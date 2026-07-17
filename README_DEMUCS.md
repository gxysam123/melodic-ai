# 妙音AI - Demucs音频处理引擎

基于Facebook Demucs模型的专业音频分离工具，支持人声提取、多音轨分离、智能降噪。

## 功能特性

✅ **人声分离** - 只输出纯净人声，彻底消除BGM和背景杂音
✅ **多音轨分离** - 分离人声、鼓、贝斯、钢琴、其他乐器
✅ **智能降噪** - 基于AI的降噪处理
✅ **批量处理** - 同时处理多个文件
✅ **GPU加速** - 自动检测并使用CUDA加速
✅ **视频支持** - 自动从视频中提取音频

## 快速开始

### 1. 安装依赖

```bash
# 进入项目目录
cd /Users/xyl/Desktop/L/11-AI-project/09-melodic-ai-new/miaoyin-ai-audio-center

# 安装Python依赖
pip install flask flask-cors demucs torch torchaudio

# 如果有NVIDIA GPU，安装CUDA版本的PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### 2. 启动后端服务器

```bash
# 启动Flask后端（端口5000）
python backend_server.py
```

### 3. 启动前端服务

```bash
# 新开一个终端，启动前端开发服务器
npm run dev
```

访问: http://localhost:3000

## 模型下载

Demucs模型会在首次运行时自动下载，无需手动下载。

支持的模型：
- **htdemucs** (默认) - 高质量混合Transformer模型，速度和质量平衡
- **htdemucs_ft** - 微调版，音质更好但速度稍慢
- **mdx_extra** - 额外模型，专注于人声分离

模型存储位置：
- Windows: `C:\Users\<用户名>\.cache\torch\hub\checkpoints\`
- macOS/Linux: `~/.cache/torch/hub/checkpoints/`

## 命令行使用

### 基础用法

```bash
# 只提取人声（最常用）
python audio_processor.py input.mp3 -o output_vocals.wav -m vocals

# 智能降噪
python audio_processor.py input.mp3 -o output_clean.wav -m denoise

# 完整多音轨分离
python audio_processor.py input.mp3 -o output_dir/ -m tracks
```

### 高级选项

```bash
# 指定GPU设备
python audio_processor.py input.mp3 -m vocals --device cuda

# 使用不同模型
python audio_processor.py input.mp3 -m vocals --model htdemucs_ft

# 处理视频文件
python audio_processor.py video.mp4 -m vocals -o vocals_only.wav
```

### 批量处理示例

```python
from audio_processor import AudioProcessor

# 初始化处理器
processor = AudioProcessor(device='cuda')

# 批量提取人声
input_files = ['song1.mp3', 'song2.mp3', 'song3.mp3']
results = processor.batch_process(
    input_files=input_files,
    output_dir='./vocals_output',
    mode='vocals'
)

# 打印结果
for result in results:
    print(f"{result['input_file']}: {result['status']}")
```

## API接口文档

### 1. 上传音频

```bash
POST http://localhost:5000/api/upload
Content-Type: multipart/form-data

file: <audio_file>

# 响应
{
  "task_id": "uuid",
  "filename": "audio.mp3",
  "size": 1024000,
  "message": "文件上传成功"
}
```

### 2. 人声分离

```bash
POST http://localhost:5000/api/process/vocal-separation
Content-Type: application/json

{
  "task_id": "uuid",
  "settings": {
    "sensitivity": 75,
    "focusVoice": "main",
    "targetEnhancement": false
  }
}

# 响应
{
  "task_id": "uuid",
  "status": "completed",
  "output_url": "/api/download/uuid",
  "message": "人声分离完成"
}
```

### 3. 多音轨分离

```bash
POST http://localhost:5000/api/process/track-separation
Content-Type: application/json

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
```

### 4. 下载结果

```bash
GET http://localhost:5000/api/download/<task_id>
```

## 性能优化

### GPU加速

确保已安装CUDA版本的PyTorch：

```bash
# 检查CUDA是否可用
python -c "import torch; print(torch.cuda.is_available())"

# 查看GPU信息
python -c "import torch; print(torch.cuda.get_device_name(0))"
```

### 性能对比

| 硬件配置 | 处理速度 (5分钟音频) |
|---------|-------------------|
| CPU (Intel i7) | ~15-20分钟 |
| GPU (RTX 3060) | ~2-3分钟 |
| GPU (RTX 4090) | ~30-60秒 |

### 内存占用

- CPU模式: ~2-4GB RAM
- GPU模式: ~4-8GB VRAM

## 支持的文件格式

### 音频格式
- MP3, WAV, FLAC, OGG, M4A, AAC, WMA

### 视频格式
- MP4, AVI, MOV, MKV, FLV, WEBM

所有视频文件会自动提取音频后处理。

## 常见问题

### Q: 白屏问题怎么解决？

**A**: 白屏通常是后端未启动或端口错误，请检查：

1. 确保后端在运行：
```bash
python backend_server.py
# 应该看到: "妙音AI 后端服务器启动"
```

2. 检查端口配置：
- 后端默认: http://localhost:5000
- 前端默认: http://localhost:3000
- 确保 `.env` 文件配置正确

3. 查看浏览器控制台错误：
```
F12 -> Console -> 查看错误信息
```

### Q: Demucs下载慢怎么办？

**A**: 使用镜像源加速：

```bash
# 使用清华镜像
pip install demucs -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### Q: GPU加速不工作？

**A**: 检查步骤：

```bash
# 1. 确认CUDA版本
nvidia-smi

# 2. 安装对应版本的PyTorch
# CUDA 11.8
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# CUDA 12.1
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### Q: 处理视频时出错？

**A**: 确保安装了ffmpeg：

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# 从 https://ffmpeg.org/download.html 下载
```

### Q: 内存不足错误？

**A**: 降低处理质量或使用分段处理：

```python
# 对于大文件，先分段
from pydub import AudioSegment

audio = AudioSegment.from_file("large_file.mp3")
# 分成5分钟的片段
for i, chunk in enumerate(audio[::5*60*1000]):
    chunk.export(f"chunk_{i}.mp3")
```

## 项目结构

```
miaoyin-ai-audio-center/
├── backend_server.py          # Flask后端服务器
├── audio_processor.py         # Demucs音频处理引擎
├── src/
│   ├── App.tsx               # React主应用
│   ├── lib/apiClient.ts      # API客户端
│   └── components/           # UI组件
├── .env                      # 环境变量配置
├── package.json              # 前端依赖
└── requirements.txt          # Python依赖
```

## 技术栈

**后端**
- Flask - Web框架
- Demucs - Facebook音频分离模型
- PyTorch - 深度学习框架
- Torchaudio - 音频处理

**前端**
- React 19 - UI框架
- TypeScript - 类型安全
- Tailwind CSS 4 - 样式
- Vite - 构建工具

## 开发模式

后端支持模拟模式，即使没有安装Demucs也可以测试UI：

```python
# backend_server.py 会自动检测
if PROCESSOR_AVAILABLE:
    # 使用真实的Demucs处理
else:
    # 使用模拟模式（复制文件）
```

## 许可证

MIT License

## 鸣谢

- [Demucs](https://github.com/facebookresearch/demucs) - Facebook Research
- [PyTorch](https://pytorch.org/) - Meta AI

## 支持

遇到问题？
1. 查看本文档的"常见问题"部分
2. 检查后端日志输出
3. 查看浏览器控制台错误

---

**版本**: v2.4.0-CYBER
**更新**: 2026-07-17
