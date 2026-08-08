import { Request, Response } from 'express';
import { mondayService } from '../services/mondayService.js';
import { geminiService } from '../services/geminiService.js';

export async function generateLeadershipUpdate(req: Request, res: Response) {
  try {
    // Read live Monday.com data
    const [woData, dealData] = await Promise.all([
      mondayService.getWorkOrders(),
      mondayService.getDeals(),
    ]);

    const combinedQuality = {
      totalItemsProcessed: woData.qualityReport.totalItemsProcessed + dealData.qualityReport.totalItemsProcessed,
      missingFieldsCount: woData.qualityReport.missingFieldsCount + dealData.qualityReport.missingFieldsCount,
      normalizedNamesCount: woData.qualityReport.normalizedNamesCount + dealData.qualityReport.normalizedNamesCount,
      dateAdjustmentsCount: woData.qualityReport.dateAdjustmentsCount + dealData.qualityReport.dateAdjustmentsCount,
      warnings: [...woData.qualityReport.warnings, ...dealData.qualityReport.warnings],
      qualityScorePercent: Math.round((woData.qualityReport.qualityScorePercent + dealData.qualityReport.qualityScorePercent) / 2),
      isMockDataFallback: woData.qualityReport.isMockDataFallback || dealData.qualityReport.isMockDataFallback,
    };

    const updateReport = await geminiService.generateLeadershipUpdate(
      woData.workOrders,
      dealData.deals,
      combinedQuality
    );

    res.json({
      success: true,
      data: updateReport,
    });
  } catch (error: any) {
    console.error('[LeadershipController] Error generating leadership update:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate leadership update',
    });
  }
}
