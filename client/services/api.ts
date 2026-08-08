import axios from 'axios';
import {
  HealthStatus,
  WorkOrder,
  Deal,
  BIResponse,
  LeadershipUpdateResponse,
  DataQualityReport,
} from '../../src/types/index.js';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await api.get('/health');
  return res.data;
}

export async function fetchWorkOrders(): Promise<{
  data: WorkOrder[];
  qualityReport: DataQualityReport;
  isLiveConnection: boolean;
  lastSyncedAt?: string;
}> {
  const res = await api.get('/work-orders');
  return res.data;
}

export async function fetchDeals(): Promise<{
  data: Deal[];
  qualityReport: DataQualityReport;
  isLiveConnection: boolean;
  lastSyncedAt?: string;
}> {
  const res = await api.get('/deals');
  return res.data;
}

export async function sendChatQuery(message: string): Promise<{
  success: boolean;
  data: BIResponse;
  isLiveMonday: boolean;
}> {
  const res = await api.post('/chat', { message });
  return res.data;
}

export async function fetchLeadershipUpdate(): Promise<{
  success: boolean;
  data: LeadershipUpdateResponse;
}> {
  const res = await api.post('/leadership-update', {});
  return res.data;
}

export default api;