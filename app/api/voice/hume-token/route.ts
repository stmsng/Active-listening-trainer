import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.HUME_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "HUME_API_KEY not configured" },
      { status: 500 }
    );
  }

  // For the Expression Measurement WebSocket, we pass the API key directly.
  // In production, you'd exchange this for a short-lived access token
  // via Hume's OAuth flow. For now, we return the key as the token.
  return NextResponse.json({ token: apiKey });
}
