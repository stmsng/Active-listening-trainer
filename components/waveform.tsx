"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WaveformProps {
  amplitudes: number[];
  audioUrl?: string;
  durationMs?: number;
  autoPlay?: boolean;
  className?: string;
}

export function Waveform({
  amplitudes,
  audioUrl,
  durationMs,
  autoPlay,
  className,
}: WaveformProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1

  // Set up the audio element when URL changes.
  useEffect(() => {
    if (!audioUrl) {
      audioRef.current?.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setProgress(0);
      return;
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const onTime = () => {
      if (audio.duration > 0) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTime);
    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTime);
      audioRef.current = null;
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!autoPlay || !audioUrl || autoPlayedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    autoPlayedRef.current = true;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay blocked; user can hit play manually.
      });
  }, [autoPlay, audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const bars = amplitudes.length || 1;
  const barWidth = 2;
  const gap = 2;
  const height = 24;
  const width = bars * (barWidth + gap) - gap;
  const playedBars = Math.floor(progress * bars);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {audioUrl && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-current/15 hover:bg-current/25 transition-colors"
        >
          {isPlaying ? (
            <Pause className="h-3 w-3 fill-current" />
          ) : (
            <Play className="h-3 w-3 fill-current translate-x-px" />
          )}
        </button>
      )}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="flex-shrink-0"
        aria-hidden
      >
        {amplitudes.map((amp, i) => {
          const h = Math.max(2, amp * height);
          const played = i < playedBars;
          return (
            <rect
              key={i}
              x={i * (barWidth + gap)}
              y={(height - h) / 2}
              width={barWidth}
              height={h}
              rx={1}
              className={played ? "fill-current opacity-100" : "fill-current opacity-50"}
            />
          );
        })}
      </svg>
      {typeof durationMs === "number" && durationMs > 0 && (
        <span className="text-[10px] tabular-nums opacity-70">
          {formatDuration(durationMs)}
        </span>
      )}
    </div>
  );
}

function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
