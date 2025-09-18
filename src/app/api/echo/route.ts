import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { apiKeys } from "~/server/db/schema";
import { eq } from "drizzle-orm"; 
import { verifyKey } from "~/server/keys";

export async function POST(req: NextRequest) {
    const apiKey = req.headers.get("x-api-key") ?? "";
    const result = await verifyKey(apiKey);
        
    if (!result.valid) {
        return Response.json({ error: result.reason }, { status: 401})
    }
        
    const body = await req.json();
    
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
    
    return Response.json(
        {
            ok: true,
            message: "Hello POST",
            keyData: getKeyData[0] || null, 
            keyId: result.keyId,
            hardwareSpecs: result.hardwareSpecs,
            imageUrl: result.imageUrl, 
        },
        { status: 200},
    );
}