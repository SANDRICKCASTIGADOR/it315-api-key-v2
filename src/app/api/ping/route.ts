import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { verifyKey } from "~/server/keys";

export async function GET(req: NextRequest) {
    const apiKey = req.headers.get("x-api-key") ?? "";
    const result = await verifyKey(apiKey);
    const getImage = await db.select();

    if (!result.valid) {
        return Response.json({ error: result.reason }, { status: 401})
    }

    return Response.json(
        { ok: true, message: "Hello GET", imageLink: getImage, keyId: result.keyId},
        { status: 200}
    )
}