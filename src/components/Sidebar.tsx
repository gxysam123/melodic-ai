import React from 'react';
import { 
  Waves, 
  Users, 
  Layers, 
  UserCircle, 
  Settings 
} from 'lucide-react';
import { TabId } from '../types';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    {
      id: 'denoise' as TabId,
      name: '智能降噪',
      icon: Waves,
      desc: 'Smart Denoise',
    },
    {
      id: 'vocal-sep' as TabId,
      name: '重叠人声分离',
      icon: Users,
      desc: 'Vocal Separator',
    },
    {
      id: 'track-sep' as TabId,
      name: '多音轨分离',
      icon: Layers,
      desc: 'Multi-track Splitter',
    },
  ];

  return (
    <aside id="sidebar-panel" className="w-64 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col z-50">
      {/* Brand Logo & Info */}
      <div className="p-6 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-primary font-sans text-[20px] font-extrabold tracking-tight">妙音AI</span>
          <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold border border-primary/20 tracking-wider">CYBER</span>
        </div>
        <p className="text-[10px] text-on-surface-variant/40 mt-1.5 uppercase tracking-widest font-mono">核心功能区</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav-btn-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group hover-glow relative ${
                isActive
                  ? 'sidebar-active text-primary font-medium'
                  : 'text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-variant/10'
              }`}
            >
              <Icon 
                id={`nav-icon-${item.id}`}
                className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? 'text-primary' : 'group-hover:scale-110'
                }`} 
              />
              <span className="font-sans text-[14px] text-left">{item.name}</span>
              {isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00f2ff]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Information Profile Box */}
      <div className="p-4 mt-auto border-t border-outline-variant/10">
        <div className="flex items-center gap-3 p-2.5 bg-surface-container/30 rounded-xl border border-outline-variant/5">
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/15">
            <UserCircle className="w-5 h-5 text-on-surface-variant/75" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[12px] font-sans text-on-surface font-semibold truncate">访客用户</p>
            <p className="text-[10px] text-on-surface-variant/40 font-mono">ID: 8829-01</p>
          </div>
          <button 
            id="settings-btn"
            className="p-1 rounded hover:bg-surface-variant/30 text-on-surface-variant/50 hover:text-primary transition-colors duration-200"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
