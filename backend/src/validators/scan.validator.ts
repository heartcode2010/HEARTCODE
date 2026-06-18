/**
 * backend/src/validators/scan.validator.ts
 * Zod schemas for scan request payloads.
 */
import { z } from 'zod';

export const InspectSchema = z.object({
  url: z
    .string()
    .url('Must be a valid URL')
    .refine((v) => v.startsWith('http://') || v.startsWith('https://'), {
      message: 'URL must start with http:// or https://',
    }),
});

export const ScanIdSchema = z.object({
  scanId: z.string().min(1, 'scanId is required'),
});

export const PasteSchema = z.object({
  html: z.string().min(1, 'HTML content is required').max(10_000_000, 'Payload too large'),
  url: z.string().url().optional(),
});

export type InspectInput = z.infer<typeof InspectSchema>;
export type ScanIdInput = z.infer<typeof ScanIdSchema>;
export type PasteInput = z.infer<typeof PasteSchema>;
