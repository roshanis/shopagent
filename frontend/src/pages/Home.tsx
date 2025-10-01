import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Bot, TrendingUp, Shield, Plus, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import type { ProductData, EvaluationStatus, EvaluationResult } from '../types';

interface ConversationStep {
  id: string;
  question: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  value?: string | number;
}

export const Home: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [conversationData, setConversationData] = useState<Record<string, any>>({});

  // Evaluation state
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [evaluationStatus, setEvaluationStatus] = useState<EvaluationStatus | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const conversationSteps: ConversationStep[] = [
    {
      id: 'product_name',
      question: 'What product would you like to evaluate?',
      type: 'text',
      placeholder: 'e.g., iPhone 15 Pro, Vitamin C Serum, Organic Coffee...',
      required: true
    },
    {
      id: 'product_category',
      question: 'What category does this product belong to?',
      type: 'select',
      options: [
        'Electronics', 'Skincare', 'Food & Beverages', 'Clothing',
        'Home & Garden', 'Health & Wellness', 'Sports & Outdoors',
        'Beauty', 'Books', 'Automotive', 'Other'
      ],
      required: true
    },
    {
      id: 'product_price',
      question: 'What\'s the price of this product?',
      type: 'number',
      placeholder: 'Enter price in USD',
      required: true
    },
    {
      id: 'product_brand',
      question: 'Who makes this product?',
      type: 'text',
      placeholder: 'Brand or manufacturer name',
      required: true
    },
    {
      id: 'product_description',
      question: 'Can you describe this product?',
      type: 'textarea',
      placeholder: 'Tell us about the product features, benefits, and any other relevant details...',
      required: false
    },
    {
      id: 'product_ingredients',
      question: 'Do you know the ingredients or materials? (Optional)',
      type: 'textarea',
      placeholder: 'List ingredients, materials, or components if known...',
      required: false
    }
  ];

  const handleInputChange = (stepId: string, value: string | number) => {
    setConversationData(prev => ({
      ...prev,
      [stepId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < conversationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Poll for evaluation status
  useEffect(() => {
    if (!evaluationId || !showEvaluation) return;

    const pollStatus = async () => {
      try {
        const status = await apiService.getEvaluationStatus(evaluationId);
        setEvaluationStatus(status);

        // If completed, fetch results
        if (status.status === 'completed') {
          const result = await apiService.getEvaluationResult(evaluationId);
          setEvaluationResult(result);
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          alert(`Evaluation ${status.status}. Please try again.`);
          setShowEvaluation(false);
          setEvaluationId(null);
          setEvaluationStatus(null);
          setEvaluationResult(null);
        }
      } catch (err) {
        console.error('Error polling status:', err);
        alert('Failed to get evaluation status. Please try again.');
        setShowEvaluation(false);
        setEvaluationId(null);
        setEvaluationStatus(null);
        setEvaluationResult(null);
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(pollStatus, 2000);
    pollStatus(); // Initial poll

    return () => clearInterval(interval);
  }, [evaluationId, showEvaluation]);

  const handleSubmit = async () => {
    setIsEvaluating(true);

    try {
      // Convert conversation data to ProductData format
      const productData: ProductData = {
        name: conversationData.product_name || '',
        price: Number(conversationData.product_price) || 0,
        brand: conversationData.product_brand || '',
        category: conversationData.product_category || '',
        description: conversationData.product_description || '',
        ingredients: conversationData.product_ingredients || '',
      };

      // Start evaluation using API service
      const response = await apiService.startEvaluation(productData);
      console.log('Evaluation started:', response);

      // Show evaluation interface
      setEvaluationId(response.id);
      setShowEvaluation(true);
      setShowForm(false);

    } catch (error) {
      console.error('Error starting evaluation:', error);
      alert('Failed to start evaluation. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentStepData = conversationSteps[currentStep];
  const isLastStep = currentStep === conversationSteps.length - 1;
  const canProceed = conversationData[currentStepData.id] !== undefined && conversationData[currentStepData.id] !== '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Agentic Shop Lab
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          AI-Powered Product Evaluation - Just Tell Us About Your Product
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {showEvaluation ? (
          /* Evaluation Progress and Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            {evaluationStatus && !evaluationResult ? (
              /* Evaluation Progress */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Evaluation in Progress
                  </h2>
                  <button
                    onClick={() => {
                      setShowEvaluation(false);
                      setEvaluationId(null);
                      setEvaluationStatus(null);
                      setEvaluationResult(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Overall Progress */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Overall Progress
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {Math.round(Object.values(evaluationStatus.progress).reduce((a, b) => a + b, 0) / Object.keys(evaluationStatus.progress).length * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Object.values(evaluationStatus.progress).reduce((a, b) => a + b, 0) / Object.keys(evaluationStatus.progress).length * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Agent Progress */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Agent Status
                  </h3>
                  {Object.entries(evaluationStatus.progress).map(([agentName, progress]) => (
                    <div key={agentName} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-shrink-0">
                        {progress === 1 ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : progress === 0 ? (
                          <AlertCircle className="w-6 h-6 text-gray-400" />
                        ) : (
                          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {agentName}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {Math.round(progress * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="h-full bg-primary-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                    Our AI agents are analyzing your product. This may take a few moments...
                  </p>
                </div>
              </div>
            ) : evaluationResult ? (
              /* Evaluation Results */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Evaluation Results
                  </h2>
                  <button
                    onClick={() => {
                      setShowEvaluation(false);
                      setEvaluationId(null);
                      setEvaluationStatus(null);
                      setEvaluationResult(null);
                      setShowForm(true);
                    }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Evaluate Another Product
                  </button>
                </div>

                {/* Overall Recommendation */}
                <div className={`mb-8 p-6 rounded-lg ${
                  evaluationResult.overall_recommendation === 'buy' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                  evaluationResult.overall_recommendation === 'avoid' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                  'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      evaluationResult.overall_recommendation === 'buy' ? 'bg-green-100 dark:bg-green-900' :
                      evaluationResult.overall_recommendation === 'avoid' ? 'bg-red-100 dark:bg-red-900' :
                      'bg-yellow-100 dark:bg-yellow-900'
                    }`}>
                      {evaluationResult.overall_recommendation === 'buy' ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : evaluationResult.overall_recommendation === 'avoid' ? (
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        evaluationResult.overall_recommendation === 'buy' ? 'text-green-800 dark:text-green-200' :
                        evaluationResult.overall_recommendation === 'avoid' ? 'text-red-800 dark:text-red-200' :
                        'text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {evaluationResult.overall_recommendation === 'buy' ? 'Recommended to Buy' :
                         evaluationResult.overall_recommendation === 'avoid' ? 'Not Recommended' :
                         'Consider Carefully'}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {evaluationResult.overall_score}/100
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Confidence: {evaluationResult.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agent Results */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Agent Analysis
                  </h3>
                  {Object.entries(evaluationResult.agent_results).map(([agentName, agentData]: [string, any]) => (
                    <div key={agentName} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {agentName}
                        </span>
                        <span className={`text-lg font-bold ${
                          agentData.score >= 70 ? 'text-green-600' :
                          agentData.score >= 40 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {agentData.score}/100
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {agentData.reasoning}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Key Insights */}
                {evaluationResult.key_strengths.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Key Strengths
                    </h3>
                    <ul className="space-y-2">
                      {evaluationResult.key_strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {strength}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              /* Loading State */
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
                <p className="text-gray-600 dark:text-gray-400">Loading evaluation...</p>
              </div>
            )}
          </motion.div>
        ) : !showForm ? (
          /* Welcome State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Evaluate a Product?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Our AI agents will analyze your product across multiple dimensions and provide comprehensive insights.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Product Evaluation
            </button>
          </motion.div>
        ) : (
          /* Conversation Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Step {currentStep + 1} of {conversationSteps.length}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(((currentStep + 1) / conversationSteps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / conversationSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {currentStepData.question}
              </h2>

              {/* Input Field */}
              <div className="space-y-4">
                {currentStepData.type === 'select' ? (
                  <select
                    value={conversationData[currentStepData.id] || ''}
                    onChange={(e) => handleInputChange(currentStepData.id, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select {currentStepData.placeholder?.toLowerCase()}</option>
                    {currentStepData.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : currentStepData.type === 'textarea' ? (
                  <textarea
                    value={conversationData[currentStepData.id] || ''}
                    onChange={(e) => handleInputChange(currentStepData.id, e.target.value)}
                    placeholder={currentStepData.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-vertical"
                  />
                ) : (
                  <input
                    type={currentStepData.type}
                    value={conversationData[currentStepData.id] || ''}
                    onChange={(e) => handleInputChange(currentStepData.id, e.target.value)}
                    placeholder={currentStepData.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex space-x-4">
                {currentStep > 0 && (
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                )}

                {isLastStep ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed || isEvaluating}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Start Analysis'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            {/* Preview of Collected Data */}
            {Object.keys(conversationData).length > 0 && (
              <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Collected Information:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(conversationData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace('_', ' ')}:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Features Section (shown when not in form) */}
      {!showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              4 AI Agents
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Specialized agents for cost, trust, sustainability, and safety analysis
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Watch agents work in parallel with live progress updates
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Comprehensive Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Detailed analysis with confidence scores and actionable recommendations
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Smart Tools
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Web search and ingredient database integration for enhanced analysis
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
