import React from 'react';
import { Sliders } from 'lucide-react';
import { DenoiseSettings } from '../types';

interface DenoisePanelProps {
  settings: DenoiseSettings;
  onChange: (settings: DenoiseSettings) => void;
}

export default function DenoisePanel({ settings, onChange }: DenoisePanelProps) {
  const togglePreserveReverb = () => {
    onChange({
      ...settings,
      preserveReverb: !settings.preserveReverb,
    });
  };

  return (
    <div id="denoise-panel-card" className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 shadow-lg">
      {/* Module Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-primary">
          <Sliders className="w-5 h-5" />
          <span className="font-sans font-semibold text-[14px] tracking-wider">智能降噪控制</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00f2ff]" />
      </div>

      <div className="space-y-4">
        {/* 说明文本 */}
        <div className="text-[12px] text-on-surface-variant/70 bg-surface-container-lowest/30 rounded-lg p-4 border border-outline-variant/10">
          <p className="mb-2">智能降噪将使用 AI 模型自动去除音频中的背景噪声，保留清晰的主要音频内容。</p>
          <p className="text-[11px] text-on-surface-variant/50">适用于：录音杂音、环境噪声、电流声等干扰的清理。</p>
        </div>

        {/* Toggle Option: Preserve Reverb */}
        <div className="flex items-center justify-between py-4 border-t border-outline-variant/10">
          <div className="space-y-0.5 pr-4">
            <span className="text-[14px] text-on-surface font-medium block">保留自然混响</span>
            <span className="text-[12px] text-on-surface-variant/60 block">防止音频处理过度导致的空间感丧失，保持温暖自然的听感</span>
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
      </div>
    </div>
  );
}
