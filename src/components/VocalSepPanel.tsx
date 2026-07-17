import React from 'react';
import { Sliders, Check, UserCircle2, Disc, RefreshCw } from 'lucide-react';
import { VocalSepSettings } from '../types';

interface VocalSepPanelProps {
  settings: VocalSepSettings;
  onChange: (settings: VocalSepSettings) => void;
}

export default function VocalSepPanel({ settings, onChange }: VocalSepPanelProps) {
  const handleSensitivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...settings,
      sensitivity: parseInt(e.target.value, 10),
    });
  };

  const handleFocusChange = (focus: 'main' | 'secondary' | 'backing') => {
    onChange({
      ...settings,
      focusVoice: focus,
    });
  };

  const toggleEnhancement = () => {
    onChange({
      ...settings,
      targetEnhancement: !settings.targetEnhancement,
    });
  };

  const options = [
    { id: 'main' as const, name: '提取人声 (Vocal Focus)', desc: '隔离并强化主唱/独白音轨', icon: UserCircle2 },
    { id: 'secondary' as const, name: '提取伴奏 (Accompaniment)', desc: '剔除人声，高保真还原背景伴奏', icon: Disc },
    { id: 'backing' as const, name: '原始混合 (Original Balance)', desc: '旁路旁通，恢复原始信号混合比', icon: RefreshCw },
  ];

  return (
    <div id="vocal-sep-panel" className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 shadow-lg">
      {/* Module Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-primary">
          <Sliders className="w-5 h-5" />
          <span className="font-sans font-semibold text-[14px] tracking-wider">重叠人声分离控制</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#ddb7ff]" />
      </div>

      <div className="space-y-6">
        {/* Slider: Separation Sensitivity */}
        <div className="space-y-3">
          <div className="flex justify-between text-[11px] font-mono text-on-surface-variant/80">
            <span>分离敏感度 (SEPARATION SENSITIVITY)</span>
            <span className="text-secondary font-bold font-mono">{settings.sensitivity}%</span>
          </div>
          <div className="relative flex items-center">
            <input
              id="sensitivity-slider"
              type="range"
              min="0"
              max="100"
              value={settings.sensitivity}
              onChange={handleSensitivityChange}
              className="w-full h-1.5 bg-[#060e20] rounded-full appearance-none cursor-pointer accent-secondary focus:outline-none"
              style={{
                background: `linear-gradient(to right, #ddb7ff ${settings.sensitivity}%, #060e20 ${settings.sensitivity}%)`,
              }}
            />
          </div>
        </div>

        {/* Separator Focus Modes */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-mono text-on-surface-variant/50 uppercase block tracking-wider">分离目标模式 (Separation Target)</span>
          <div className="space-y-2">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = settings.focusVoice === opt.id;
              return (
                <button
                  id={`focus-btn-${opt.id}`}
                  key={opt.id}
                  type="button"
                  onClick={() => handleFocusChange(opt.id)}
                  className={`w-full text-left p-3 rounded-lg border flex items-start gap-3 transition-all duration-300 ${
                    isSelected
                      ? 'bg-secondary/10 border-secondary text-on-surface shadow-[0_0_15px_rgba(221,183,255,0.1)]'
                      : 'bg-[#0b1326]/40 border-outline-variant/20 text-on-surface-variant/70 hover:bg-surface-variant/10 hover:text-on-surface'
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${isSelected ? 'bg-secondary/20 text-secondary' : 'bg-surface-container text-on-surface-variant/50'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="text-[12.5px] font-semibold block">{opt.name}</span>
                    <span className="text-[10px] opacity-60 block mt-0.5">{opt.desc}</span>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vocal Feature Boost */}
        <div className="flex items-center justify-between py-3 border-t border-outline-variant/10">
          <div className="space-y-0.5 pr-4">
            <span className="text-[13px] text-on-surface font-medium block">人声特征分离增强 (Target Enhancement)</span>
            <span className="text-[11px] text-on-surface-variant/50 block">针对主唱音域进行频谱重排，滤除微小串音，获得水晶般剔透的人声</span>
          </div>
          <button
            id="toggle-enhance-btn"
            type="button"
            onClick={toggleEnhancement}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative flex items-center ${
              settings.targetEnhancement ? 'bg-secondary/20 border border-secondary/40' : 'bg-surface-variant/40 border border-outline-variant/30'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform duration-200 shadow-md ${
                settings.targetEnhancement 
                  ? 'bg-secondary translate-x-5 shadow-[0_0_8px_#ddb7ff]' 
                  : 'bg-on-surface-variant/50 translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
