"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface, { Message } from "@/components/chat-interface";
import { toast } from "sonner";
import { useTalk } from "@/baml_client/react/hooks";

interface AIPersonality {
  name: string;
  avatar: string;
  scenario: string;
  characteristics: {
    name: string;
    introversion: number;
    communication_skill: number;
    openness: number;
    conscientiousness: number;
    age: number;
    gender: "male" | "female" | "other";
    nationality: string;
    reactivity: number;
  };
}

// Demo AI personality - you can expand this later
const DEMO_AI: AIPersonality = {
  name: "Sarah",
  avatar: "/professional-woman-therapist-headshot-warm-smile.png",
  scenario:
    "I'm struggling with the recent loss of my dog. It's been really hard to process this grief, and I feel like I need someone to just listen and understand what I'm going through.",
  characteristics: {
    name: "Sarah",
    introversion: 6,
    communication_skill: 7,
    openness: 8,
    conscientiousness: 7,
    age: 35,
    gender: "female",
    nationality: "American",
    reactivity: 4,
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
    if (talkMutation.streamData && talkMutation.isSuccess && talkMutation.data) {
      const aiMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        text: talkMutation.streamData,
        speaker: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      talkMutation.reset(); // Reset for next call
    }
  }, [talkMutation.streamData, talkMutation.isSuccess]);

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

    // Convert messages to BAML format
    const bamlHistory = messages.map((msg) => ({
      text: msg.text,
      speaker: msg.speaker === "user" ? ("user" as const) : ("ai" as const),
    }));

    // Add the new user message to history
    bamlHistory.push({
      text: messageText,
      speaker: "user" as const,
    });

    // Call BAML function using the hook
    talkMutation.mutate(
      DEMO_AI.characteristics,
      DEMO_AI.scenario,
      true, // pretending mode
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
          <p>{talkMutation.streamData}</p>
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
