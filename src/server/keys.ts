// server/keys.ts
import { createHash, randomBytes, randomUUID } from "crypto";
import { db } from "./db";
import { apiKeys, hardwareSpecs } from "./db/schema";
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
    frontView?: string;
    sideView?: string;
    backView?: string;
    description?: string;
    monthlyPrice?: string;
    fullyPaidPrice?: string;
}

export async function insertKey(name: string, hardwareSpecsData?: HardwareSpecs) {
    const { key, last4 } = generatePlainKey();
    const hashed = sha256(key);
    const keyId = randomUUID();
    const specId = randomUUID();
    
    // Insert API key
    await db.insert(apiKeys).values({ 
        id: keyId, 
        name, 
        hashedKey: hashed, 
        last4,
    });
    
    if (hardwareSpecsData) {
        await db.insert(hardwareSpecs).values({
            id: specId,
            apiKeyId: keyId,
            frontView: hardwareSpecsData.frontView,
            sideView: hardwareSpecsData.sideView,
            backView: hardwareSpecsData.backView,
            description: hardwareSpecsData.description,
            monthlyPrice: hardwareSpecsData.monthlyPrice,
            fullyPaidPrice: hardwareSpecsData.fullyPaidPrice,
        });
    }
    
    return { 
        id: keyId, 
        name, 
        key, 
        last4,
        hardwareSpecs: hardwareSpecsData
    } as const;
}

export async function listKeys() {

    const result = await db
        .select({
            id: apiKeys.id,
            name: apiKeys.name,
            last4: apiKeys.last4,
            createdAt: apiKeys.createdAt,
            revoked: apiKeys.revoked,
            // Hardware specs
            frontView: hardwareSpecs.frontView,
            sideView: hardwareSpecs.sideView,
            backView: hardwareSpecs.backView,
            description: hardwareSpecs.description,
            monthlyPrice: hardwareSpecs.monthlyPrice,
            fullyPaidPrice: hardwareSpecs.fullyPaidPrice,
        })
        .from(apiKeys)
        .leftJoin(hardwareSpecs, eq(apiKeys.id, hardwareSpecs.apiKeyId))
        .where(eq(apiKeys.revoked, false))
        .orderBy(desc(apiKeys.createdAt));
    
    return result;
}

export async function revokeKey(id: string) {
    const res = await db
        .update(apiKeys)
        .set({ revoked: true })
        .where(eq(apiKeys.id, id));
    
    return (res.rowCount ?? 0) > 0;
}

export async function updateKeySpecs(
    apiKeyId: string, 
    hardwareSpecsData: Partial<HardwareSpecs>
) {
    
    const existing = await db
        .select()
        .from(hardwareSpecs)
        .where(eq(hardwareSpecs.apiKeyId, apiKeyId))
        .limit(1);
    
    if (existing.length > 0) {
        // Update existing
        const res = await db
            .update(hardwareSpecs)
            .set({
                frontView: hardwareSpecsData.frontView,
                sideView: hardwareSpecsData.sideView,
                backView: hardwareSpecsData.backView,
                description: hardwareSpecsData.description,
                monthlyPrice: hardwareSpecsData.monthlyPrice,
                fullyPaidPrice: hardwareSpecsData.fullyPaidPrice,
            })
            .where(eq(hardwareSpecs.apiKeyId, apiKeyId));
        
        return (res.rowCount ?? 0) > 0;
    } else {
        // Create new
        const specId = randomUUID();
        await db.insert(hardwareSpecs).values({
            id: specId,
            apiKeyId,
            frontView: hardwareSpecsData.frontView,
            sideView: hardwareSpecsData.sideView,
            backView: hardwareSpecsData.backView,
            description: hardwareSpecsData.description,
            monthlyPrice: hardwareSpecsData.monthlyPrice,
            fullyPaidPrice: hardwareSpecsData.fullyPaidPrice,
        });
        
        return true;
    }
}

export async function getKeyDetails(id: string) {
    const result = await db
        .select({
            id: apiKeys.id,
            name: apiKeys.name,
            last4: apiKeys.last4,
            createdAt: apiKeys.createdAt,
            revoked: apiKeys.revoked,
            hashedKey: apiKeys.hashedKey,
            // Hardware specs
            frontView: hardwareSpecs.frontView,
            sideView: hardwareSpecs.sideView,
            backView: hardwareSpecs.backView,
            description: hardwareSpecs.description,
            monthlyPrice: hardwareSpecs.monthlyPrice,
            fullyPaidPrice: hardwareSpecs.fullyPaidPrice,
        })
        .from(apiKeys)
        .leftJoin(hardwareSpecs, eq(apiKeys.id, hardwareSpecs.apiKeyId))
        .where(eq(apiKeys.id, id))
        .limit(1);
    
    return result[0] || null;
}

export async function verifyKey(apiKey: string) {
    const hashed = sha256(apiKey);
    const result = await db
        .select({ 
            id: apiKeys.id, 
            name: apiKeys.name,
            revoked: apiKeys.revoked,
            // Hardware specs
            frontView: hardwareSpecs.frontView,
            sideView: hardwareSpecs.sideView,
            backView: hardwareSpecs.backView,
            description: hardwareSpecs.description,
            monthlyPrice: hardwareSpecs.monthlyPrice,
            fullyPaidPrice: hardwareSpecs.fullyPaidPrice,
        })
        .from(apiKeys)
        .leftJoin(hardwareSpecs, eq(apiKeys.id, hardwareSpecs.apiKeyId))
        .where(eq(apiKeys.hashedKey, hashed))
        .limit(1);
    
    const row = result[0];
    if (!row) return { valid: false as const, reason: "not_found" as const };
    if (row.revoked) return { valid: false as const, reason: "revoked" as const };
    
    return { 
        valid: true as const, 
        keyId: row.id,
        name: row.name,
        hardwareSpecs: {
            frontView: row.frontView,
            sideView: row.sideView,
            backView: row.backView,
            description: row.description,
            monthlyPrice: row.monthlyPrice,
            fullyPaidPrice: row.fullyPaidPrice,
        }
    };
}