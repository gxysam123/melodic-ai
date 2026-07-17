export type TabId = 'denoise' | 'vocal-sep' | 'track-sep';

export interface DenoiseSettings {
  intensity: number; // 0-100%
  preserveReverb: boolean;
  voiceRecovery: boolean;
}

export interface VocalSepSettings {
  sensitivity: number; // 0-100%
  focusVoice: 'main' | 'secondary' | 'backing';
  targetEnhancement: boolean;
}

export interface TrackSepSettings {
  vocals: number; // 0-100%
  drums: number; // 0-100%
  bass: number; // 0-100%
  piano: number; // 0-100%
  others: number; // 0-100%
}

export interface AudioFile {
  name: string;
  size: number;
  duration: number; // in seconds
  url: string;
  isDemo?: boolean;
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'cyber' | 'input';
  timestamp: string;
}

export type ProcessingStatus = 'idle' | 'ready' | 'processing' | 'completed';
