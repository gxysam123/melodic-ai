import React from 'react';
import { Sliders, Music, Volume2, VolumeX } from 'lucide-react';
import { TrackSepSettings } from '../types';

interface TrackSepPanelProps {
  settings: TrackSepSettings;
  onChange: (settings: TrackSepSettings) => void;
}

export default function TrackSepPanel({ settings, onChange }: TrackSepPanelProps) {
  const handleFaderChange = (key: keyof TrackSepSettings, value: number) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const tracks = [
    { key: 'vocals' as const, name: '人声 (Vocals)', color: 'from-primary to-cyan-500', glow: 'shadow-[0_0_10px_#00f2ff]' },
    { key: 'drums' as const, name: '鼓组 (Drums)', color: 'from-purple-500 to-secondary', glow: 'shadow-[0_0_10px_#ddb7ff]' },
    { key: 'bass' as const, name: '贝斯 (Bass)', color: 'from-blue-500 to-indigo-500', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' },
    { key: 'piano' as const, name: '钢琴 (Piano)', color: 'from-emerald-500 to-teal-500', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
    { key: 'others' as const, name: '环境/其他 (Others)', color: 'from-amber-500 to-orange-500', glow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
  ];

  return (
    <div id="track-sep-panel" className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 shadow-lg">
      {/* Module Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-primary">
          <Sliders className="w-5 h-5" />
          <span className="font-sans font-semibold text-[14px] tracking-wider">多音轨立体声混音台</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      </div>

      {/* Cyber Mixer Faders Container */}
      <div className="space-y-5">
        {tracks.map((track) => {
          const val = settings[track.key];
          return (
            <div id={`mixer-strip-${track.key}`} key={track.key} className="space-y-2 bg-[#050b17]/40 p-3.5 rounded-lg border border-outline-variant/5">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-on-surface font-medium flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 opacity-60 text-on-surface-variant" />
                  {track.name}
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  {val === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-on-surface-variant/40" />
                  )}
                  <span className={val === 0 ? 'text-red-400 font-bold' : 'text-primary font-bold'}>{val}%</span>
                </div>
              </div>

              {/* Slider Track */}
              <div className="flex items-center gap-3">
                <button
                  id={`mute-btn-${track.key}`}
                  type="button"
                  onClick={() => handleFaderChange(track.key, val > 0 ? 0 : 100)}
                  className={`text-[10px] font-bold px-2 py-1 rounded border tracking-wider transition-all uppercase ${
                    val === 0 
                      ? 'bg-red-500/15 border-red-500/30 text-red-400' 
                      : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/10'
                  }`}
                >
                  {val === 0 ? 'MUTED' : 'MUTE'}
                </button>
                <div className="flex-1 relative flex items-center">
                  <input
                    id={`fader-${track.key}`}
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => handleFaderChange(track.key, parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-[#060e20] rounded-full appearance-none cursor-pointer focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, ${val === 0 ? '#ef4444' : '#00f2ff'} ${val}%, #060e20 ${val}%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
