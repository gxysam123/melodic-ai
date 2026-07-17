# 妙音AI音频处理平台 - 工程提示词

## 🎯 项目概述

构建一个基于 Demucs 的智能音频处理平台，提供音频降噪、人声分离、多音轨分离功能。前端采用 React + TypeScript + Vite，后端使用 Python Flask，音频处理基于 Facebook Demucs 深度学习模型。

## 📋 核心功能需求

### 1. 音频降噪 (Denoise)
- 智能降噪强度调节（0-100%）
- 保留混响开关
- 人声恢复增强
- 实时处理进度显示

### 2. 人声分离 (Vocal Separation)
- 灵敏度调节（0-100%）
- 人声焦点选择：主唱/副唱/和声
- 目标增强选项
- 人声/伴奏分离预览

### 3. 多音轨分离 (Track Separation)
- 分离音轨：人声、鼓点、贝斯、钢琴、其他
- 每个音轨独立音量控制（0-100%）
- 单独播放每个音轨
- 单独下载或批量下载所有音轨

### 4. 文件管理
- 支持音频格式：MP3, WAV, FLAC, AAC, OGG
- 支持视频格式：MP4, AVI, MKV, MOV
- 拖拽上传或点击选择
- 文件大小限制：500MB
- 显示文件信息：大小、时长、格式

### 5. 播放器功能
- 波形可视化显示
- 播放/暂停/停止控制
- 进度条拖动
- 时间显示（当前/总时长）

## 🎨 UI/UX 设计要求

### 视觉风格：赛博朋克 (Cyberpunk)
- 主色调：深蓝紫渐变（#4338CA, #7C3AED, #EC4899）
- 背景：深色系（#0A0A1A, #1A1A2E）
- 强调色：霓虹蓝、霓虹紫、霓虹粉
- 字体：等宽字体用于代码风格文本

### 设计元素
- **玻璃态效果**：半透明背景 + backdrop-blur
- **发光效果**：按钮和边框使用 glow 效果
- **动画**：平滑过渡、脉冲效果、渐变动画
- **图标**：使用 Lucide React 图标库
- **波形**：使用自定义 Canvas 或 WaveSurfer.js

### 布局结构
```
┌─────────────────────────────────────────────────────┐
│  Header (logo, 标题)                                 │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Main Content Area                      │
│  - 降噪  │   - 波形播放器                           │
│  - 人声  │   - 参数面板                             │
│  - 音轨  │   - 处理结果预览                         │
│          │                                          │
│          ├──────────────────────────────────────────┤
│          │  Log Terminal (实时处理日志)              │
└──────────┴──────────────────────────────────────────┘
```

### 关键UI组件
1. **WaveformPlayer**: 音频波形可视化播放器
2. **DenoisePanel**: 降噪参数控制面板
3. **VocalSepPanel**: 人声分离参数面板
4. **TrackSepPanel**: 多音轨分离参数面板
5. **LogTerminal**: 赛博风格的日志终端
6. **Sidebar**: 功能切换侧边栏
7. **Header**: 顶部标题栏

## 🏗️ 技术架构

### 前端技术栈
```typescript
{
  "framework": "React 18",
  "language": "TypeScript",
  "build": "Vite",
  "styling": "TailwindCSS",
  "icons": "Lucide React",
  "http": "Fetch API"
}
```

### 后端技术栈
```python
{
  "framework": "Flask 3.0",
  "cors": "Flask-CORS",
  "audio": "Demucs 4.0.1",
  "processing": "PyTorch, torchaudio",
  "utilities": "python-dotenv, pathlib"
}
```

### 音频处理流程
```
用户上传文件 
  → 前端验证 (格式、大小)
  → 后端接收 (/api/upload)
  → 生成 task_id
  → 用户选择处理类型和参数
  → 后端处理 (/api/process/*)
  → 实时进度更新
  → 返回处理结果
  → 前端播放/下载
```

## 📡 API 接口设计

### 1. 文件上传
```
POST /api/upload
Content-Type: multipart/form-data

Request:
  file: File

Response:
  {
    "task_id": "uuid",
    "filename": "example.mp3",
    "size": 1024000,
    "message": "上传成功"
  }
```

### 2. 降噪处理
```
POST /api/process/denoise
Content-Type: application/json

Request:
  {
    "task_id": "uuid",
    "settings": {
      "intensity": 85,
      "preserveReverb": true,
      "voiceRecovery": false
    }
  }

Response:
  {
    "task_id": "uuid",
    "status": "completed",
    "output_url": "/api/download/uuid",
    "message": "处理完成"
  }
```

### 3. 人声分离
```
POST /api/process/vocal-separation
Content-Type: application/json

Request:
  {
    "task_id": "uuid",
    "settings": {
      "sensitivity": 75,
      "focusVoice": "main",
      "targetEnhancement": false
    }
  }

Response:
  {
    "task_id": "uuid",
    "status": "completed",
    "output_url": "/api/download/uuid",
    "message": "处理完成"
  }
```

