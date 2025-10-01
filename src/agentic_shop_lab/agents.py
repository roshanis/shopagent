"""
Specialized AI agents for product evaluation
"""

import asyncio
import json
from typing import Dict, Any, Optional, Callable
from openai import AsyncOpenAI
import os
from tavily import TavilyClient


class BaseAgent:
    """Base class for all evaluation agents"""
    
    def __init__(self, name: str, emoji: str, description: str):
        self.name = name
        self.emoji = emoji
        self.description = description
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o"  # Using GPT-4o for reliable responses (GPT-5 responses API not working)
        self.tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

    async def web_search(self, query: str) -> str:
        """Search the web using Tavily API"""
        try:
            response = self.tavily_client.search(query)
            if response and response.get('results'):
                # Format search results for the agent
                results = []
                for result in response['results'][:3]:  # Limit to top 3 results
                    results.append({
                        'title': result.get('title', ''),
                        'content': result.get('content', ''),
                        'url': result.get('url', '')
                    })

                # Create a formatted summary
                summary = f"Web search results for '{query}':\n\n"
                for i, result in enumerate(results, 1):
                    summary += f"Result {i}:\n"
                    summary += f"Title: {result['title']}\n"
                    summary += f"URL: {result['url']}\n"
                    summary += f"Content: {result['content'][:300]}...\n\n"

                return summary
            else:
                return f"No relevant search results found for '{query}'"
        except Exception as e:
            return f"Web search failed for '{query}': {str(e)}"

    async def lookup_product_ingredients(self, product_name: str, category: str = "") -> str:
        """Look up product ingredients using OpenFoodFacts API"""
        try:
            import requests
            import urllib.parse

            # Encode the product name for URL
            encoded_name = urllib.parse.quote(product_name)

            # Try different search approaches
            search_queries = [
                f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={encoded_name}&json=1",
                f"https://world.openfoodfacts.org/cgi/search.pl?search_terms={encoded_name}&categories={category}&json=1" if category else "",
            ]

            for url in search_queries:
                if not url:
                    continue

                response = requests.get(url, timeout=10)
                response.raise_for_status()

                data = response.json()

                if data.get('products') and len(data['products']) > 0:
                    # Get the first (most relevant) product
                    product = data['products'][0]

                    # Extract ingredients information
                    ingredients_text = product.get('ingredients_text', '')
                    ingredients_tags = product.get('ingredients_tags', [])

                    if ingredients_text:
                        result = f"Found product: {product.get('product_name', product_name)}\n"
                        result += f"Ingredients: {ingredients_text}\n"
                        result += f"Brand: {product.get('brands', 'Not specified')}\n"
                        result += f"Categories: {product.get('categories', 'Not specified')}"

                        if ingredients_tags:
                            result += f"\nIngredient tags: {', '.join(ingredients_tags[:10])}"

                        return result
                    else:
                        # Try next search query
                        continue

            return f"No ingredient data found for '{product_name}' in OpenFoodFacts database"

        except requests.exceptions.RequestException as e:
            return f"Network error searching OpenFoodFacts: {str(e)}"
        except Exception as e:
            return f"Error searching OpenFoodFacts for '{product_name}': {str(e)}"
        
    async def analyze(
        self, 
        product_data: Dict[str, Any],
        progress_callback: Optional[Callable[[float], None]] = None
    ) -> Dict[str, Any]:
        """
        Analyze product and return evaluation results
        
        Args:
            product_data: Product information dictionary
            progress_callback: Optional callback for progress updates (progress: float)
            
        Returns:
            Dictionary with score, recommendation, reasoning, and details
        """
        try:
            if progress_callback:
                await progress_callback(0.1)
            
            # Create analysis prompt
            prompt = self._create_prompt(product_data)
            
            if progress_callback:
                await progress_callback(0.3)
            
            # Use OpenAI chat completions API with tool support
            import json

            messages = [
                {
                    "role": "system",
                    "content": self._get_system_prompt() + "\n\nIMPORTANT: Respond in valid JSON format with keys: score (0-100), recommendation (buy/neutral/avoid), reasoning (string), confidence (0-100). If you need to search the web or look up ingredients, use the available function tools."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.7,
                max_tokens=1000,
                tools=[
                    {
                        "type": "function",
                        "function": {
                            "name": "web_search",
                            "description": "Search the web for current market prices, competitor information, and general product data",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "query": {
                                        "type": "string",
                                        "description": "The search query to look for current information"
                                    }
                                },
                                "required": ["query"]
                            }
                        }
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "lookup_product_ingredients",
                            "description": "Look up product ingredients using the OpenFoodFacts database",
                            "parameters": {
                                "type": "object",
                                "properties": {
                                    "product_name": {
                                        "type": "string",
                                        "description": "The product name to search for ingredients"
                                    },
                                    "category": {
                                        "type": "string",
                                        "description": "The product category to help narrow the search"
                                    }
                                },
                                "required": ["product_name"]
                            }
                        }
                    }
                ],
                tool_choice="auto"
            )

            if progress_callback:
                await progress_callback(0.7)

            # Check if tool usage is needed
            message = response.choices[0].message
            if hasattr(message, 'tool_calls') and message.tool_calls:
                # Execute tool calls
                for tool_call in message.tool_calls:
                    if tool_call.function.name == "web_search":
                        tool_args = json.loads(tool_call.function.arguments)
                        search_query = tool_args.get("query", "")

                        # Perform web search
                        search_results = await self.web_search(search_query)

                        # Add search results to messages and get final response
                        messages.append({
                            "role": "assistant",
                            "content": None,
                            "tool_calls": [tool_call]
                        })
                        messages.append({
                            "role": "tool",
                            "content": search_results,
                            "tool_call_id": tool_call.id
                        })

                        # Get final response with search results
                        final_response = await self.client.chat.completions.create(
                            model=self.model,
                            messages=messages,
                            response_format={"type": "json_object"},
                            temperature=0.7,
                            max_tokens=1000
                        )

                        result = json.loads(final_response.choices[0].message.content)
                        result.setdefault("details", {})
                        result["search_results"] = search_results

                    elif tool_call.function.name == "lookup_product_ingredients":
                        tool_args = json.loads(tool_call.function.arguments)
                        product_name = tool_args.get("product_name", "")
                        category = tool_args.get("category", "")

                        # Perform ingredient lookup
                        ingredient_results = await self.lookup_product_ingredients(product_name, category)

                        # Add ingredient results to messages and get final response
                        messages.append({
                            "role": "assistant",
                            "content": None,
                            "tool_calls": [tool_call]
                        })
                        messages.append({
                            "role": "tool",
                            "content": ingredient_results,
                            "tool_call_id": tool_call.id
                        })

                        # Get final response with ingredient data
                        final_response = await self.client.chat.completions.create(
                            model=self.model,
                            messages=messages,
                            response_format={"type": "json_object"},
                            temperature=0.7,
                            max_tokens=1000
                        )

                        result = json.loads(final_response.choices[0].message.content)
                        result.setdefault("details", {})
                        result["ingredient_data"] = ingredient_results
                    else:
                        result = self._parse_response(str(message.content) if message.content is not None else "")
            else:
                # No tool usage needed
                try:
                    result = json.loads(message.content)
                    result.setdefault("details", {})
                except json.JSONDecodeError:
                    result = self._parse_response(str(message.content) if message.content is not None else "")
            
            if progress_callback:
                await progress_callback(1.0)
            
            return result
            
        except Exception as e:
            return {
                "score": 0,
                "recommendation": "error",
                "reasoning": f"Error during analysis: {str(e)}",
                "confidence": 0,
                "details": {}
            }
    
    def _get_system_prompt(self) -> str:
        """Get system prompt for the agent"""
        raise NotImplementedError
    
    def _create_prompt(self, product_data: Dict[str, Any]) -> str:
        """Create analysis prompt from product data"""
        raise NotImplementedError
    
    def _parse_response(self, response) -> Dict[str, Any]:
        """Parse LLM response into structured format"""
        # Default parsing - extract score and reasoning
        # Ensure response is a string
        response_str = str(response) if response is not None else ""
        lines = response_str.strip().split('\n')
        score = 50
        recommendation = "neutral"
        reasoning = response_str
        confidence = 75
        
        # Try to extract score
        for line in lines:
            if 'score' in line.lower() or 'rating' in line.lower():
                try:
                    # Extract number from line
                    import re
                    numbers = re.findall(r'\d+', line)
                    if numbers:
                        score = int(numbers[0])
                        if score > 100:
                            score = score % 100
                        break
                except:
                    pass
        
        # Determine recommendation based on score
        if score >= 70:
            recommendation = "buy"
        elif score >= 40:
            recommendation = "neutral"
        else:
            recommendation = "avoid"
        
        return {
            "score": score,
            "recommendation": recommendation,
            "reasoning": reasoning,
            "confidence": confidence,
            "details": {}
        }


