/**
 * A gentle, generated ambient piano pad used when no MP3 file is present at
 * `public/music/romantic.mp3`. Built entirely with the Web Audio API so it
 * adds zero bytes to the bundle and never leaves the site silent.
 *
 * Musically: a slow, warm Ilm–VI–III–VII style progression in A minor with
 * soft bell tones, a low drone and a long reverb tail.
 */

type Voice = { osc: OscillatorNode[]; gain: GainNode };

// Frequencies (Hz) for a soft, romantic chord cycle.
const CHORDS: number[][] = [
  [220.0, 261.63, 329.63], // Am
  [174.61, 220.0, 261.63], // F
  [130.81, 196.0, 261.63], // C
  [196.0, 246.94, 293.66], // G
];

// Sparkle melody notes (higher octave), chosen to fit every chord.
const MELODY = [523.25, 587.33, 659.25, 783.99, 880.0];

export class AmbientPad {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private timer: number | null = null;
  private melodyTimer: number | null = null;
  private voices: Voice[] = [];
  private chordIndex = 0;
  private targetVolume = 0.3;
  private started = false;

  constructor(volume = 0.3) {
    this.targetVolume = volume;
  }

  /** Builds a short synthetic impulse response for a lush reverb tail. */
  private makeReverb(ctx: AudioContext): ConvolverNode {
    const seconds = 3.2;
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const t = i / length;
        // exponential decay with a little stereo variation
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.6) * (ch === 0 ? 1 : 0.92);
      }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  private playChord(freqs: number[], when: number, duration: number) {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.16, when + duration * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, when);
    filter.frequency.linearRampToValueAtTime(1500, when + duration * 0.4);
    filter.Q.value = 0.6;

    const oscs: OscillatorNode[] = [];
    freqs.forEach((f, i) => {
      // Two slightly detuned oscillators per note = warm, chorused pad
      [0, 1].forEach((d) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.value = f * (d === 0 ? 1 : 1.004);
        const vGain = ctx.createGain();
        vGain.gain.value = i === 0 ? 0.5 : 0.3;
        osc.connect(vGain).connect(filter);
        osc.start(when);
        osc.stop(when + duration + 0.2);
        oscs.push(osc);
      });
    });

    filter.connect(gain);
    gain.connect(this.master!);
    if (this.reverb) gain.connect(this.reverb);

    this.voices.push({ osc: oscs, gain });
    if (this.voices.length > 12) this.voices.shift();
  }

  /** A single soft bell note that drifts over the pad. */
  private playSparkle(when: number) {
    const ctx = this.ctx!;
    const freq = MELODY[Math.floor(Math.random() * MELODY.length)];
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    const dur = 2.6;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.055, when + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);

    osc.connect(gain).connect(this.master!);
    if (this.reverb) gain.connect(this.reverb);
    osc.start(when);
    osc.stop(when + dur + 0.1);
  }

  async start() {
    if (this.started) {
      await this.ctx?.resume();
      return;
    }

    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    this.ctx = ctx;
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    const reverb = this.makeReverb(ctx);
    const wet = ctx.createGain();
    wet.gain.value = 0.34;
    reverb.connect(wet).connect(ctx.destination);
    this.reverb = reverb;

    // Low, barely-there drone for warmth
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 55;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.05;
    drone.connect(droneGain).connect(master);
    drone.start();

    this.started = true;

    const CHORD_SECONDS = 7.5;
    const cycle = () => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      this.playChord(CHORDS[this.chordIndex % CHORDS.length], now, CHORD_SECONDS);
      this.chordIndex++;
    };
    cycle();
    this.timer = window.setInterval(cycle, CHORD_SECONDS * 1000);

    // Occasional sparkle notes
    const sparkle = () => {
      if (!this.ctx) return;
      if (Math.random() > 0.35) this.playSparkle(this.ctx.currentTime + Math.random() * 0.6);
    };
    this.melodyTimer = window.setInterval(sparkle, 2600);

    this.fadeTo(this.targetVolume, 2.2);
  }

  private fadeTo(value: number, seconds: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.linearRampToValueAtTime(value, now + seconds);
  }

  setVolume(v: number) {
    this.targetVolume = v;
    this.fadeTo(v, 0.6);
  }

  async mute() {
    this.fadeTo(0, 0.8);
    window.setTimeout(() => {
      void this.ctx?.suspend();
    }, 850);
  }

  async unmute() {
    await this.ctx?.resume();
    this.fadeTo(this.targetVolume, 1.4);
  }

  destroy() {
    if (this.timer) window.clearInterval(this.timer);
    if (this.melodyTimer) window.clearInterval(this.melodyTimer);
    this.timer = null;
    this.melodyTimer = null;
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.reverb = null;
    this.voices = [];
    this.started = false;
  }
}
