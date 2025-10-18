// ~/server/validation.ts
import { z } from "zod";

// Schema for creating API keys (simple lang, name lang)
export const CreateApiKeySchema = z.object({
  name: z.string().min(1, "Key name is required").max(256, "Key name too long"),
});

// Schema for creating motors (with all motor details)
export const CreateMotorSchema = z.object({
  motorName: z.string().min(1, "Motor name is required").max(256, "Motor name too long"),
  frontView: z.string().optional().or(z.literal("")).transform(val => val || undefined),
  sideView: z.string().optional().or(z.literal("")).transform(val => val || undefined),
  backView: z.string().optional().or(z.literal("")).transform(val => val || undefined),
  description: z.string().optional().or(z.literal("")).transform(val => val || undefined),
  monthlyPrice: z.string().optional().or(z.literal("")).transform(val => val || undefined),
  fullyPaidPrice: z.string().optional().or(z.literal("")).transform(val => val || undefined),
});

export const DeleteKeySchema = z.object({ 
  keyId: z.string().uuid() 
});