/** State of the voice session state machine */
export type VoiceSessionState =
  | "idle"        // mic off, ready to start
  | "listening"   // mic on, recording + recognizing
  | "processing"  // audio sent to Hume, waiting for prosody
  | "thinking"    // BAML calls in progress
  | "speaking"    // TTS audio playing
  | "error";

/** Raw scores from Hume Expression Measurement API (all 48 emotions, 0.0-1.0) */
export interface RawProsodyScores {
  [emotion: string]: number;
}

/** Config for the voice session hook */
export interface VoiceSessionConfig {
  /** Hume Octave voice name for TTS output */
  voiceName?: string;
}
