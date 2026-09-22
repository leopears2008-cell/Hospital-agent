import { Request, Response, NextFunction } from 'express';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window per IP/user
  message?: string;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, message = 'Too many requests, please try again later.' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    let record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(ip, record);
      return next();
    }

    record.count++;

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
}
