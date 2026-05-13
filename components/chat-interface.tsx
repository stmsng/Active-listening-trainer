"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User, Mic, X, Loader2 } from "lucide-react";
import { Waveform } from "@/components/waveform";

export interface MessageAudio {
  url: string;
  waveform: number[];
  durationMs: number;
}

export interface Message {
  id: string;
  text: string;
  speaker: "user" | "ai";
  timestamp: Date;
  audio?: MessageAudio;
  /** Auto-play this message's audio once when first rendered. */
  autoPlayAudio?: boolean;
}

interface ChatInterfaceProps {
  aiName: string;
  aiAvatar: string;
  scenario: string;
  messages: Message[];
  isLoading: boolean;
  /** Partial model output while streaming; shown in-thread until the message is committed. */
  streamingText?: string;
  onSendMessage: (message: string) => void;
  onEndSession: () => void;
  // Voice recording (push-to-talk)
  isVoiceSupported?: boolean;
  isRecording?: boolean;
  isProcessingVoice?: boolean;
  liveTranscript?: string;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onCancelRecording?: () => void;
}

export default function ChatInterface({
  aiName,
  aiAvatar,
  scenario,
  messages,
  isLoading,
  streamingText,
  onSendMessage,
  onEndSession,
  isVoiceSupported = false,
  isRecording = false,
  isProcessingVoice = false,
  liveTranscript = "",
  onStartRecording,
  onStopRecording,
  onCancelRecording,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordStartedAtRef = useRef<number | null>(null);
  const [recordElapsedMs, setRecordElapsedMs] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isLoading]);

  // Tick the elapsed-time readout while recording.
  useEffect(() => {
    if (!isRecording) {
      recordStartedAtRef.current = null;
      setRecordElapsedMs(0);
      return;
    }
    recordStartedAtRef.current = Date.now();
    const id = setInterval(() => {
      if (recordStartedAtRef.current !== null) {
        setRecordElapsedMs(Date.now() - recordStartedAtRef.current);
      }
    }, 100);
    return () => clearInterval(id);
  }, [isRecording]);

  const handleSend = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isLoading || !onStartRecording) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    onStartRecording();
  };

  const handleMicUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isRecording) return;
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    onStopRecording?.();
  };

  const handleMicCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isRecording) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    onCancelRecording?.();
  };

  const showMic = isVoiceSupported && !inputMessage.trim();

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header with AI Info */}
      <div className="bg-muted/50 p-6 border-b">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={aiAvatar} alt={aiName} />
            <AvatarFallback>{aiName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{aiName}</h2>
            <p className="text-muted-foreground">AI Conversation Partner</p>
          </div>
        </div>
        <div className="bg-accent/10 p-4 rounded-lg">
          <h3 className="font-semibold text-accent mb-2">Practice Active Listening</h3>
          <p className="text-sm text-muted-foreground">
            {aiName} is sharing: <span className="italic">&ldquo;{scenario}&rdquo;</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Your goal is to practice active listening skills. Ask thoughtful questions,
            reflect their feelings, and show empathy.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.speaker === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.speaker === "ai" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={aiAvatar} alt={aiName} />
                <AvatarFallback>{aiName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <Card
              className={`max-w-[70%] ${
                message.speaker === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <CardContent className="p-3 space-y-2">
                {message.audio && (
                  <Waveform
                    amplitudes={message.audio.waveform}
                    audioUrl={message.audio.url}
                    durationMs={message.audio.durationMs}
                    autoPlay={message.autoPlayAudio}
                  />
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
                <span className="text-xs opacity-70 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </CardContent>
            </Card>
            {message.speaker === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8">
              <AvatarImage src={aiAvatar} alt={aiName} />
              <AvatarFallback>{aiName.charAt(0)}</AvatarFallback>
            </Avatar>
            <Card className="bg-muted">
              <CardContent className="p-3">
                {streamingText ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {streamingText}
                    <span
                      className="inline-block w-0.5 h-4 ml-0.5 align-middle bg-muted-foreground/80 animate-pulse"
                      aria-hidden
                    />
                  </p>
                ) : (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-6">
        <div className="flex items-end gap-2">
          {isRecording && (
            <button
              type="button"
              onClick={onCancelRecording}
              aria-label="Cancel recording"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-muted hover:bg-muted/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="flex-1">
            {isRecording ? (
              <div className="flex h-12 items-center gap-3 rounded-full bg-destructive/10 px-4">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm tabular-nums text-destructive font-medium">
                  {formatElapsed(recordElapsedMs)}
                </span>
                <span className="flex-1 truncate text-sm italic text-muted-foreground">
                  {liveTranscript || "Recording…"}
                </span>
              </div>
            ) : (
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  isProcessingVoice
                    ? "Transcribing voice memo…"
                    : "Type a message, or press and hold the mic to record"
                }
                className="min-h-[48px] max-h-32 resize-none"
                disabled={isLoading || isProcessingVoice}
              />
            )}
          </div>

          {/* Stable mic/send button — never remounts, so pointer capture survives the
              isRecording flip. Acts as send button when there's typed text or when
              releasing after a recording; acts as mic when neither. */}
          <Button
            type="button"
            size="lg"
            className="h-12 w-12 rounded-full p-0 select-none touch-none"
            disabled={
              isLoading ||
              (!isRecording && isProcessingVoice && !inputMessage.trim()) ||
              (!isRecording && !inputMessage.trim() && !showMic)
            }
            aria-label={
              isRecording
                ? "Release to send"
                : inputMessage.trim()
                  ? "Send"
                  : "Press and hold to record"
            }
            onPointerDown={
              isRecording || inputMessage.trim() ? undefined : handleMicDown
            }
            onPointerUp={isRecording ? handleMicUp : undefined}
            onPointerCancel={isRecording ? handleMicCancel : undefined}
            onClick={
              !isRecording && inputMessage.trim() ? handleSend : undefined
            }
          >
            {isRecording || inputMessage.trim() ? (
              <Send className="h-5 w-5" />
            ) : isProcessingVoice ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          {!isRecording && (
            <Button
              onClick={onEndSession}
              variant="outline"
              size="sm"
              disabled={isLoading || isProcessingVoice}
            >
              End
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {isRecording
            ? "Release to send · tap × to cancel"
            : "Conversation length affects cost. Sessions typically last 10-15 exchanges."}
        </p>
      </div>
    </div>
  );
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
