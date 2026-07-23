#!/bin/bash
# 妙音AI - 一键启动脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$PROJECT_DIR/miaoyin-ai-audio-center"

# 日志文件
BACKEND_LOG="$APP_DIR/backend.log"
FRONTEND_LOG="$APP_DIR/frontend.log"

# PID 文件
BACKEND_PID="$APP_DIR/.backend.pid"
FRONTEND_PID="$APP_DIR/.frontend.pid"

echo -e "${CYAN}"
echo "════════════════════════════════════════"
echo "         妙音AI 音频处理工具"
echo "════════════════════════════════════════"
echo -e "${NC}"

# 检查项目目录
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}❌ 错误: 找不到项目目录${NC}"
    echo "   期望路径: $APP_DIR"
    exit 1
fi

cd "$APP_DIR"

# 停止函数
stop_services() {
    echo ""
    echo -e "${YELLOW}正在停止服务...${NC}"

    # 停止后端
    if [ -f "$BACKEND_PID" ]; then
        BACKEND_PID_NUM=$(cat "$BACKEND_PID")
        if ps -p $BACKEND_PID_NUM > /dev/null 2>&1; then
            echo -e "${CYAN}  停止后端 (PID: $BACKEND_PID_NUM)${NC}"
            kill $BACKEND_PID_NUM 2>/dev/null
            sleep 1
            # 如果还在运行，强制杀死
            if ps -p $BACKEND_PID_NUM > /dev/null 2>&1; then
                kill -9 $BACKEND_PID_NUM 2>/dev/null
            fi
        fi
        rm -f "$BACKEND_PID"
    fi

    # 停止前端
    if [ -f "$FRONTEND_PID" ]; then
        FRONTEND_PID_NUM=$(cat "$FRONTEND_PID")
        if ps -p $FRONTEND_PID_NUM > /dev/null 2>&1; then
            echo -e "${CYAN}  停止前端 (PID: $FRONTEND_PID_NUM)${NC}"
            kill $FRONTEND_PID_NUM 2>/dev/null
            sleep 1
            if ps -p $FRONTEND_PID_NUM > /dev/null 2>&1; then
                kill -9 $FRONTEND_PID_NUM 2>/dev/null
            fi
        fi
        rm -f "$FRONTEND_PID"
    fi

    # 清理可能的僵尸进程
    pkill -f "python3 backend_server.py" 2>/dev/null
    pkill -f "vite.*3000" 2>/dev/null

    echo -e "${GREEN}✓ 服务已停止${NC}"
}

# 捕获 Ctrl+C
trap 'stop_services; exit 0' INT TERM

# 检查 Python
echo -e "${BLUE}检查环境...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ 未找到 Python3${NC}"
    echo "   请先安装 Python: https://www.python.org/downloads/"
    exit 1
fi
echo -e "${GREEN}✓ Python: $(python3 --version)${NC}"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未找到 Node.js${NC}"
    echo "   请先安装 Node.js: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 未找到 npm${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm: $(npm --version)${NC}"

