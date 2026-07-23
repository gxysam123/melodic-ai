#!/bin/bash

# 妙音AI 激活功能演示脚本

echo "======================================"
echo "  妙音AI 激活功能演示"
echo "======================================"
echo ""

# 检查是否已启动服务
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ 开发服务器已在运行 (http://localhost:3000)"
else
    echo "🚀 启动开发服务器..."
    cd miaoyin-ai-audio-center
    npm run dev &
    sleep 5
    echo "✅ 服务器已启动 (http://localhost:3000)"
fi

echo ""
echo "======================================"
echo "  功能说明"
echo "======================================"
echo ""
echo "1️⃣  试用限制"
echo "   - 未激活时可以试用处理 2 次"
echo "   - 试用次数用完后必须激活"
echo ""
echo "2️⃣  激活功能"
echo "   - 点击左下角【激活】按钮"
echo "   - 输入激活码格式: MIAOYIN-XXXXX-XXXXX-XXXXX-XXXXX"
echo ""
echo "3️⃣  测试激活码"
echo "   - MIAOYIN-DEMO1-DEMO2-DEMO3-DEMO4"
echo "   - MIAOYIN-TEST1-TEST2-TEST3-TEST4"
echo ""
echo "======================================"
echo "  测试步骤"
echo "======================================"
echo ""
echo "第一步：打开浏览器访问 http://localhost:3000"
echo "第二步：查看顶部试用横幅（显示：还可以处理 2 个文件）"
echo "第三步：上传音频文件并处理（消耗1次试用）"
echo "第四步：再次处理（消耗1次试用）"
echo "第五步：第三次处理时会弹出激活对话框"
echo "第六步：输入测试激活码: MIAOYIN-DEMO1-DEMO2-DEMO3-DEMO4"
echo "第七步：激活成功，可以无限使用"
echo ""
echo "======================================"
echo "  重置测试环境"
echo "======================================"
echo ""
echo "在浏览器控制台执行："
echo "localStorage.removeItem('miaoyin_license');"
echo "localStorage.removeItem('miaoyin_trial_count');"
echo "location.reload();"
echo ""
echo "======================================"
echo "  开始测试"
echo "======================================"
echo ""
echo "按任意键打开浏览器..."
read -n 1 -s

# 打开浏览器
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v google-chrome &> /dev/null; then
    google-chrome http://localhost:3000
else
    echo "请手动打开浏览器访问: http://localhost:3000"
fi

echo ""
echo "✨ 祝测试顺利！"
echo ""
