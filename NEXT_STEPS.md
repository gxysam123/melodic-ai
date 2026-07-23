# 🎯 下一步操作指南

## ✅ 当前状态

你的妙音AI音频处理工具已经准备就绪！所有脚本和文档都已配置完成。

```
✓ 后端服务器已配置 (backend_server.py)
✓ 音频处理引擎已配置 (audio_processor.py)
✓ 前端界面已构建
✓ 启动脚本已创建 (start.sh, stop.sh, logs.sh)
✓ 使用文档已完善
```

---

## 🚀 立即开始（3步）

### 第1步：启动服务

在终端运行：

```bash
cd ~/Desktop/L/11-AI-project/09-melodic-ai-new
./start.sh
```

### 第2步：访问应用

打开浏览器访问：
- **本地**: http://localhost:3000
- **API**: http://localhost:5001/api

### 第3步：开始使用

1. 上传音频文件（MP3、WAV、FLAC等）
2. 选择处理模式：
   - 智能降噪
   - 多音轨分离
   - 人声分离
3. 点击"开始处理"
4. 下载处理后的音频

---

## 📋 快速命令

```bash
# 启动服务
./start.sh

# 停止服务
./stop.sh

# 查看日志
./logs.sh

# 检查服务状态
curl http://localhost:5001/api/health
```

---

## 📁 关键文件位置

```
09-melodic-ai-new/
├── start.sh              ⭐ 一键启动脚本
├── stop.sh               🛑 停止服务脚本
├── logs.sh               📋 日志查看脚本
├── 启动指南.md            📚 详细使用文档
├── 使用演示.md            🎬 完整演示流程
└── miaoyin-ai-audio-center/
    ├── backend_server.py  🔧 后端服务
    ├── audio_processor.py 🎵 音频处理引擎
    ├── backend.log        📄 后端日志（运行时生成）
    └── frontend.log       📄 前端日志（运行时生成）
```

---

## 🔧 系统要求

确保你的系统满足以下要求：

- ✅ **Python 3.8+** （检查：`python3 --version`）
- ✅ **Node.js 16.0+** （检查：`node --version`）
- ✅ **npm 7.0+** （检查：`npm --version`）

start.sh 脚本会自动检查这些要求。

---

## 💡 功能亮点

### 1. 智能降噪
清理音频背景噪音，保留清晰人声
- 适合：录音、会议、播客

### 2. 多音轨分离
分离人声、鼓、贝斯、其他伴奏
- 适合：音乐制作、混音、卡拉OK

### 3. 人声分离
提取纯净人声或伴奏
- 适合：配音、翻唱、制作

---

## ⚡ 性能说明

### CPU 模式（默认）
- 人声分离：1-3x 实时
- 多音轨分离：2-5x 实时
- 示例：10分钟音频 → 10-30分钟处理

### GPU 模式（NVIDIA显卡）
- 人声分离：0.3-1x 实时
- 多音轨分离：0.5-2x 实时
- 示例：10分钟音频 → 3-10分钟处理

💡 **提示**：首次运行会下载 Demucs 模型（约300MB），请耐心等待。

---

## 🐛 遇到问题？

### 端口被占用
```bash
# 查看占用端口的进程
lsof -i :5001  # 后端
lsof -i :3000  # 前端

# 杀死进程
kill -9 <PID>
```

### 查看日志排查问题
```bash
# 后端日志
tail -f miaoyin-ai-audio-center/backend.log

# 前端日志
tail -f miaoyin-ai-audio-center/frontend.log
```

### 重新安装依赖
```bash
cd miaoyin-ai-audio-center

# Python依赖
pip3 install --upgrade pip
pip3 install -r requirements.txt

# Node依赖
npm install
```

---

## 📚 详细文档

需要更多信息？查看：

- **启动指南.md** - 完整的安装和配置说明
- **使用演示.md** - 详细的使用流程和示例
- **README.md** - 项目介绍和技术说明

---

## ✨ 下一步建议

### 立即可做的：
1. ✅ 运行 `./start.sh` 启动服务
2. ✅ 访问 http://localhost:3000 开始使用
3. ✅ 上传测试音频文件

### 进阶优化：
1. 🔧 配置 GPU 加速（如果有NVIDIA显卡）
2. 📊 监控处理性能和日志
3. 🎨 根据需求自定义前端界面
4. 🚀 考虑部署到服务器供团队使用

---

## 🎉 开始使用

现在就运行：

```bash
./start.sh
```

然后在浏览器打开 **http://localhost:3000**，开始体验妙音AI的强大功能！

---

**有问题？** 查看日志文件或参考启动指南.md

**享受使用！** 🎵✨
