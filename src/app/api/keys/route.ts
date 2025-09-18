// app/api/keys/route.ts
import { NextRequest } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/keys";
import { CreateKeySchema, DeleteKeySchema } from "~/server/validation";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);
   
    const validatedData = CreateKeySchema.parse(body);
    const { name, hardwareSpecs } = validatedData;
    
    const result = await insertKey(name, hardwareSpecs);
    
    return Response.json({
      id: result.id,
      name: result.name,
      key: result.key,
      last4: result.last4,
      hardwareSpecs: result.hardwareSpecs
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating key:", error);
    
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
        error: "Failed to create key", 
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
      revoked: key.revoked,
      imageUrl: key.imageUrl,
      brandname: key.brandname,
      processor: key.processor,
      graphic: key.graphic,
      display: key.display,
      ram: key.ram,
      storage: key.storage,
    }));
    
    return Response.json({ items });
    
  } catch (error) {
    console.error("Error listing keys:", error);
    return Response.json(
      { error: "Failed to list keys" },
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
      return Response.json({ error: "Key not found or already revoked" }, { status: 404 });
    }
    
    return Response.json({ success: true });
    
  } catch (error) {
    console.error("Error revoking key:", error);
    
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
      { error: "Failed to revoke key" },
      { status: 500 }
    );
  }
}