# 检查 Python 依赖
echo ""
echo -e "${BLUE}检查 Python 依赖...${NC}"
if ! python3 -c "import flask" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Python 依赖未安装，正在安装...${NC}"
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Python 依赖安装失败${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Python 依赖已安装${NC}"
fi

# 检查 Node 依赖
echo ""
echo -e "${BLUE}检查 Node 依赖...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Node 依赖未安装，正在安装...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Node 依赖安装失败${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Node 依赖已安装${NC}"
fi

# 检查 GPU
echo ""
echo -e "${BLUE}检查硬件...${NC}"
if python3 -c "import torch; exit(0 if torch.cuda.is_available() else 1)" 2>/dev/null; then
    GPU_NAME=$(python3 -c "import torch; print(torch.cuda.get_device_name(0))" 2>/dev/null)
    echo -e "${GREEN}✓ GPU 加速: $GPU_NAME${NC}"
else
    echo -e "${YELLOW}ℹ️  将使用 CPU 模式（处理速度较慢）${NC}"
fi

# 停止旧服务
if [ -f "$BACKEND_PID" ] || [ -f "$FRONTEND_PID" ]; then
    echo ""
    echo -e "${YELLOW}检测到已有服务在运行，正在停止...${NC}"
    stop_services
fi

# 清理端口占用
echo ""
echo -e "${BLUE}检查端口占用...${NC}"

# 清理后端端口
BACKEND_PORT_PIDS=$(lsof -ti :5001 2>/dev/null)
if [ ! -z "$BACKEND_PORT_PIDS" ]; then
    echo -e "${YELLOW}⚠️  端口 5001 被占用，正在清理...${NC}"
    for pid in $BACKEND_PORT_PIDS; do
        kill -9 $pid 2>/dev/null
    done
    # 额外清理所有 backend_server.py 进程
    pkill -9 -f "python3.*backend_server.py" 2>/dev/null
    sleep 2
    # 再次检查
    if lsof -ti :5001 > /dev/null 2>&1; then
        echo -e "${RED}❌ 端口 5001 仍被占用，请手动清理：${NC}"
        echo -e "   ${CYAN}lsof -ti :5001 | xargs kill -9${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ 端口 5001 已清理${NC}"
fi

# 清理前端端口
FRONTEND_PORT_PIDS=$(lsof -ti :3000 2>/dev/null)
if [ ! -z "$FRONTEND_PORT_PIDS" ]; then
    echo -e "${YELLOW}⚠️  端口 3000 被占用，正在清理...${NC}"
    for pid in $FRONTEND_PORT_PIDS; do
        kill -9 $pid 2>/dev/null
    done
    pkill -9 -f "vite.*3000" 2>/dev/null
    sleep 2
    echo -e "${GREEN}✓ 端口 3000 已清理${NC}"
fi

# 启动后端
echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 启动后端服务器...${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"
python3 backend_server.py > "$BACKEND_LOG" 2>&1 &
BACKEND_PID_NUM=$!
echo $BACKEND_PID_NUM > "$BACKEND_PID"
echo -e "${GREEN}✓ 后端启动成功 (PID: $BACKEND_PID_NUM)${NC}"
echo -e "  日志: ${CYAN}$BACKEND_LOG${NC}"

# 等待后端启动
echo -e "${YELLOW}等待后端就绪...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ 后端已就绪${NC}"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ 后端启动超时${NC}"
        echo -e "查看日志: ${CYAN}tail -f $BACKEND_LOG${NC}"
        stop_services
        exit 1
    fi
done

# 启动前端
echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 启动前端开发服务器...${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"
npm run dev > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID_NUM=$!
echo $FRONTEND_PID_NUM > "$FRONTEND_PID"
echo -e "${GREEN}✓ 前端启动成功 (PID: $FRONTEND_PID_NUM)${NC}"
echo -e "  日志: ${CYAN}$FRONTEND_LOG${NC}"

# 等待前端启动
echo -e "${YELLOW}等待前端就绪...${NC}"
sleep 3

# 显示启动信息
echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ 妙音AI 启动成功！${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo ""
echo -e "${PURPLE}📱 访问地址:${NC}"
echo -e "   🌐 本地:   ${CYAN}http://localhost:3000${NC}"
echo -e "   🌐 网络:   ${CYAN}http://$(ipconfig getifaddr en0 2>/dev/null || echo '获取失败'):3000${NC}"
echo ""
echo -e "${PURPLE}🔧 API 地址:${NC}"
echo -e "   🔌 后端:   ${CYAN}http://localhost:5001/api${NC}"
echo ""
echo -e "${PURPLE}📋 日志文件:${NC}"
echo -e "   📄 后端:   ${CYAN}$BACKEND_LOG${NC}"
echo -e "   📄 前端:   ${CYAN}$FRONTEND_LOG${NC}"
echo ""
echo -e "${PURPLE}💡 实用命令:${NC}"
echo -e "   查看后端日志: ${CYAN}tail -f $BACKEND_LOG${NC}"
echo -e "   查看前端日志: ${CYAN}tail -f $FRONTEND_LOG${NC}"
echo -e "   停止服务:     ${CYAN}./stop.sh${NC} 或按 ${YELLOW}Ctrl+C${NC}"
echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"
echo ""

# 持续运行，等待用户按 Ctrl+C
while true; do
    # 检查后端是否还在运行
    if ! ps -p $BACKEND_PID_NUM > /dev/null 2>&1; then
        echo -e "\n${RED}❌ 后端已停止运行${NC}"
        echo -e "查看日志: ${CYAN}tail -f $BACKEND_LOG${NC}"
        stop_services
        exit 1
    fi

    # 检查前端是否还在运行
    if ! ps -p $FRONTEND_PID_NUM > /dev/null 2>&1; then
        echo -e "\n${RED}❌ 前端已停止运行${NC}"
        echo -e "查看日志: ${CYAN}tail -f $FRONTEND_LOG${NC}"
        stop_services
        exit 1
    fi

    sleep 5
done
