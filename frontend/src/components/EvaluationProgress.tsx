import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { EvaluationStatus } from '../types';

interface EvaluationProgressProps {
  status: EvaluationStatus;
  onCancel?: () => void;
}

const agentEmojis: Record<string, string> = {
  'Cost Analysis': '💰',
  'Supplier Trust': '🤝',
  'Sustainability': '🌱',
  'Ingredient Safety': '🔬',
};

export const EvaluationProgress: React.FC<EvaluationProgressProps> = ({ status, onCancel }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const startTime = new Date(status.created_at).getTime();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [status.created_at]);

  const overallProgress = Object.values(status.progress).reduce((a, b) => a + b, 0) / Object.keys(status.progress).length;
  const estimatedTimeRemaining = Math.max(0, Math.ceil((30 - elapsedTime) * (1 - overallProgress)));

  const getAgentStatus = (progress: number) => {
    if (progress === 0) return 'pending';
    if (progress === 1) return 'completed';
    return 'running';
  };

  const getStatusIcon = (progress: number) => {
    const agentStatus = getAgentStatus(progress);
    switch (agentStatus) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'running':
        return <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />;
      case 'pending':
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
      default:
        return <XCircle className="w-6 h-6 text-red-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Evaluation in Progress
          </h2>
          {onCancel && status.status === 'running' && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          AI agents are analyzing your product...
        </p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Progress
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(overallProgress * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Elapsed: {elapsedTime}s</span>
          <span>Est. remaining: {estimatedTimeRemaining}s</span>
        </div>
      </div>

      {/* Agent Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Agent Status
        </h3>
        {Object.entries(status.progress).map(([agentName, progress]) => (
          <motion.div
            key={agentName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex-shrink-0">
              {getStatusIcon(progress)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{agentEmojis[agentName] || '🤖'}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {agentName}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(progress * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status Message */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
          {status.status === 'running' 
            ? 'Our AI agents are working hard to provide you with comprehensive insights...'
            : 'Preparing evaluation results...'}
        </p>
      </div>
    </div>
  );
};
