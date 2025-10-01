import React, { useState, useEffect } from 'react';
import { ProductForm } from '../components/ProductForm';
import { EvaluationProgress } from '../components/EvaluationProgress';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { useEvaluation } from '../contexts/EvaluationContext';
import { apiService } from '../services/api';
import type { ProductData } from '../types';

type ViewState = 'form' | 'progress' | 'results';

export const Evaluate: React.FC = () => {
  const [view, setView] = useState<ViewState>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    currentEvaluation,
    evaluationStatus,
    evaluationResult,
    setCurrentEvaluation,
    setEvaluationStatus,
    setEvaluationResult,
    clearEvaluation,
  } = useEvaluation();

  // Poll for evaluation status
  useEffect(() => {
    if (!currentEvaluation || view !== 'progress') return;

    const pollStatus = async () => {
      try {
        const status = await apiService.getEvaluationStatus(currentEvaluation);
        setEvaluationStatus(status);

        // If completed, fetch results
        if (status.status === 'completed') {
          const result = await apiService.getEvaluationResult(currentEvaluation);
          setEvaluationResult(result);
          setView('results');
        } else if (status.status === 'failed' || status.status === 'cancelled') {
          setError(`Evaluation ${status.status}. Please try again.`);
          setView('form');
        }
      } catch (err) {
        console.error('Error polling status:', err);
        setError('Failed to get evaluation status. Please try again.');
        setView('form');
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(pollStatus, 2000);
    pollStatus(); // Initial poll

    return () => clearInterval(interval);
  }, [currentEvaluation, view, setEvaluationStatus, setEvaluationResult]);

  const handleSubmit = async (data: ProductData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Clean up the data - ensure optional fields are strings or undefined
      const cleanedData = {
        ...data,
        ingredients: data.ingredients?.trim() || 'Not specified',
        reviews: data.reviews?.trim() || 'Not specified',
        rating: data.rating || undefined,
      };
      
      const response = await apiService.startEvaluation(cleanedData);
      setCurrentEvaluation(response.id);
      setView('progress');
    } catch (err: any) {
      console.error('Error starting evaluation:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to start evaluation. Please try again.';
      console.error('Full error:', err.response?.data);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!currentEvaluation) return;

    try {
      await apiService.cancelEvaluation(currentEvaluation);
      clearEvaluation();
      setView('form');
    } catch (err) {
      console.error('Error cancelling evaluation:', err);
    }
  };

  const handleNewEvaluation = () => {
    clearEvaluation();
    setView('form');
    setError(null);
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {view === 'form' && (
        <ProductForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      )}

      {view === 'progress' && evaluationStatus && (
        <EvaluationProgress status={evaluationStatus} onCancel={handleCancel} />
      )}

      {view === 'results' && evaluationResult && (
        <ResultsDashboard result={evaluationResult} onNewEvaluation={handleNewEvaluation} />
      )}
    </div>
  );
};
