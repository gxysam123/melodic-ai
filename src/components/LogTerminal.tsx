import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { LogEntry } from '../types';

interface LogTerminalProps {
  logs: LogEntry[];
  progress: number;
}

export default function LogTerminal({ logs, progress }: LogTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when logs are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div id="log-terminal" className="bg-surface-container-lowest border border-outline-variant/10 flex flex-col h-[460px] rounded-xl overflow-hidden shadow-2xl relative">
      {/* Terminal Title Bar */}
      <div className="p-4 bg-surface-container/40 border-b border-outline-variant/10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-on-surface-variant/50 font-mono text-[12px]">
          <Terminal className="w-4 h-4 text-primary/80" />
          <span className="font-bold text-on-surface/80">系统日志</span>
          <span className="text-[10px] opacity-40">SESSION_R2_2026</span>
        </div>
        
        {/* Window controls (Mock) */}
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 hover:bg-red-500/60 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 hover:bg-yellow-500/60 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 hover:bg-green-500/60 transition-colors" />
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={containerRef}
        className="flex-1 p-5 font-mono text-[11px] leading-relaxed space-y-3 overflow-y-auto custom-scrollbar bg-[#050b17]"
      >
        {logs.map((log) => {
          let colorClass = 'text-on-surface-variant/50';
          if (log.type === 'success') {
            colorClass = 'text-green-400/90 font-medium';
          } else if (log.type === 'cyber') {
            colorClass = 'text-primary/90 font-bold';
          } else if (log.type === 'warning') {
            colorClass = 'text-yellow-400/90';
          } else if (log.type === 'input') {
            colorClass = 'text-secondary-fixed-dim';
          }

          return (
            <p key={log.id} className={`${colorClass} transition-all duration-300`}>
              <span className="opacity-30 mr-1.5 font-bold">&gt;</span>
              {log.text}
            </p>
          );
        })}

        {/* Dynamic blinking status cursor */}
        <div className="flex items-center gap-1.5 text-on-surface-variant/40 mt-1 animate-pulse">
          <span className="opacity-30 font-bold">&gt;</span>
          <span>_ {progress > 0 && progress < 100 ? 'PROCESSING_SIGNAL_FRAME' : 'WAITING_FOR_PAYLOAD'}</span>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="p-4 border-t border-outline-variant/10 bg-surface-container/20">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider font-mono">Current Progress</span>
          <span className="text-[11px] text-primary font-bold font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-[#060e20] rounded-full overflow-hidden border border-outline-variant/5">
          <div 
            className="h-full bg-primary shadow-[0_0_12px_#00f2ff] transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