### 4. 多音轨分离
```
POST /api/process/track-separation
Content-Type: application/json

Request:
  {
    "task_id": "uuid",
    "settings": {
      "vocals": 100,
      "drums": 100,
      "bass": 100,
      "piano": 100,
      "others": 100
    }
  }

Response:
  {
    "task_id": "uuid",
    "status": "completed",
    "output_url": "/api/download/uuid",
    "tracks": {
      "vocals": "/path/to/vocals.wav",
      "drums": "/path/to/drums.wav",
      "bass": "/path/to/bass.wav",
      "piano": "/path/to/piano.wav",
      "other": "/path/to/other.wav"
    },
    "message": "多音轨分离完成"
  }
```

### 5. 任务状态查询
```
GET /api/task/:task_id

Response:
  {
    "task_id": "uuid",
    "status": "processing",
    "progress": 45,
    "filename": "example.mp3"
  }
```

### 6. 文件下载
```
GET /api/download/:task_id
- 下载单个处理结果

GET /api/download-track/:task_id?track=vocals
- 下载单个分离音轨
```

### 7. 清理任务
```
DELETE /api/cleanup/:task_id

Response:
  {
    "message": "清理成功"
  }
```

### 8. 健康检查
```
GET /api/health

Response:
  {
    "status": "healthy",
    "version": "v2.4.0-CYBER",
    "processor_available": true
  }
```

## 🔧 核心实现细节

### 前端关键逻辑

#### 1. 文件上传处理
```typescript
const handleFileUpload = async (file: File) => {
  // 验证文件类型和大小
  // 显示加载动画
  // 调用上传API
  // 保存task_id
  // 更新UI状态
}
```

#### 2. 音频处理触发
```typescript
const handleProcess = async () => {
  // 根据activeTab选择处理类型
  // 收集用户参数
  // 显示进度动画
  // 调用处理API
  // 轮询状态更新
  // 显示处理结果
}
```

#### 3. 波形可视化
```typescript
// 使用Canvas API绘制波形
// 实时更新播放进度
// 支持点击跳转
```

#### 4. 多音轨分离结果显示
```typescript
// 检测separatedTracks是否存在
// 遍历tracks字典
// 为每个音轨创建独立播放器
// 提供单独下载链接
```

### 后端关键逻辑

#### 1. AudioProcessor 类
```python
class AudioProcessor:
    def __init__(self):
        # 检测CUDA支持
        # 初始化设备
        
    def separate_vocals(self, input_file, output_file):
        # 使用demucs命令行工具
        # 两音轨模式：vocals + no_vocals
        
    def separate_tracks(self, input_file, output_dir):
        # 使用demucs完整模式
        # 分离：vocals, drums, bass, piano, other
        # 返回文件路径字典
        
    def denoise_audio(self, input_file, output_file):
        # 使用noisereduce或demucs
        # 降噪处理
```

#### 2. Flask 路由处理
```python
@app.route('/api/process/track-separation', methods=['POST'])
def process_track_separation():
    # 获取task_id和settings
    # 验证任务存在
    # 调用AudioProcessor.separate_tracks()
    # 保存separated_tracks到任务
    # 返回tracks字典
```

#### 3. 文件管理
```python
# 上传文件保存到 ./uploads/
# 处理结果保存到 ./outputs/
# 多音轨保存到 ./outputs/{task_id}/
# 定期清理临时文件
```

## 🎯 状态管理

### 前端状态
```typescript
// 文件状态
const [file, setFile] = useState<AudioFile | null>(null);
const [taskId, setTaskId] = useState<string | null>(null);

// 处理状态
const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>('idle');
const [processingProgress, setProcessingProgress] = useState(0);

// 结果状态
const [outputAudioUrl, setOutputAudioUrl] = useState<string | null>(null);
const [separatedTracks, setSeparatedTracks] = useState<Record<string, string> | null>(null);

// 播放状态
const [isPlaying, setIsPlaying] = useState(false);

// UI状态
const [activeTab, setActiveTab] = useState<TabId>('denoise');
const [logs, setLogs] = useState<LogEntry[]>([]);
```

### 后端状态
```python
# 全局任务字典
tasks = {
    'task_id': {
        'file_path': '/path/to/input',
        'filename': 'example.mp3',
        'status': 'completed',
        'progress': 100,
        'output_path': '/path/to/output',
        'output_filename': 'output.wav',
        'separated_tracks': {
            'vocals': '/path/to/vocals.wav',
            'drums': '/path/to/drums.wav',
            ...
        }
    }
}
```

## 🔐 安全考虑

1. **文件验证**
   - 检查文件扩展名
   - 验证文件MIME类型
   - 限制文件大小（500MB）
   - 防止路径遍历攻击

2. **资源限制**
   - 并发处理任务数量限制
   - 磁盘空间检查
   - 内存使用监控

3. **错误处理**
   - 优雅的错误提示
   - 详细的日志记录
   - 自动清理失败任务

## 📝 日志系统

### 日志类型
```typescript
type LogType = 'info' | 'success' | 'warning' | 'error' | 'cyber';

// 示例日志
logs = [
  { id: '1', text: '妙音AI 引擎初始化中... [完毕]', type: 'success' },
  { id: '2', text: '正在进行快速傅里叶变换 (FFT)...', type: 'info' },
  { id: '3', text: '逆熵时修正变换 (iSTFT) 还原波形。', type: 'cyber' },
  { id: '4', text: '智能音频处理完毕！耗时 2.4s', type: 'success' }
];
```

