"""
FastAPI backend server for Agentic Shop Lab web application
"""

import asyncio
import uuid
from datetime import datetime
from typing import Dict, Optional, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sys
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Add parent directory to path to import agentic_shop_lab
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.agentic_shop_lab import AgenticShopLab


# Pydantic models
class ProductData(BaseModel):
    """Product information model"""
    name: str = Field(..., description="Product name")
    price: float = Field(..., gt=0, description="Product price")
    brand: str = Field(..., description="Brand name")
    category: Optional[str] = Field(None, description="Product category")
    description: Optional[str] = Field(None, description="Product description")
    ingredients: Optional[str] = Field(None, description="Ingredients list")
    reviews: Optional[str] = Field(None, description="User reviews")
    rating: Optional[float] = Field(None, ge=0, le=5, description="Average rating")


class EvaluationRequest(BaseModel):
    """Request model for product evaluation"""
    product: ProductData


class EvaluationStatus(BaseModel):
    """Status model for evaluation progress"""
    id: str
    status: str  # pending, running, completed, failed, cancelled
    progress: Dict[str, float]
    created_at: str
    completed_at: Optional[str] = None


class EvaluationResult(BaseModel):
    """Result model for completed evaluation"""
    id: str
    status: str
    overall_score: int
    overall_recommendation: str
    agent_results: Dict[str, Any]
    key_strengths: list
    key_concerns: list
    confidence: int
    completed_at: str


# Initialize FastAPI app
app = FastAPI(
    title="Agentic Shop Lab API",
    description="AI-powered product evaluation API with multi-agent framework",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS - Allow all origins for deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Render, Vercel, localhost)
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for evaluations
evaluations: Dict[str, Dict[str, Any]] = {}

# Initialize framework
framework = AgenticShopLab()


@app.get("/")
async def root():
    """Health check and API information"""
    return {
        "name": "Agentic Shop Lab API",
        "version": "1.0.0",
        "status": "running",
        "agents": len(framework.agents),
        "endpoints": {
            "health": "/",
            "agents": "/api/agents",
            "evaluate": "/api/evaluate",
            "status": "/api/evaluate/{id}/status",
            "result": "/api/evaluate/{id}/result",
            "cancel": "/api/evaluate/{id}"
        }
    }


@app.get("/api/agents")
async def get_agents():
    """Get list of available evaluation agents"""
    return {
        "agents": framework.get_agents_info(),
        "count": len(framework.agents)
    }


async def run_evaluation(evaluation_id: str, product_data: Dict[str, Any]):
    """Background task to run product evaluation"""
    try:
        # Update status to running
        evaluations[evaluation_id]["status"] = "running"
        evaluations[evaluation_id]["progress"] = {
            agent.name: 0.0 for agent in framework.agents
        }
        
        # Progress callback
        async def progress_callback(progress: Dict[str, float]):
            evaluations[evaluation_id]["progress"] = progress
        
        # Run evaluation
        result = await framework.evaluate_product(
            product_data,
            progress_callback
        )
        
        # Update with results
        evaluations[evaluation_id].update({
            "status": "completed",
            "result": result,
            "completed_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        evaluations[evaluation_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now().isoformat()
        })


from fastapi import FastAPI, HTTPException, BackgroundTasks, Request as FastAPIRequest
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: FastAPIRequest, exc: RequestValidationError):
    print(f"Validation error: {exc.errors()}")
    print(f"Request body: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(await request.body())}
    )

@app.post("/api/evaluate")
async def create_evaluation(
    request: EvaluationRequest,
    background_tasks: BackgroundTasks
):
    """
    Start a new product evaluation
    
    Creates an evaluation task and returns the evaluation ID
    for tracking progress.
    """
    # Generate unique ID
    evaluation_id = str(uuid.uuid4())
    
    # Initialize evaluation record
    evaluations[evaluation_id] = {
        "id": evaluation_id,
        "status": "pending",
        "product": request.product.model_dump(),
        "progress": {agent.name: 0.0 for agent in framework.agents},
        "created_at": datetime.now().isoformat(),
        "completed_at": None,
        "result": None,
        "error": None
    }
    
    # Start evaluation in background
    background_tasks.add_task(
        run_evaluation,
        evaluation_id,
        request.product.model_dump()
    )
    
    return {
        "id": evaluation_id,
        "status": "pending",
        "message": "Evaluation started successfully"
    }


@app.get("/api/evaluate/{evaluation_id}/status")
async def get_evaluation_status(evaluation_id: str):
    """
    Get the current status of an evaluation
    
    Returns progress information for all agents.
    """
    if evaluation_id not in evaluations:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    eval_data = evaluations[evaluation_id]
    
    return {
        "id": evaluation_id,
        "status": eval_data["status"],
        "progress": eval_data["progress"],
        "created_at": eval_data["created_at"],
        "completed_at": eval_data.get("completed_at")
    }


@app.get("/api/evaluate/{evaluation_id}/result")
async def get_evaluation_result(evaluation_id: str):
    """
    Get the results of a completed evaluation
    
    Returns detailed evaluation results from all agents.
    """
    if evaluation_id not in evaluations:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    eval_data = evaluations[evaluation_id]
    
    if eval_data["status"] == "pending" or eval_data["status"] == "running":
        raise HTTPException(
            status_code=400,
            detail="Evaluation not yet completed"
        )
    
    if eval_data["status"] == "failed":
        raise HTTPException(
            status_code=500,
            detail=f"Evaluation failed: {eval_data.get('error', 'Unknown error')}"
        )
    
    if eval_data["status"] == "cancelled":
        raise HTTPException(
            status_code=400,
            detail="Evaluation was cancelled"
        )
    
    result = eval_data.get("result", {})
    
    return {
        "id": evaluation_id,
        "status": eval_data["status"],
        "overall_score": result.get("overall_score", 0),
        "overall_recommendation": result.get("overall_recommendation", "neutral"),
        "agent_results": result.get("agent_results", {}),
        "key_strengths": result.get("key_strengths", []),
        "key_concerns": result.get("key_concerns", []),
        "confidence": result.get("confidence", 0),
        "completed_at": eval_data["completed_at"]
    }


@app.delete("/api/evaluate/{evaluation_id}")
async def cancel_evaluation(evaluation_id: str):
    """
    Cancel a running evaluation
    
    Marks the evaluation as cancelled.
    """
    if evaluation_id not in evaluations:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    
    eval_data = evaluations[evaluation_id]
    
    if eval_data["status"] not in ["pending", "running"]:
        raise HTTPException(
            status_code=400,
            detail="Can only cancel pending or running evaluations"
        )
    
    evaluations[evaluation_id]["status"] = "cancelled"
    evaluations[evaluation_id]["completed_at"] = datetime.now().isoformat()
    
    return {
        "id": evaluation_id,
        "status": "cancelled",
        "message": "Evaluation cancelled successfully"
    }


if __name__ == "__main__":
    import uvicorn

    # Check for OpenAI API key
    if not os.getenv("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY environment variable not set!")
        print("Please set it in the .env file or environment")
        sys.exit(1)

    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")

    print("Starting Agentic Shop Lab API server...")
    print(f"API Documentation: http://localhost:{port}/docs")
    print(f"Health Check: http://localhost:{port}/")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True
    )
