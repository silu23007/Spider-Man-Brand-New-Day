/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";

class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private rainNode: AudioWorkletNode | ScriptProcessorNode | null = null;

  private spiderSenseRainSource: AudioBufferSourceNode | null = null;
  private spiderSenseRainGain: GainNode | null = null;
  private spiderSenseRainInterval: any = null;

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.startRain();
    } else {
      this.stopRain();
      this.stopSpiderSenseRain();
    }
  }

  getMuted() {
    return this.isMuted;
  }

  startSpiderSenseRain() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    this.stopSpiderSenseRain();

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. Soft background wind/rain rumble (low-pass white noise)
    const noiseBuffer = this.createNoiseBuffer();
    if (noiseBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, now); // soft and comfortable

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(now);
      this.spiderSenseRainSource = source;
      this.spiderSenseRainGain = gain;
    }

    // 2. Realistic raindrops pitter-patter plucks
    this.spiderSenseRainInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const dNow = this.ctx.currentTime;
      const drops = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < drops; i++) {
        const delay = Math.random() * 0.12;
        const osc = this.ctx.createOscillator();
        const dropGain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(Math.random() * 450 + 350, dNow + delay);
        osc.frequency.exponentialRampToValueAtTime(100, dNow + delay + 0.04);

        dropGain.gain.setValueAtTime(0.006 + Math.random() * 0.006, dNow + delay);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, dNow + delay + 0.04);

        osc.connect(dropGain);
        dropGain.connect(this.ctx.destination);

        osc.start(dNow + delay);
        osc.stop(dNow + delay + 0.05);
      }
    }, 140);
  }

  stopSpiderSenseRain() {
    if (this.spiderSenseRainSource) {
      try {
        this.spiderSenseRainSource.stop();
        this.spiderSenseRainSource.disconnect();
      } catch (e) {}
      this.spiderSenseRainSource = null;
    }
    if (this.spiderSenseRainGain) {
      try {
        this.spiderSenseRainGain.disconnect();
      } catch (e) {}
      this.spiderSenseRainGain = null;
    }
    if (this.spiderSenseRainInterval) {
      clearInterval(this.spiderSenseRainInterval);
      this.spiderSenseRainInterval = null;
    }
  }

  private createNoiseBuffer() {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Play a procedurally synthesized thunder clap
  playThunder() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Create a low rumble oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 1.5);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(30, now + 1.5);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    // Create a noise crunch for the initial lightning strike
    const noise = ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer();
    if (noiseBuffer) {
      noise.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();

      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(150, now);
      noiseFilter.Q.setValueAtTime(1, now);

      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.0);
  }

  // Play a procedurally synthesized web shooter zip sound
  playWebShoot() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2500, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    // Add high frequency hiss
    const hiss = ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer();
    if (noiseBuffer) {
      hiss.buffer = noiseBuffer;
      const hissGain = ctx.createGain();
      const hissFilter = ctx.createBiquadFilter();

      hissFilter.type = "highpass";
      hissFilter.frequency.setValueAtTime(3000, now);
      hissGain.gain.setValueAtTime(0.2, now);
      hissGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      hiss.connect(hissFilter);
      hissFilter.connect(hissGain);
      hissGain.connect(ctx.destination);
      hiss.start(now);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Play a cinematic whoosh sound for swinging
  playSwing() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const noise = ctx.createBufferSource();
    const noiseBuffer = this.createNoiseBuffer();
    if (!noiseBuffer) return;

    noise.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.8);
    filter.Q.setValueAtTime(2.0, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 1.0);
  }

  // Heartbeat sound for Spider-Sense mode (two pulses)
  playHeartbeat() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.frequency.setValueAtTime(55, now);
    osc1.frequency.exponentialRampToValueAtTime(25, now + 0.15);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);

    // Second beat
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc2.frequency.setValueAtTime(55, now + 0.25);
    osc2.frequency.exponentialRampToValueAtTime(20, now + 0.45);
    gain2.gain.setValueAtTime(0.35, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 0.5);
  }

  // Clean UI hover tick
  playHover() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.setValueAtTime(1600, now + 0.02);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Clean UI metallic click
  playClick() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.setValueAtTime(600, now);
    osc2.frequency.setValueAtTime(615, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.1);
    osc2.stop(now + 0.1);
  }

  // Camera Shutter mechanical release click
  playShutter() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // High frequency shutter click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(850, now);
    osc1.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.11);

    // Dynamic mechanical spring release whip
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(120, now + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(10, now + 0.13);
    gain2.gain.setValueAtTime(0.06, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.04);
    osc2.stop(now + 0.14);
  }

  // Camera focal focus confirmation beep
  playFocusBeep() {
    if (this.isMuted || !this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.setValueAtTime(2200, now + 0.06);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Continuous rain sound generator (bypassed to remove static frequency noise)
  private startRain() {
    // Rain static noise completely disabled to remove static frequency sound.
  }

  private stopRain() {
    if (this.rainNode) {
      try {
        this.rainNode.disconnect();
      } catch (e) {}
      this.rainNode = null;
    }
  }
}

export const soundEngine = new ProceduralSoundEngine();

// React hook to control sound status globally
export function useSoundControl() {
  const [muted, setMuted] = useState(soundEngine.getMuted());

  const toggleMute = () => {
    const nextState = !soundEngine.getMuted();
    soundEngine.setMute(nextState);
    setMuted(nextState);
  };

  return { muted, toggleMute };
}
