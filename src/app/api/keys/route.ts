import { NextRequest } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/keys";
import { CreateKeySchema, DeleteKeySchema } from "~/server/validation";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);
    
    // Validate the request body using your schema
    const validatedData = CreateKeySchema.parse(body);
    console.log("Validated data:", validatedData);
    
    const { imageUrl, hardwareSpecs } = validatedData;
    
    // Handle null/empty imageUrl
    const cleanImageUrl = imageUrl || undefined;
    
    // Call insertKey with validated data
    const result = await insertKey(cleanImageUrl, hardwareSpecs);
    
    return Response.json({
      id: result.id,
      imageUrl: result.imageUrl,
      key: result.key,
      last4: result.last4,
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating key:", error);
    
    // Handle Zod validation errors
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
    
    // Map the results to include masked keys
    const items = keys.map(key => ({
      id: key.id,
      imageUrl: key.imageUrl,
      masked: `****${key.last4}`, // Better masking format
      createdAt: key.createdAt,
      revoked: key.revoked,
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
    
    // Validate the keyId
    const validatedData = DeleteKeySchema.parse({ keyId });
    
    const success = await revokeKey(validatedData.keyId);
    
    if (!success) {
      return Response.json({ error: "Key not found or already revoked" }, { status: 404 });
    }
    
    return Response.json({ success: true });
    
  } catch (error) {
    console.error("Error revoking key:", error);
    
    // Handle Zod validation errors
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