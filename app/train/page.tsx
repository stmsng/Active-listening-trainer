"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface, { Message } from "@/components/chat-interface";
import { toast } from "sonner";
import { b } from "@/baml_client";

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
  scenario: "I'm struggling with the recent loss of my dog. It's been really hard to process this grief, and I feel like I need someone to just listen and understand what I'm going through.",
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
  }
};

export default function TrainingSession() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const router = useRouter();

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

  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      speaker: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      // Convert messages to BAML format
      const bamlHistory = messages.map((msg) => ({
        text: msg.text,
        speaker: msg.speaker === "user" ? "user" as const : "ai" as const,
      }));

      // Add the new user message to history
      bamlHistory.push({
        text: messageText,
        speaker: "user" as const,
      });

      // Call BAML function
      const response = await b.Talk(
        DEMO_AI.characteristics,
        DEMO_AI.scenario,
        true, // pretending mode
        bamlHistory
      );

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        speaker: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error calling BAML:", error);
      toast.error("Failed to get response. Please check your OpenAI API key in environment variables.");
      
      // Add a fallback message for demo purposes
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I appreciate you asking that question. It really means a lot that you're taking the time to listen to me. The pain feels so heavy right now, and having someone who wants to understand makes a difference.",
        speaker: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (messages.length < 4) {
      toast.error("Please have a longer conversation before ending the session.");
      return;
    }

    try {
      // Convert messages for grading
      const bamlHistory = messages.map((msg) => ({
        text: msg.text,
        speaker: msg.speaker === "user" ? "user" as const : "ai" as const,
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
        <ChatInterface
          aiName={DEMO_AI.name}
          aiAvatar={DEMO_AI.avatar}
          scenario={DEMO_AI.scenario}
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onEndSession={handleEndSession}
        />
      </div>
    </div>
  );
}