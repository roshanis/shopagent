"""
Main framework for coordinating multiple AI agents
"""

import asyncio
from typing import Dict, Any, List, Optional, Callable
from .agents import (
    CostAnalysisAgent,
    SupplierTrustAgent,
    SustainabilityAgent,
    IngredientSafetyAgent
)


class AgenticShopLab:
    """
    Main framework for coordinating multiple specialized agents
    to evaluate products comprehensively
    """
    
    def __init__(self):
        self.agents = [
            CostAnalysisAgent(),
            SupplierTrustAgent(),
            SustainabilityAgent(),
            IngredientSafetyAgent()
        ]
        self.results = {}
        self.progress = {}
        
    def get_agents_info(self) -> List[Dict[str, str]]:
        """Get information about all available agents"""
        return [
            {
                "name": agent.name,
                "emoji": agent.emoji,
                "description": agent.description
            }
            for agent in self.agents
        ]
    
    async def evaluate_product(
        self,
        product_data: Dict[str, Any],
        progress_callback: Optional[Callable[[Dict[str, float]], None]] = None
    ) -> Dict[str, Any]:
        """
        Evaluate a product using all available agents
        
        Args:
            product_data: Product information dictionary
            progress_callback: Optional callback for progress updates
            
        Returns:
            Comprehensive evaluation results from all agents
        """
        # Initialize progress tracking
        self.progress = {agent.name: 0.0 for agent in self.agents}
        
        async def agent_progress_callback(agent_name: str, progress: float):
            """Update progress for a specific agent"""
            self.progress[agent_name] = progress
            if progress_callback:
                await progress_callback(self.progress.copy())
        
        def create_progress_callback(agent_name: str):
            """Create a progress callback closure for a specific agent"""
            async def callback(progress: float):
                await agent_progress_callback(agent_name, progress)
            return callback
        
        # Run all agents in parallel
        tasks = []
        for agent in self.agents:
            task = agent.analyze(
                product_data,
                create_progress_callback(agent.name)
            )
            tasks.append(task)
        
        # Wait for all agents to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Compile results
        agent_results = {}
        for agent, result in zip(self.agents, results):
            if isinstance(result, Exception):
                agent_results[agent.name] = {
                    "score": 0,
                    "recommendation": "error",
                    "reasoning": f"Error: {str(result)}",
                    "confidence": 0,
                    "details": {}
                }
            else:
                agent_results[agent.name] = result
        
        # Calculate overall score and recommendation
        overall_score = self._calculate_overall_score(agent_results)
        overall_recommendation = self._determine_recommendation(overall_score, agent_results)
        
        # Extract key insights
        strengths, concerns = self._extract_insights(agent_results)
        
        return {
            "overall_score": overall_score,
            "overall_recommendation": overall_recommendation,
            "agent_results": agent_results,
            "key_strengths": strengths,
            "key_concerns": concerns,
            "confidence": self._calculate_confidence(agent_results)
        }
    
    def _calculate_overall_score(self, agent_results: Dict[str, Dict[str, Any]]) -> int:
        """Calculate weighted overall score from agent results"""
        scores = []
        weights = {
            "Cost Analysis": 0.25,
            "Supplier Trust": 0.25,
            "Sustainability": 0.25,
            "Ingredient Safety": 0.25
        }
        
        total_weight = 0
        weighted_sum = 0
        
        for agent_name, result in agent_results.items():
            if result.get("recommendation") != "error":
                score = result.get("score", 0)
                weight = weights.get(agent_name, 0.25)
                weighted_sum += score * weight
                total_weight += weight
        
        if total_weight == 0:
            return 0
        
        return int(weighted_sum / total_weight)
    
    def _determine_recommendation(
        self, 
        overall_score: int, 
        agent_results: Dict[str, Dict[str, Any]]
    ) -> str:
        """Determine overall recommendation"""
        # Count recommendations
        buy_count = sum(
            1 for r in agent_results.values() 
            if r.get("recommendation") == "buy"
        )
        avoid_count = sum(
            1 for r in agent_results.values() 
            if r.get("recommendation") == "avoid"
        )
        
        # Check for critical failures
        safety_result = agent_results.get("Ingredient Safety", {})
        if safety_result.get("recommendation") == "avoid":
            return "avoid"
        
        # Make decision based on score and agent consensus
        if overall_score >= 70 and buy_count >= 2:
            return "buy"
        elif overall_score < 40 or avoid_count >= 2:
            return "avoid"
        else:
            return "neutral"
    
    def _calculate_confidence(self, agent_results: Dict[str, Dict[str, Any]]) -> int:
        """Calculate overall confidence level"""
        confidences = [
            r.get("confidence", 50) 
            for r in agent_results.values() 
            if r.get("recommendation") != "error"
        ]
        
        if not confidences:
            return 0
        
        return int(sum(confidences) / len(confidences))
    
    def _extract_insights(
        self, 
        agent_results: Dict[str, Dict[str, Any]]
    ) -> tuple[List[str], List[str]]:
        """Extract key strengths and concerns from agent results"""
        strengths = []
        concerns = []
        
        for agent_name, result in agent_results.items():
            if result.get("recommendation") == "error":
                continue
            
            score = result.get("score", 0)
            reasoning = result.get("reasoning", "")
            
            # High scores indicate strengths
            if score >= 70:
                strengths.append(f"{agent_name}: {reasoning[:100]}...")
            # Low scores indicate concerns
            elif score < 40:
                concerns.append(f"{agent_name}: {reasoning[:100]}...")
        
        return strengths[:3], concerns[:3]  # Limit to top 3 each
