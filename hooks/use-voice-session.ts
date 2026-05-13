"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ProsodyScores } from "@/baml_client/types";
import type { RawProsodyScores } from "@/types/voice";
import {
  createHumeExpressionSocket,
  fetchHumeToken,
  mapHumeProsody,
  zeroProsody,
  synthesizeSpeech,
  playAudio,
  type HumeExpressionSocket,
  type TTSParams,
} from "@/lib/hume";
import { computeWaveform, getAudioDurationMs } from "@/lib/audio-utils";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface VoiceMemo {
  transcript: string;
  prosody: ProsodyScores;
  audioBlob: Blob;
  audioUrl: string;
  waveform: number[];
  durationMs: number;
}

interface UseVoiceRecorderReturn {
  isSupported: boolean;
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  startRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  error: string | null;
  clearError: () => void;
}

interface UseVoiceRecorderCallbacks {
  onMemo: (memo: VoiceMemo) => void;
}

/**
 * Push-to-talk voice recorder. Captures audio + speech recognition transcript,
 * runs the audio through Hume for prosody, computes a waveform, and hands the
 * complete memo to the parent via onMemo.
 */
export function useVoiceRecorder(
  callbacks: UseVoiceRecorderCallbacks,
): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<unknown>(null);
  const humeSocketRef = useRef<HumeExpressionSocket | null>(null);
  const humeConnectingRef = useRef<Promise<void> | null>(null);
  const cancelledRef = useRef(false);
  // Capture transcript in a ref so the stop handler reads the latest value
  // even though the closure was created at start time.
  const transcriptRef = useRef("");

  useEffect(() => {
    // Mic support means "can we capture audio?" — MediaRecorder is universal.
    // Live transcript via Web Speech API is a Chrome/Edge nicety; Firefox &
    // Safari fall back to server-side Whisper after the recording stops.
    const supported =
      typeof window !== "undefined" &&
      typeof window.MediaRecorder !== "undefined" &&
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia;
    setIsSupported(supported);
  }, []);

  useEffect(() => {
    return () => {
      humeSocketRef.current?.disconnect();
      humeSocketRef.current = null;
    };
  }, []);

  const ensureHumeSocket = useCallback(async () => {
    if (humeSocketRef.current) return;
    if (!humeConnectingRef.current) {
      humeConnectingRef.current = (async () => {
        try {
          const token = await fetchHumeToken();
          const socket = createHumeExpressionSocket(token);
          await socket.connect();
          humeSocketRef.current = socket;
        } catch (err) {
          console.warn("Hume connection failed; prosody will be zero.", err);
        } finally {
          humeConnectingRef.current = null;
        }
      })();
    }
    await humeConnectingRef.current;
  }, []);

  const startRecording = useCallback(() => {
    if (isRecording || isProcessing) return;
    setError(null);
    setTranscript("");
    transcriptRef.current = "";
    cancelledRef.current = false;
    audioChunksRef.current = [];
    setIsRecording(true);

    // Kick off Hume connect in the background; first record will wait briefly.
    ensureHumeSocket();

    const SpeechRecognition =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new (SpeechRecognition as new () => {
        continuous: boolean;
        interimResults: boolean;
        onresult: (e: SpeechRecognitionEvent) => void;
        onerror: (e: { error: string }) => void;
        onend: () => void;
        start: () => void;
        stop: () => void;
      })();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (e: SpeechRecognitionEvent) => {
        let text = "";
        for (let i = 0; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        transcriptRef.current = text;
        setTranscript(text);
      };
      recognition.onerror = (e: { error: string }) => {
        if (e.error !== "aborted" && e.error !== "no-speech") {
          setError(`Speech recognition error: ${e.error}`);
        }
      };
      recognition.onend = () => {};
      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("SpeechRecognition.start failed", err);
      }
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (cancelledRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        recorder.start(250);
        mediaRecorderRef.current = recorder;
      })
      .catch((err) => {
        setError("Microphone access denied");
        setIsRecording(false);
        console.error("Mic error:", err);
      });
  }, [isRecording, isProcessing, ensureHumeSocket]);

  const teardownRecorders = useCallback(() => {
    const recognition = recognitionRef.current as { stop: () => void } | null;
    try {
      recognition?.stop();
    } catch {}
    recognitionRef.current = null;

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {}
      recorder.stream.getTracks().forEach((t) => t.stop());
    }
    mediaRecorderRef.current = null;
  }, []);

  const cancelRecording = useCallback(() => {
    if (!isRecording) return;
    cancelledRef.current = true;
    teardownRecorders();
    audioChunksRef.current = [];
    setIsRecording(false);
    setTranscript("");
    transcriptRef.current = "";
  }, [isRecording, teardownRecorders]);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;
    setIsRecording(false);
    setIsProcessing(true);

    teardownRecorders();

    // Let the final chunks flush.
    await new Promise((resolve) => setTimeout(resolve, 120));

    const mime = audioChunksRef.current[0]?.type || "audio/webm";
    const audioBlob = new Blob(audioChunksRef.current, { type: mime });
    audioChunksRef.current = [];

    if (audioBlob.size === 0) {
      setError("No audio captured. Try again.");
      setIsProcessing(false);
      return;
    }

    let prosody: ProsodyScores = zeroProsody();
    if (humeSocketRef.current) {
      try {
        const raw = await humeSocketRef.current.sendAudio(audioBlob);
        prosody = mapHumeProsody(raw);
      } catch (err) {
        console.warn("Prosody analysis failed; using zero scores.", err);
      }
    }

    let waveform: number[] = [];
    let durationMs = 0;
    try {
      [waveform, durationMs] = await Promise.all([
        computeWaveform(audioBlob, 32),
        getAudioDurationMs(audioBlob),
      ]);
    } catch (err) {
      console.warn("Waveform/duration computation failed", err);
    }

    let finalTranscript = transcriptRef.current.trim();
    let sttError: string | null = null;
    if (!finalTranscript) {
      // Web Speech API isn't available (Firefox/Safari) — ask the server.
      try {
        finalTranscript = await transcribeViaServer(audioBlob);
      } catch (err) {
        sttError = err instanceof Error ? err.message : String(err);
        console.warn("Server-side transcription failed:", sttError);
      }
    }
    setIsProcessing(false);

    if (!finalTranscript) {
      setError(
        sttError
          ? `Transcription failed: ${sttError}`
          : "No speech detected. Try again.",
      );
      return;
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    callbacks.onMemo({
      transcript: finalTranscript,
      prosody,
      audioBlob,
      audioUrl,
      waveform,
      durationMs,
    });
  }, [isRecording, teardownRecorders, callbacks]);

  const clearError = useCallback(() => setError(null), []);

  return {
    isSupported,
    isRecording,
    isProcessing,
    transcript,
    startRecording,
    stopRecording,
    cancelRecording,
    error,
    clearError,
  };
}

