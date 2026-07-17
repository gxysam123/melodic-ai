import React from 'react';
import { Cpu, Zap } from 'lucide-react';
import { TabId } from '../types';

interface HeaderProps {
  activeTab: TabId;
}

export default function Header({ activeTab }: HeaderProps) {
  const getTabTitle = (id: TabId) => {
    switch (id) {
      case 'denoise':
        return '智能降噪';
      case 'vocal-sep':
        return '重叠人声分离';
      case 'track-sep':
        return '多音轨分离';
      default:
        return '智能降噪';
    }
  };

  return (
    <header id="top-header" className="h-16 flex items-center justify-between px-8 border-b border-outline-variant/10 bg-surface-container-lowest/50 backdrop-blur-sm sticky top-0 z-40">
      {/* Page Title / Location breadcrumbs */}
      <div className="flex items-center gap-2">
        <span className="text-on-surface-variant/70 font-sans text-[14px]">音频处理中心</span>
        <span className="text-on-surface-variant/30 text-[14px] mx-1">/</span>
        <span className="text-primary font-sans text-[14px] font-semibold">{getTabTitle(activeTab)}</span>
      </div>

      {/* Cyber Hardware Status Indicators */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5 text-[11px] font-mono">
          <div className="flex items-center gap-2 bg-surface-container-high/40 px-3 py-1.5 rounded-md border border-outline-variant/5">
            <Zap className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-on-surface-variant/60">延迟时间:</span>
            <span className="text-primary font-bold">12ms (本地)</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-high/40 px-3 py-1.5 rounded-md border border-outline-variant/5">
            <Cpu className="w-3 h-3 text-secondary" />
            <span className="text-on-surface-variant/60">GPU 状态:</span>
            <span className="text-secondary font-bold flex items-center gap-1">活跃 (RTX 4090)</span>
          </div>
        </div>
      </div>
    </header>
  );
}