### 日志样式
- `info`: 蓝色
- `success`: 绿色
- `warning`: 黄色
- `error`: 红色
- `cyber`: 霓虹紫色 + 脉冲动画

## 🚀 部署要求

### 开发环境
```bash
# 前端
cd miaoyin-ai-audio-center
npm install
npm run dev  # http://localhost:5173

# 后端
pip install -r requirements.txt
python backend_server.py  # http://localhost:5001
```

### 生产环境
```bash
# 前端构建
npm run build
# 生成 dist/ 目录

# 后端部署
- 使用 Gunicorn + Nginx
- 配置 CORS
- 设置环境变量（API_URL）
- GPU支持（可选）
```

### 环境变量
```bash
# .env
VITE_API_URL=http://localhost:5001/api

# .env.production
VITE_API_URL=https://your-domain.com/api
```

## 🎨 组件设计规范

### 颜色系统（Tailwind）
```css
primary: #4338CA (靛蓝)
secondary: #7C3AED (紫色)
tertiary: #EC4899 (粉色)

background: #0A0A1A (深黑)
surface: #1A1A2E (深蓝灰)
surface-container: #2D2D44 (容器背景)

on-surface: #E0E0E0 (主文本)
on-surface-variant: #A0A0A0 (次要文本)
outline-variant: #444444 (边框)
```

### 间距系统
```css
gap-2: 0.5rem  /* 8px */
gap-4: 1rem    /* 16px */
gap-6: 1.5rem  /* 24px */
gap-8: 2rem    /* 32px */

p-4: 1rem      /* 16px */
p-6: 1.5rem    /* 24px */
p-8: 2rem      /* 32px */
```

### 圆角
```css
rounded-lg: 0.5rem   /* 8px */
rounded-xl: 0.75rem  /* 12px */
rounded-2xl: 1rem    /* 16px */
```

### 阴影和发光
```css
shadow-xl: 大阴影
shadow-2xl: 超大阴影

/* 自定义glow效果 */
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(67, 56, 202, 0.5);
}
```

## 🧪 测试要点

### 功能测试
1. 文件上传（各种格式、大小）
2. 三种处理模式（降噪、人声、音轨）
3. 参数调节生效
4. 播放器控制
5. 文件下载
6. 多音轨独立播放和下载

### UI测试
1. 响应式布局（桌面、平板、手机）
2. 动画流畅度
3. 浏览器兼容性
4. 波形显示正确性

### 边界测试
1. 超大文件处理
2. 网络中断恢复
3. 并发任务处理
4. 磁盘空间不足
5. GPU不可用降级

## 📚 依赖库说明

### 前端核心依赖
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "lucide-react": "^0.300.0"
}
```

### 后端核心依赖
```txt
flask==3.0.0
flask-cors==4.0.0
demucs==4.0.1
torch>=2.0.0
torchaudio>=2.0.0
python-dotenv==1.0.0
```

## 🔄 工作流程总结

1. **用户上传** → 验证 → 保存 → 返回task_id
2. **选择功能** → 调整参数 → 开始处理
3. **后端处理** → Demucs分离 → 保存结果
4. **前端展示** → 播放预览 → 提供下载
5. **清理资源** → 删除临时文件

## 💡 优化方向

1. **性能优化**
   - WebAssembly音频处理
   - WebWorker后台处理
   - 流式传输大文件

2. **功能扩展**
   - 批量处理
   - 音频格式转换（MP3/FLAC/WAV）
   - 音轨合成功能
   - AI音质增强

3. **用户体验**
   - 拖拽调节音轨音量
   - 实时预览参数效果
   - 处理历史记录
   - 快捷键支持

## 🎓 关键技术点

1. **Demucs模型**
   - Hybrid Transformer Demucs
   - 6音轨分离能力
   - GPU加速支持

2. **React Hooks**
   - useState管理状态
   - useEffect处理副作用
   - useRef操作DOM

3. **Canvas绘图**
   - 波形可视化
   - 实时更新动画

4. **Flask异步处理**
   - 后台任务队列
   - 进度追踪
   - 文件流传输

---

## 📌 快速开始提示词

如果要从零开始构建这个项目，可以使用以下提示词：

**基础提示**：
```
请帮我构建一个赛博朋克风格的音频处理平台。要求：
1. 前端使用React + TypeScript + Vite + TailwindCSS
2. 后端使用Python Flask + Demucs
3. 实现音频降噪、人声分离、多音轨分离三个功能
4. UI风格：深色主题、霓虹色、玻璃态、发光效果
5. 支持文件上传、实时处理、结果播放下载
```

**详细提示**：
```
基于这份工程提示词（PROJECT_PROMPT.md）构建妙音AI音频处理平台。
请严格按照文档中的：
- API接口设计
- 技术栈选择
- UI组件结构
- 状态管理方案
- 视觉风格规范
逐步实现完整的前后端代码。
```
