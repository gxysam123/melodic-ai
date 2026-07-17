#!/bin/bash
# 妙音AI 快速启动脚本

echo "======================================"
echo "      妙音AI 音频处理工具"
echo "======================================"
echo ""

# 检查Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到Python3"
    echo "请先安装Python: https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python版本: $(python3 --version)"

# 检查依赖是否安装
if ! python3 -c "import flask" 2>/dev/null; then
    echo ""
    echo "📦 正在安装Python依赖..."
    pip3 install -r requirements.txt
fi

# 检查Demucs
if python3 -c "import demucs" 2>/dev/null; then
    echo "✅ Demucs已安装"
else
    echo ""
    echo "⚠️  Demucs未安装，将在首次处理时自动下载模型"
    echo "提示: 可以手动安装加速下载"
    echo "      pip3 install demucs"
fi

# 检查GPU
if python3 -c "import torch; print('GPU可用' if torch.cuda.is_available() else '')" 2>/dev/null | grep -q "GPU可用"; then
    GPU_NAME=$(python3 -c "import torch; print(torch.cuda.get_device_name(0))" 2>/dev/null)
    echo "✅ GPU加速: $GPU_NAME"
else
    echo "ℹ️  将使用CPU模式（速度较慢）"
    echo "   提示: 安装CUDA版PyTorch可启用GPU加速"
fi

echo ""
echo "======================================"
echo "🚀 启动后端服务器..."
echo "======================================"
echo ""

# 启动Flask服务器
python3 backend_server.py
