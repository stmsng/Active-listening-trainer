/** Decode audio and downsample to N normalized amplitude bars (0..1). */
export async function computeWaveform(
  source: Blob | ArrayBuffer,
  bars: number = 32,
): Promise<number[]> {
  const arrayBuffer =
    source instanceof Blob ? await source.arrayBuffer() : source.slice(0);

  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new Ctx();
  try {
    const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const data = buffer.getChannelData(0);
    const bucketSize = Math.max(1, Math.floor(data.length / bars));
    const amplitudes: number[] = new Array(bars).fill(0);
    let max = 0;
    for (let i = 0; i < bars; i++) {
      let bucketMax = 0;
      const start = i * bucketSize;
      const end = Math.min(data.length, start + bucketSize);
      for (let j = start; j < end; j++) {
        const v = Math.abs(data[j]);
        if (v > bucketMax) bucketMax = v;
      }
      amplitudes[i] = bucketMax;
      if (bucketMax > max) max = bucketMax;
    }
    return max > 0 ? amplitudes.map((a) => a / max) : amplitudes;
  } finally {
    try {
      await ctx.close();
    } catch {
      // Some browsers reject close() if already closed
    }
  }
}

/** Best-effort duration of an audio blob, in ms. */
export async function getAudioDurationMs(source: Blob | ArrayBuffer): Promise<number> {
  const arrayBuffer =
    source instanceof Blob ? await source.arrayBuffer() : source.slice(0);
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new Ctx();
  try {
    const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    return Math.round(buffer.duration * 1000);
  } finally {
    try {
      await ctx.close();
    } catch {}
  }
}
