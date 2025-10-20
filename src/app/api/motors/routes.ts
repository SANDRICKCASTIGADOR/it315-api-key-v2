import { db } from '~/server/db';
import { hardwareSpecs } from '~/server/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      apiKeyId,
      motorName,
      description,
      monthlyPrice,
      fullyPaidPrice,
      frontView,
      sideView,
      backView,
    } = body;

    console.log('📝 Received motor data:', { motorName, apiKeyId });

    if (!apiKeyId) {
      return NextResponse.json(
        { error: 'API Key ID is required' },
        { status: 400 }
      );
    }

    // Create hardware spec record
    const newMotor = {
      id: uuidv4(),
      apiKeyId,
      description: description || motorName || 'Motor',
      monthlyPrice: monthlyPrice ? String(monthlyPrice) : null,
      fullyPaidPrice: fullyPaidPrice ? String(fullyPaidPrice) : null,
      frontView: frontView || null,
      sideView: sideView || null,
      backView: backView || null,
    };

    console.log('🔧 Inserting motor:', newMotor.id);

    await db.insert(hardwareSpecs).values(newMotor);

    console.log('✅ Motor added successfully:', newMotor.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Motor uploaded successfully',
        id: newMotor.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error uploading motor:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload motor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}