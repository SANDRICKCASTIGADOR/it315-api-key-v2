// app/api/echo/route.ts
import { CreateKeySchema } from "~/server/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Received body:", body);

    const parsed = CreateKeySchema.safeParse(body);

    if (!parsed.success) {
      console.error("❌ Validation failed:", parsed.error.format());
      return new Response(
        JSON.stringify({
          message: "Validation failed",
          errors: parsed.error.format(),
        }),
        { status: 400 }
      );
    }

    const data = parsed.data;
    console.log("✅ Parsed data:", data);

    // dito na yung pag-save/generate ng key
    return new Response(
      JSON.stringify({ message: "Key created!", data }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Server error:", err);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
