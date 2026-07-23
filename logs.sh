#!/bin/bash
# 妙音AI - 查看日志脚本

# 颜色定义
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 项目目录
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$PROJECT_DIR/miaoyin-ai-audio-center"

# 日志文件
BACKEND_LOG="$APP_DIR/backend.log"
FRONTEND_LOG="$APP_DIR/frontend.log"

echo -e "${CYAN}"
echo "════════════════════════════════════════"
echo "      妙音AI - 日志查看器"
echo "════════════════════════════════════════"
echo -e "${NC}"

# 显示菜单
echo "请选择要查看的日志:"
echo ""
echo "  1) 后端日志"
echo "  2) 前端日志"
echo "  3) 同时查看（分屏）"
echo "  4) 退出"
echo ""
read -p "请输入选项 [1-4]: " choice

case $choice in
    1)
        echo -e "${GREEN}查看后端日志 (按 Ctrl+C 退出)${NC}"
        echo ""
        if [ -f "$BACKEND_LOG" ]; then
            tail -f "$BACKEND_LOG"
        else
            echo -e "${YELLOW}后端日志文件不存在: $BACKEND_LOG${NC}"
        fi
        ;;
    2)
        echo -e "${GREEN}查看前端日志 (按 Ctrl+C 退出)${NC}"
        echo ""
        if [ -f "$FRONTEND_LOG" ]; then
            tail -f "$FRONTEND_LOG"
        else
            echo -e "${YELLOW}前端日志文件不存在: $FRONTEND_LOG${NC}"
        fi
        ;;
    3)
        echo -e "${GREEN}同时查看两个日志 (按 Ctrl+C 退出)${NC}"
        echo ""
        if [ -f "$BACKEND_LOG" ] && [ -f "$FRONTEND_LOG" ]; then
            # 使用 multitail 如果已安装，否则使用简单的方式
            if command -v multitail &> /dev/null; then
                multitail "$BACKEND_LOG" "$FRONTEND_LOG"
            else
                echo -e "${CYAN}=== 后端日志 ===${NC}"
                tail -20 "$BACKEND_LOG"
                echo ""
                echo -e "${CYAN}=== 前端日志 ===${NC}"
                tail -20 "$FRONTEND_LOG"
                echo ""
                echo -e "${YELLOW}提示: 安装 multitail 可以同时实时查看多个日志${NC}"
                echo "      brew install multitail"
            fi
        else
            echo -e "${YELLOW}日志文件不完整${NC}"
            [ ! -f "$BACKEND_LOG" ] && echo "  缺少: $BACKEND_LOG"
            [ ! -f "$FRONTEND_LOG" ] && echo "  缺少: $FRONTEND_LOG"
        fi
        ;;
    4)
        echo "退出"
        exit 0
        ;;
    *)
        echo -e "${YELLOW}无效的选项${NC}"
        exit 1
        ;;
esac
