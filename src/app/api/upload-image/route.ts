import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

export async function POST(request: NextRequest) {
  try {
    // Debug: Check if token exists
    const token = process.env.UPLOADTHING_SECRET || process.env.UPLOADTHING_TOKEN;
    console.log('Token exists:', !!token);
    console.log('Token length:', token?.length);
    
    if (!token) {
      return NextResponse.json(
        { error: 'UPLOADTHING_SECRET or UPLOADTHING_TOKEN not set in environment variables' },
        { status: 500 }
      );
    }

    const utapi = new UTApi({ token });

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Uploading file:', file.name, file.size);

    // Upload file to UploadThing using UTApi
    const response = await utapi.uploadFiles(file);

    if (response.error) {
      console.error('UploadThing error:', response.error);
      return NextResponse.json(
        { error: response.error.message },
        { status: 500 }
      );
    }

    console.log('Upload successful:', response.data.url);

    return NextResponse.json({
      url: response.data.url,
      key: response.data.key,
      name: response.data.name,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}