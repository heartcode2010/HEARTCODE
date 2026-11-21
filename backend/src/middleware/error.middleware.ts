import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  status?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl} - Status: ${status} - Message: ${message}`);
  if (err.stack) {
    console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    status,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
export default errorHandler;
