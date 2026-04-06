"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface, { Message } from "@/components/chat-interface";
import { toast } from "sonner";
import { useTalk } from "@/baml_client/react/hooks";

import type { CharacterCharacteristics } from "@/baml_client/types";

interface AIPersonality {
  name: string;
  avatar: string;
  scenario: string;
  characteristics: CharacterCharacteristics;
}

// Demo AI personality - you can expand this later
const DEMO_AI: AIPersonality = {
  name: "Satomi",
  avatar: "/professional-woman-therapist-headshot-warm-smile.png",
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

export default function TrainingSession() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const router = useRouter();
  const talkMutation = useTalk({ stream: true });

  useEffect(() => {
    // Start the conversation with an initial message from the AI
    if (!sessionStarted) {
      setSessionStarted(true);
      const initialMessage: Message = {
        id: "1",
        text: "Hi there... I'm going through a really difficult time right now and could use someone to talk to. I recently lost my beloved dog, and the grief is overwhelming. I'm not sure how to process these feelings. Would you mind if I shared what I'm experiencing?",
        speaker: "ai",
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [sessionStarted]);

  // Handle AI response when mutation completes
  useEffect(() => {
    if (talkMutation.isSuccess && talkMutation.finalData) {
      const aiMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        text: talkMutation.finalData.character_message,
        speaker: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      talkMutation.reset(); // Reset for next call
    }
  }, [talkMutation.isSuccess, talkMutation.finalData]);

  // Handle errors
  useEffect(() => {
    if (talkMutation.error) {
      console.error("Error calling BAML:", talkMutation.error);
      toast.error(
        "Failed to get response. Please check your OpenAI API key in environment variables.",
      );
      talkMutation.reset();
    }
  }, [talkMutation.error]);

  const handleSendMessage = (messageText: string) => {
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
    }));

    // Add the new user message to history
    bamlHistory.push({
      text: messageText,
      speaker: "user" as const,
      timestamp: new Date().toISOString(),
      character_state: null,
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
      // Convert messages for grading
      const bamlHistory = messages.map((msg) => ({
        text: msg.text,
        speaker: msg.speaker === "user" ? ("user" as const) : ("ai" as const),
        timestamp: msg.timestamp.toISOString(),
        character_state: null,
      }));

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

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen flex flex-col">
        <div>
          <h1>Testing</h1>
          {talkMutation.error && <p>{talkMutation.error.message}</p>}
          {talkMutation.streamData && (
            <p>{talkMutation.streamData.character_message}</p>
          )}
        </div>
        <ChatInterface
          aiName={DEMO_AI.name}
          aiAvatar={DEMO_AI.avatar}
          scenario={DEMO_AI.scenario}
          messages={messages}
          isLoading={talkMutation.isPending}
          onSendMessage={handleSendMessage}
          onEndSession={handleEndSession}
        />
        ;
      </div>
    </div>
  );
}
