let audioCtx: AudioContext | null = null;
let ambientSource: AudioBufferSourceNode | null = null;
let ambientGainNode: GainNode | null = null;
let wavesLfo: OscillatorNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a beautiful, uplifting arpeggio sound upon task completion.
 */
export const playSuccessSound = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Notes: C5, E5, G5, C6 (Uplifting ascending major arpeggio)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      
      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.4);
    });
  } catch (e) {
    console.warn('Web Audio success chime failed to play:', e);
  }
};

/**
 * Plays a gentle, double chime to signify the end of a Pomodoro lock-in session.
 */
export const playTimerEndSound = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const tones = [587.33, 587.33]; // D5
    
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.25);
      
      gain.gain.setValueAtTime(0, now + idx * 0.25);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.25 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.25 + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.25);
      osc.stop(now + idx * 0.25 + 0.7);
    });
  } catch (e) {
    console.warn('Web Audio timer end chime failed to play:', e);
  }
};

/**
 * Plays a deep, resonant Zen Bell tone with a long decay.
 */
export const playZenBell = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(293.66, now); // D4 deep tone
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5); // long decay
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 2.6);
  } catch (e) {
    console.warn('Zen bell failed to play:', e);
  }
};

/**
 * Plays a quick, retro 8-bit style triplet chime.
 */
export const playRetroChime = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  } catch (e) {
    console.warn('Retro chime failed to play:', e);
  }
};

/**
 * Plays a soft, quick UI feedback click sound.
 */
export const playClickSound = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
    
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    // Fail silently for subtle click sounds
  }
};

/**
 * Helper to generate white noise buffer.
 */
function createWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/**
 * Synthesizes and loops ambient focus noise.
 */
export const startAmbientNoise = (type: 'rain' | 'white' | 'waves', volume: number): void => {
  try {
    const ctx = getAudioContext();
    
    // Stop any existing sound first
    stopAmbientNoise();
    
    const noiseBuffer = createWhiteNoiseBuffer(ctx);
    ambientSource = ctx.createBufferSource();
    ambientSource.buffer = noiseBuffer;
    ambientSource.loop = true;
    
    ambientGainNode = ctx.createGain();
    ambientGainNode.gain.setValueAtTime(volume, ctx.currentTime);
    
    if (type === 'rain') {
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 600;
      bandpass.Q.value = 1.0;
      
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1400;
      
      ambientSource.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(ambientGainNode);
    } else if (type === 'white') {
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 800; // Brownish pink noise hum
      
      ambientSource.connect(lowpass);
      lowpass.connect(ambientGainNode);
    } else if (type === 'waves') {
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 600;
      
      // LFO to modulate filter frequency between 300Hz and 900Hz
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.08; // slow cycles
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300;
      
      lfo.connect(lfoGain);
      lfoGain.connect(lowpass.frequency);
      
      ambientSource.connect(lowpass);
      lowpass.connect(ambientGainNode);
      
      wavesLfo = lfo;
      lfo.start();
    }
    
    ambientGainNode.connect(ctx.destination);
    ambientSource.start();
  } catch (e) {
    console.warn('Failed to start ambient noise:', e);
  }
};

/**
 * Stops any active ambient loop.
 */
export const stopAmbientNoise = (): void => {
  try {
    if (ambientSource) {
      ambientSource.stop();
      ambientSource.disconnect();
      ambientSource = null;
    }
    if (wavesLfo) {
      wavesLfo.stop();
      wavesLfo.disconnect();
      wavesLfo = null;
    }
    if (ambientGainNode) {
      ambientGainNode.disconnect();
      ambientGainNode = null;
    }
  } catch (e) {
    // Fail silently
  }
};

/**
 * Updates ambient volume in real-time.
 */
export const updateAmbientVolume = (volume: number): void => {
  if (ambientGainNode && audioCtx) {
    ambientGainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  }
};

/**
 * Synthesizes a festive confetti pop and shower sound effect.
 */
export const playConfettiPopSound = (): void => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. The POP Thump (quick transient lowpass-filtered noise)
    const bufferSize = 0.05 * ctx.sampleRate; // very short duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 180; // deep pop thump
    noiseFilter.Q.value = 2.0;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // 2. The Sparkle Shower (rising major arpeggio notes)
    const notes = [587.33, 783.99, 1046.50, 1567.98]; // D5, G5, C6, G6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      
      gain.gain.setValueAtTime(0, now + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.3);
    });
  } catch (e) {
    // Fail silently
  }
};
