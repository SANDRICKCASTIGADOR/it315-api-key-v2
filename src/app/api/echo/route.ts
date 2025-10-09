import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { apiKeys } from "~/server/db/schema";
import { verifyKey } from "~/server/keys";
import { ratelimiter } from "~/server/ratelimits";

export async function GET(req: NextRequest) {
    const apiKey = req.headers.get("x-api-key") ?? "";
    const result = await verifyKey(apiKey);
    const getImage = await db.select();

    if (!result.valid) {
        return Response.json({ error: result.reason }, { status: 401});
    }
     
    const { success, remaining, limit, reset } = await ratelimiter.limit(apiKey);
    if (!success) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
            status: 429,
            headers: {
                "Content-Type": "application/json",
                "Retry-After": String(
                    Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
                ),
                "X-RateLimit-Limit": String(limit),
                "X-RateLimit-Remaining": String(remaining),
            },
        });
    }

    return Response.json(
        { ok: true, message: "Hello GET", keyId: result.keyId },
        { 
            status: 200,
            headers: {
                "X-RateLimit-Limit": String(limit),
                "X-RateLimit-Ramaining": String(Math.max(0, remaining)),
            },
        },
    );
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401});
  }

  const { success, remaining, limit, reset } = await ratelimiter.limit(apiKey);
      if (!success) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
              status: 429,
              headers: {
                  "Content-Type": "application/json",
                  "Retry-After": String(
                      Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
                  ),
                  "X-RateLimit-Limit": String(limit),
                  "X-RateLimit-Remaining": String(remaining),
              },
          });
      }


  const body = await req.json();

  const getName =  await db
     .select({ id: apiKeys.id, name: apiKeys.name })
     .from(apiKeys)
     .where(eq(apiKeys.name, body.postBody));

  if (!getName.length) {
    return Response.json(
      { error: "No matching API key name found" },
      { 
        status: 200,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Ramaining": String(Math.max(0, remaining)),
        },
      },
    ); 
  }

  return Response.json(
    { ok:true, message: "Hello POST", received: getName, keyId: result.keyId },
    { 
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Ramaining": String(Math.max(0, remaining)),
      },
    },
  );
}
