import React from 'react';
import { Sliders, Sparkles, HelpCircle } from 'lucide-react';
import { DenoiseSettings } from '../types';

interface DenoisePanelProps {
  settings: DenoiseSettings;
  onChange: (settings: DenoiseSettings) => void;
}

export default function DenoisePanel({ settings, onChange }: DenoisePanelProps) {
  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      intensity: parseInt(e.target.value, 10),
    });
  };

  const togglePreserveReverb = () => {
    onChange({
      ...settings,
      preserveReverb: !settings.preserveReverb,
    });
  };

  const toggleVoiceRecovery = () => {
    onChange({
      ...settings,
      voiceRecovery: !settings.voiceRecovery,
    });
  };

  return (
    <div id="denoise-panel-card" className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 shadow-lg">
      {/* Module Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-primary">
          <Sliders className="w-5 h-5" />
          <span className="font-sans font-semibold text-[14px] tracking-wider">智能降噪深度控制</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00f2ff]" />
      </div>

      <div className="space-y-6">
        {/* Slider: AI Denoise Intensity */}
        <div className="space-y-3">
          <div className="flex justify-between text-[11px] font-mono text-on-surface-variant/80">
            <span className="flex items-center gap-1">
              AI 降噪强度 (DENOISE INTENSITY)
              <HelpCircle className="w-3.5 h-3.5 text-on-surface-variant/30 hover:text-primary cursor-help" title="Higher values reduce background noise more aggressively, but might filter out vocal harmonics." />
            </span>
            <span className="text-primary font-bold font-mono">{settings.intensity}%</span>
          </div>
          <div className="relative flex items-center">
            <input
              id="intensity-slider"
              type="range"
              min="0"
              max="100"
              value={settings.intensity}
              onChange={handleIntensityChange}
              className="w-full h-1.5 bg-[#060e20] rounded-full appearance-none cursor-pointer accent-primary focus:outline-none"
              style={{
                background: `linear-gradient(to right, #00f2ff ${settings.intensity}%, #060e20 ${settings.intensity}%)`,
              }}
            />
          </div>
        </div>

        {/* Toggle Option 1: Preserve Reverb */}
        <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
          <div className="space-y-0.5 pr-4">
            <span className="text-[13px] text-on-surface font-medium block">保留自然混响 (Preserve Reverb)</span>
            <span className="text-[11px] text-on-surface-variant/50 block">防止音频处理过度导致的空间感丧失，创造温暖自然的听感</span>
          </div>
          <button
            id="toggle-reverb-btn"
            type="button"
            onClick={togglePreserveReverb}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative flex items-center ${
              settings.preserveReverb ? 'bg-primary/20 border border-primary/40' : 'bg-surface-variant/40 border border-outline-variant/30'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform duration-200 shadow-md ${
                settings.preserveReverb 
                  ? 'bg-primary translate-x-5 shadow-[0_0_8px_#00f2ff]' 
                  : 'bg-on-surface-variant/50 translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Toggle Option 2: Voice Recovery */}
        <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
          <div className="space-y-0.5 pr-4">
            <span className="text-[13px] text-on-surface font-medium block">人声特征补偿 (Voice Recovery)</span>
            <span className="text-[11px] text-on-surface-variant/50 block">智能修复因背景噪声过大而损失的高频谐波细节与人声高频亮感</span>
          </div>
          <button
            id="toggle-recovery-btn"
            type="button"
            onClick={toggleVoiceRecovery}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative flex items-center ${
              settings.voiceRecovery ? 'bg-primary/20 border border-primary/40' : 'bg-surface-variant/40 border border-outline-variant/30'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform duration-200 shadow-md ${
                settings.voiceRecovery 
                  ? 'bg-primary translate-x-5 shadow-[0_0_8px_#00f2ff]' 
                  : 'bg-on-surface-variant/50 translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
