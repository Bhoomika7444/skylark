import axios from 'axios';
import { config } from '../config/env.js';
import { GET_BOARD_ITEMS_QUERY } from '../utils/graphqlQueries.js';
import {
  processWorkOrdersBoard,
  processDealsBoard,
  getMockWorkOrders,
  getMockDeals,
} from './dataNormalizationService.js';
import { WorkOrder, Deal, DataQualityReport, MondayBoardRaw } from '../../src/types/index.js';

export class MondayService {
  private apiUrl = 'https://api.monday.com/v2';
  private lastWorkOrdersSyncedAt: string | null = null;
  private lastDealsSyncedAt: string | null = null;

  /**
   * Fetches raw GraphQL board data from Monday.com
   */
  async fetchRawBoard(boardId: string): Promise<MondayBoardRaw | null> {
    if (!config.mondayApiKey) {
      console.log(`[MondayService] No MONDAY_API_KEY provided in env. Returning fallback data for board ${boardId}.`);
      return null;
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          query: GET_BOARD_ITEMS_QUERY,
          variables: { boardIds: [boardId] },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: config.mondayApiKey,
            'API-Version': config.mondayApiVersion,
          },
          timeout: 10000,
        }
      );

      if (response.data?.errors && response.data.errors.length > 0) {
        console.warn('[MondayService] Monday API returned errors:', response.data.errors);
        return null;
      }

      const boards = response.data?.data?.boards;
      if (Array.isArray(boards) && boards.length > 0) {
        return boards[0] as MondayBoardRaw;
      }

      return null;
    } catch (err: any) {
      console.error(`[MondayService] Error querying Monday.com API for board ${boardId}:`, err?.message || err);
      return null;
    }
  }

  /**
   * Returns normalized work orders with quality report and sync timestamp
   */
  async getWorkOrders(): Promise<{ workOrders: WorkOrder[]; qualityReport: DataQualityReport; isLive: boolean; lastSyncedAt: string | null }> {
    const rawBoard = await this.fetchRawBoard(config.workOrderBoardId);
    if (rawBoard) {
      const processed = processWorkOrdersBoard(rawBoard);
      this.lastWorkOrdersSyncedAt = new Date().toISOString();
      return { ...processed, isLive: true, lastSyncedAt: this.lastWorkOrdersSyncedAt };
    }

    if (!this.lastWorkOrdersSyncedAt) {
      this.lastWorkOrdersSyncedAt = new Date().toISOString();
    }

    const mock = getMockWorkOrders();
    return {
      workOrders: mock,
      qualityReport: {
        totalItemsProcessed: mock.length,
        missingFieldsCount: 0,
        normalizedNamesCount: 0,
        dateAdjustmentsCount: 0,
        warnings: ['Operating in Skylark Drones reference mode (Live Monday.com credentials optional).'],
        qualityScorePercent: 98,
        isMockDataFallback: true,
      },
      isLive: false,
      lastSyncedAt: this.lastWorkOrdersSyncedAt,
    };
  }

  /**
   * Returns normalized deals with quality report and sync timestamp
   */
  async getDeals(): Promise<{ deals: Deal[]; qualityReport: DataQualityReport; isLive: boolean; lastSyncedAt: string | null }> {
    const rawBoard = await this.fetchRawBoard(config.dealsBoardId);
    if (rawBoard) {
      const processed = processDealsBoard(rawBoard);
      this.lastDealsSyncedAt = new Date().toISOString();
      return { ...processed, isLive: true, lastSyncedAt: this.lastDealsSyncedAt };
    }

    if (!this.lastDealsSyncedAt) {
      this.lastDealsSyncedAt = new Date().toISOString();
    }

    const mock = getMockDeals();
    return {
      deals: mock,
      qualityReport: {
        totalItemsProcessed: mock.length,
        missingFieldsCount: 0,
        normalizedNamesCount: 0,
        dateAdjustmentsCount: 0,
        warnings: ['Operating in Skylark Drones reference mode (Live Monday.com credentials optional).'],
        qualityScorePercent: 98,
        isMockDataFallback: true,
      },
      isLive: false,
      lastSyncedAt: this.lastDealsSyncedAt,
    };
  }

  /**
   * Returns all board data combined for complete context
   */
  async getFullBusinessContext() {
    const [woData, dealData] = await Promise.all([this.getWorkOrders(), this.getDeals()]);

    const totalRevenueWO = woData.workOrders.reduce((sum, wo) => sum + wo.revenueValue, 0);
    const delayedWO = woData.workOrders.filter(wo => wo.status === 'Delayed');
    const closedWonDeals = dealData.deals.filter(d => d.stage === 'Closed Won');
    const pipelineValue = dealData.deals
      .filter(d => d.stage !== 'Closed Lost')
      .reduce((sum, d) => sum + d.dealValue, 0);

    return {
      workOrders: woData.workOrders,
      deals: dealData.deals,
      workOrdersReport: woData.qualityReport,
      dealsReport: dealData.qualityReport,
      isLiveConnection: woData.isLive || dealData.isLive,
      summaryMetrics: {
        totalWorkOrders: woData.workOrders.length,
        delayedWorkOrdersCount: delayedWO.length,
        totalDealsCount: dealData.deals.length,
        closedWonValue: closedWonDeals.reduce((sum, d) => sum + d.dealValue, 0),
        pipelineValue,
        totalWorkOrderRevenue: totalRevenueWO,
      },
    };
  }
}

export const mondayService = new MondayService();
