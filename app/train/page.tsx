"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatInterface, { Message } from "@/components/chat-interface";
import { toast } from "sonner";
import { useTalk, useFilterPerception, useDeriveVoice } from "@/baml_client/react/hooks";
import { useVoiceRecorder, deriveAiVoiceAssets, type VoiceMemo } from "@/hooks/use-voice-session";

import type { CharacterCharacteristics, CharacterState, ProsodyScores } from "@/baml_client/types";

interface AIPersonality {
  name: string;
  avatar: string;
  scenario: string;
  characteristics: CharacterCharacteristics;
}

const DEMO_AI: AIPersonality = {
  name: "Satomi",
  avatar: "/placeholder-user.jpg",
  scenario:
    "My dog died. I need to process this.",
  characteristics: {
    name: "Satomi",
    is_therapist: false,
    introversion: 5,
    communication_skill: 1,
    openness: 5,
    conscientiousness: 2,
    age: 44,
    gender: "female",
    nationality: "Japanese",
    reactivity: 3,
    special_notes: "",
  },
};

const DEFAULT_STATE: CharacterState = {
  relaxed: 5,
  nervous: 5,
  openness: 5,
  shy: 5,
  aggressive: 1,
  secretly_angry: 1,
};

export default function TrainingSession() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [lastCharacterState, setLastCharacterState] = useState<CharacterState>(DEFAULT_STATE);
  const [isSynthesizingVoice, setIsSynthesizingVoice] = useState(false);
  const router = useRouter();

  const talkMutation = useTalk({ stream: true });
  const filterPerceptionMutation = useFilterPerception({ stream: false });
  const deriveVoiceMutation = useDeriveVoice({ stream: false });

  // Was the most recent user turn voice? Determines whether the AI replies with voice.
  const voiceTurnRef = useRef(false);
  // AI's text response held while we wait for TTS so we can attach audio to the message.
  const pendingAiTextRef = useRef<string | null>(null);

  const handleVoiceMemo = useCallback(
    (memo: VoiceMemo) => {
      voiceTurnRef.current = true;

      const userMessage: Message = {
        id: Date.now().toString(),
        text: memo.transcript,
        speaker: "user",
        timestamp: new Date(),
        audio: {
          url: memo.audioUrl,
          waveform: memo.waveform,
          durationMs: memo.durationMs,
        },
      };
      setMessages((prev) => [...prev, userMessage]);

      filterPerceptionMutation.mutate(
        memo.prosody,
        DEMO_AI.characteristics,
        lastCharacterState,
      );
    },
    [lastCharacterState, filterPerceptionMutation],
  );

  const voice = useVoiceRecorder({ onMemo: handleVoiceMemo });

  // FilterPerception -> Talk (voice path)
  useEffect(() => {
    if (
      filterPerceptionMutation.isSuccess &&
      filterPerceptionMutation.finalData &&
      voiceTurnRef.current
    ) {
      const perceived = filterPerceptionMutation.finalData;

      const bamlHistory = messages.map((msg, i) => ({
        text: msg.text,
        speaker: msg.speaker === "user" ? ("user" as const) : ("ai" as const),
        timestamp: msg.timestamp.toISOString(),
        character_state: null,
        user_prosody:
          i === messages.length - 1 && msg.speaker === "user" ? perceived : null,
      }));

      talkMutation.mutate(
        DEMO_AI.characteristics,
        DEMO_AI.scenario,
        bamlHistory,
      );

      filterPerceptionMutation.reset();
    }
  }, [filterPerceptionMutation.isSuccess, filterPerceptionMutation.finalData]);

  // Initial AI greeting on mount.
  useEffect(() => {
    if (!sessionStarted) {
      setSessionStarted(true);
      talkMutation.mutate(DEMO_AI.characteristics, DEMO_AI.scenario, []);
    }
  }, [sessionStarted]);

  // Talk completes -> commit AI text message (text turn) or kick off TTS (voice turn).
  useEffect(() => {
    if (talkMutation.isSuccess && talkMutation.finalData) {
      const data = talkMutation.finalData;
      setLastCharacterState(data.character_state);

      if (voiceTurnRef.current) {
        pendingAiTextRef.current = data.character_message;
        deriveVoiceMutation.mutate(
          data.character_message,
          DEMO_AI.characteristics,
          data.character_state,
        );
      } else {
        const aiMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          text: data.character_message,
          speaker: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }

      talkMutation.reset();
    }
  }, [talkMutation.isSuccess, talkMutation.finalData]);

  // DeriveVoice completes -> synthesize TTS, attach to AI message, auto-play.
  useEffect(() => {
    if (deriveVoiceMutation.isSuccess && deriveVoiceMutation.finalData) {
      const directions = deriveVoiceMutation.finalData;
      const text = pendingAiTextRef.current;
      deriveVoiceMutation.reset();
      if (!text) return;

      setIsSynthesizingVoice(true);
      deriveAiVoiceAssets({
        text,
        description: directions.description,
        speed: directions.speed,
      })
        .then((assets) => {
          const aiMessage: Message = {
            id: (Date.now() + Math.random()).toString(),
            text,
            speaker: "ai",
            timestamp: new Date(),
            audio: {
              url: assets.audioUrl,
              waveform: assets.waveform,
              durationMs: assets.durationMs,
            },
            autoPlayAudio: true,
          };
          setMessages((prev) => [...prev, aiMessage]);
        })
        .catch((err) => {
          console.error("TTS synthesis failed:", err);
          // Fall back to a text-only AI message so the conversation continues.
          const aiMessage: Message = {
            id: (Date.now() + Math.random()).toString(),
            text,
            speaker: "ai",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          toast.error("Voice generation failed; showing text instead.");
        })
        .finally(() => {
          setIsSynthesizingVoice(false);
          voiceTurnRef.current = false;
          pendingAiTextRef.current = null;
        });
    }
  }, [deriveVoiceMutation.isSuccess, deriveVoiceMutation.finalData]);

  useEffect(() => {
    if (talkMutation.error) {
      console.error("Error calling BAML:", talkMutation.error);
      toast.error(
        "Failed to get response. Please check your API key in environment variables.",
      );
      talkMutation.reset();
      voiceTurnRef.current = false;
      pendingAiTextRef.current = null;
    }
  }, [talkMutation.error]);

  useEffect(() => {
    if (filterPerceptionMutation.error) {
      console.error("FilterPerception error:", filterPerceptionMutation.error);
      // Fall back: call Talk without prosody.
      const bamlHistory = messages.map((msg) => ({
        text: msg.text,
        speaker: msg.speaker === "user" ? ("user" as const) : ("ai" as const),
        timestamp: msg.timestamp.toISOString(),
        character_state: null,
        user_prosody: null,
      }));
      talkMutation.mutate(DEMO_AI.characteristics, DEMO_AI.scenario, bamlHistory);
      filterPerceptionMutation.reset();
    }
  }, [filterPerceptionMutation.error]);

  useEffect(() => {
    if (deriveVoiceMutation.error) {
      console.error("DeriveVoice error:", deriveVoiceMutation.error);
      // Fall back: commit AI text-only and clear voice state.
      const text = pendingAiTextRef.current;
      if (text) {
        const aiMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          text,
          speaker: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
      pendingAiTextRef.current = null;
      voiceTurnRef.current = false;
      deriveVoiceMutation.reset();
    }
  }, [deriveVoiceMutation.error]);

  const handleSendMessage = (messageText: string) => {
    voiceTurnRef.current = false;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      speaker: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const bamlHistory = messages.map((msg) => ({
      text: msg.text,
      speaker: msg.speaker === "user" ? ("user" as const) : ("ai" as const),
      timestamp: msg.timestamp.toISOString(),
      character_state: null,
      user_prosody: null,
    }));
    bamlHistory.push({
      text: messageText,
      speaker: "user" as const,
      timestamp: new Date().toISOString(),
      character_state: null,
      user_prosody: null,
    });

    talkMutation.mutate(DEMO_AI.characteristics, DEMO_AI.scenario, bamlHistory);
  };

  const handleEndSession = async () => {
    if (messages.length < 4) {
      toast.error(
        "Please have a longer conversation before ending the session.",
      );
      return;
    }

    try {
      // Strip non-serializable audio data before persisting.
      const persistedMessages = messages.map(({ audio, autoPlayAudio, timestamp, ...rest }) => ({
        ...rest,
        timestamp: timestamp.toISOString(),
      }));
      const turnCount = persistedMessages.filter((m) => m.speaker === "user").length;
      const voiceTurnCount = messages.filter(
        (m) => m.speaker === "user" && m.audio,
      ).length;

      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiName: DEMO_AI.name,
          scenario: DEMO_AI.scenario,
          messages: persistedMessages,
          turnCount,
          voiceTurnCount,
          model: "claude-opus-4-6",
        }),
      });

      if (res.status === 401) {
        // Anonymous user — fall back to localStorage. Quota gating arrives
        // with Phase 2 of MVP_GAPS.
        const legacySession = {
          aiName: DEMO_AI.name,
          scenario: DEMO_AI.scenario,
          messages: persistedMessages,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem("lastSession", JSON.stringify(legacySession));
        router.push("/report");
        return;
      }

      if (!res.ok) {
        throw new Error(`POST /api/sessions failed: ${res.status}`);
      }

      const { id } = (await res.json()) as { id: string };
      router.push(`/report?id=${id}`);
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to process session. Please try again.");
    }
  };

  const isProcessing =
    talkMutation.isLoading ||
    filterPerceptionMutation.isLoading ||
    deriveVoiceMutation.isLoading ||
    isSynthesizingVoice;

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen flex flex-col">
        <ChatInterface
          aiName={DEMO_AI.name}
          aiAvatar={DEMO_AI.avatar}
          scenario={DEMO_AI.scenario}
          messages={messages}
          isLoading={isProcessing}
          streamingText={
            talkMutation.streamData?.character_message ?? undefined
          }
          onSendMessage={handleSendMessage}
          onEndSession={handleEndSession}
          isVoiceSupported={voice.isSupported}
          isRecording={voice.isRecording}
          isProcessingVoice={voice.isProcessing}
          liveTranscript={voice.transcript}
          onStartRecording={voice.startRecording}
          onStopRecording={voice.stopRecording}
          onCancelRecording={voice.cancelRecording}
        />
      </div>
      {voice.error && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="mx-auto max-w-md rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center">
            {voice.error}
            <button
              onClick={voice.clearError}
              className="ml-2 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
