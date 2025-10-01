import React, { createContext, useContext, useState } from 'react';
import type { EvaluationResult, EvaluationStatus } from '../types';

interface EvaluationContextType {
  currentEvaluation: string | null;
  evaluationStatus: EvaluationStatus | null;
  evaluationResult: EvaluationResult | null;
  setCurrentEvaluation: (id: string | null) => void;
  setEvaluationStatus: (status: EvaluationStatus | null) => void;
  setEvaluationResult: (result: EvaluationResult | null) => void;
  clearEvaluation: () => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEvaluation, setCurrentEvaluation] = useState<string | null>(null);
  const [evaluationStatus, setEvaluationStatus] = useState<EvaluationStatus | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  const clearEvaluation = () => {
    setCurrentEvaluation(null);
    setEvaluationStatus(null);
    setEvaluationResult(null);
  };

  return (
    <EvaluationContext.Provider
      value={{
        currentEvaluation,
        evaluationStatus,
        evaluationResult,
        setCurrentEvaluation,
        setEvaluationStatus,
        setEvaluationResult,
        clearEvaluation,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within EvaluationProvider');
  }
  return context;
};
