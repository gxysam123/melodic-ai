// API 客户端 - 连接 React 前端和 Python 后端
// 文件位置: miaoyin-ai-audio-center/src/lib/apiClient.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface UploadResponse {
  task_id: string;
  filename: string;
  size: number;
  message: string;
}

export interface ProcessResponse {
  task_id: string;
  status: string;
  output_url?: string;
  tracks?: any[];
  message: string;
}

export interface TaskStatusResponse {
  task_id: string;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  progress: number;
  filename?: string;
  output_filename?: string;
  error?: string;
}

/**
 * 上传音频文件到后端
 */
export async function uploadAudio(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '上传失败');
  }

  return response.json();
}

/**
 * 智能降噪处理
 */
export async function processDenoise(
  taskId: string,
  settings: {
    intensity: number;
    preserveReverb: boolean;
    voiceRecovery: boolean;
  }
): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE_URL}/process/denoise`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task_id: taskId,
      settings,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '处理失败');
  }

  return response.json();
}

/**
 * 人声分离处理
 */
export async function processVocalSeparation(
  taskId: string,
  settings: {
    sensitivity: number;
    focusVoice: 'main' | 'secondary' | 'backing';
    targetEnhancement: boolean;
  }
): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE_URL}/process/vocal-separation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task_id: taskId,
      settings,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '处理失败');
  }

  return response.json();
}

/**
 * 多音轨分离处理
 */
export async function processTrackSeparation(
  taskId: string,
  settings: {
    vocals: number;
    drums: number;
    bass: number;
    piano: number;
    others: number;
  }
): Promise<ProcessResponse> {
  const response = await fetch(`${API_BASE_URL}/process/track-separation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      task_id: taskId,
      settings,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '处理失败');
  }

  return response.json();
}

/**
 * 获取任务状态
 */
export async function getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/task/${taskId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '获取状态失败');
  }

  return response.json();
}

/**
 * 下载处理后的文件
 */
export function getDownloadUrl(taskId: string): string {
  return `${API_BASE_URL}/download/${taskId}`;
}

/**
 * 取消处理任务
 */
export async function cancelProcessing(taskId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cancel/${taskId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '取消失败');
  }
}

/**
 * 清理任务文件
 */
export async function cleanupTask(taskId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/cleanup/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '清理失败');
  }
}

/**
 * 健康检查
 */
export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}
