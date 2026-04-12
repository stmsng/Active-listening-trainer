import { NextResponse } from "next/server";
import { z } from "zod";

const ttsRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  description: z.string().max(100).default(""),
  speed: z.number().min(0.5).max(2.0).default(1.0),
  voiceName: z.string().optional(),
});

export async function POST(req: Request) {
  const apiKey = process.env.HUME_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "HUME_API_KEY not configured" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const parsed = ttsRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { text, description, speed, voiceName } = parsed.data;

  const utterance: Record<string, unknown> = {
    text,
    speed,
  };

  if (description) {
    utterance.description = description;
  }

  if (voiceName) {
    utterance.voice = { name: voiceName, provider: "HUME_AI" };
  }

  const humeRes = await fetch("https://api.hume.ai/v0/tts", {
    method: "POST",
    headers: {
      "X-Hume-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      utterances: [utterance],
      format: { type: "mp3" },
    }),
  });

  if (!humeRes.ok) {
    const errorText = await humeRes.text();
    console.error("Hume TTS error:", errorText);
    return NextResponse.json(
      { error: "TTS synthesis failed" },
      { status: 502 }
    );
  }

  // Hume returns JSON with base64-encoded audio
  const result = await humeRes.json();
  const audioBase64 = result?.generations?.[0]?.audio;

  if (!audioBase64) {
    return NextResponse.json(
      { error: "No audio in TTS response" },
      { status: 502 }
    );
  }

  // Decode base64 and return as binary audio
  const audioBuffer = Buffer.from(audioBase64, "base64");
  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length.toString(),
    },
  });
}
