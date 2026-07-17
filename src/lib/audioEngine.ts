import { 
  DenoiseSettings, 
  VocalSepSettings, 
  TrackSepSettings 
} from '../types';

export class MiaoyinAudioEngine {
  private ctx: AudioContext | null = null;
  
  // Audio Buffers
  private vocalBuffer: AudioBuffer | null = null;
  private drumBuffer: AudioBuffer | null = null;
  private bassBuffer: AudioBuffer | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  // Source Nodes
  private vocalSource: AudioBufferSourceNode | null = null;
  private drumSource: AudioBufferSourceNode | null = null;
  private bassSource: AudioBufferSourceNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;

  // Gain Nodes
  private vocalGain: GainNode | null = null;
  private drumGain: GainNode | null = null;
  private bassGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;

  // Master Gain & Effects
  private masterGain: GainNode | null = null;
  private reverbDelay: DelayNode | null = null;
  private reverbFeedback: GainNode | null = null;
  private reverbWet: GainNode | null = null;
  private voiceRecoveryFilter: BiquadFilterNode | null = null;

  // Connection State
  private isPlaying: boolean = false;
  private startTime: number = 0;
  private pauseOffset: number = 0;

  // Event listener for progress
  private onProgressCallback: ((percent: number) => void) | null = null;
  private progressInterval: any = null;

  constructor() {
    // Lazy initialized on play to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.generateSynthesizedTracks();
      this.setupAudioGraph();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generates 4 separate tracks synchronized in a perfect 8-second loop
  private generateSynthesizedTracks() {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const duration = 8.0; // 8 seconds loop
    const totalSamples = sampleRate * duration;

    // Create 4 buffers
    this.vocalBuffer = this.ctx.createBuffer(2, totalSamples, sampleRate);
    this.drumBuffer = this.ctx.createBuffer(2, totalSamples, sampleRate);
    this.bassBuffer = this.ctx.createBuffer(2, totalSamples, sampleRate);
    this.noiseBuffer = this.ctx.createBuffer(2, totalSamples, sampleRate);

    const vL = this.vocalBuffer.getChannelData(0);
    const vR = this.vocalBuffer.getChannelData(1);
    const dL = this.drumBuffer.getChannelData(0);
    const dR = this.drumBuffer.getChannelData(1);
    const bL = this.bassBuffer.getChannelData(0);
    const bR = this.bassBuffer.getChannelData(1);
    const nL = this.noiseBuffer.getChannelData(0);
    const nR = this.noiseBuffer.getChannelData(1);

    const bpm = 110;
    const beatDuration = 60 / bpm; // ~0.545s
    const eighthNote = beatDuration / 2;

    // A minor arpeggio steps for Vocals/Melody
    const melody = [
      220.00, 261.63, 329.63, 440.00, // A3, C4, E4, A4
      392.00, 329.63, 261.63, 220.00, // G4, E4, C4, A3
      293.66, 349.23, 440.00, 587.33, // D4, F4, A4, D5
      523.25, 440.00, 349.23, 293.66  // C5, A4, F4, D4
    ];

    // Bassline notes
    const bass = [
      55.00, 55.00, 55.00, 55.00, // A1
      65.41, 65.41, 73.42, 73.42, // C2, D2
      55.00, 55.00, 55.00, 55.00, // A1
      82.41, 82.41, 73.42, 65.41  // E2, D2, C2
    ];

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;

      // --- 1. Synthesize Hiss / Cyber Noise ---
      // Low rumble hum + high frequency analog hiss
      const whiteNoiseL = Math.random() * 2 - 1;
      const whiteNoiseR = Math.random() * 2 - 1;
      const hum = Math.sin(2 * Math.PI * 50 * t) * 0.05; // 50Hz hum
      nL[i] = (whiteNoiseL * 0.08 + hum) * 0.45;
      nR[i] = (whiteNoiseR * 0.08 + hum) * 0.45;

      // --- 2. Synthesize Bass ---
      const stepIndex = Math.floor(t / eighthNote) % 16;
      const bassFreq = bass[stepIndex];
      const bassEnv = Math.exp(-4 * ((t % eighthNote) / eighthNote));
      // Bass sound with a rich triangle-like overtone
      const bassVal = (Math.sin(2 * Math.PI * bassFreq * t) + 0.3 * Math.sin(2 * Math.PI * bassFreq * 2 * t)) * 0.28 * bassEnv;
      bL[i] = bassVal;
      bR[i] = bassVal;

      // --- 3. Synthesize Vocals / Neon Synth Lead ---
      const leadFreq = melody[Math.floor(t / eighthNote) % 16];
      const leadEnv = Math.exp(-6 * ((t % eighthNote) / eighthNote));
      // Phase-offset stereo voice
      const vValL = (
        Math.sin(2 * Math.PI * leadFreq * t) +
        0.4 * Math.sin(2 * Math.PI * leadFreq * 2 * t) +
        0.15 * Math.sin(2 * Math.PI * leadFreq * 3 * t)
      ) * 0.14 * leadEnv;

      const vValR = (
        Math.sin(2 * Math.PI * leadFreq * t + 0.15) +
        0.4 * Math.sin(2 * Math.PI * leadFreq * 2 * t + 0.3) +
        0.15 * Math.sin(2 * Math.PI * leadFreq * 3 * t + 0.45)
      ) * 0.14 * leadEnv;

      vL[i] = vValL;
      vR[i] = vValR;

      // --- 4. Synthesize Drums ---
      const currentBeat = Math.floor(t / beatDuration) % 8;
      const beatTime = t % beatDuration;

      // Kick (on every 1st beat of 2-beat intervals)
      let kick = 0;
      if (currentBeat % 2 === 0) {
        const kickPitchSweep = 130 * Math.exp(-40 * beatTime);
        const kickEnv = Math.exp(-10 * beatTime);
        kick = Math.sin(2 * Math.PI * kickPitchSweep * beatTime) * 0.45 * kickEnv;
      }

      // Snare / Clap (on alternate beats)
      let snare = 0;
      if (currentBeat % 2 === 1) {
        const snareEnv = Math.exp(-6 * beatTime);
        const snareNoise = (Math.random() * 2 - 1) * snareEnv * 0.18;
        const snareTone = Math.sin(2 * Math.PI * 160 * beatTime) * snareEnv * 0.1;
        snare = snareNoise + snareTone;
      }

      dL[i] = kick + snare;
      dR[i] = kick + snare;
    }
  }

