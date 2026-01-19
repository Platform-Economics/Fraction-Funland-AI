class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3) {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Sound playback failed:", e);
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    
    const ctx = this.getContext();
    const now = ctx.currentTime;
    
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, "sine", 0.25);
      }, i * 100);
    });
  }

  playWrong() {
    if (!this.enabled) return;
    this.playTone(200, 0.3, "sawtooth", 0.15);
  }

  playCelebration() {
    if (!this.enabled) return;
    
    const notes = [523.25, 587.33, 659.25, 783.99, 880, 987.77, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, "sine", 0.2);
      }, i * 80);
    });
  }

  playClick() {
    if (!this.enabled) return;
    this.playTone(800, 0.05, "sine", 0.1);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.playTone(880, 0.1, "sine", 0.2);
    setTimeout(() => this.playTone(1100, 0.15, "sine", 0.2), 100);
  }

  // Play upbeat kids background music using Web Audio oscillators
  playBackgroundMusic(duration: number = 8, volume: number = 0.08): () => void {
    if (!this.enabled) return () => {};
    
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      // Create a simple cheerful melody pattern
      const melody = [
        { freq: 523, time: 0 },     // C5
        { freq: 659, time: 0.3 },   // E5
        { freq: 784, time: 0.6 },   // G5
        { freq: 659, time: 0.9 },   // E5
        { freq: 523, time: 1.2 },   // C5
        { freq: 587, time: 1.5 },   // D5
        { freq: 659, time: 1.8 },   // E5
        { freq: 784, time: 2.1 },   // G5
      ];
      
      const oscillators: OscillatorNode[] = [];
      const gainNodes: GainNode[] = [];
      
      // Play melody in loop
      const loops = Math.ceil(duration / 2.4);
      for (let loop = 0; loop < loops; loop++) {
        melody.forEach(note => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = note.freq;
          osc.type = "triangle";
          gain.gain.setValueAtTime(volume, now + loop * 2.4 + note.time);
          gain.gain.exponentialRampToValueAtTime(0.01, now + loop * 2.4 + note.time + 0.25);
          osc.start(now + loop * 2.4 + note.time);
          osc.stop(now + loop * 2.4 + note.time + 0.25);
          oscillators.push(osc);
          gainNodes.push(gain);
        });
      }
      
      return () => {
        oscillators.forEach(o => { try { o.stop(); } catch(e) {} });
      };
    } catch (e) {
      console.warn("Background music failed:", e);
      return () => {};
    }
  }

  // Play kids cheering sound effect
  playKidsCheering(duration: number = 2): void {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      // Create multiple oscillators at different frequencies to simulate cheering
      const frequencies = [440, 554, 659, 880, 1047, 1319];
      
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sawtooth";
        osc.frequency.value = freq + Math.random() * 50;
        
        filter.type = "bandpass";
        filter.frequency.value = freq;
        filter.Q.value = 2;
        
        // Envelope for cheering effect
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
        gain.gain.setValueAtTime(0.05, now + duration - 0.3);
        gain.gain.linearRampToValueAtTime(0, now + duration);
        
        // Add some vibrato for realistic effect
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.frequency.value = 5 + i;
        lfoGain.gain.value = 20;
        lfo.start(now);
        lfo.stop(now + duration);
        
        osc.start(now);
        osc.stop(now + duration);
      });
      
      // Add some high-pitched "yay" sounds
      [1200, 1400, 1600].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.03, now + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.5);
        osc.start(now + i * 0.2);
        osc.stop(now + i * 0.2 + 0.5);
      });
    } catch (e) {
      console.warn("Cheering sound failed:", e);
    }
  }
}

export const soundManager = new SoundManager();
