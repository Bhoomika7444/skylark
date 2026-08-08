import { Request, Response } from 'express';
import { mondayService } from '../services/mondayService.js';
import { geminiService } from '../services/geminiService.js';

export async function processChatQuery(req: Request, res: Response) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message string is required in request body',
      });
    }

    // Always read live data from Monday.com every time
    const [woData, dealData] = await Promise.all([
      mondayService.getWorkOrders(),
      mondayService.getDeals(),
    ]);

    // Combine data quality report
    const combinedQualityReport = {
      totalItemsProcessed: woData.qualityReport.totalItemsProcessed + dealData.qualityReport.totalItemsProcessed,
      missingFieldsCount: woData.qualityReport.missingFieldsCount + dealData.qualityReport.missingFieldsCount,
      normalizedNamesCount: woData.qualityReport.normalizedNamesCount + dealData.qualityReport.normalizedNamesCount,
      dateAdjustmentsCount: woData.qualityReport.dateAdjustmentsCount + dealData.qualityReport.dateAdjustmentsCount,
      warnings: [...woData.qualityReport.warnings, ...dealData.qualityReport.warnings],
      qualityScorePercent: Math.round((woData.qualityReport.qualityScorePercent + dealData.qualityReport.qualityScorePercent) / 2),
      isMockDataFallback: woData.qualityReport.isMockDataFallback || dealData.qualityReport.isMockDataFallback,
    };

    const biResult = await geminiService.processBIQuery(
      message.trim(),
      woData.workOrders,
      dealData.deals,
      combinedQualityReport
    );

    res.json({
      success: true,
      data: biResult,
      isLiveMonday: woData.isLive || dealData.isLive,
    });
  } catch (error: any) {
    console.error('[ChatController] Error processing BI query:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process business intelligence query',
    });
  }
}
