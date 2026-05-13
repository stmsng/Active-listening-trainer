/** Raw scores from Hume Expression Measurement API (all 48 emotions, 0.0-1.0) */
export interface RawProsodyScores {
  [emotion: string]: number;
}
