/**
 * backend/src/utils/asyncHandler.ts
 * Wraps async route handlers so you don't need try/catch in every controller.
 * Automatically passes thrown errors to Express's next() error handler.
 */
import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFn): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
