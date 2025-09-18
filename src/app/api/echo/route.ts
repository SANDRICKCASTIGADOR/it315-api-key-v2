import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { apiKeys } from "~/server/db/schema";
import { eq } from "drizzle-orm"; 
import { verifyKey } from "~/server/keys";

export async function POST(req: NextRequest) {
    const apiKey = req.headers.get("x-api-key") ?? "";
    
    try {
        const result = await verifyKey(apiKey);
        console.log("Verify result:", result);
        
        if (!result.valid) {
            return Response.json({ error: result.reason }, { status: 401})
        }
        
        const body = await req.json();
        console.log("Request body:", body);
        
        // Debug: Check what's in the database first
        const rawQuery = await db
            .select()
            .from(apiKeys)
            .where(eq(apiKeys.id, result.keyId))
            .limit(1);
        
        console.log("Raw database record:", rawQuery);
        
        // Now try the specific select
        const getKeyData = await db
          .select({
            id: apiKeys.id,
            imageUrl: apiKeys.imageUrl,
            brandname: apiKeys.brandname,
            processor: apiKeys.processor,
            graphic: apiKeys.graphic,
            display: apiKeys.display,
            ram: apiKeys.ram,
            storage: apiKeys.storage,
            createdAt: apiKeys.createdAt,
            revoked: apiKeys.revoked
          })
          .from(apiKeys)
          .where(eq(apiKeys.id, result.keyId));
    
        console.log("Selected key data:", getKeyData);
        
        return Response.json(
            {
                ok: true,
                message: "Hello POST",
                keyData: getKeyData[0] || null,
                keyId: result.keyId,
                hardwareSpecs: result.hardwareSpecs,
                imageUrl: result.imageUrl,
                debug: {
                    rawRecord: rawQuery[0],
                    selectedRecord: getKeyData[0]
                }
            },
            { status: 200 },
        );
        
    } catch (error) {
        console.error("Detailed error:", error);
        
        return Response.json(
            { 
                error: "API Error",
                message: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined
            }, 
            { status: 500 }
        );
    }
}