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
}

export const soundManager = new SoundManager();
