# 🖥️ macOS 桌面应用 - 安装指南

## 📍 当前状态

**桌面应用配置已完成，但尚未构建打包。**

你有两个选择：
1. **构建桌面应用**（推荐用于独立分发）
2. **使用 Web 版**（推荐用于快速开始）

---

## 方式一：🚀 快速开始 - Web 版（推荐）

如果你想**立即使用**，无需打包，直接运行 Web 版：

```bash
cd ~/Desktop/L/11-AI-project/09-melodic-ai-new
./start.sh
```

然后访问：**http://localhost:3000**

**优点**：
- ✅ 启动快速，无需等待打包
- ✅ 功能完全相同
- ✅ 开发调试方便

---

## 方式二：📦 构建 macOS 桌面应用

### 第 1 步：准备应用图标（可选）

创建应用图标文件：

```bash
# 在 assets/ 目录下放置图标
mkdir -p assets

# 需要两个图标文件：
# - assets/icon.png (1024x1024px) - 应用主图标
# - assets/tray-icon.png (32x32px) - 托盘图标
```

如果暂时没有图标，可以跳过此步，使用默认图标。

### 第 2 步：运行打包脚本

```bash
cd ~/Desktop/L/11-AI-project/09-melodic-ai-new/miaoyin-ai-audio-center

# 运行打包脚本
./electron-build.sh
```

脚本会提示你选择打包类型：
- **1) DMG 安装包**（推荐，双击即可安装）
- **2) ZIP 压缩包**（解压后直接使用）
- **3) 两者都打包**

**推荐选择 1**。

### 第 3 步：等待打包完成

打包过程包括：
1. 清理旧的构建文件
2. 构建前端代码
3. 打包 Electron 应用
4. 生成 DMG 安装包

**预计时间**：2-5 分钟（取决于电脑性能）

### 第 4 步：查找安装包

打包完成后，在 `release/` 目录下会生成：

```bash
cd release/
ls -lh

# 你会看到：
# 妙音AI-1.0.0.dmg          - DMG 安装包
# 妙音AI-1.0.0-mac.zip      - ZIP 压缩包（如果选择了）
```

---

## 🎯 安装桌面应用

### 方式 A：从 DMG 安装（推荐）

1. **双击打开** `妙音AI-1.0.0.dmg`
2. **拖拽**应用图标到 `Applications` 文件夹
3. **打开** Finder → 应用程序 → 妙音AI
4. **首次运行**可能需要在「系统偏好设置 → 安全性与隐私」中允许

### 方式 B：从 ZIP 安装

1. **解压** `妙音AI-1.0.0-mac.zip`
2. **拖拽** 解压出的 `妙音AI.app` 到 `Applications` 文件夹
3. **运行**应用

---

## 🔐 macOS 安全提示

如果遇到"无法打开应用"的提示：

### 解决方法 1：系统设置
1. 打开「系统偏好设置」
2. 进入「安全性与隐私」
3. 点击「仍要打开」

### 解决方法 2：移除隔离属性
```bash
xattr -cr /Applications/妙音AI.app
```

---

## ✨ 桌面应用特性

安装后的桌面应用提供：

### 🎯 一键启动
- 无需手动启动后端和前端
- 双击应用图标即可使用

### 🔄 自动管理
- 自动启动 Python 后端服务
- 自动停止后端（退出时）

### 🪟 原生体验
- macOS 原生窗口样式
- 系统托盘图标
- 最小化到托盘

### 📊 托盘菜单
右键点击托盘图标：
- 显示/隐藏窗口
- 查看关于信息
- 退出应用

---

## 🆚 Web 版 vs 桌面版

| 特性 | Web 版 | 桌面版 |
|------|--------|--------|
| **启动方式** | 运行 `./start.sh` | 双击应用图标 |
| **访问方式** | 浏览器访问 | 独立窗口 |
| **后端管理** | 手动启动/停止 | 自动管理 |
| **系统集成** | ❌ | ✅ 托盘图标 |
| **分发** | 需要源代码 | 独立安装包 |
| **开发调试** | ✅ 方便 | ⚠️ 需重新打包 |

