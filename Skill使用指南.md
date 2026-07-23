# 📖 Skill 使用指南

## 📍 Skill 文档位置

```
~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md
```

---

## 🎯 什么是 Skill？

Skill 是一个**可复用的开发流程和最佳实践文档**，记录了：
- 完整的工作流程
- 可复用的代码模板
- 问题解决方案
- 经验和技巧

---

## 💡 如何使用这个 Skill？

### 方式 1：作为开发流程指南

当你开始新项目时，按照文档中的流程：

```
第 1 步：设计阶段
├── 打开 AI辅助开发技能总结.md
├── 查看"阶段 1：设计原型"
└── 使用 Stitch/Figma 创建设计

第 2 步：AI 生成代码
├── 查看"阶段 2：AI 优化"
├── 使用 Google AI Studio 生成骨架
└── 参考文档中的提示词模板

第 3 步：功能实现
├── 查看"阶段 3：功能实现"
├── 使用 Claude 实现业务逻辑
└── 参考代码模板

第 4 步：组件整合
├── 查看"阶段 4：组件整合"
└── 复用设计系统
```

---

### 方式 2：作为代码模板库

需要某个功能时，直接复制模板：

#### 示例 1：需要 Flask API
```bash
# 1. 打开文档
open ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md

# 2. 找到"可复用的代码模板"部分
# 3. 复制 Flask API 模板
# 4. 根据需求修改
```

#### 示例 2：需要文件上传组件
```bash
# 1. 查找"React 文件上传组件"
# 2. 复制代码
# 3. 调整样式和功能
# 4. 集成到项目
```

---

### 方式 3：作为问题排查手册

遇到问题时，查找解决方案：

```
遇到端口占用？
└── 查看"技能 4：系统化的问题解决"
    └── 找到端口占用解决方案

遇到路径问题？
└── 查看"路径配置问题"
    └── 复制路径配置模式

打包失败？
└── 查看"打包问题"
    └── 按步骤排查
```

---

## 🔍 快速查找方法

### 在终端中搜索关键词

```bash
# 搜索特定内容
grep -n "Flask" ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md

# 搜索路径问题
grep -n "路径" ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md

# 搜索代码模板
grep -n "模板" ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md
```

### 使用 VS Code 打开

```bash
# 在 VS Code 中打开
code ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md

# 使用 Cmd+F 搜索关键词
```

---

## 📋 实际应用示例

### 场景 1：开发新的音频处理功能

```
1. 查看 Skill 文档中的"完整开发流程示例"
2. 按照 6 天计划执行：
   Day 1: 设计 UI
   Day 2: 前端开发
   Day 3: 后端 API
   Day 4: 集成测试
   Day 5: Electron 封装
   Day 6: 打包分发
```

### 场景 2：遇到 Electron 路径问题

```bash
# 1. 打开 Skill 文档
open ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md

# 2. 搜索"路径配置模式"
# 3. 找到这段代码：

const isDev = process.env.NODE_ENV === 'development';
const resourcePath = isDev
  ? __dirname
  : process.resourcesPath;

# 4. 应用到你的代码
```

### 场景 3：需要创建启动脚本

```bash
# 1. 查找"启动脚本模式"
# 2. 复制模板结构：
#!/bin/bash
# 1. 环境检查
# 2. 依赖检查
# 3. 端口清理
# 4. 服务启动
# 5. 健康检查
# 6. 持续监控

# 3. 参考 start.sh 的完整实现
cat ~/Desktop/L/11-AI-project/09-melodic-ai-new/start.sh
```

---

## 🎓 与 Claude 配合使用

### 在对话中引用 Skill

```
你：我要开发一个新的文件处理应用，
    按照 AI辅助开发技能总结.md 中的流程

Claude：好的！我看到你有完整的开发流程文档。
       让我们按照文档中的 6 个阶段来进行...
```

### 让 Claude 读取 Skill

