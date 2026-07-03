import { z } from 'zod';

export function isValidGSTIN(value: string): boolean {
  if (!value) return true;
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value);
}

export function isValidPAN(value: string): boolean {
  if (!value) return true;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
}

export const GSTINSchema = z
  .string()
  .optional()
  .refine((val) => {
    if (!val) return true;
    return isValidGSTIN(val);
  }, "Invalid GSTIN format");

export const PANSchema = z
  .string()
  .optional()
  .refine((val) => {
    if (!val) return true;
    return isValidPAN(val);
  }, "Invalid PAN format");
