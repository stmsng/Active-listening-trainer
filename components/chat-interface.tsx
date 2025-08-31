"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Send, User } from "lucide-react";

export interface Message {
  id: string;
  text: string;
  speaker: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  aiName: string;
  aiAvatar: string;
  scenario: string;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onEndSession: () => void;
}

export default function ChatInterface({
  aiName,
  aiAvatar,
  scenario,
  messages,
  isLoading,
  onSendMessage,
  onEndSession,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
            {aiName} is sharing: <span className="italic">"{scenario}"</span>
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
            <Card className={`max-w-[70%] ${
              message.speaker === "user" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted"
            }`}>
              <CardContent className="p-3">
                <p className="text-sm leading-relaxed">{message.text}</p>
                <span className="text-xs opacity-70">
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
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-6">
        <div className="flex gap-3">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your response here... (Press Enter to send)"
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleSend} 
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button 
              onClick={onEndSession}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              End Session
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Conversation length affects cost. Sessions typically last 10-15 exchanges.
        </p>
      </div>
    </div>
  );
}