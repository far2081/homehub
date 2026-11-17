/**
 * HomeHub - Sound Controller
 * Generates realistic procedural magazine paper rustle via Web Audio API.
 * Includes Sound On / Off toggle with persistent user preference.
 */

import { storage } from '../utils/storage.js';

class SoundController {
  constructor() {
    this.soundEnabled = storage.get('sound_enabled', true);
    this.audioCtx = null;
    this.initAudioContext = this.initAudioContext.bind(this);
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    storage.set('sound_enabled', this.soundEnabled);
    if (this.soundEnabled) {
      this.initAudioContext();
    }
    return this.soundEnabled;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  /**
   * Play a realistic physical magazine page turn paper rustle sound
   * Synthesizes shaped filtered noise burst with two-stage friction envelope
   */
  playPageTurn() {
    if (!this.soundEnabled) return;

    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const duration = 0.28;

      // 1. Generate White Noise buffer
      const bufferSize = this.audioCtx.sampleRate * duration;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // 2. Bandpass filter to mimic high-frequency paper flutter/crispness
      const bandpass = this.audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, now);
      bandpass.frequency.exponentialRampToValueAtTime(3200, now + 0.12);
      bandpass.frequency.exponentialRampToValueAtTime(900, now + duration);
      bandpass.Q.setValueAtTime(2.2, now);

      // 3. Highpass filter to eliminate unnatural boomy bass
      const highpass = this.audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(450, now);

      // 4. Amplitude Envelope (Quick rise, initial snap, soft secondary slide)
      const gainNode = this.audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(0.22, now + 0.03); // initial page lift
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.11); // mid glide
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.18); // soft page landing
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Connect nodes: Noise -> Highpass -> Bandpass -> Gain -> Destination
      whiteNoise.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch (e) {
      console.warn('Web Audio synthesis not available or blocked by autoplay policy:', e);
    }
  }

  /**
   * Play subtle click / UI interaction sound
   */
  playClick() {
    if (!this.soundEnabled) return;
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      // ignore
    }
  }
}

export const sound = new SoundController();
