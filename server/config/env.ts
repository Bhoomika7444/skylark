import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mondayApiKey: process.env.MONDAY_API_KEY || '',
  mondayApiVersion: process.env.MONDAY_API_VERSION || '2025-04',
  workOrderBoardId: process.env.WORK_ORDER_BOARD_ID || '5030485390',
  dealsBoardId: process.env.DEALS_BOARD_ID || '5030486158',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  appUrl: process.env.APP_URL || '',
};
