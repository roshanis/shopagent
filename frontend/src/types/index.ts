export interface ProductData {
  name: string;
  price: number;
  brand: string;
  category: string;
  description: string;
  ingredients?: string;
  reviews?: string;
  rating?: number;
}

export interface AgentResult {
  score: number;
  recommendation: 'buy' | 'neutral' | 'avoid' | 'error';
  reasoning: string;
  confidence: number;
  details: Record<string, any>;
}

export interface EvaluationResult {
  id: string;
  status: string;
  overall_score: number;
  overall_recommendation: 'buy' | 'neutral' | 'avoid';
  agent_results: Record<string, AgentResult>;
  key_strengths: string[];
  key_concerns: string[];
  confidence: number;
  completed_at: string;
}

export interface EvaluationStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: Record<string, number>;
  created_at: string;
  completed_at?: string;
}

export interface Agent {
  name: string;
  emoji: string;
  description: string;
}
