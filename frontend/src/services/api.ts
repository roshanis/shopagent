import axios from 'axios';
import type { ProductData, EvaluationStatus, EvaluationResult, Agent } from '../types';

// Replit deployment: Use relative URL for backend on same domain
const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get('/');
    return response.data;
  },

  // Get available agents
  async getAgents(): Promise<{ agents: Agent[]; count: number }> {
    const response = await api.get('/api/agents');
    return response.data;
  },

  // Start product evaluation
  async startEvaluation(product: ProductData): Promise<{ id: string; status: string; message: string }> {
    const response = await api.post('/api/evaluate', { product });
    return response.data;
  },

  // Get evaluation status
  async getEvaluationStatus(id: string): Promise<EvaluationStatus> {
    const response = await api.get(`/api/evaluate/${id}/status`);
    return response.data;
  },

  // Get evaluation result
  async getEvaluationResult(id: string): Promise<EvaluationResult> {
    const response = await api.get(`/api/evaluate/${id}/result`);
    return response.data;
  },

  // Cancel evaluation
  async cancelEvaluation(id: string): Promise<{ id: string; status: string; message: string }> {
    const response = await api.delete(`/api/evaluate/${id}`);
    return response.data;
  },
};

export default apiService;
