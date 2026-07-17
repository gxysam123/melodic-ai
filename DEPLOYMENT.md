# 妙音AI - 部署成功！🎉

## ✅ 当前状态

### 后端服务器
- **状态**: ✅ 运行中
- **地址**: http://localhost:5001
- **API**: http://localhost:5001/api
- **音频处理器**: ✅ Demucs可用
- **设备模式**: CPU

### 前端服务器
- **状态**: ✅ 运行中  
- **地址**: http://localhost:3000

---

## 🚀 快速启动指南

### 方法1: 使用当前运行的服务

后端和前端已经在运行中，直接访问：
**http://localhost:3000**

### 方法2: 重新启动

如果服务停止了，按以下步骤重启：

#### 启动后端（终端1）
```bash
cd /Users/xyl/Desktop/L/11-AI-project/09-melodic-ai-new/miaoyin-ai-audio-center
python3 backend_server.py
```

#### 启动前端（终端2）
```bash
cd /Users/xyl/Desktop/L/11-AI-project/09-melodic-ai-new/miaoyin-ai-audio-center
npm run dev
```

---

## 📁 重要文件说明

### 核心文件
| 文件 | 说明 |
|------|------|
| `backend_server.py` | Flask后端服务器 |
| `audio_processor.py` | Demucs音频处理引擎 |
| `src/App.tsx` | React前端主应用 |
| `src/lib/apiClient.ts` | API客户端 |

### 配置文件
| 文件 | 说明 |
|------|------|
| `.env` | 环境变量（API地址配置） |
| `requirements.txt` | Python依赖列表 |
| `package.json` | Node.js依赖列表 |

### 文档文件
| 文件 | 说明 |
|------|------|
| `README_DEMUCS.md` | Demucs使用文档 |
| `TUTORIAL.md` | 完整安装和使用教程 |
| `DEPLOYMENT.md` | 本文件 |
| `UI-UPGRADE-SUMMARY.md` | UI美化升级总结 |

---

## 🎯 功能测试步骤

### 1. 测试人声分离

1. 访问 http://localhost:3000
2. 点击"本地文件"或拖拽音频文件上传
3. 等待上传完成
4. 点击"重叠人声分离"标签
5. 点击"开始处理"
6. 等待处理完成（首次会下载模型，需要几分钟）
7. 播放或下载结果

### 2. 测试多音轨分离

1. 上传音频文件
2. 切换到"多音轨分离"标签
3. 调整各音轨音量
4. 点击"开始处理"
5. 下载完整分离的音轨

### 3. 测试降噪功能

1. 上传音频文件
2. 在"智能降噪"标签
3. 调整降噪强度
4. 启用"保留混响"
5. 点击"开始处理"
6. 对比处理前后效果

---

## ⚙️ 配置说明

### 端口配置
- **后端端口**: 5001 (在 `backend_server.py`)
- **前端端口**: 3000 (在 `vite.config.ts`)
- **API地址**: 在 `.env` 文件中配置

### 为什么使用5001端口？

端口5000被macOS的AirPlay占用，所以改用5001。如果你想改回5000：

1. 关闭AirPlay接收器：
   - 系统设置 -> 通用 -> 隔空播放与接力 -> 关闭"隔空播放接收器"

2. 修改配置：
   ```bash
   # 修改 backend_server.py 中的端口为5000
   # 修改 .env 文件: VITE_API_URL=http://localhost:5000/api
   # 修改 src/lib/apiClient.ts 的默认URL
   ```

---

## 🔧 常见问题

### Q1: 白屏问题

**原因**: 后端未启动或API地址配置错误

**解决**:
1. 确认后端在运行: `curl http://localhost:5001/api/health`
2. 检查`.env`文件配置
3. 重启前端: Ctrl+C 后 `npm run dev`
4. 清除浏览器缓存

### Q2: 上传失败

**原因**: 文件格式不支持或后端权限问题

**解决**:
1. 确认文件格式: MP3, WAV, FLAC, MP4等
2. 检查文件大小 < 500MB
3. 查看后端终端错误日志

### Q3: 处理速度慢

**原因**: 使用CPU模式，没有GPU加速

**优化**:
1. 首次运行会下载模型（3-5分钟）
2. 安装GPU版PyTorch:
   ```bash
   pip3 uninstall torch torchaudio
   pip3 install torch torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```
3. 重启后端服务

### Q4: 模块找不到

**错误**: `ModuleNotFoundError: No module named 'xxx'`

**解决**:
```bash
pip3 install -r requirements.txt
```

---

## 📊 性能指标

### CPU模式（当前）
- 3分钟音频: ~5-8分钟处理时间
- 内存占用: ~2-4GB
- 适合: 测试、小文件

### GPU模式（推荐）
- 3分钟音频: ~30-60秒处理时间
- 显存占用: ~4-6GB
- 适合: 批量处理、长音频

### 模型下载
- 首次运行会自动下载
- 模型大小: ~2.5GB
- 下载位置: `~/.cache/torch/hub/checkpoints/`
- 只需下载一次，永久使用

---

## 🌟 高级功能

### 1. 命令行直接使用

```bash
# 提取人声
python3 audio_processor.py input.mp3 -o vocals.wav -m vocals

# 完整分离
python3 audio_processor.py input.mp3 -o output/ -m tracks

# 降噪
python3 audio_processor.py input.mp3 -o clean.wav -m denoise
```

### 2. 批量处理

```python
from audio_processor import AudioProcessor

processor = AudioProcessor(device='cpu')

files = ['song1.mp3', 'song2.mp3', 'song3.mp3']
results = processor.batch_process(
    input_files=files,
    output_dir='./vocals_output',
    mode='vocals'
)
```

### 3. 从视频提取音频

```python
processor.extract_audio_from_video(
    video_file='video.mp4',
    audio_file='audio.wav'
)
```

---

## 🛠️ 维护命令

### 查看运行状态
```bash
# 检查后端
curl http://localhost:5001/api/health

# 查看端口占用
lsof -i :5001  # 后端
lsof -i :3000  # 前端
```

### 停止服务
```bash
# 在运行的终端按 Ctrl+C
# 或强制停止
pkill -f backend_server.py
pkill -f vite
```

### 清理临时文件
```bash
rm -rf /var/folders/*/T/miaoyin_uploads/*
rm -rf /var/folders/*/T/miaoyin_outputs/*
```

### 更新依赖
```bash
# Python依赖
pip3 install --upgrade -r requirements.txt

# Node依赖  
npm update
```

---

## 📞 技术支持

### 诊断工具
```bash
python3 diagnose.py
```

### 查看日志
- 后端: 终端输出
- 前端: 浏览器Console (F12)

### 测试API
```bash
# 健康检查
curl http://localhost:5001/api/health

# 上传测试
curl -X POST -F "file=@test.mp3" http://localhost:5001/api/upload
```

---

## 🎓 学习资源

- **Demucs官方**: https://github.com/facebookresearch/demucs
- **Flask文档**: https://flask.palletsprojects.com/
- **React文档**: https://react.dev/

---

**部署完成时间**: 2026-07-17
**版本**: v2.4.0-CYBER
**状态**: ✅ 生产就绪

---

## ✨ 下一步

现在你可以：

1. 🎵 **开始处理音频** - 访问 http://localhost:3000
2. 📖 **阅读完整教程** - 查看 `TUTORIAL.md`
3. 🚀 **启用GPU加速** - 安装CUDA版PyTorch
4. 📦 **批量处理** - 使用 `audio_processor.py` 命令行

享受妙音AI带来的专业音频处理体验！🎉
