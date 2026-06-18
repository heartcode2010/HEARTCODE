/**
 * backend/src/middleware/validation.middleware.ts
 * Generic Zod schema validation middleware factory.
 * Usage:  router.post('/route', validate(MySchema), handler)
 */
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate<T>(schema: ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
      return;
    }

    // Replace the raw input with the parsed (coerced + defaulted) value
    (req as any)[source] = result.data;
    next();
  };
}
