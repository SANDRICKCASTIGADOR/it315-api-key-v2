// app/api/keys/route.ts
import { NextRequest } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/keys";
import { CreateApiKeySchema, DeleteKeySchema } from "~/server/validation";
import { z } from "zod";
import { db } from "~/server/db";
import { apiKeys, motorSpecs } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);
   
    const validatedData = CreateApiKeySchema.parse(body);
    const { name } = validatedData;
    
    const result = await insertKey(name);
    
    return Response.json({
      id: result.id,
      name: result.name,
      key: result.key,
      last4: result.last4,
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating API key:", error);
    
    if (error instanceof z.ZodError) {
      return Response.json(
        { 
          error: "Validation failed", 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return Response.json(
      { 
        error: "Failed to create API key", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("🔍 Fetching API keys with motor specs...");
    
    // Fetch keys with motor specs using LEFT JOIN
    const keysWithSpecs = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        last4: apiKeys.last4,
        createdAt: apiKeys.createdAt,
        revoked: apiKeys.revoked,
        // Motor specs
        motorName: motorSpecs.motorName,
        description: motorSpecs.description,
        monthlyPrice: motorSpecs.monthlyPrice,
        fullyPaidPrice: motorSpecs.fullyPaidPrice,
        frontView: motorSpecs.frontView,
        sideView: motorSpecs.sideView,
        backView: motorSpecs.backView,
      })
      .from(apiKeys)
      .leftJoin(motorSpecs, eq(apiKeys.id, motorSpecs.apiKeyId));

    console.log("✅ Fetched keys:", keysWithSpecs.length);

    const items = keysWithSpecs.map(key => ({
      id: key.id,
      name: key.name,
      masked: `****${key.last4}`,
      createdAt: key.createdAt,
      revoked: key.revoked,
      hardwareSpec: key.motorName ? {
        motorName: key.motorName,
        description: key.description,
        monthlyPrice: key.monthlyPrice,
        fullyPaidPrice: key.fullyPaidPrice,
        frontView: key.frontView,
        sideView: key.sideView,
        backView: key.backView,
      } : null,
    }));
    
    console.log("📦 Returning items:", items);
    
    return Response.json({ items }, { status: 200 });
    
  } catch (error) {
    console.error("💥 Error listing API keys:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown",
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return Response.json(
      { 
        error: "Failed to list API keys",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("keyId");
    
    if (!keyId) {
      return Response.json({ error: "keyId is required" }, { status: 400 });
    }
    
    const validatedData = DeleteKeySchema.parse({ keyId });
    
    const success = await revokeKey(validatedData.keyId);
    
    if (!success) {
      return Response.json({ error: "API key not found or already revoked" }, { status: 404 });
    }
    
    return Response.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error("Error revoking API key:", error);
    
    if (error instanceof z.ZodError) {
      return Response.json(
        { 
          error: "Invalid keyId format", 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: "Failed to revoke API key" },
      { status: 500 }
    );
  }
}