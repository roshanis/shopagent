import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { EvaluationResult } from '../types';

interface ResultsDashboardProps {
  result: EvaluationResult;
  onNewEvaluation: () => void;
}

const recommendationConfig = {
  buy: {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    label: 'Recommended to Buy',
    description: 'This product meets high standards across multiple criteria',
  },
  neutral: {
    icon: AlertTriangle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    label: 'Consider Carefully',
    description: 'This product has both strengths and concerns to consider',
  },
  avoid: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    label: 'Not Recommended',
    description: 'This product has significant concerns that should be addressed',
  },
};

const agentEmojis: Record<string, string> = {
  'Cost Analysis': '💰',
  'Supplier Trust': '🤝',
  'Sustainability': '🌱',
  'Ingredient Safety': '🔬',
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onNewEvaluation }) => {
  const config = recommendationConfig[result.overall_recommendation];
  const RecommendationIcon = config.icon;

  // Prepare data for charts
  const radialData = [
    {
      name: 'Score',
      value: result.overall_score,
      fill: result.overall_score >= 70 ? '#10b981' : result.overall_score >= 40 ? '#f59e0b' : '#ef4444',
    },
  ];

  const barData = Object.entries(result.agent_results).map(([name, data]) => ({
    name: name.replace(' Agent', ''),
    score: data.score,
    emoji: agentEmojis[name] || '🤖',
  }));

  const getBarColor = (score: number) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      {/* Overall Recommendation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${config.bg} ${config.border} border-2 rounded-lg p-6`}
      >
        <div className="flex items-start space-x-4">
          <RecommendationIcon className={`w-12 h-12 ${config.color} flex-shrink-0`} />
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${config.color} mb-2`}>
              {config.label}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {config.description}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Overall Score:
                </span>
                <span className={`text-2xl font-bold ${config.color}`}>
                  {result.overall_score}/100
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Confidence:
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {result.confidence}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radial Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Overall Score
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-4xl font-bold fill-gray-900 dark:fill-white"
              >
                {result.overall_score}
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Agent Scores
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        {result.key_strengths.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Key Strengths
              </h3>
            </div>
            <ul className="space-y-2">
              {result.key_strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Concerns */}
        {result.key_concerns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingDown className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Key Concerns
              </h3>
            </div>
            <ul className="space-y-2">
              {result.key_concerns.map((concern, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {concern}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Detailed Agent Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detailed Analysis
        </h3>
        <div className="space-y-4">
          {Object.entries(result.agent_results).map(([agentName, agentData]) => (
            <div
              key={agentName}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{agentEmojis[agentName] || '🤖'}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {agentName}
                  </span>
                </div>
                <span className={`text-lg font-bold ${
                  agentData.score >= 70 ? 'text-green-600' :
                  agentData.score >= 40 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {agentData.score}/100
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {agentData.reasoning}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={onNewEvaluation}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
        >
          Evaluate Another Product
        </button>
      </div>
    </div>
  );
};
