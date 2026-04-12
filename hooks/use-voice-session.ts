"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { VoiceSessionState, VoiceSessionConfig, RawProsodyScores } from "@/types/voice";
import type { ProsodyScores } from "@/baml_client/types";
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

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface UseVoiceSessionReturn {
  state: VoiceSessionState;
  isVoiceMode: boolean;
  isSupported: boolean;
  toggleVoiceMode: () => void;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  stopPlayback: () => void;
  error: string | null;
  clearError: () => void;
}

interface UseVoiceSessionCallbacks {
  onVoiceInput: (transcript: string, prosody: ProsodyScores) => void;
}

export function useVoiceSession(
  config: VoiceSessionConfig,
  callbacks: UseVoiceSessionCallbacks
): UseVoiceSessionReturn {
  const [state, setState] = useState<VoiceSessionState>("idle");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isSupported, setIsSupported] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<unknown>(null);
  const humeSocketRef = useRef<HumeExpressionSocket | null>(null);
  const playbackStopRef = useRef<(() => void) | null>(null);

  // Check browser support on mount (must be in useEffect for SSR)
  useEffect(() => {
    const supported = !!(
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    );
    setIsSupported(supported);
  }, []);

  const toggleVoiceMode = useCallback(() => {
    setIsVoiceMode((v) => !v);
    setState("idle");
    setTranscript("");
    setError(null);
  }, []);

  // Initialize Hume WS when voice mode activates
  useEffect(() => {
    if (!isVoiceMode) {
      humeSocketRef.current?.disconnect();
      humeSocketRef.current = null;
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const token = await fetchHumeToken();
        if (cancelled) return;
        const socket = createHumeExpressionSocket(token);
        await socket.connect();
        if (cancelled) {
          socket.disconnect();
          return;
        }
        humeSocketRef.current = socket;
      } catch (err) {
        if (!cancelled) {
          setError("Failed to connect to Hume. Check API key.");
          console.error("Hume connection error:", err);
        }
      }
    })();

    return () => {
      cancelled = true;
      humeSocketRef.current?.disconnect();
      humeSocketRef.current = null;
    };
  }, [isVoiceMode]);

  const startListening = useCallback(() => {
    if (state !== "idle") return;
    setError(null);
    setTranscript("");
    setState("listening");
    audioChunksRef.current = [];

    // Start SpeechRecognition
    const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition ||
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
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.onresult = (e: SpeechRecognitionEvent) => {
        let text = "";
        for (let i = 0; i < e.results.length; i++) {
          text += e.results[i][0].transcript;
        }
        setTranscript(text);
      };
      recognition.onerror = (e: { error: string }) => {
        if (e.error !== "aborted") {
          setError(`Speech recognition error: ${e.error}`);
        }
      };
      recognition.onend = () => {
        // Recognition ended naturally (silence detected)
      };
      recognition.start();
      recognitionRef.current = recognition;
    }

    // Start MediaRecorder for Hume prosody analysis
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        recorder.start(250); // collect chunks every 250ms
        mediaRecorderRef.current = recorder;
      })
      .catch((err) => {
        setError("Microphone access denied");
        setState("idle");
        console.error("Mic error:", err);
      });
  }, [state]);

  const stopListening = useCallback(async () => {
    if (state !== "listening") return;
    setState("processing");

    // Stop speech recognition
    const recognition = recognitionRef.current as { stop: () => void } | null;
    recognition?.stop();
    recognitionRef.current = null;

    // Stop media recorder
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      // Stop all tracks to release mic
      recorder.stream.getTracks().forEach((t) => t.stop());
    }
    mediaRecorderRef.current = null;

    // Wait a tick for final data chunks
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Get prosody from Hume
    let prosody: ProsodyScores;
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

    if (humeSocketRef.current && audioBlob.size > 0) {
      try {
        const rawScores = await humeSocketRef.current.sendAudio(audioBlob);
        prosody = mapHumeProsody(rawScores);
      } catch (err) {
        console.warn("Prosody analysis failed, using zero scores:", err);
        prosody = zeroProsody();
      }
    } else {
      prosody = zeroProsody();
    }

    const finalTranscript = transcript.trim();
    if (!finalTranscript) {
      setError("No speech detected. Try again.");
      setState("idle");
      return;
    }

    // Hand off to the parent for BAML processing
    setState("thinking");
    callbacks.onVoiceInput(finalTranscript, prosody);
  }, [state, transcript, callbacks]);

  const stopPlayback = useCallback(() => {
    playbackStopRef.current?.();
    playbackStopRef.current = null;
    setState("idle");
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Expose a way for the parent to trigger TTS playback
  // The parent calls this after DeriveVoice completes
  // We'll expose it via a method on the hook return... but hooks can't expose imperative methods easily.
  // Instead, the parent will call synthesizeSpeech + playAudio directly and update state via a passed setter.
  // Let's simplify: expose setState so parent can transition to "speaking" and "idle"

  return {
    state,
    isVoiceMode,
    isSupported,
    toggleVoiceMode,
    startListening,
    stopListening,
    transcript,
    stopPlayback,
    error,
    clearError,
  };
}

/** Helper for parent to play TTS and manage state */
export async function playTTSResponse(
  params: TTSParams,
  onStart: () => void,
  onEnd: () => void
): Promise<{ stop: () => void }> {
  onStart();
  const audioData = await synthesizeSpeech(params);
  const { stop } = playAudio(audioData, onEnd);
  return { stop };
}
