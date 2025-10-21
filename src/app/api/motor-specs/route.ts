import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { motorSpecs } from "~/server/db/schema";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Motor specs data:", body);
    
    const {
      apiKeyId,
      name,
      description,
      monthlyPrice,
      fullyPaidPrice,
      frontView,
      sideView,
      backView,
    } = body;

    if (!apiKeyId || !name) {
      return NextResponse.json(
        { error: "apiKeyId and motorName are required" },
        { status: 400 }
      );
    }

    const [newSpec] = await db
      .insert(motorSpecs)
      .values({
        id: randomUUID(),
        apiKeyId: apiKeyId,
        motorName: name,
        description: description || null,
        monthlyPrice: monthlyPrice || null,
        fullyPaidPrice: fullyPaidPrice || null,
        frontView: frontView || null,
        sideView: sideView || null,
        backView: backView || null,
      })
      .returning();

    console.log("✅ Motor spec created:", newSpec);

    return NextResponse.json({
      success: true,
      data: newSpec,
    }, { status: 201 });
    
  } catch (error) {
    console.error("💥 Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to create motor spec", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const specs = await db.select().from(motorSpecs);
    return NextResponse.json({ success: true, data: specs });
  } catch (error) {
    console.error("Error fetching motor specs:", error);
    return NextResponse.json(
      { error: "Failed to fetch motor specs" },
      { status: 500 }
    );
  }
}