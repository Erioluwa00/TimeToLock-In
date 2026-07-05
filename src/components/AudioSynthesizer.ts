let audioCtx: AudioContext | null = null;

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
      
      // 'triangle' oscillator provides a softer, bell-like retro chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      
      // Envelope setup: quick attack, smooth exponential decay
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
    
    // Two soft, warm tones
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
