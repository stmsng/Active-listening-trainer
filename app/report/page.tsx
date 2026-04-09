"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle, XCircle, TrendingUp, ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { useGradeActiveListening } from "@/baml_client/react/hooks";

interface SessionData {
  aiName: string;
  scenario: string;
  messages: Array<{
    id: string;
    text: string;
    speaker: "user" | "ai";
    timestamp: Date;
  }>;
  timestamp: string;
}

interface Grade {
  letter_grade: string;
  effective_responses: Array<{
    original_content: string;
    grader_note: string;
  }>;
  areas_for_improvement: Array<{
    original_content: string;
    grader_note: string;
  }>;
  feedback: string;
}

// Mock progress data for demonstration
const mockProgressData = [
  { session: 1, score: 65 },
  { session: 2, score: 72 },
  { session: 3, score: 78 },
  { session: 4, score: 85 },
  { session: 5, score: 88 },
];

const getGradeColor = (grade: string) => {
  switch (grade) {
    case "A": return "bg-green-500";
    case "B": return "bg-blue-500";
    case "C": return "bg-yellow-500";
    case "D": return "bg-orange-500";
    case "F": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

const getGradeScore = (grade: string) => {
  switch (grade) {
    case "A": return 95;
    case "B": return 85;
    case "C": return 75;
    case "D": return 65;
    case "F": return 50;
    default: return 0;
  }
};

export default function ReportPage() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [grade, setGrade] = useState<Grade | null>(null);
  const router = useRouter();
  const gradeMutation = useGradeActiveListening({ stream: false });

  useEffect(() => {
    const loadSessionData = () => {
      try {
        const storedData = localStorage.getItem("lastSession");
        if (!storedData) {
          toast.error("No session data found. Please complete a training session first.");
          router.push("/train");
          return;
        }

        const parsed = JSON.parse(storedData);
        setSessionData(parsed);
        generateGrade(parsed);
      } catch (error) {
        console.error("Error loading session data:", error);
        toast.error("Failed to load session data.");
        router.push("/train");
      }
    };

    loadSessionData();
  }, [router]);

  // Handle grade response when mutation completes
  useEffect(() => {
    if (gradeMutation.data && gradeMutation.isSuccess) {
      setGrade(gradeMutation.data);
      gradeMutation.reset(); // Reset for next call
    }
  }, [gradeMutation.data, gradeMutation.isSuccess]);

  // Handle errors
  useEffect(() => {
    if (gradeMutation.error) {
      console.error("Error generating grade:", gradeMutation.error);
      toast.error("Failed to generate grade. Please check your OpenAI API key.");
      gradeMutation.reset();
    }
  }, [gradeMutation.error]);

  const generateGrade = (data: SessionData) => {
    const bamlHistory = data.messages.map((msg) => ({
      text: msg.text,
      speaker: msg.speaker === "user" ? "user" as const : "ai" as const,
      timestamp: new Date(msg.timestamp).toISOString(),
    }));

    gradeMutation.mutate(
      data.scenario,
      bamlHistory
    );
  };

  // No need for this function anymore - we get real data from BAML

  if (gradeMutation.isPending || (!sessionData || !grade)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  if (!sessionData || !grade) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No session data available</p>
            <Button onClick={() => router.push("/train")}>
              Start New Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gradeScore = getGradeScore(grade.letter_grade);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold">Session Report</h1>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Session Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-user.jpg" alt={sessionData.aiName} />
                <AvatarFallback>{sessionData.aiName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2>Session with {sessionData.aiName}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(sessionData.timestamp).toLocaleDateString()} • {sessionData.messages.length} messages
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">"{sessionData.scenario}"</p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Overall Grade */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-2xl font-bold ${getGradeColor(grade.letter_grade)}`}>
                  {grade.letter_grade}
                </div>
                <div className="space-y-2">
                  <Progress value={gradeScore} className="w-full" />
                  <p className="text-sm text-muted-foreground">{gradeScore}% Active Listening Score</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Feedback</h4>
                <p className="text-sm leading-relaxed">{grade.feedback}</p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: "#8884d8", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Your active listening skills have improved by 35% over 5 sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Response Examples */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Helpful Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Effective Responses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {grade.effective_responses.map((response, index) => (
                <div key={index} className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-sm">"{response.original_content}"</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {response.grader_note}
                  </p>
                </div>
              ))}
              {grade.effective_responses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No effective responses identified in this session.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <XCircle className="h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {grade.areas_for_improvement.map((response, index) => (
                <div key={index} className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                  <p className="text-sm">"{response.original_content}"</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {response.grader_note}
                  </p>
                </div>
              ))}
              {grade.areas_for_improvement.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No areas for improvement identified - excellent work!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-auto p-4 flex-col items-start" onClick={() => router.push("/train")}>
                <span className="font-semibold">Practice Again</span>
                <span className="text-sm opacity-80">Continue with Sarah or try a new AI partner</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col items-start">
                <span className="font-semibold">Study Techniques</span>
                <span className="text-sm opacity-80">Review active listening strategies</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col items-start">
                <span className="font-semibold">Share with Therapist</span>
                <span className="text-sm opacity-80">Discuss this session in your next appointment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}