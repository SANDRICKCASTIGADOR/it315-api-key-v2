import { z } from "zod";

export const CreateKeySchema = z.object({
  imageUrl: z.string().optional().nullable(),
  hardwareSpecs: z.object({
    brandname: z.string().max(100).optional().or(z.literal("")),
    processor: z.string().max(200).optional().or(z.literal("")),
    graphic: z.string().max(200).optional().or(z.literal("")),
    display: z.string().max(150).optional().or(z.literal("")),
    ram: z.string().max(50).optional().or(z.literal("")),
    storage: z.string().max(100).optional().or(z.literal("")),
  }).optional(),
});

export const DeleteKeySchema = z.object({ 
  keyId: z.string().uuid() 
});