import type { ProsodyScores } from "@/baml_client/types";
import type { RawProsodyScores } from "@/types/voice";

// ── Prosody Score Mapping ──────────────────────────────────────────
// Maps Hume's 48 emotion labels to our curated 35-field ProsodyScores.
// Hume uses title-case labels; we map to our camelCase/snake_case fields.

const HUME_TO_FIELD: Record<string, keyof ProsodyScores> = {
  "Admiration": "admiration",
  "Adoration": "adoration",
  "Amusement": "amusement",
  "Anger": "anger",
  "Anxiety": "anxiety",
  "Awe": "awe",
  "Awkwardness": "awkwardness",
  "Boredom": "boredom",
  "Calmness": "calmness",
  "Concentration": "concentration",
  "Confusion": "confusion",
  "Contempt": "contempt",
  "Contentment": "contentment",
  "Determination": "determination",
  "Disappointment": "disappointment",
  "Disgust": "disgust",
  "Distress": "distress",
  "Doubt": "doubt",
  "Embarrassment": "embarrassment",
  "Excitement": "excitement",
  "Fear": "fear",
  "Guilt": "guilt",
  "Interest": "interest",
  "Joy": "joy",
  "Love": "love",
  "Nostalgia": "nostalgia",
  "Pain": "pain",
  "Pride": "pride",
  "Sadness": "sadness",
  "Satisfaction": "satisfaction",
  "Shame": "shame",
  "Surprise (negative)": "surprise_negative",
  "Surprise (positive)": "surprise_positive",
  "Sympathy": "sympathy",
  "Tiredness": "tiredness",
};

/** Map Hume's raw 48 emotion scores to our 35-field ProsodyScores */
export function mapHumeProsody(raw: RawProsodyScores): ProsodyScores {
  const scores: Record<string, number> = {};
  for (const [humeLabel, field] of Object.entries(HUME_TO_FIELD)) {
    scores[field] = raw[humeLabel] ?? 0;
  }
  return scores as unknown as ProsodyScores;
}

/** Return a zero-initialized ProsodyScores (used as fallback) */
export function zeroProsody(): ProsodyScores {
  const scores: Record<string, number> = {};
  for (const field of Object.values(HUME_TO_FIELD)) {
    scores[field] = 0;
  }
  return scores as unknown as ProsodyScores;
}

// ── Hume Expression Measurement WebSocket ──────────────────────────

export interface HumeExpressionSocket {
  connect(): Promise<void>;
  sendAudio(audioBlob: Blob): Promise<RawProsodyScores>;
  disconnect(): void;
}

/**
 * Creates a WebSocket connection to Hume's Expression Measurement API.
 * Audio is sent as base64, prosody scores are returned.
 */
export function createHumeExpressionSocket(accessToken: string): HumeExpressionSocket {
  let ws: WebSocket | null = null;
  let pendingResolve: ((scores: RawProsodyScores) => void) | null = null;
  let pendingReject: ((err: Error) => void) | null = null;

  return {
    async connect() {
      return new Promise<void>((resolve, reject) => {
        ws = new WebSocket(
          `wss://api.hume.ai/v0/stream/models?apikey=${accessToken}`
        );
        ws.onopen = () => resolve();
        ws.onerror = (e) => reject(new Error("Hume WS connection failed"));
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            // Extract prosody predictions from the response
            const predictions = data?.prosody?.predictions?.[0]?.emotions;
            if (predictions && pendingResolve) {
              const scores: RawProsodyScores = {};
              for (const item of predictions) {
                scores[item.name] = item.score;
              }
              pendingResolve(scores);
              pendingResolve = null;
              pendingReject = null;
            }
          } catch (err) {
            if (pendingReject) {
              pendingReject(err as Error);
              pendingResolve = null;
              pendingReject = null;
            }
          }
        };
      });
    },

    async sendAudio(audioBlob: Blob): Promise<RawProsodyScores> {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        throw new Error("Hume WebSocket not connected");
      }

      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64 = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );

      return new Promise((resolve, reject) => {
        pendingResolve = resolve;
        pendingReject = reject;

        ws!.send(
          JSON.stringify({
            models: { prosody: {} },
            data: base64,
            raw_text: false,
          })
        );

        // Timeout after 10s
        setTimeout(() => {
          if (pendingReject) {
            pendingReject(new Error("Hume prosody analysis timed out"));
            pendingResolve = null;
            pendingReject = null;
          }
        }, 10000);
      });
    },

    disconnect() {
      ws?.close();
      ws = null;
    },
  };
}

// ── Hume Octave TTS (via server proxy) ─────────────────────────────

export interface TTSParams {
  text: string;
  description: string; // acting instructions, ≤100 chars
  speed: number;       // 0.5-2.0
  voiceName?: string;
}

/**
 * Calls our server-side TTS proxy which forwards to Hume Octave.
 * Returns audio as an ArrayBuffer (mp3).
 */
export async function synthesizeSpeech(params: TTSParams): Promise<ArrayBuffer> {
  const res = await fetch("/api/voice/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`TTS failed: ${res.statusText}`);
  }

  return res.arrayBuffer();
}

// ── Audio Playback ─────────────────────────────────────────────────

let currentAudioSource: AudioBufferSourceNode | null = null;
let audioContext: AudioContext | null = null;

export function playAudio(
  audioData: ArrayBuffer,
  onEnd?: () => void
): { stop: () => void } {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  const stop = () => {
    if (currentAudioSource) {
      currentAudioSource.stop();
      currentAudioSource = null;
    }
  };

  // Stop any currently playing audio
  stop();

  audioContext.decodeAudioData(audioData.slice(0), (buffer) => {
    const source = audioContext!.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext!.destination);
    source.onended = () => {
      currentAudioSource = null;
      onEnd?.();
    };
    source.start();
    currentAudioSource = source;
  });

  return { stop };
}

// ── Access Token ───────────────────────────────────────────────────

/** Fetch a Hume access token from our server endpoint */
export async function fetchHumeToken(): Promise<string> {
  const res = await fetch("/api/voice/hume-token");
  if (!res.ok) throw new Error("Failed to get Hume token");
  const { token } = await res.json();
  return token;
}