  private setupAudioGraph() {
    if (!this.ctx) return;

    // Create mixing gain nodes
    this.vocalGain = this.ctx.createGain();
    this.drumGain = this.ctx.createGain();
    this.bassGain = this.ctx.createGain();
    this.noiseGain = this.ctx.createGain();

    this.masterGain = this.ctx.createGain();

    // Voice Recovery Filter (peaking EQ centered around 3kHz)
    this.voiceRecoveryFilter = this.ctx.createBiquadFilter();
    this.voiceRecoveryFilter.type = 'peaking';
    this.voiceRecoveryFilter.frequency.value = 3200;
    this.voiceRecoveryFilter.Q.value = 1.0;
    this.voiceRecoveryFilter.gain.value = 0; // Off by default

    // Reverb Delay Loop
    this.reverbDelay = this.ctx.createDelay(1.0);
    this.reverbDelay.delayTime.value = 0.35; // 350ms delay
    this.reverbFeedback = this.ctx.createGain();
    this.reverbFeedback.gain.value = 0.4; // Feedback amount
    this.reverbWet = this.ctx.createGain();
    this.reverbWet.gain.value = 0.0; // Off by default (0%)

    // Connect individual mixer channels to Voice Recovery filter
    this.vocalGain.connect(this.voiceRecoveryFilter);
    this.drumGain.connect(this.masterGain);
    this.bassGain.connect(this.masterGain);
    this.noiseGain.connect(this.masterGain);

    // Voice Recovery filter connects to master
    this.voiceRecoveryFilter.connect(this.masterGain);

    // Set up Reverb loop (Parallel)
    this.masterGain.connect(this.reverbDelay);
    this.reverbDelay.connect(this.reverbFeedback);
    this.reverbFeedback.connect(this.reverbDelay); // Loop

    // Connect Reverb Wet output to destination
    this.reverbDelay.connect(this.reverbWet);
    this.reverbWet.connect(this.ctx.destination);

    // Connect Master directly to destination
    this.masterGain.connect(this.ctx.destination);
  }

  // Set up progress tracking
  public setOnProgress(callback: (percent: number) => void) {
    this.onProgressCallback = callback;
  }

