import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileAudio,
  Play,
  Pause,
  Square,
  Trash2,
  PlusCircle
} from 'lucide-react';
import { AudioFile } from '../types';

interface WaveformPlayerProps {
  file: AudioFile | null;
  onFileLoaded: (file: AudioFile, rawFile?: File) => void;
  onFileRemoved: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  progress: number;
}

export default function WaveformPlayer({
  file,
  onFileLoaded,
  onFileRemoved,
  isPlaying,
  onPlayPause,
  onStop,
  progress,
}: WaveformPlayerProps) {
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Generate random stable waveform bars
  const [bars] = useState(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      // Simulating a nice stereo-symmetric music envelope shape
      const centerFactor = 1 - Math.abs(i - 30) / 30; // 0 to 1
      const height = 15 + Math.random() * 45 * Math.sin(centerFactor * Math.PI);
      arr.push(height);
    }
    return arr;
  });

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (rawFile: File) => {
    if (!rawFile.type.startsWith('audio/') && !rawFile.type.startsWith('video/')) {
      alert('请上传有效的音频或视频文件 (MP3, WAV, FLAC, MP4 等)');
      return;
    }

    const fileUrl = URL.createObjectURL(rawFile);
    
    // Create a temporary audio element to read duration
    const tempAudio = new Audio();
    tempAudio.src = fileUrl;
    tempAudio.onloadedmetadata = () => {
      onFileLoaded({
        name: rawFile.name,
        size: rawFile.size,
        duration: tempAudio.duration || 8.0,
        url: fileUrl,
      }, rawFile);
    };
  };

  const loadDemoTrack = () => {
    // Cyber synth loop metadata
    onFileLoaded({
      name: 'cyber_ambient_synth_110bpm_loop.wav',
      size: 2514300, // 2.4 MB
      duration: 8.0,
      url: '#demo',
      isDemo: true,
    });
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlValue.trim()) return;

    if (!urlValue.startsWith('http://') && !urlValue.startsWith('https://')) {
      setUrlError('请输入有效的 URL 地址 (以 http:// 或 https:// 开头)');
      return;
    }

    // Load URL as a mock stream
    onFileLoaded({
      name: urlValue.split('/').pop() || 'network_audio_stream.mp3',
      size: 4120000,
      duration: 120.0,
      url: urlValue,
    });
    setShowUrlInput(false);
    setUrlValue('');
    setUrlError('');
  };

  // Canvas waveform animation when playing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localFrame = 0;

    const render = () => {
      localFrame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 6;
      const gap = 3;
      const startX = (canvas.width - (bars.length * (barWidth + gap) - gap)) / 2;

      for (let i = 0; i < bars.length; i++) {
        const x = startX + i * (barWidth + gap);
        
        // Bouncing factor if playing
        let animHeight = bars[i];
        if (isPlaying) {
          // Bounces to a moving sinewave phase to look like real spectrum activity
          const bounce = Math.sin((localFrame * 0.15) + i * 0.4) * 8;
          animHeight = Math.max(8, bars[i] + bounce);
        }

        // Draw active (completed) vs inactive (pending) bars based on progress
        const barProgressPercent = (i / bars.length) * 100;
        const isActive = barProgressPercent <= progress;

        ctx.beginPath();
        // Top half
        const yTop = canvas.height / 2 - animHeight / 2;
        ctx.roundRect(x, yTop, barWidth, animHeight, 3);
        
        if (isActive) {
          // Glow style for active audio signal
          ctx.fillStyle = '#4338CA';
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(67, 56, 202, 0.7)';
        } else {
          ctx.fillStyle = '#1E1E3D';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, progress, bars]);

  // Format File Size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format Time Duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      id="waveform-player-card"
      className={`relative rounded-xl transition-all duration-300 ${
        file
          ? 'bg-surface-container/80 backdrop-blur-sm p-6 border border-primary/30 shadow-xl'
          : 'bg-surface-container/80 backdrop-blur-sm min-h-[400px] p-8 border border-primary/20 flex flex-col items-center justify-center overflow-hidden'
      }`}
    >
      {/* Absolute Gradient glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none rounded-xl" />

      {!file ? (
        // STATE 1: IDLE UPLOAD WINDOW
        <div 
          id="dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
            isDragging
              ? 'border-primary bg-primary/15 shadow-[0_0_30px_rgba(67,56,202,0.2)] scale-[0.99]'
              : 'border-outline-variant/30 hover:border-primary/50 bg-transparent'
          }`}
        >
          {/* Cloud Upload Icon pulsing */}
          <button
            id="cloud-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-2xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center mb-6 animate-pulse-soft shadow-[0_0_30px_rgba(67,56,202,0.15)] hover:scale-105 transition-transform cursor-pointer"
          >
            <UploadCloud className="w-12 h-12 text-primary" />
          </button>

          <h3 className="font-sans font-bold text-[18px] text-on-surface mb-2.5">拖拽音频文件至此开始处理</h3>
          <p className="text-[13px] text-on-surface-variant/70 font-sans mb-8 max-w-md leading-relaxed">
            支持主流格式 (MP3, WAV, FLAC, MP4 等)。<br />您的文件将在本地通过高性能 Web Audio API 进行安全高精分析。
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              id="upload-local-btn"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-3.5 rounded-lg text-[14px] font-bold flex items-center gap-2.5 transition-all hover-glow shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              选择音频文件
            </button>
          </div>
        </div>
      ) : (
        // STATE 2: WAVEFORM PLAYER ACTIVE
        <div id="player-view" className="space-y-5">
          {/* Top Metadata Header */}
          <div className="flex items-center justify-between p-4 bg-surface-container-low/60 backdrop-blur-sm rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-lg bg-primary/15 text-primary border border-primary/30">
                <FileAudio className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[14px] font-sans text-on-surface font-semibold max-w-[280px] sm:max-w-md truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-on-surface-variant/60 font-mono">
                  <span>大小: {formatSize(file.size)}</span>
                  <span>|</span>
                  <span>时长: {formatDuration(file.duration)}</span>
                  {file.isDemo && (
                    <>
                      <span>|</span>
                      <span className="text-tertiary font-bold">CYBER DEMO</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Remove / Change button */}
            <button
              id="remove-file-btn"
              onClick={onFileRemoved}
              className="p-2.5 rounded-lg bg-error/10 hover:bg-error/20 text-error border border-error/20 transition-all cursor-pointer hover:scale-105"
              title="移除文件"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Glow Waveform Display Canvas */}
          <div className="bg-surface-container-lowest h-36 rounded-xl relative flex items-center justify-center border border-outline-variant/10 shadow-inner overflow-hidden">
            <canvas
              ref={canvasRef}
              width={640}
              height={120}
              className="w-full h-full max-w-full pointer-events-none"
            />
            {/* Timeline Progress Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-primary/90 shadow-[0_0_10px_rgba(67,56,202,0.6)] pointer-events-none"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* Timeline Bottom Legend */}
          <div className="flex justify-between items-center text-[11px] text-on-surface-variant/50 font-mono px-2">
            <span>00:00</span>
            <span className="text-[11px] text-primary/70 font-semibold tracking-widest animate-pulse">
              {isPlaying ? 'AUDIO_PIPELINE_ACTIVE' : 'READY_TO_STREAM'}
            </span>
            <span>{formatDuration(file.duration)}</span>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center justify-center gap-4 pt-3">
            <button
              id="player-stop-btn"
              onClick={onStop}
              className="p-4 rounded-full bg-surface-container-high border border-outline-variant/30 hover:border-error/40 text-on-surface-variant hover:text-error transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Stop"
            >
              <Square className="w-4.5 h-4.5 fill-current stroke-[2]" />
            </button>
            <button
              id="player-play-btn"
              onClick={onPlayPause}
              className={`p-5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl flex items-center justify-center cursor-pointer ${
                isPlaying
                  ? 'bg-secondary text-white shadow-[0_0_20px_rgba(49,46,129,0.4)] hover:brightness-110'
                  : 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(67,56,202,0.4)] hover:brightness-110'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
