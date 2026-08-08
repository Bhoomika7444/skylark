export interface MondayColumnValue {
  id: string;
  title?: string;
  text?: string;
  value?: string;
  type?: string;
}

export interface MondayItemRaw {
  id: string;
  name: string;
  updated_at?: string;
  created_at?: string;
  column_values: MondayColumnValue[];
}

export interface MondayBoardRaw {
  id: string;
  name: string;
  description?: string;
  items_page?: {
    cursor?: string;
    items: MondayItemRaw[];
  };
}

export interface WorkOrder {
  id: string;
  woNumber: string;
  clientName: string;
  siteLocation: string;
  sector: string;
  status: 'Completed' | 'In Progress' | 'Delayed' | 'Scheduled' | 'Cancelled';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  surveyAreaSqKm: number;
  assignedPilot: string;
  startDate: string;
  targetCompletionDate: string;
  actualCompletionDate?: string;
  delayReason?: string;
  revenueValue: number;
}

export interface Deal {
  id: string;
  dealName: string;
  clientName: string;
  sector: string;
  stage: 'Qualified Lead' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  dealValue: number;
  expectedCloseDate: string;
  probability: number;
  contractType: 'Recurring ARR' | 'One-off Survey' | 'Multi-year Contract';
  owner: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  notes?: string;
}

export interface DataQualityReport {
  totalItemsProcessed: number;
  missingFieldsCount: number;
  normalizedNamesCount: number;
  dateAdjustmentsCount: number;
  warnings: string[];
  qualityScorePercent: number;
  isMockDataFallback: boolean;
}

export interface BIResponse {
  answer: string;
  executiveSummary: string;
  keyInsights: string[];
  metrics?: { label: string; value: string; change?: string; tone?: 'positive' | 'negative' | 'neutral' }[];
  risksAndBlockers: string[];
  recommendations: string[];
  confidenceLevel: 'High' | 'Medium' | 'Low';
  confidenceRationale: string;
  dataQuality: DataQualityReport;
  clarificationNeeded?: boolean;
  clarificationQuestions?: string[];
  suggestedFollowups?: string[];
  relevantWorkOrdersCount?: number;
  relevantDealsCount?: number;
}

export interface LeadershipUpdateResponse {
  title: string;
  generatedAt: string;
  period: string;
  summary: string;
  wins: string[];
  risks: string[];
  actionItems: string[];
  keyMetrics: { label: string; value: string }[];
  dataQualitySummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  biResponse?: BIResponse;
  isClarification?: boolean;
}

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  mondayConnected: boolean;
  mondaySource: 'live_api' | 'mock_fallback';
  geminiConnected: boolean;
  boards: {
    workOrdersBoardId: string;
    dealsBoardId: string;
    workOrdersCount: number;
    dealsCount: number;
  };
  environment: {
    nodeEnv: string;
    hasMondayKey: boolean;
    hasGeminiKey: boolean;
  };
}
