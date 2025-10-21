// server/keys.ts
import { createHash, randomBytes, randomUUID } from "crypto";
import { db } from "./db";
import { apiKeys, motorSpecs } from "./db/schema";
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

export interface MotorSpecs {
    motorName?: string;
    frontView?: string;
    sideView?: string;
    backView?: string;
    description?: string;
    monthlyPrice?: string;
    fullyPaidPrice?: string;
}

export async function insertKey(name: string, motorSpecsData?: MotorSpecs) {
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
    
    if (motorSpecsData) {
        await db.insert(motorSpecs).values({
            id: specId,
            apiKeyId: keyId,
            motorName: motorSpecsData.motorName || '',
            frontView: motorSpecsData.frontView || '',
            sideView: motorSpecsData.sideView || '',
            backView: motorSpecsData.backView || '',
            description: motorSpecsData.description || '',
            monthlyPrice: motorSpecsData.monthlyPrice || '',
            fullyPaidPrice: motorSpecsData.fullyPaidPrice || '',
        });
    }
    
    return { 
        id: keyId, 
        name, 
        key, 
        last4,
        motorSpecs: motorSpecsData
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
            // Motor specs
            motorName: motorSpecs.motorName,
            frontView: motorSpecs.frontView,
            sideView: motorSpecs.sideView,
            backView: motorSpecs.backView,
            description: motorSpecs.description,
            monthlyPrice: motorSpecs.monthlyPrice,
            fullyPaidPrice: motorSpecs.fullyPaidPrice,
        })
        .from(apiKeys)
        .leftJoin(motorSpecs, eq(apiKeys.id, motorSpecs.apiKeyId))
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
    motorSpecsData: Partial<MotorSpecs>
) {
    const existing = await db
        .select()
        .from(motorSpecs)
        .where(eq(motorSpecs.apiKeyId, apiKeyId))
        .limit(1);
    
    if (existing.length > 0) {
        // Update existing - only include fields that are provided
        const updateData: any = {};
        
        if (motorSpecsData.motorName !== undefined) {
            updateData.motorName = motorSpecsData.motorName;
        }
        if (motorSpecsData.frontView !== undefined) {
            updateData.frontView = motorSpecsData.frontView;
        }
        if (motorSpecsData.sideView !== undefined) {
            updateData.sideView = motorSpecsData.sideView;
        }
        if (motorSpecsData.backView !== undefined) {
            updateData.backView = motorSpecsData.backView;
        }
        if (motorSpecsData.description !== undefined) {
            updateData.description = motorSpecsData.description;
        }
        if (motorSpecsData.monthlyPrice !== undefined) {
            updateData.monthlyPrice = motorSpecsData.monthlyPrice;
        }
        if (motorSpecsData.fullyPaidPrice !== undefined) {
            updateData.fullyPaidPrice = motorSpecsData.fullyPaidPrice;
        }
        
        const res = await db
            .update(motorSpecs)
            .set(updateData)
            .where(eq(motorSpecs.apiKeyId, apiKeyId));
        
        return (res.rowCount ?? 0) > 0;
    } else {
        // Create new
        const specId = randomUUID();
        await db.insert(motorSpecs).values({
            id: specId,
            apiKeyId,
            motorName: motorSpecsData.motorName || '',
            frontView: motorSpecsData.frontView || '',
            sideView: motorSpecsData.sideView || '',
            backView: motorSpecsData.backView || '',
            description: motorSpecsData.description || '',
            monthlyPrice: motorSpecsData.monthlyPrice || '',
            fullyPaidPrice: motorSpecsData.fullyPaidPrice || '',
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
            // Motor specs
            motorName: motorSpecs.motorName,
            frontView: motorSpecs.frontView,
            sideView: motorSpecs.sideView,
            backView: motorSpecs.backView,
            description: motorSpecs.description,
            monthlyPrice: motorSpecs.monthlyPrice,
            fullyPaidPrice: motorSpecs.fullyPaidPrice,
        })
        .from(apiKeys)
        .leftJoin(motorSpecs, eq(apiKeys.id, motorSpecs.apiKeyId))
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
            // Motor specs
            motorName: motorSpecs.motorName,
            frontView: motorSpecs.frontView,
            sideView: motorSpecs.sideView,
            backView: motorSpecs.backView,
            description: motorSpecs.description,
            monthlyPrice: motorSpecs.monthlyPrice,
            fullyPaidPrice: motorSpecs.fullyPaidPrice,
        })
        .from(apiKeys)
        .leftJoin(motorSpecs, eq(apiKeys.id, motorSpecs.apiKeyId))
        .where(eq(apiKeys.hashedKey, hashed))
        .limit(1);
    
    const row = result[0];
    if (!row) return { valid: false as const, reason: "not_found" as const };
    if (row.revoked) return { valid: false as const, reason: "revoked" as const };
    
    return { 
        valid: true as const, 
        keyId: row.id,
        name: row.name,
        motorSpecs: {
            motorName: row.motorName,
            frontView: row.frontView,
            sideView: row.sideView,
            backView: row.backView,
            description: row.description,
            monthlyPrice: row.monthlyPrice,
            fullyPaidPrice: row.fullyPaidPrice,
        }
    };
}