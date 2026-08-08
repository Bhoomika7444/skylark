import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requestLogger } from './server/middleware/logging.js';
import { errorHandler } from './server/middleware/errorHandler.js';
import healthRoutes from './server/routes/healthRoutes.js';
import boardsRoutes from './server/routes/boardsRoutes.js';
import chatRoutes from './server/routes/chatRoutes.js';
import leadershipRoutes from './server/routes/leadershipRoutes.js';
import { config } from './server/config/env.js';

async function startServer() {
  const app = express();
  const PORT = config.port || 3000;

  // CORS Middleware - allow localhost:5173 and process.env.APP_URL
  const allowedOrigins = [
    'http://localhost:5173',
    process.env.APP_URL,
    config.appUrl,
  ].filter((url): url is string => Boolean(url && url.trim().length > 0));

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. same-origin, mobile apps, or curl)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.some(
          (allowed) => origin === allowed || origin.startsWith(allowed) || allowed.startsWith(origin)
        );

        if (isAllowed || allowedOrigins.length === 0) {
          return callback(null, origin);
        }
        return callback(null, origin);
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(requestLogger);

  // Mount Backend APIs
  app.use('/', healthRoutes);
  app.use('/', boardsRoutes);
  app.use('/', chatRoutes);
  app.use('/', leadershipRoutes);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SkyInsight Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
