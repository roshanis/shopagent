# Agentic Shop Lab - AI Agent Documentation

## 🤖 Multi-Agent System Overview

This project implements a sophisticated multi-agent AI framework for product evaluation using GPT-5, Tavily Search, and OpenFoodFacts APIs.

## 📋 Agent Architecture

### **Base Agent** (`BaseAgent`)
- **Purpose**: Foundation class for all specialized agents
- **Model**: GPT-5 (OpenAI)
- **Features**:
  - Async OpenAI client integration
  - Progress callback support
  - Tool calling capabilities (web search, ingredient lookup)
  - JSON response parsing with error handling
  - Defensive null-safety in response parsing

### **Specialized Agents**

#### 1. **💰 Cost Analysis Agent**
- **Responsibility**: Evaluate product pricing and cost-effectiveness
- **Analysis Factors**:
  - Price competitiveness vs. market
  - Value for money assessment
  - Cost-benefit ratio
  - Market positioning
- **Tools**: Tavily web search for market research
- **Score**: 0-100 (lower = better value)

#### 2. **🏢 Supplier Trust Agent**
- **Responsibility**: Assess supplier credibility and reliability
- **Analysis Factors**:
  - Supplier reputation
  - Certifications and compliance
  - Business history
  - Customer feedback
- **Tools**: Tavily web search for supplier verification
- **Score**: 0-100 (higher = more trustworthy)

#### 3. **🌱 Sustainability Agent**
- **Responsibility**: Evaluate environmental impact
- **Analysis Factors**:
  - Eco-friendly practices
  - Carbon footprint
  - Sustainable sourcing
  - Packaging materials
- **Tools**: Tavily web search for sustainability data
- **Score**: 0-100 (higher = more sustainable)

#### 4. **🧪 Ingredient Safety Agent**
- **Responsibility**: Assess product ingredient safety
- **Analysis Factors**:
  - Ingredient toxicity
  - Allergen presence
  - Regulatory compliance
  - Health risks
- **Tools**: 
  - OpenFoodFacts API for ingredient lookup
  - Tavily web search for safety research
- **Score**: 0-100 (higher = safer)
- **Special Feature**: Auto-lookup ingredients if not provided

## 🛠️ Tool Integration

### **Tavily Search** (`web_search`)
- **Purpose**: Real-time web research for all agents
- **Usage**: Market data, supplier info, sustainability reports
- **Implementation**: Async TavilyClient with error handling

### **OpenFoodFacts API** (`lookup_product_ingredients`)
- **Purpose**: Ingredient data retrieval
- **Usage**: Automatic ingredient lookup by product name
- **Implementation**: REST API with URL encoding and category filtering
- **Fallback**: Returns helpful message if product not found

## 📊 Evaluation Framework

### **AgenticFramework** Class
- **Orchestration**: Manages all 4 agents concurrently
- **Progress Tracking**: Real-time progress callbacks
- **Parallel Execution**: Async/await for simultaneous agent runs
- **Result Aggregation**: Combines scores and insights
- **Error Handling**: Graceful degradation on individual agent failures

### **Workflow**
1. User submits product data (name, price, supplier, etc.)
2. Framework initializes all 4 agents
3. Agents run in parallel with progress callbacks
4. Each agent:
   - Receives product context
   - Uses tools (web search, ingredient lookup) as needed
   - Generates analysis with GPT-5
   - Returns score + detailed insights
5. Framework aggregates results
6. Frontend displays comprehensive evaluation

## 🔧 Technical Implementation

### **Key Features**
- **Async/Await**: Non-blocking operations for better performance
- **Type Safety**: Full TypeScript support in frontend
- **Error Handling**: Defensive programming with null checks
- **JSON Mode**: Structured outputs from GPT-5
- **Tool Calling**: Function calling API for web search and lookups
- **Progress Tracking**: Real-time UI updates during evaluation

### **API Integration**
- **OpenAI GPT-5**: Primary intelligence engine
- **Tavily Search**: Web research capabilities
- **OpenFoodFacts**: Ingredient database

### **Environment Variables**
```bash
OPENAI_API_KEY=your-openai-key
TAVILY_API_KEY=your-tavily-key  # Optional but recommended
```

## 🎯 Code Quality Standards

### **Python Backend**
- Type hints for all function signatures
- Comprehensive error handling
- Async/await for I/O operations
- Clean separation of concerns
- Defensive null-safety checks

### **TypeScript Frontend**
- Strict TypeScript configuration
- React 18+ best practices
- No unused imports
- Proper type definitions for external APIs
- Clean component architecture

## 📝 Development Guidelines

### **Adding New Agents**
1. Extend `BaseAgent` class
2. Override `_get_system_prompt()`
3. Override `_create_prompt()`
4. Add agent to framework's agent list
5. Update frontend UI for new agent display

### **Adding New Tools**
1. Implement async method in `BaseAgent`
2. Update `_get_system_prompt()` to mention tool
3. Add tool to `tools` parameter in `analyze()` method
4. Handle tool calls in response processing

### **Testing**
- Test individual agents with sample data
- Verify tool integrations work correctly
- Check error handling with invalid inputs
- Validate progress callbacks
- Ensure frontend displays results properly

## 🚀 Deployment

- **Local**: Use `start_backend.sh` and `start_frontend.sh`
- **Replit**: Use `run.sh` for unified deployment
- **Environment**: Ensure API keys are in secrets/env variables

## 📚 Resources

- **OpenAI API**: https://platform.openai.com/docs
- **Tavily Search**: https://tavily.com/docs
- **OpenFoodFacts**: https://world.openfoodfacts.org/data

---

**Last Updated**: October 2, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