  // Play / Resume
  public play() {
    this.initContext();
    if (!this.ctx || this.isPlaying) return;

    const now = this.ctx.currentTime;
    this.startTime = now - this.pauseOffset;

    // Create and configure source nodes
    this.vocalSource = this.ctx.createBufferSource();
    this.drumSource = this.ctx.createBufferSource();
    this.bassSource = this.ctx.createBufferSource();
    this.noiseSource = this.ctx.createBufferSource();

    this.vocalSource.buffer = this.vocalBuffer;
    this.drumSource.buffer = this.drumBuffer;
    this.bassSource.buffer = this.bassBuffer;
    this.noiseSource.buffer = this.noiseBuffer;

    this.vocalSource.loop = true;
    this.drumSource.loop = true;
    this.bassSource.loop = true;
    this.noiseSource.loop = true;

    // Connect sources to their respective gain nodes
    this.vocalSource.connect(this.vocalGain!);
    this.drumSource.connect(this.drumGain!);
    this.bassSource.connect(this.bassGain!);
    this.noiseSource.connect(this.noiseGain!);

    // Start playback from offset
    const offset = this.pauseOffset % 8.0;
    this.vocalSource.start(0, offset);
    this.drumSource.start(0, offset);
    this.bassSource.start(0, offset);
    this.noiseSource.start(0, offset);

    this.isPlaying = true;

    // Start interval to update visual progress (0-100%) based on loop duration (8s)
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const currentOffset = (this.ctx.currentTime - this.startTime) % 8.0;
      const progressPercent = (currentOffset / 8.0) * 100;
      if (this.onProgressCallback) {
        this.onProgressCallback(progressPercent);
      }
    }, 100);
  }

  // Pause
  public pause() {
    if (!this.isPlaying || !this.ctx) return;

    this.pauseOffset = this.ctx.currentTime - this.startTime;
    
    // Stop and clean up sources
    try {
      this.vocalSource?.stop();
      this.drumSource?.stop();
      this.bassSource?.stop();
      this.noiseSource?.stop();
    } catch (e) {
      console.warn("Error stopping sources", e);
    }

    this.vocalSource = null;
    this.drumSource = null;
    this.bassSource = null;
    this.noiseSource = null;

    this.isPlaying = false;
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // Stop & Reset
  public stop() {
    this.pause();
    this.pauseOffset = 0;
    if (this.onProgressCallback) {
      this.onProgressCallback(0);
    }
  }

  // Live Update parameters for "Smart Denoise"
  public updateDenoise(settings: DenoiseSettings) {
    this.initContext();
    if (!this.noiseGain || !this.reverbWet || !this.voiceRecoveryFilter) return;

    // Slider directly scales the ambient noise volume!
    // If intensity is 0%, noise level is 1.0 (full). If intensity is 100%, noise is 0.0 (silent)
    const noiseMultiplier = (100 - settings.intensity) / 100;
    const targetNoiseGain = 0.5 * noiseMultiplier; // Scale standard level
    
    // Smooth transition
    this.noiseGain.gain.setTargetAtTime(targetNoiseGain, this.ctx!.currentTime, 0.1);

    // Reverb (Preserve Reverb toggle adds a 25% wet echo mix)
    const reverbVolume = settings.preserveReverb ? 0.35 : 0.0;
    this.reverbWet.gain.setTargetAtTime(reverbVolume, this.ctx!.currentTime, 0.15);

    // Voice Recovery Peaking Filter (toggles a +6.5dB presence boost around 3.2kHz)
    const eqBoost = settings.voiceRecovery ? 6.5 : 0.0;
    this.voiceRecoveryFilter.gain.setTargetAtTime(eqBoost, this.ctx!.currentTime, 0.1);
  }

  // Live Update parameters for "Vocal Separation"
  public updateVocalSep(settings: VocalSepSettings) {
    this.initContext();
    if (!this.vocalGain || !this.drumGain || !this.bassGain || !this.noiseGain) return;

    const now = this.ctx!.currentTime;

    // Apply separating coefficients based on selected target
    if (settings.focusVoice === 'main') {
      // Vocal Only: Damp others
      this.vocalGain.gain.setTargetAtTime(1.0, now, 0.15);
      this.drumGain.gain.setTargetAtTime(0.05, now, 0.15);
      this.bassGain.gain.setTargetAtTime(0.05, now, 0.15);
      this.noiseGain.gain.setTargetAtTime(0.02, now, 0.15);
    } else if (settings.focusVoice === 'secondary') {
      // Accompaniment Only (vocals muted)
      this.vocalGain.gain.setTargetAtTime(0.0, now, 0.15);
      this.drumGain.gain.setTargetAtTime(0.9, now, 0.15);
      this.bassGain.gain.setTargetAtTime(0.9, now, 0.15);
      this.noiseGain.gain.setTargetAtTime(0.1, now, 0.15);
    } else {
      // Original Mix
      this.vocalGain.gain.setTargetAtTime(0.8, now, 0.15);
      this.drumGain.gain.setTargetAtTime(0.8, now, 0.15);
      this.bassGain.gain.setTargetAtTime(0.8, now, 0.15);
      this.noiseGain.gain.setTargetAtTime(0.15, now, 0.15); // Normal hiss
    }

    // Boost vocal presence further if "targetEnhancement" is active
    if (settings.focusVoice === 'main' && settings.targetEnhancement) {
      this.vocalGain.gain.setTargetAtTime(1.3, now, 0.1);
    }
  }

  // Live Update parameters for "Multi-track Separation" (sliders)
  public updateTrackSep(settings: TrackSepSettings) {
    this.initContext();
    if (!this.vocalGain || !this.drumGain || !this.bassGain || !this.noiseGain) return;

    const now = this.ctx!.currentTime;
    
    // Map sliders 0-100% to node gain coefficients 0.0 to 1.2
    this.vocalGain.gain.setTargetAtTime((settings.vocals / 100) * 1.0, now, 0.05);
    this.drumGain.gain.setTargetAtTime((settings.drums / 100) * 1.0, now, 0.05);
    this.bassGain.gain.setTargetAtTime((settings.bass / 100) * 1.0, now, 0.05);
    
    // Others is tied to the synthesized ambient noise slider
    this.noiseGain.gain.setTargetAtTime((settings.others / 100) * 0.4, now, 0.05);
  }

  // Clean up Web Audio state on component unmount
  public dispose() {
    this.stop();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }

  public getPlaybackState(): boolean {
    return this.isPlaying;
  }
}