class CostAnalysisAgent(BaseAgent):
    """Analyzes product pricing and value proposition"""
    
    def __init__(self):
        super().__init__(
            name="Cost Analysis",
            emoji="💰",
            description="Evaluates pricing, value proposition, and cost-effectiveness"
        )
    
    def _get_system_prompt(self) -> str:
        return """You are a cost analysis expert specializing in product pricing evaluation.
        Your task is to analyze products based on:
        - Price competitiveness in the market
        - Value for money proposition
        - Cost-effectiveness
        - Price-to-quality ratio
        - Long-term value

        You have access to a web search tool that can find current market prices, competitor information, and pricing trends.

        Provide a score from 0-100 (higher is better) and detailed reasoning.
        Format your response with:
        - SCORE: [number]
        - REASONING: [detailed analysis]
        - KEY FACTORS: [bullet points]

        If you need current market data, use the web search tool by responding with the search query in your reasoning.
        """
    
    def _create_prompt(self, product_data: Dict[str, Any]) -> str:
        return f"""
        Analyze the cost-effectiveness of this product:

        Product Name: {product_data.get('name', 'Unknown')}
        Price: ${product_data.get('price', 0)}
        Brand: {product_data.get('brand', 'Unknown')}
        Category: {product_data.get('category', 'Unknown')}
        Description: {product_data.get('description', 'No description')}

        User Reviews: {product_data.get('reviews', 'No reviews available')}
        Average Rating: {product_data.get('rating', 'N/A')}

        Please provide a comprehensive cost analysis with a score (0-100) and detailed reasoning.
        If you need current market data, search for: "{product_data.get('name', '')} price comparison {product_data.get('category', '')}"
        """


