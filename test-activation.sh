#!/bin/bash

echo "========================================="
echo "  声音处理工具 - 功能测试"
echo "========================================="
echo ""

# 1. 检查文件是否存在
echo "✅ 检查必要文件..."
if [ -f "activation-code-generator.html" ]; then
    echo "   ✓ 激活码生成器: activation-code-generator.html"
else
    echo "   ✗ 缺少: activation-code-generator.html"
fi

if [ -f "miaoyin-ai-audio-center/dist/index.html" ]; then
    echo "   ✓ 生产构建: dist/index.html"
else
    echo "   ✗ 需要构建: cd miaoyin-ai-audio-center && npm run build"
fi

echo ""
echo "========================================="
echo "  快速测试指南"
echo "========================================="
echo ""

echo "📋 测试清单："
echo ""
echo "1️⃣  品牌名称检查"
echo "   - 左上角显示 '声音处理工具' ✓"
echo "   - 激活对话框标题正确 ✓"
echo ""

echo "2️⃣  试用限制测试"
echo "   - 显示 '还可以处理 2 个文件'"
echo "   - 处理2次后被拦截"
echo ""

echo "3️⃣  处理按钮测试"
echo "   - 上传文件后可以点击 ✓"
echo "   - 降噪功能可以处理 ✓"
echo "   - 多音轨分离可以处理 ✓"
echo ""

echo "4️⃣  激活流程测试"
echo "   - 点击【激活】按钮弹出对话框 ✓"
echo "   - 只有输入框和激活按钮 ✓"
echo "   - 激活成功自动关闭 ✓"
echo ""

echo "5️⃣  激活码生成器测试"
echo "   - 打开 activation-code-generator.html"
echo "   - 生成单个激活码"
echo "   - 复制并在软件中测试"
echo ""

echo "========================================="
echo "  启动测试环境"
echo "========================================="
echo ""

read -p "按回车键启动开发服务器..." key

cd miaoyin-ai-audio-center
npm run dev &
DEV_PID=$!

sleep 3

echo ""
echo "✅ 服务器已启动: http://localhost:3000"
echo ""
echo "现在打开激活码生成器..."
sleep 1

# 打开激活码生成器
if command -v open &> /dev/null; then
    open ../activation-code-generator.html
fi

sleep 1

# 打开应用
if command -v open &> /dev/null; then
    open http://localhost:3000
fi

echo ""
echo "========================================="
echo "  测试环境已启动"
echo "========================================="
echo ""
echo "🎯 测试步骤："
echo ""
echo "1. 在激活码生成器中生成一个激活码"
echo "2. 在应用中上传音频文件"
echo "3. 点击'开始处理'（处理2次）"
echo "4. 第3次会弹出激活对话框"
echo "5. 输入生成的激活码"
echo "6. 激活成功！"
echo ""
echo "========================================="
echo ""
echo "按 Ctrl+C 停止测试服务器"
echo ""

# 等待用户停止
wait $DEV_PID