async function transcribeViaServer(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("audio", blob, filenameForBlob(blob));
  const res = await fetch("/api/voice/transcribe", {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) detail = body.error;
    } catch {
      // non-JSON body; keep the HTTP code message
    }
    throw new Error(detail);
  }
  const data = (await res.json()) as { text?: string };
  return (data.text ?? "").trim();
}

function filenameForBlob(blob: Blob): string {
  const t = blob.type || "";
  if (t.includes("ogg")) return "voice.ogg";
  if (t.includes("mp4") || t.includes("m4a")) return "voice.m4a";
  if (t.includes("mpeg") || t.includes("mp3")) return "voice.mp3";
  if (t.includes("wav")) return "voice.wav";
  return "voice.webm";
}

/** Generate TTS for the AI response and return both the playable URL and waveform data. */
export async function deriveAiVoiceAssets(params: TTSParams): Promise<{
  audioUrl: string;
  audioBlob: Blob;
  waveform: number[];
  durationMs: number;
}> {
  const arrayBuffer = await synthesizeSpeech(params);
  const audioBlob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(audioBlob);
  let waveform: number[] = [];
  let durationMs = 0;
  try {
    [waveform, durationMs] = await Promise.all([
      computeWaveform(arrayBuffer, 32),
      getAudioDurationMs(arrayBuffer),
    ]);
  } catch (err) {
    console.warn("AI waveform computation failed", err);
  }
  return { audioUrl, audioBlob, waveform, durationMs };
}

/** Backwards-compatible helper kept for any callers that want fire-and-forget playback. */
export async function playTTSResponse(
  params: TTSParams,
  onStart: () => void,
  onEnd: () => void,
): Promise<{ stop: () => void }> {
  onStart();
  const audioData = await synthesizeSpeech(params);
  const { stop } = playAudio(audioData, onEnd);
  return { stop };
}
