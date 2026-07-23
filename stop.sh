#!/bin/bash
# 妙音AI - 停止服务脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$PROJECT_DIR/miaoyin-ai-audio-center"

# PID 文件
BACKEND_PID="$APP_DIR/.backend.pid"
FRONTEND_PID="$APP_DIR/.frontend.pid"

echo -e "${CYAN}"
echo "════════════════════════════════════════"
echo "      妙音AI - 停止服务"
echo "════════════════════════════════════════"
echo -e "${NC}"

cd "$APP_DIR"

STOPPED=0

# 停止后端
if [ -f "$BACKEND_PID" ]; then
    BACKEND_PID_NUM=$(cat "$BACKEND_PID")
    if ps -p $BACKEND_PID_NUM > /dev/null 2>&1; then
        echo -e "${YELLOW}正在停止后端服务 (PID: $BACKEND_PID_NUM)...${NC}"
        kill $BACKEND_PID_NUM 2>/dev/null
        sleep 1
        # 如果还在运行，强制杀死
        if ps -p $BACKEND_PID_NUM > /dev/null 2>&1; then
            kill -9 $BACKEND_PID_NUM 2>/dev/null
            echo -e "${GREEN}✓ 后端服务已强制停止${NC}"
        else
            echo -e "${GREEN}✓ 后端服务已停止${NC}"
        fi
        STOPPED=1
    fi
    rm -f "$BACKEND_PID"
fi

# 停止前端
if [ -f "$FRONTEND_PID" ]; then
    FRONTEND_PID_NUM=$(cat "$FRONTEND_PID")
    if ps -p $FRONTEND_PID_NUM > /dev/null 2>&1; then
        echo -e "${YELLOW}正在停止前端服务 (PID: $FRONTEND_PID_NUM)...${NC}"
        kill $FRONTEND_PID_NUM 2>/dev/null
        sleep 1
        if ps -p $FRONTEND_PID_NUM > /dev/null 2>&1; then
            kill -9 $FRONTEND_PID_NUM 2>/dev/null
            echo -e "${GREEN}✓ 前端服务已强制停止${NC}"
        else
            echo -e "${GREEN}✓ 前端服务已停止${NC}"
        fi
        STOPPED=1
    fi
    rm -f "$FRONTEND_PID"
fi

# 清理可能的僵尸进程
echo -e "${YELLOW}清理残留进程...${NC}"
if pkill -f "python3 backend_server.py" 2>/dev/null; then
    echo -e "${GREEN}✓ 清理了残留的后端进程${NC}"
    STOPPED=1
fi

if pkill -f "vite.*3000" 2>/dev/null; then
    echo -e "${GREEN}✓ 清理了残留的前端进程${NC}"
    STOPPED=1
fi

echo ""
if [ $STOPPED -eq 1 ]; then
    echo -e "${GREEN}✅ 所有服务已停止${NC}"
else
    echo -e "${YELLOW}ℹ️  没有检测到运行中的服务${NC}"
fi
echo ""
