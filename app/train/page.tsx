"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatInterface, { Message } from "@/components/chat-interface";
import { toast } from "sonner";
import { useTalk, useFilterPerception, useDeriveVoice } from "@/baml_client/react/hooks";
import { useVoiceSession, playTTSResponse } from "@/hooks/use-voice-session";

import type { CharacterCharacteristics, CharacterState, ProsodyScores } from "@/baml_client/types";

interface AIPersonality {
  name: string;
  avatar: string;
  scenario: string;
  characteristics: CharacterCharacteristics;
}

// Demo AI personality - you can expand this later
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
  const router = useRouter();

  const talkMutation = useTalk({ stream: true });
  const filterPerceptionMutation = useFilterPerception({ stream: false });
  const deriveVoiceMutation = useDeriveVoice({ stream: false });

  // Track whether the current Talk response was triggered by voice
  const voiceTurnRef = useRef(false);
  const playbackStopRef = useRef<(() => void) | null>(null);

  // Voice session
  const handleVoiceInput = useCallback(
    (transcript: string, prosody: ProsodyScores) => {
      voiceTurnRef.current = true;

      // Add user message to chat
      const userMessage: Message = {
        id: Date.now().toString(),
        text: transcript,
        speaker: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // First: filter perception through character's emotional lens
      filterPerceptionMutation.mutate(
        prosody,
        DEMO_AI.characteristics,
        lastCharacterState
      );
    },
    [lastCharacterState, filterPerceptionMutation]
  );

  const voice = useVoiceSession({}, { onVoiceInput: handleVoiceInput });

  // When FilterPerception completes, call Talk with prosody-augmented history
  useEffect(() => {
    if (filterPerceptionMutation.isSuccess && filterPerceptionMutation.finalData && voiceTurnRef.current) {
      const perceived = filterPerceptionMutation.finalData;

      // Build BAML history with prosody on the latest user message
      const bamlHistory = messages.map((msg, i) => ({
        text: msg.text,
        speaker: msg.speaker === "user" ? ("user" as const) : ("ai" as const),
        timestamp: msg.timestamp.toISOString(),
        character_state: null,
        user_prosody: (i === messages.length - 1 && msg.speaker === "user") ? perceived : null,
      }));

      talkMutation.mutate(
        DEMO_AI.characteristics,
        DEMO_AI.scenario,
        bamlHistory
      );

      filterPerceptionMutation.reset();
    }
  }, [filterPerceptionMutation.isSuccess, filterPerceptionMutation.finalData]);

  useEffect(() => {
    // Start the conversation with an initial message from the AI
    if (!sessionStarted) {
      setSessionStarted(true);
      talkMutation.mutate(
        DEMO_AI.characteristics,
        DEMO_AI.scenario,
        [],
      );
    }
  }, [sessionStarted]);

  // Handle AI response when mutation completes
  useEffect(() => {
    if (talkMutation.isSuccess && talkMutation.finalData) {
      const data = talkMutation.finalData;
      const aiMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        text: data.character_message,
        speaker: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLastCharacterState(data.character_state);

      // If this was a voice turn, derive voice and play TTS
      if (voiceTurnRef.current && voice.isVoiceMode) {
        deriveVoiceMutation.mutate(
          data.character_message,
          DEMO_AI.characteristics,
          data.character_state
        );
      }

      talkMutation.reset();
    }
  }, [talkMutation.isSuccess, talkMutation.finalData]);

  // When DeriveVoice completes, play TTS
  useEffect(() => {
    if (deriveVoiceMutation.isSuccess && deriveVoiceMutation.finalData) {
      const directions = deriveVoiceMutation.finalData;
      const lastAiMessage = messages.findLast((m) => m.speaker === "ai");
      if (!lastAiMessage) return;

      playTTSResponse(
        {
          text: lastAiMessage.text,
          description: directions.description,
          speed: directions.speed,
        },
        () => {
          // onStart - we don't set voice.state directly, but the hook handles it
        },
        () => {
          // onEnd - voice turn complete
          voiceTurnRef.current = false;
        }
      ).then(({ stop }) => {
        playbackStopRef.current = stop;
      }).catch((err) => {
        console.error("TTS playback failed:", err);
        voiceTurnRef.current = false;
      });

      deriveVoiceMutation.reset();
    }
  }, [deriveVoiceMutation.isSuccess, deriveVoiceMutation.finalData]);

  // Handle errors
  useEffect(() => {
    if (talkMutation.error) {
      console.error("Error calling BAML:", talkMutation.error);
      toast.error(
        "Failed to get response. Please check your API key in environment variables.",
      );
      talkMutation.reset();
      voiceTurnRef.current = false;
    }
  }, [talkMutation.error]);

  useEffect(() => {
    if (filterPerceptionMutation.error) {
      console.error("FilterPerception error:", filterPerceptionMutation.error);
      // Fall back to calling Talk without prosody
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

  const handleSendMessage = (messageText: string) => {
    voiceTurnRef.current = false;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      speaker: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Convert messages to BAML HistoryItem format
    const bamlHistory = messages.map((msg) => ({
      text: msg.text,
      speaker: msg.speaker === "user" ? ("user" as const) : ("ai" as const),
      timestamp: msg.timestamp.toISOString(),
      character_state: null,
      user_prosody: null,
    }));

    // Add the new user message to history
    bamlHistory.push({
      text: messageText,
      speaker: "user" as const,
      timestamp: new Date().toISOString(),
      character_state: null,
      user_prosody: null,
    });

    // Call BAML function using the hook
    talkMutation.mutate(
      DEMO_AI.characteristics,
      DEMO_AI.scenario,
      bamlHistory,
    );
  };

  const handleEndSession = async () => {
    if (messages.length < 4) {
      toast.error(
        "Please have a longer conversation before ending the session.",
      );
      return;
    }

    try {
      // Store session data in localStorage for the report page
      const sessionData = {
        aiName: DEMO_AI.name,
        scenario: DEMO_AI.scenario,
        messages,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("lastSession", JSON.stringify(sessionData));

      // Navigate to report page
      router.push("/report");
    } catch (error) {
      console.error("Error ending session:", error);
      toast.error("Failed to process session. Please try again.");
    }
  };

  const isProcessing = talkMutation.isLoading ||
    filterPerceptionMutation.isLoading ||
    deriveVoiceMutation.isLoading;

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
          // Voice mode props
          isVoiceMode={voice.isVoiceMode}
          isVoiceSupported={voice.isSupported}
          voiceState={voice.state}
          liveTranscript={voice.transcript}
          onToggleVoiceMode={voice.toggleVoiceMode}
          onStartListening={voice.startListening}
          onStopListening={voice.stopListening}
          onStopPlayback={voice.stopPlayback}
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