```
你：Read ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md

Claude：[读取文档内容]

你：按照文档中的 Flask API 模板，
    帮我创建一个图片处理的后端

Claude：好的，我会使用文档中的模板...
```

---

## 📚 Skill 包含的内容

### 1. 工作流程（4个阶段）
- 设计原型（Stitch/Figma）
- AI 优化（Google AI Studio）
- 功能实现（Claude）
- 组件整合

### 2. 核心技能（6个）
- AI 驱动的 UI 开发
- 前后端分离架构
- Web 到桌面迁移
- 系统化问题解决
- 文档驱动开发
- 脚本自动化

### 3. 代码模板（3个）
- Flask API 模板
- React 组件模板
- Electron 主进程模板

### 4. 最佳实践
- 提供上下文的方法
- 分步骤迭代
- 代码审查清单

### 5. 问题解决方案
- 端口占用
- 路径配置
- 打包问题

---

## 🔄 如何更新 Skill

当你遇到新问题或学到新技巧时：

```bash
# 1. 打开文档
code ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md

# 2. 添加新的章节或经验
例如：添加新的代码模板
     添加新的问题解决方案
     更新最佳实践

# 3. 保存
```

---

## 💡 使用技巧

### 技巧 1：创建快捷命令

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
# 快速打开 Skill 文档
alias skill='open ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md'

# 搜索 Skill 文档
skillsearch() {
    grep -n "$1" ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md
}
```

使用：
```bash
# 打开文档
skill

# 搜索内容
skillsearch "Flask"
```

### 技巧 2：打印常用部分

```bash
# 提取所有代码块
sed -n '/```/,/```/p' ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md > code-templates.md
```

### 技巧 3：分享给团队

```bash
# 复制到团队文档库
cp ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md \
   ~/团队文档/开发规范/

# 或创建链接
ln -s ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md \
      ~/常用文档/
```

---

## 🎯 实战演练

### 练习 1：使用 Skill 开发新功能

```
任务：添加视频处理功能

步骤：
1. 打开 AI辅助开发技能总结.md
2. 查看"完整开发流程示例"
3. 按照 Day 1-6 的计划执行
4. 遇到问题时查找对应章节
5. 完成后更新 Skill（如有新经验）
```

### 练习 2：解决打包问题

```
问题：Electron 打包失败

步骤：
1. 打开 Skill 文档
2. 搜索"打包问题"
3. 找到解决方案
4. 应用到项目
5. 记录任何新的发现
```

---

## 📊 Skill 结构图

```
AI辅助开发技能总结.md
├── 工作流程（设计→生成→实现→整合）
├── 6大核心技能
│   ├── AI驱动开发
│   ├── 前后端架构
│   ├── 桌面应用
│   ├── 问题解决
│   ├── 文档编写
│   └── 脚本自动化
├── 代码模板库
│   ├── Flask API
│   ├── React 组件
│   └── Electron 封装
├── 最佳实践
│   ├── 提示词技巧
│   ├── 迭代方法
│   └── 审查清单
├── 问题解决手册
│   ├── 端口占用
│   ├── 路径配置
│   └── 打包失败
└── 学习路径
    ├── 前端开发
    ├── 后端开发
    └── AI协作
```

---

## 🎉 开始使用

### 立即行动

```bash
# 1. 打开 Skill 文档
open ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md

# 2. 快速浏览目录
# 3. 收藏常用章节
# 4. 在下个项目中应用
```

### 持续改进

```
每次项目结束后：
├── 回顾使用了哪些 Skill
├── 记录新的经验
├── 更新代码模板
└── 完善问题解决方案
```

---

## 📖 相关文档

- **完整指南.md** - 项目综合指南
- **NEXT_STEPS.md** - 快速开始
- **修复说明.md** - 具体问题的解决过程

---

**快速开始**：

```bash
open ~/Desktop/L/11-AI-project/09-melodic-ai-new/AI辅助开发技能总结.md
```

**Skill 不是死的文档，而是活的知识库！**

每次使用、每个项目都可以让它更完善 🚀
