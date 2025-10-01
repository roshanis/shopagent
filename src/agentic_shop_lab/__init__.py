"""
Agentic Shop Lab - AI-powered product evaluation framework
"""

from .framework import AgenticShopLab
from .agents import (
    CostAnalysisAgent,
    SupplierTrustAgent,
    SustainabilityAgent,
    IngredientSafetyAgent
)

__version__ = "1.0.0"

__all__ = [
    "AgenticShopLab",
    "CostAnalysisAgent",
    "SupplierTrustAgent",
    "SustainabilityAgent",
    "IngredientSafetyAgent",
]