class SupplierTrustAgent(BaseAgent):
    """Evaluates supplier reliability and reputation"""
    
    def __init__(self):
        super().__init__(
            name="Supplier Trust",
            emoji="🤝",
            description="Assesses supplier reliability, reputation, and trustworthiness"
        )
    
    def _get_system_prompt(self) -> str:
        return """You are a supplier trust and reputation expert.
        Your task is to evaluate suppliers based on:
        - Brand reputation and history
        - Customer service quality
        - Delivery reliability
        - Return and refund policies
        - Overall trustworthiness
        
        Provide a score from 0-100 (higher is better) and detailed reasoning.
        Format your response with:
        - SCORE: [number]
        - REASONING: [detailed analysis]
        - TRUST FACTORS: [bullet points]
        """
    
    def _create_prompt(self, product_data: Dict[str, Any]) -> str:
        return f"""
        Evaluate the supplier trustworthiness for this product:
        
        Brand: {product_data.get('brand', 'Unknown')}
        Product: {product_data.get('name', 'Unknown')}
        Category: {product_data.get('category', 'Unknown')}
        
        User Reviews: {product_data.get('reviews', 'No reviews available')}
        Average Rating: {product_data.get('rating', 'N/A')}
        
        Based on the brand name and user feedback, assess the supplier's trustworthiness.
        Provide a score (0-100) and detailed reasoning.
        """


class SustainabilityAgent(BaseAgent):
    """Evaluates environmental impact and sustainability"""
    
    def __init__(self):
        super().__init__(
            name="Sustainability",
            emoji="🌱",
            description="Analyzes environmental impact and sustainability practices"
        )
    
    def _get_system_prompt(self) -> str:
        return """You are a sustainability and environmental impact expert.
        Your task is to evaluate products based on:
        - Environmental footprint
        - Sustainable sourcing practices
        - Packaging and waste
        - Carbon footprint
        - Ethical production
        
        Provide a score from 0-100 (higher is better) and detailed reasoning.
        Format your response with:
        - SCORE: [number]
        - REASONING: [detailed analysis]
        - SUSTAINABILITY FACTORS: [bullet points]
        """
    
    def _create_prompt(self, product_data: Dict[str, Any]) -> str:
        return f"""
        Analyze the sustainability of this product:
        
        Product: {product_data.get('name', 'Unknown')}
        Brand: {product_data.get('brand', 'Unknown')}
        Category: {product_data.get('category', 'Unknown')}
        Description: {product_data.get('description', 'No description')}
        Ingredients: {product_data.get('ingredients', 'Not specified')}
        
        Evaluate the environmental impact and sustainability practices.
        Provide a score (0-100) and detailed reasoning.
        """


class IngredientSafetyAgent(BaseAgent):
    """Evaluates ingredient safety and health impact"""
    
    def __init__(self):
        super().__init__(
            name="Ingredient Safety",
            emoji="🔬",
            description="Assesses ingredient safety and health implications"
        )
    
    def _get_system_prompt(self) -> str:
        return """You are an ingredient safety and health expert.
        Your task is to evaluate products based on:
        - Ingredient safety profiles
        - Potential health risks
        - Allergen presence
        - Chemical safety
        - Overall health impact

        You have access to multiple tools:
        - web_search: For general web queries and current market data
        - lookup_product_ingredients: For finding ingredient lists in the OpenFoodFacts database

        Provide a score from 0-100 (higher is better) and detailed reasoning.
        Format your response with:
        - SCORE: [number]
        - REASONING: [detailed analysis]
        - SAFETY FACTORS: [bullet points]
        - CONCERNS: [any red flags]

        CRITICAL: If ingredients are not provided in the product data, you MUST use the lookup_product_ingredients tool to find ingredient information. Do not give a low score just because ingredients aren't listed - search for them first!
        """
    
    def _create_prompt(self, product_data: Dict[str, Any]) -> str:
        ingredients = product_data.get('ingredients', 'Not specified')

        search_suggestion = ""
        if ingredients == 'Not specified' or (ingredients is not None and not ingredients.strip()):
            search_suggestion = f"Since no ingredients are provided, I MUST use the lookup_product_ingredients tool to find ingredient information for '{product_data.get('name', '')}' in the {product_data.get('category', '')} category."

        return f"""
        Evaluate the ingredient safety of this product:

        Product: {product_data.get('name', 'Unknown')}
        Category: {product_data.get('category', 'Unknown')}
        Description: {product_data.get('description', 'No description')}

        Ingredients List: {ingredients}

        {search_suggestion}

        Analyze each ingredient for safety, potential health risks, and overall health impact.
        Provide a score (0-100) and detailed reasoning with specific ingredient concerns if any.
        """
