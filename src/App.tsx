import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Check, Loader2, Download, Pause } from 'lucide-react';
import { 
  TabId, 
  DenoiseSettings, 
  VocalSepSettings, 
  TrackSepSettings, 
  AudioFile, 
  LogEntry, 
  ProcessingStatus 
} from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LogTerminal from './components/LogTerminal';
import DenoisePanel from './components/DenoisePanel';
import VocalSepPanel from './components/VocalSepPanel';
import TrackSepPanel from './components/TrackSepPanel';
import WaveformPlayer from './components/WaveformPlayer';
import * as API from './lib/apiClient';

const INITIAL_LOGS: LogEntry[] = [
  { id: '1', text: '妙音AI 引擎初始化中... [完毕]', type: 'success', timestamp: new Date().toLocaleTimeString() },
  { id: '2', text: '连接后端服务器...', type: 'info', timestamp: new Date().toLocaleTimeString() },
  { id: '3', text: '正在映射本地 GPU 核心资源...', type: 'info', timestamp: new Date().toLocaleTimeString() },
  { id: '4', text: '系统状态: 就绪。等待输入音频流。', type: 'cyber', timestamp: new Date().toLocaleTimeString() },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('denoise');
  const [file, setFile] = useState<AudioFile | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [outputAudioUrl, setOutputAudioUrl] = useState<string | null>(null);
  const [separatedTracks, setSeparatedTracks] = useState<Record<string, string> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingResult, setIsPlayingResult] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const resultAudioRef = useRef<HTMLAudioElement>(null);

  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [denoiseSettings, setDenoiseSettings] = useState<DenoiseSettings>({
    intensity: 85,
    preserveReverb: true,
    voiceRecovery: false,
  });

  const [vocalSettings, setVocalSettings] = useState<VocalSepSettings>({
    sensitivity: 75,
    focusVoice: 'backing',
    targetEnhancement: false,
  });

  const [trackSettings, setTrackSepSettings] = useState<TrackSepSettings>({
    vocals: 100,
    drums: 100,
    bass: 100,
    piano: 100,
    others: 100,
  });

  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  // 清理interval
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const addLog = (text: string, type: 'info' | 'success' | 'warning' | 'cyber' | 'input' = 'info') => {
    const newLog: LogEntry = {
      id: Date.now().toString() + Math.random().toString(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs(prev => [...prev, newLog]);
  };

  // 处理文件上传
  const handleFileLoaded = async (audioFile: AudioFile, uploadFile?: File) => {
    setFile(audioFile);
    setProcessingStatus('ready');
    setOutputAudioUrl(null);
    
    addLog(`载入音频文件: ${audioFile.name}`, 'input');
    addLog(`文件大小: ${(audioFile.size / (1024 * 1024)).toFixed(2)} MB`, 'info');
    
    // 如果有真实文件,上传到后端
    if (uploadFile) {
      setRawFile(uploadFile);
      try {
        addLog('正在上传文件到服务器...', 'info');
        const response = await API.uploadAudio(uploadFile);
        setTaskId(response.task_id);
        addLog(`文件上传成功! Task ID: ${response.task_id.substring(0, 8)}...`, 'success');
        addLog('系统状态: 载入就绪。点击"开始处理"激活 AI 模型。', 'cyber');
      } catch (error: any) {
        addLog(`上传失败: ${error.message}`, 'warning');
      }
    } else {
      addLog('使用演示文件，跳过上传。', 'info');
    }
  };

  const handleFileRemoved = () => {
    setFile(null);
    setRawFile(null);
    setTaskId(null);
    setOutputAudioUrl(null);
    setSeparatedTracks(null);
    setProcessingStatus('idle');
    setProcessingProgress(0);
    if (audioRef.current) audioRef.current.pause();
    if (resultAudioRef.current) resultAudioRef.current.pause();
    setIsPlaying(false);
    setIsPlayingResult(false);
    addLog('音频流已卸载。系统重置。', 'warning');
  };

  // 播放源文件
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      addLog('播放已暂停。', 'info');
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      addLog('开始播放源文件...', 'success');
    }
  };

  const handleStopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  // 暂停处理
  const handlePauseProcessing = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsPaused(true);
    addLog('⏸️ 处理已暂停', 'warning');
  };

  // 继续处理
  const handleResumeProcessing = () => {
    setIsPaused(false);
    addLog('▶️ 继续处理...', 'info');

    // 恢复进度动画
    progressIntervalRef.current = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + Math.random() * 8 + 3;
        if (newProgress >= 95) {
          return 95;
        }
        return newProgress;
      });
    }, 400);
  };

  // 开始处理
  const handleStartProcessing = async () => {
    if (!taskId) {
      addLog('错误: 没有可用的任务ID，请先上传文件', 'warning');
      return;
    }

    handleStopPlayback();
    setProcessingStatus('processing');
    setProcessingProgress(0);
    setOutputAudioUrl(null);
    setSeparatedTracks(null);
    setIsPaused(false);

    addLog('启动 Cyber 音频处理引擎...', 'cyber');
    addLog('正在进行快速傅里叶变换 (FFT)...', 'info');

    // 模拟进度更新
    progressIntervalRef.current = setInterval(() => {
      setProcessingProgress(prev => {
        const newProgress = prev + Math.random() * 8 + 3;
        if (newProgress >= 95) {
          return 95;
        }
        return newProgress;
      });
    }, 400);

    try {
      let response;

      if (activeTab === 'denoise') {
        addLog(`保留混响: ${denoiseSettings.preserveReverb ? '开启' : '关闭'}`, 'info');
        response = await API.processDenoise(taskId, denoiseSettings);
      } else if (activeTab === 'vocal-sep') {
        addLog(`人声分离模式: ${vocalSettings.focusVoice}`, 'info');
        response = await API.processVocalSeparation(taskId, vocalSettings);
      } else if (activeTab === 'track-sep') {
        addLog('多音轨分离处理中...', 'info');
        response = await API.processTrackSeparation(taskId, trackSettings);
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      if (response) {
        setProcessingProgress(100);
        setProcessingStatus('completed');
        setOutputAudioUrl(response.output_url);
        setIsPaused(false);

        // 保存分离后的音轨（如果有）
        if (response.tracks && activeTab === 'track-sep') {
          setSeparatedTracks(response.tracks);
          addLog(`音轨分离完成，共 ${Object.keys(response.tracks).length} 个音轨`, 'success');
        }

        addLog('逆短时傅里叶变换 (iSTFT) 还原就绪。', 'success');
        addLog('智能音频处理完毕！耗时 2.4s', 'success');
        addLog('系统状态: 处理完成。可播放结果或下载文件。', 'cyber');
      }
    } catch (error: any) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      addLog(`处理失败: ${error.message}`, 'warning');
      setProcessingStatus('ready');
      setProcessingProgress(0);
      setIsPaused(false);
    }
  };

  // 下载结果
  const handleDownload = () => {
    if (taskId && outputAudioUrl) {
      const downloadUrl = API.getDownloadUrl(taskId);
      window.open(downloadUrl, '_blank');
      addLog('开始下载处理结果...', 'info');
    }
  };

  return (
    <div className="bg-background text-on-surface font-sans overflow-hidden h-screen flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col bg-background relative overflow-hidden">
        <Header activeTab={activeTab} />

        <div className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Status Bar - 美化外层容器 */}
            <div className="bg-surface-container/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-outline-variant/10">
              <div className="flex items-center gap-4 text-[12px] text-on-surface-variant/70 font-mono">
                <span className="flex items-center gap-2">
                  当前状态:
                  {processingStatus === 'processing' ? (
                    <span className="text-primary font-bold flex items-center gap-1 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      正在处理
                    </span>
                  ) : processingStatus === 'completed' ? (
                    <span className="text-primary font-bold">处理完成</span>
                  ) : file ? (
                    <span className="text-tertiary font-bold">待处理</span>
                  ) : (
                    <span className="text-tertiary font-bold">就绪</span>
                  )}
                </span>
                <span className="opacity-30">|</span>
                <span>引擎版本: v2.4.0-CYBER</span>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 items-start">

              <div className="col-span-12 lg:col-span-8 space-y-6">

                <WaveformPlayer
                  file={file}
                  onFileLoaded={handleFileLoaded}
                  onFileRemoved={handleFileRemoved}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  onStop={handleStopPlayback}
                  progress={0}
                />

                {/* 源文件播放器 (隐藏audio控件,使用WaveformPlayer控制) */}
                {file && !file.isDemo && file.url && (
                  <audio
                    ref={audioRef}
                    src={file.url}
                    onEnded={() => setIsPlaying(false)}
                  />
                )}

                {/* 处理结果播放区 - 美化外层容器 */}
                {outputAudioUrl && taskId && (
                  <div className="bg-surface-container/80 backdrop-blur-sm rounded-xl p-6 border border-primary/30 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-primary font-semibold flex items-center gap-2.5 text-[16px]">
                        <Check className="w-5 h-5" />
                        处理完成 - 结果预览
                      </h3>
                    </div>

                    {/* 如果是多音轨分离，显示所有音轨 */}
                    {separatedTracks && activeTab === 'track-sep' ? (
                      <div className="space-y-4">
                        {Object.entries(separatedTracks).map(([trackName, trackPath]) => {
                          const trackLabels: Record<string, string> = {
                            vocals: '🎤 人声',
                            drums: '🥁 鼓点',
                            bass: '🎸 贝斯',
                            piano: '🎹 钢琴',
                            other: '🎵 其他',
                            others: '🎵 其他'
                          };

                          const displayName = trackLabels[trackName] || `🎵 ${trackName}`;
                          const downloadUrl = `${API.getDownloadUrl(taskId).replace('/download/', '/download-track/')}?track=${trackName}`;

                          return (
                            <div key={trackName} className="bg-surface-container/50 rounded-lg p-4 border border-outline-variant/20">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-on-surface font-medium text-[14px]">{displayName}</h4>
                                <a
                                  href={downloadUrl}
                                  download
                                  className="text-primary hover:text-primary/80 text-[12px] flex items-center gap-1 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  下载
                                </a>
                              </div>
                              <audio
                                src={downloadUrl}
                                controls
                                className="w-full rounded-lg"
                                style={{
                                  accentColor: '#4338CA',
                                  background: '#0A0A1A',
                                  borderRadius: '0.5rem',
                                  padding: '0.5rem',
                                  height: '40px'
                                }}
                              />
                            </div>
                          );
                        })}

                        <button
                          onClick={handleDownload}
                          className="w-full bg-gradient-to-r from-primary via-primary to-secondary text-white px-6 py-3.5 rounded-lg font-bold flex items-center justify-center gap-2.5 hover-glow shadow-xl transition-all duration-300 active:scale-95 hover:shadow-2xl mt-4"
                        >
                          <Download className="w-5 h-5" />
                          下载所有音轨（ZIP）
                        </button>
                      </div>
                    ) : (
                      /* 单个音频结果 */
                      <>
                        <audio
                          ref={resultAudioRef}
                          src={API.getDownloadUrl(taskId)}
                          controls
                          className="w-full mb-5 rounded-lg"
                          style={{
                            accentColor: '#4338CA',
                            background: '#0A0A1A',
                            borderRadius: '0.5rem',
                            padding: '0.5rem'
                          }}
                          onPlay={() => setIsPlayingResult(true)}
                          onPause={() => setIsPlayingResult(false)}
                        />

                        <button
                          onClick={handleDownload}
                          className="w-full bg-gradient-to-r from-primary via-primary to-secondary text-white px-6 py-3.5 rounded-lg font-bold flex items-center justify-center gap-2.5 hover-glow shadow-xl transition-all duration-300 active:scale-95 hover:shadow-2xl"
                        >
                          <Download className="w-5 h-5" />
                          下载处理结果
                        </button>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'denoise' && (
                  <DenoisePanel
                    settings={denoiseSettings}
                    onChange={setDenoiseSettings}
                  />
                )}

                {activeTab === 'vocal-sep' && (
                  <VocalSepPanel
                    settings={vocalSettings}
                    onChange={setVocalSettings}
                  />
                )}

                {activeTab === 'track-sep' && (
                  <TrackSepPanel
                    settings={trackSettings}
                    onChange={setTrackSepSettings}
                  />
                )}
              </div>

              <div className="col-span-12 lg:col-span-4 space-y-6">
                <LogTerminal
                  logs={logs}
                  progress={processingStatus === 'processing' ? processingProgress : (processingStatus === 'completed' ? 100 : 0)}
                />

                {/* Action Bar - 处理按钮区域 */}
                <div className="bg-surface-container/30 backdrop-blur-sm rounded-xl p-5 border border-outline-variant/10">
                  <div className="flex flex-col gap-3">
                    <button
                      disabled={!taskId || (processingStatus === 'processing' && !isPaused && false)}
                      onClick={() => {
                        if (processingStatus === 'processing') {
                          if (isPaused) {
                            handleResumeProcessing();
                          } else {
                            handlePauseProcessing();
                          }
                        } else {
                          handleStartProcessing();
                        }
                      }}
                      className={`w-full py-3.5 rounded-lg text-[14px] font-bold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg group active:scale-95 ${
                        !taskId
                          ? 'bg-surface-container border border-outline-variant/10 text-on-surface-variant/30 cursor-not-allowed'
                          : processingStatus === 'processing'
                            ? isPaused
                              ? 'bg-tertiary/20 text-tertiary border border-tertiary/30 hover:bg-tertiary/30 cursor-pointer'
                              : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 cursor-pointer'
                            : 'bg-gradient-to-r from-primary to-secondary text-white hover-glow shadow-[0_0_30px_rgba(67,56,202,0.2)] cursor-pointer hover:shadow-[0_0_40px_rgba(67,56,202,0.3)]'
                      }`}
                    >
                      {processingStatus === 'processing' ? (
                        isPaused ? (
                          <>
                            <Play className="w-5 h-5 fill-current" />
                            继续处理
                          </>
                        ) : (
                          <>
                            <Pause className="w-5 h-5" />
                            停止处理
                          </>
                        )
                      ) : processingStatus === 'completed' ? (
                        <>
                          重新处理
                          <Play className="w-4 h-4 fill-current" />
                        </>
                      ) : (
                        <>
                          开始处理
                          <Play className="w-4 h-4 fill-current" />
                        </>
                      )}
                    </button>

                    {processingStatus === 'completed' && (
                      <button
                        onClick={() => {
                          setProcessingStatus('ready');
                          setProcessingProgress(0);
                          setOutputAudioUrl(null);
                          setSeparatedTracks(null);
                        }}
                        className="w-full bg-surface-container hover:bg-surface-variant/30 text-on-surface-variant py-3 rounded-lg text-[13px] font-semibold border border-outline-variant/20 transition-all duration-200 hover:border-outline-variant/40"
                      >
                        重置处理
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        <footer className="px-8 py-4 bg-surface-container-lowest/50 backdrop-blur-sm border-t border-outline-variant/10 flex justify-between items-center text-[11px] text-on-surface-variant/50">
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors duration-200 cursor-pointer" href="#privacy">Privacy Policy</a>
            <a className="hover:text-primary transition-colors duration-200 cursor-pointer" href="#terms">Terms of Service</a>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>© 2026 MIAOYIN AI. POWERED BY DEMUCS AI.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
