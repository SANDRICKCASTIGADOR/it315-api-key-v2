// server/validation.ts
import { z } from "zod";

export const CreateKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(256, "Name too long"),
  hardwareSpecs: z.object({
    imageUrl: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    brandname: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    processor: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    graphic: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    display: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    ram: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    storage: z.string().optional().or(z.literal("")).transform(val => val || undefined),
  }).optional(),
});

export const DeleteKeySchema = z.object({ 
  keyId: z.string().uuid() 
});