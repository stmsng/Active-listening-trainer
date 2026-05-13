import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Server-side speech-to-text fallback for browsers that lack the Web Speech API
 * (Firefox, Safari iOS in some configs). Accepts a single audio file under the
 * "audio" field and proxies it to OpenAI Whisper.
 */
export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const audio = form.get("audio");
  if (!(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json(
      { error: "Missing 'audio' file" },
      { status: 400 },
    );
  }

  const filename = (audio as File).name || filenameFor(audio.type);

  const whisperForm = new FormData();
  whisperForm.append("file", audio, filename);
  whisperForm.append("model", "whisper-1");
  const language = form.get("language");
  if (typeof language === "string" && language) {
    whisperForm.append("language", language);
  }

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: whisperForm,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Whisper error:", res.status, detail);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 502 },
    );
  }

  const data = (await res.json()) as { text?: string };
  return NextResponse.json({ text: (data.text ?? "").trim() });
}

function filenameFor(mime: string): string {
  if (mime.includes("ogg")) return "voice.ogg";
  if (mime.includes("mp4") || mime.includes("m4a")) return "voice.m4a";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "voice.mp3";
  if (mime.includes("wav")) return "voice.wav";
  return "voice.webm";
}
