import { z } from "zod";
import { isValidGSTIN, isValidPAN } from "../utils/validators";

export const GSTINSchema = z
  .string()
  .toUpperCase()
  .refine(isValidGSTIN, "Invalid GSTIN format");

export const PANSchema = z
  .string()
  .toUpperCase()
  .refine(isValidPAN, "Invalid PAN format");

export const PhoneSchema = z
  .string()
  .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits");

export const PincodeSchema = z
  .string()
  .regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits");
