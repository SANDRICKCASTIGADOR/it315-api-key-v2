import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const motorId = params.id;

    if (!motorId) {
      return NextResponse.json(
        { error: "Motor ID is required" },
        { status: 400 }
      );
    }

    // Get Website A's API credentials from environment variables
    const WEBSITE_A_API_URL = process.env.WEBSITE_A_API_URL;
    const WEBSITE_A_API_KEY = process.env.WEBSITE_A_API_KEY;

    if (!WEBSITE_A_API_URL || !WEBSITE_A_API_KEY) {
      console.error("Missing Website A API configuration");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // Fetch from Website A's API (server-side request)
    const response = await fetch(`${WEBSITE_A_API_URL}/api/v1/motors/${motorId}`, {
      method: 'GET',
      headers: {
        'X-API-Key': WEBSITE_A_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    // Handle rate limiting from Website A
    if (response.status === 429) {
      const errorData = await response.json().catch(() => ({ 
        error: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later." 
      }));
      
      return NextResponse.json(errorData, { status: 429 });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: "Motor not found in Website A" 
      }));
      
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error fetching from Website A API:", error);
    return NextResponse.json(
      { error: "Failed to fetch from external API" },
      { status: 500 }
    );
  }
}