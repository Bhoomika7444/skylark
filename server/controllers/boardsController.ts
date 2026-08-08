import { Request, Response } from 'express';
import { mondayService } from '../services/mondayService.js';

export async function getBoardsOverview(req: Request, res: Response) {
  try {
    const fullContext = await mondayService.getFullBusinessContext();
    res.json({
      success: true,
      data: fullContext,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch Monday.com boards overview',
    });
  }
}

export async function getWorkOrders(req: Request, res: Response) {
  try {
    const data = await mondayService.getWorkOrders();
    res.json({
      success: true,
      data: data.workOrders,
      qualityReport: data.qualityReport,
      isLiveConnection: data.isLive,
      lastSyncedAt: data.lastSyncedAt,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch work orders from Monday.com',
    });
  }
}

export async function getDeals(req: Request, res: Response) {
  try {
    const data = await mondayService.getDeals();
    res.json({
      success: true,
      data: data.deals,
      qualityReport: data.qualityReport,
      isLiveConnection: data.isLive,
      lastSyncedAt: data.lastSyncedAt,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch deals from Monday.com',
    });
  }
}
