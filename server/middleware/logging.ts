import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${method} ${url} ${res.statusCode} - ${duration}ms`);
  });

  next();
}
