# 妙音AI 完整安装和使用教程

## 目录
1. [系统要求](#系统要求)
2. [安装步骤](#安装步骤)
3. [启动服务](#启动服务)
4. [使用教程](#使用教程)
5. [白屏问题解决](#白屏问题解决)
6. [性能优化](#性能优化)

---

## 系统要求

### 最低配置
- **操作系统**: Windows 10/11, macOS 10.15+, Ubuntu 20.04+
- **Python**: 3.9 或更高版本
- **内存**: 8GB RAM
- **存储**: 10GB可用空间
- **CPU**: 4核以上

### 推荐配置（GPU加速）
- **显卡**: NVIDIA GPU (GTX 1060 或更高)
- **显存**: 6GB VRAM 或以上
- **CUDA**: 11.8 或 12.1

---

## 安装步骤

### 1. 克隆或下载项目

```bash
cd /Users/xyl/Desktop/L/11-AI-project/09-melodic-ai-new/miaoyin-ai-audio-center
```

### 2. 安装Node.js依赖（前端）

```bash
npm install
```

### 3. 安装Python依赖（后端）

#### 方法A: 使用requirements.txt（推荐）

```bash
pip3 install -r requirements.txt
```

#### 方法B: 手动安装

```bash
# 基础依赖
pip3 install flask flask-cors

# Demucs和PyTorch (CPU版本)
pip3 install demucs torch torchaudio

# 如果有NVIDIA GPU，先卸载CPU版本
pip3 uninstall torch torchaudio

# 然后安装CUDA版本
# CUDA 11.8
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# CUDA 12.1
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

### 4. 安装ffmpeg（可选，用于视频处理）

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# 从 https://ffmpeg.org/download.html 下载并添加到PATH
```

### 5. 验证安装

```bash
# 检查Python依赖
python3 -c "import flask, demucs, torch; print('✅ 所有依赖已安装')"

# 检查GPU是否可用
python3 -c "import torch; print('✅ GPU可用' if torch.cuda.is_available() else 'ℹ️ 使用CPU模式')"
```

---

## 启动服务

### 方法1: 使用启动脚本（推荐）

```bash
# 启动后端
./start_backend.sh

# 新开终端，启动前端
npm run dev
```

### 方法2: 手动启动

**终端1 - 启动后端:**
```bash
cd /Users/xyl/Desktop/L/11-AI-project/09-melodic-ai-new/miaoyin-ai-audio-center
python3 backend_server.py
```

你应该看到：
```
======================================================================
妙音AI 后端服务器启动
音频处理器状态: 可用
上传目录: /tmp/miaoyin_uploads
输出目录: /tmp/miaoyin_outputs
======================================================================
 * Running on http://0.0.0.0:5000
```

**终端2 - 启动前端:**
```bash
cd /Users/xyl/Desktop/L/11-AI-project/09-melodic-ai-new/miaoyin-ai-audio-center
npm run dev
```

你应该看到：
```
VITE v6.4.3  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

### 访问应用

在浏览器中打开: **http://localhost:3000**

---

## 使用教程

### 1. 上传音频文件

**方法A: 拖拽上传**
- 直接将音频/视频文件拖到上传区域

**方法B: 点击上传**
- 点击"本地文件"按钮
- 选择音频/视频文件

**方法C: 网络链接**
- 点击"网络链接"
- 输入音频文件的直链URL

### 2. 选择处理模式

#### 智能降噪
- 移除背景噪音、环境杂音
- 保留纯净人声
- 参数:
  - **降噪强度**: 0-100% (推荐85%)
  - **保留混响**: 保持空间感
  - **人声补偿**: 修复高频细节

#### 重叠人声分离
- 分离主唱、和声、背景人声
- 适用于多人对话、合唱场景
- 参数:
  - **灵敏度**: 0-100%
  - **焦点人声**: 主唱/副唱/和声

#### 多音轨分离
- 完整分离所有乐器
- 输出: 人声、鼓、贝斯、钢琴、其他
- 可单独调整每个音轨音量

### 3. 开始处理

点击"开始处理"按钮，等待AI处理完成

处理时间参考:
- **3分钟音频 + GPU**: ~30秒
- **3分钟音频 + CPU**: ~5分钟

### 4. 下载结果

处理完成后:
1. 点击播放按钮预览结果
2. 点击"下载处理结果"保存文件

---

## 白屏问题解决

### 问题: 点击上传后出现白屏

这通常是**后端服务未启动**或**API地址配置错误**导致的。

### 解决步骤:

#### 步骤1: 检查后端是否运行

```bash
# 检查5000端口是否被占用
lsof -i :5000

# 或使用curl测试
curl http://localhost:5000/api/health
```

如果没有响应，说明后端未启动，请重新运行:
```bash
python3 backend_server.py
```

#### 步骤2: 检查环境变量

确保 `.env` 文件配置正确:

```bash
# .env
VITE_API_URL=http://localhost:5000/api
```

如果修改了配置，需要重启前端:
```bash
# Ctrl+C 停止
npm run dev  # 重新启动
```

#### 步骤3: 查看浏览器错误

1. 打开浏览器开发者工具 (F12)
2. 切换到 Console 标签
3. 查看错误信息

常见错误及解决:

**错误1: "Failed to fetch"**
- 原因: 后端未运行或端口不对
- 解决: 启动后端 `python3 backend_server.py`

**错误2: "CORS policy blocked"**
- 原因: 跨域配置问题
- 解决: 确保后端有 `flask-cors` (`pip3 install flask-cors`)

**错误3: "Network Error"**
- 原因: 防火墙阻止
- 解决: 临时关闭防火墙或添加5000端口例外

#### 步骤4: 检查API端点

手动测试API是否正常:

```bash
# 测试健康检查
curl http://localhost:5000/api/health

# 应该返回:
# {"status":"healthy","processor_available":true,"version":"v2.4.0-CYBER"}
```

#### 步骤5: 查看后端日志

后端终端应该显示每个请求:

```
INFO:werkzeug:127.0.0.1 - - [日期] "GET /api/health HTTP/1.1" 200 -
```

如果没有日志输出，说明请求没有到达后端。

#### 步骤6: 重启所有服务

```bash
# 1. 停止前端 (Ctrl+C)
# 2. 停止后端 (Ctrl+C)

# 3. 清理缓存
rm -rf node_modules/.vite

# 4. 重启后端
python3 backend_server.py

# 5. 新终端启动前端
npm run dev
```

---

## 性能优化

### 1. 启用GPU加速

#### 检查CUDA版本
```bash
nvidia-smi
```

查看输出中的 `CUDA Version`，例如 `12.1`

#### 安装对应版本PyTorch

```bash
# 卸载CPU版本
pip3 uninstall torch torchaudio

# CUDA 11.8
pip3 install torch torchaudio --index-url https://download.pytorch.org/whl/cu118

# CUDA 12.1
pip3 install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
```

#### 验证GPU
```bash
python3 -c "import torch; print(f'CUDA可用: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"无\"}')"
```

### 2. 加快模型下载

#### 方法1: 使用镜像源
```bash
pip3 install demucs -i https://pypi.tuna.tsinghua.edu.cn/simple
```

#### 方法2: 手动下载模型
模型会在首次运行时自动下载到:
- Windows: `C:\Users\<用户名>\.cache\torch\hub\checkpoints\`
- macOS/Linux: `~/.cache/torch/hub/checkpoints/`

### 3. 批量处理优化

对于多个文件，使用批量处理更高效:

```python
from audio_processor import AudioProcessor

processor = AudioProcessor(device='cuda')

# 批量提取人声
files = ['song1.mp3', 'song2.mp3', 'song3.mp3']
results = processor.batch_process(
    input_files=files,
    output_dir='./output',
    mode='vocals'
)
```

### 4. 内存优化

如果遇到内存不足:

```python
# 分段处理大文件
import subprocess

# 使用ffmpeg分段
subprocess.run([
    'ffmpeg', '-i', 'large_file.mp3',
    '-f', 'segment', '-segment_time', '300',  # 5分钟一段
    '-c', 'copy', 'chunk_%03d.mp3'
])
```

---

## 常见错误及解决

### 错误1: ModuleNotFoundError: No module named 'demucs'

**解决:**
```bash
pip3 install demucs
```

### 错误2: RuntimeError: CUDA out of memory

**解决:**
- 关闭其他占用GPU的程序
- 或切换到CPU模式: 在 `backend_server.py` 中设置 `device='cpu'`

### 错误3: ffmpeg not found

**解决:**
```bash
# macOS
brew install ffmpeg

# Ubuntu
sudo apt-get install ffmpeg
```

### 错误4: 处理速度很慢

**检查:**
1. 是否在使用GPU模式
2. 模型是否已下载完成
3. CPU/GPU负载是否正常

**优化:**
- 使用GPU加速
- 降低音频质量
- 分段处理大文件

---

## 技术支持

### 日志位置
- 后端日志: 终端输出
- 前端日志: 浏览器Console (F12)

### 诊断命令

```bash
# 检查所有依赖
python3 -c "
import sys
try:
    import flask; print('✅ Flask')
except: print('❌ Flask')
try:
    import demucs; print('✅ Demucs')
except: print('❌ Demucs')
try:
    import torch; print('✅ PyTorch')
except: print('❌ PyTorch')
"

# 检查端口
lsof -i :5000  # 后端
lsof -i :3000  # 前端

# 测试API
curl http://localhost:5000/api/health
```

---

**版本**: v2.4.0-CYBER
**文档更新**: 2026-07-17

遇到其他问题？请检查 `README_DEMUCS.md` 或查看终端错误日志。
