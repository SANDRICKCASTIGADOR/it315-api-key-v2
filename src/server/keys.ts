import { createHash, randomBytes, randomUUID } from "crypto";
import { db } from "./db";
import { apiKeys } from "./db/schema";

import { desc, eq } from "drizzle-orm";

const KEY_PREFIX = process.env.KEY_PREFIX ?? "sk_live_";

export function generatePlainKey(bytes: number = 24) {
    const raw = randomBytes(bytes).toString("base64url");
    const key = `${KEY_PREFIX}${raw}`;
    const last4 = key.slice(-4);
    return { key, last4 };
}

export function sha256(data: string) {
    return createHash("sha256").update(data).digest("hex");
}

export interface HardwareSpecs {
    brandname?: string;
    processor?: string;
    graphic?: string;
    display?: string;
    ram?: string;
    storage?: string;
}

export async function insertKey(
    imageUrl?: string, 
    hardwareSpecs?: HardwareSpecs
) {
    const { key, last4 } = generatePlainKey();
    const hashed = sha256(key);
    const id = randomUUID();
    
    await db.insert(apiKeys).values({ 
        id, 
        imageUrl, 
        hashedKey: hashed, 
        last4,
        brandname: hardwareSpecs?.brandname,
        processor: hardwareSpecs?.processor,
        graphic: hardwareSpecs?.graphic,
        display: hardwareSpecs?.display,
        ram: hardwareSpecs?.ram,
        storage: hardwareSpecs?.storage,
    });
    
    return { 
        id, 
        imageUrl, 
        key, 
        last4,
        ...hardwareSpecs 
    } as const;
}

export async function listKeys() {
    return db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.revoked, false))
        .orderBy(desc(apiKeys.createdAt));
}

export async function revokeKey(id: string) {
    const res = await db
        .update(apiKeys)
        .set({ revoked: true })
        .where(eq(apiKeys.id, id));
    
    return (res.rowCount ?? 0) > 0;
}

export async function updateKeySpecs(
    id: string, 
    hardwareSpecs: Partial<HardwareSpecs>
) {
    const res = await db
        .update(apiKeys)
        .set({
            brandname: hardwareSpecs.brandname,
            processor: hardwareSpecs.processor,
            graphic: hardwareSpecs.graphic,
            display: hardwareSpecs.display,
            ram: hardwareSpecs.ram,
            storage: hardwareSpecs.storage,
        })
        .where(eq(apiKeys.id, id));
    
    return (res.rowCount ?? 0) > 0;
}

export async function getKeyDetails(id: string) {
    const rows = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.id, id));
    
    return rows[0] || null;
}

export async function verifyKey(apiKey: string) {
    const hashed = sha256(apiKey);
    const rows = await db
        .select({ 
            id: apiKeys.id, 
            revoked: apiKeys.revoked,
            imageUrl: apiKeys.imageUrl,
            brandname: apiKeys.brandname,
            processor: apiKeys.processor,
            graphic: apiKeys.graphic,
            display: apiKeys.display,
            ram: apiKeys.ram,
            storage: apiKeys.storage,
        })
        .from(apiKeys)
        .where(eq(apiKeys.hashedKey, hashed));
    
    const row = rows[0];
    if (!row) return { valid: false as const, reason: "not_found" as const };
    if (row.revoked) return { valid: false as const, reason: "revoked" as const };
    
    return { 
        valid: true as const, 
        keyId: row.id,
        imageUrl: row.imageUrl,
        hardwareSpecs: {
            brandname: row.brandname,
            processor: row.processor,
            graphic: row.graphic,
            display: row.display,
            ram: row.ram,
            storage: row.storage,
        }
    };
}