// app/api/keys/route.ts
import { NextRequest } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/keys";
import { CreateApiKeySchema, DeleteKeySchema } from "~/server/validation";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);
   
    // CreateKeySchema should only have { name: string }
    const validatedData = CreateApiKeySchema.parse(body);
    const { name } = validatedData;
    
    const result = await insertKey(name);
    
    return Response.json({
      id: result.id,
      name: result.name,
      key: result.key,
      last4: result.last4,
      // createdAt: result.createdAt,
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
    const keys = await listKeys();

    const items = keys.map(key => ({
      id: key.id,
      name: key.name,
      masked: `****${key.last4}`,
      createdAt: key.createdAt,
    }));
    
    return Response.json({ items }, { status: 200 });
    
  } catch (error) {
    console.error("Error listing API keys:", error);
    return Response.json(
      { error: "Failed to list API keys" },
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