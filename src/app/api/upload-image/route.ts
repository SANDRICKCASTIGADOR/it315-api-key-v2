import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    const token = process.env.UPLOADTHING_TOKEN;
    
    console.log('=== UPLOAD REQUEST DEBUG ===');
    console.log('Origin:', origin);
    console.log('Token exists:', !!token);
    console.log('Token first 20 chars:', token?.substring(0, 20));
    
    if (!token) {
      return NextResponse.json(
        { error: 'UPLOADTHING_TOKEN not set' },
        { status: 500, headers: corsHeaders }
      );
    }

    const utapi = new UTApi({ token });
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('File info:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const response = await utapi.uploadFiles(file);

    console.log('UploadThing response:', response);

    if (response.error) {
      console.error('UploadThing error details:', response.error);
      return NextResponse.json(
        { error: `UploadThing: ${response.error.message}` },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('Upload successful!');

    return NextResponse.json(
      {
        url: response.data.url,
        key: response.data.key,
        name: response.data.name,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Catch block error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}