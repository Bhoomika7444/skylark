import { Request, Response } from 'express';
import { config } from '../config/env.js';
import { mondayService } from '../services/mondayService.js';
import { HealthStatus } from '../../src/types/index.js';

export async function getHealth(req: Request, res: Response) {
  try {
    const hasMondayKey = Boolean(config.mondayApiKey);
    const hasGeminiKey = Boolean(config.geminiApiKey || process.env.GEMINI_API_KEY);

    let mondayConnected = false;
    let workOrdersCount = 0;
    let dealsCount = 0;
    let mondaySource: 'live_api' | 'mock_fallback' = 'mock_fallback';

    if (hasMondayKey) {
      try {
        const full = await mondayService.getFullBusinessContext();
        mondayConnected = full.isLiveConnection;
        mondaySource = full.isLiveConnection ? 'live_api' : 'mock_fallback';
        workOrdersCount = full.summaryMetrics.totalWorkOrders;
        dealsCount = full.summaryMetrics.totalDealsCount;
      } catch (err) {
        console.warn('[HealthController] Monday check warning:', err);
      }
    } else {
      const full = await mondayService.getFullBusinessContext();
      workOrdersCount = full.summaryMetrics.totalWorkOrders;
      dealsCount = full.summaryMetrics.totalDealsCount;
    }

    const status: HealthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      mondayConnected,
      mondaySource,
      geminiConnected: hasGeminiKey,
      boards: {
        workOrdersBoardId: config.workOrderBoardId,
        dealsBoardId: config.dealsBoardId,
        workOrdersCount,
        dealsCount,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        hasMondayKey,
        hasGeminiKey,
      },
    };

    res.json(status);
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message || 'Health check failed',
    });
  }
}