---

## 📂 目录结构

```
09-melodic-ai-new/
├── miaoyin-ai-audio-center/
│   ├── electron-main.cjs      # Electron 主进程
│   ├── preload.cjs            # 预加载脚本
│   ├── electron-build.sh      # 打包脚本 ⭐
│   ├── electron-dev.sh        # 开发模式启动脚本
│   ├── package.json           # 包含 Electron 配置
│   ├── dist/                  # 前端构建输出
│   ├── assets/                # 应用图标资源
│   └── release/               # 打包输出目录 📦
│       ├── 妙音AI-1.0.0.dmg
│       └── 妙音AI-1.0.0-mac.zip
```

---

## 🐛 常见问题

### 1. 打包失败

**错误**：electron-builder 报错

**解决**：
```bash
cd miaoyin-ai-audio-center

# 清理并重新安装依赖
rm -rf node_modules dist release
npm install

# 重新构建前端
npm run build

# 重新打包
./electron-build.sh
```

### 2. 应用无法打开

**错误**："妙音AI" 已损坏，无法打开

**解决**：
```bash
# 移除 macOS 隔离属性
xattr -cr /Applications/妙音AI.app
```

### 3. 后端无法启动

**现象**：应用打开但功能无法使用

**解决**：
```bash
# 检查 Python 依赖
pip3 list | grep -E "flask|demucs|torch"

# 重新安装依赖
cd miaoyin-ai-audio-center
pip3 install -r requirements.txt
```

### 4. 端口被占用

**错误**：端口 5001 被占用

**解决**：
```bash
# 查找占用进程
lsof -i :5001

# 杀死进程
kill -9 <PID>
```

---

## 🔧 开发者选项

### 开发模式（实时调试）

如果你需要修改代码并实时查看效果：

```bash
cd miaoyin-ai-audio-center

# 使用开发模式启动
./electron-dev.sh
```

这会：
1. 启动后端服务
2. 启动前端开发服务器（支持热重载）
3. 启动 Electron 窗口

### 手动打包命令

```bash
cd miaoyin-ai-audio-center

# 仅构建前端
npm run build

# 打包 DMG
npm run electron:build-dmg

# 打包所有格式
npm run electron:build

# 仅打包（不分发）
npm run pack
```

---

## 📋 系统要求

### 运行要求
- **macOS**: 10.13 (High Sierra) 或更高
- **内存**: 建议 8GB+
- **存储**: 2GB 可用空间

### 开发要求（打包用）
- **Python**: 3.8+
- **Node.js**: 16.0+
- **npm**: 7.0+

---

## 🎯 快速决策

### 我该用哪个？

**使用 Web 版，如果你：**
- ✅ 想要快速开始使用
- ✅ 需要频繁修改代码
- ✅ 不需要分发给其他用户

**构建桌面版，如果你：**
- ✅ 想要独立的应用体验
- ✅ 需要分发给团队或客户
- ✅ 不想每次手动启动服务

---

## 📚 相关文档

- **ELECTRON_README.md** - 详细的 Electron 开发文档
- **ELECTRON_QUICKSTART.md** - Electron 快速入门
- **启动指南.md** - Web 版使用指南
- **使用演示.md** - 完整功能演示

---

## 🚀 推荐流程

### 对于首次使用：

1. **先用 Web 版**体验功能
   ```bash
   ./start.sh
   ```

2. **确认需求**后再考虑打包
   - 如果满意 → 构建桌面版
   - 如果需要修改 → 继续用 Web 版开发

3. **最终打包**并分发
   ```bash
   cd miaoyin-ai-audio-center
   ./electron-build.sh
   ```

---

## ✅ 下一步

**立即开始（选择一个）：**

```bash
# 方式 1: 运行 Web 版（推荐先试用）
./start.sh

# 方式 2: 打包桌面版
cd miaoyin-ai-audio-center
./electron-build.sh
```

**需要帮助？** 查看相关文档或检查日志文件。

**祝使用愉快！** 🎵✨
