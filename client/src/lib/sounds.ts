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

  // Play a grand, magical intro fanfare
  playBackgroundMusic(duration: number = 8): () => void {
    if (!this.enabled) return () => {};
    
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const oscillators: OscillatorNode[] = [];
      
      // Grand opening fanfare melody - magical and building
      const melody = [
        // Opening flourish
        { freq: 392, time: 0, dur: 0.3 },      // G4 - gentle start
        { freq: 523, time: 0.35, dur: 0.3 },   // C5
        { freq: 659, time: 0.7, dur: 0.3 },    // E5
        { freq: 784, time: 1.05, dur: 0.5 },   // G5 - hold
        
        // Rising phrase
        { freq: 880, time: 1.6, dur: 0.25 },   // A5
        { freq: 784, time: 1.9, dur: 0.25 },   // G5
        { freq: 880, time: 2.2, dur: 0.25 },   // A5
        { freq: 1047, time: 2.5, dur: 0.6 },   // C6 - climax
        
        // Gentle descent
        { freq: 880, time: 3.2, dur: 0.3 },    // A5
        { freq: 784, time: 3.55, dur: 0.3 },   // G5
        { freq: 659, time: 3.9, dur: 0.3 },    // E5
        { freq: 523, time: 4.25, dur: 0.5 },   // C5 - resolve
        
        // Magical sparkle ending
        { freq: 1047, time: 4.9, dur: 0.15 },  // C6
        { freq: 1319, time: 5.1, dur: 0.15 },  // E6
        { freq: 1568, time: 5.3, dur: 0.4 },   // G6 - sparkle
        
        // Second phrase (if duration allows)
        { freq: 523, time: 5.9, dur: 0.25 },   // C5
        { freq: 659, time: 6.2, dur: 0.25 },   // E5
        { freq: 784, time: 6.5, dur: 0.25 },   // G5
        { freq: 1047, time: 6.8, dur: 0.6 },   // C6
        { freq: 1319, time: 7.5, dur: 0.5 },   // E6 - final
      ];
      
      // Harmony notes (played softer underneath)
      const harmony = [
        { freq: 262, time: 0, dur: 1.5 },      // C4 bass
        { freq: 330, time: 0, dur: 1.5 },      // E4
        { freq: 392, time: 1.6, dur: 1.5 },    // G4
        { freq: 349, time: 3.2, dur: 1.5 },    // F4
        { freq: 262, time: 4.9, dur: 1.2 },    // C4
        { freq: 392, time: 5.9, dur: 2 },      // G4
      ];
      
      // Play main melody with bright tone
      melody.forEach(note => {
        if (note.time < duration) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = note.freq;
          osc.type = "sine";
          
          // Soft attack, gentle decay
          gain.gain.setValueAtTime(0, now + note.time);
          gain.gain.linearRampToValueAtTime(0.12, now + note.time + 0.05);
          gain.gain.setValueAtTime(0.1, now + note.time + note.dur * 0.7);
          gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);
          
          osc.start(now + note.time);
          osc.stop(now + note.time + note.dur + 0.1);
          oscillators.push(osc);
        }
      });
      
      // Play harmony with warm pad sound
      harmony.forEach(note => {
        if (note.time < duration) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = note.freq;
          osc.type = "triangle";
          
          gain.gain.setValueAtTime(0, now + note.time);
          gain.gain.linearRampToValueAtTime(0.04, now + note.time + 0.2);
          gain.gain.setValueAtTime(0.03, now + note.time + note.dur * 0.8);
          gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);
          
          osc.start(now + note.time);
          osc.stop(now + note.time + note.dur + 0.1);
          oscillators.push(osc);
        }
      });
      
      // Add magical shimmer effect
      const shimmerTimes = [0.7, 1.05, 2.5, 4.9, 5.3, 6.8];
      shimmerTimes.forEach(time => {
        if (time < duration) {
          [2093, 2637, 3136].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = "sine";
            gain.gain.setValueAtTime(0, now + time + i * 0.02);
            gain.gain.linearRampToValueAtTime(0.02, now + time + i * 0.02 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + time + i * 0.02 + 0.3);
            osc.start(now + time + i * 0.02);
            osc.stop(now + time + i * 0.02 + 0.35);
            oscillators.push(osc);
          });
        }
      });
      
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
