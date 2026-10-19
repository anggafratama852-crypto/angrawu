/**
 * Web Audio API Camera Sound Synthesizer
 * Produces authentic mechanical shutter click, flash charge, and film winder sound effects.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play authentic dual-click mechanical camera shutter sound
 */
export function playShutterSound(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Initial click (mirror flip/blade open)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const filter1 = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(600, now);
    osc1.frequency.exponentialRampToValueAtTime(120, now + 0.04);

    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(800, now);
    filter1.Q.setValueAtTime(3, now);

    gain1.gain.setValueAtTime(0.7, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.05);

    // 2. White noise burst for the shutter curtain swoosh
    const bufferSize = ctx.sampleRate * 0.07;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1400, now + 0.02);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now + 0.02);
    noise.stop(now + 0.09);

    // 3. Second heavier mechanical closing clunk
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(240, now + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.14);

    gain2.gain.setValueAtTime(0.8, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.06);
    osc2.stop(now + 0.16);

    // 4. Followed by subtle film winder spool sound (whir-click)
    setTimeout(() => {
      playWinderSound();
    }, 180);
  } catch (err) {
    console.warn('Audio playback error (browser user gesture requirement):', err);
  }
}

/**
 * Play authentic film winder ratchet sound
 */
export function playWinderSound(): void {
  try {
    const ctx = getAudioContext();
    const startTime = ctx.currentTime;

    // Series of 4 quick ratchet clicks
    for (let i = 0; i < 4; i++) {
      const clickTime = startTime + i * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200 + i * 100, clickTime);
      osc.frequency.exponentialRampToValueAtTime(300, clickTime + 0.025);

      gain.gain.setValueAtTime(0.25, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.005, clickTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(clickTime);
      osc.stop(clickTime + 0.035);
    }
  } catch {
    // Ignore audio permission block
  }
}

/**
 * Play flash capacitor charging whine
 */
export function playFlashBeep(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(3800, now + 0.4);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch {
    // Ignore
  }
}
