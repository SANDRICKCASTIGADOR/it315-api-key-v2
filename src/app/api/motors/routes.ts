// app/api/motors/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKeyId, motorName, description, monthlyPrice, fullyPaidPrice, frontView, sideView, backView } = body;

    console.log('📥 Received motor data:', body);

    // Basic validation
    if (!apiKeyId || !motorName) {
      return NextResponse.json({ error: 'apiKeyId and motorName required' }, { status: 400 });
    }

    // Import database
    const { db } = await import('~/server/db');
    const { motorSpecs, apiKeys } = await import('~/server/db/schema');
    const { eq } = await import('drizzle-orm');
    const { nanoid } = await import('nanoid');

    // Check API key exists
    const keyExists = await db.select().from(apiKeys).where(eq(apiKeys.id, apiKeyId)).limit(1);
    
    if (!keyExists || keyExists.length === 0) {
      console.error('❌ API key not found:', apiKeyId);
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    console.log('✅ API key found, inserting motor spec...');

    // Insert motor spec
    const result = await db.insert(motorSpecs).values({
      id: nanoid(),
      apiKeyId,
      motorName: String(motorName).trim(),
      description: description ? String(description).trim() : null,
      monthlyPrice: monthlyPrice ? String(monthlyPrice).trim() : null,
      fullyPaidPrice: fullyPaidPrice ? String(fullyPaidPrice).trim() : null,
      frontView: frontView ? String(frontView).trim() : null,
      sideView: sideView ? String(sideView).trim() : null,
      backView: backView ? String(backView).trim() : null,
    }).returning();

    console.log('🎉 Motor spec created:', result[0]);

    return NextResponse.json({ 
      success: true, 
      motor: result[0] 
    }, { status: 201 });

  } catch (error) {
    console.error('💥 Motor route error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { db } = await import('~/server/db');
    const { motorSpecs } = await import('~/server/db/schema');
    
    const motors = await db.select().from(motorSpecs);
    
    console.log('📊 Fetched motors:', motors.length);
    
    return NextResponse.json({ 
      success: true,
      motors 
    });
  } catch (error) {
    console.error('💥 Motor GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch motors' }, { status: 500 });
  }
}