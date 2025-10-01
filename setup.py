"""
Setup file for Agentic Shop Lab package
"""

from setuptools import setup, find_packages

setup(
    name="agentic-shop-lab",
    version="1.0.0",
    description="AI-powered product evaluation framework with specialized agents",
    author="Agentic Shop Lab Team",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    python_requires=">=3.8",
    install_requires=[
        "openai>=1.0.0",
        "asyncio",
    ],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
)
