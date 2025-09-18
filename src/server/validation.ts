import { z } from "zod";

export const CreateKeySchema = z.object({
  imageUrl: z.string().optional().or(z.literal("")).or(z.null()).transform(val => val || undefined),
  hardwareSpecs: z.object({
    brandname: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    processor: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    graphic: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    display: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    ram: z.string().optional().or(z.literal("")).transform(val => val || undefined),
    storage: z.string().optional().or(z.literal("")).transform(val => val || undefined),
  }).optional().or(z.null()).transform(val => val || undefined),
}).passthrough(); // Allow additional properties

export const DeleteKeySchema = z.object({ 
  keyId: z.string().uuid() 
});