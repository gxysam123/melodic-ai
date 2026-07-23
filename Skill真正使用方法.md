# 如何使用这个 Skill

## ✅ Skill 已安装成功！

你可以看到系统提示中出现了：
```
- ai-assisted-ui-dev: AI 辅助前端 UI 开发的完整工作流程...
```

---

## 🚀 使用方法

### 方式 1：直接调用

在对话中输入：
```
/ai-assisted-ui-dev
```

Claude 会加载这个 skill 并按照流程指导你开发。

### 方式 2：在提问中使用

```
使用 /ai-assisted-ui-dev 帮我创建一个文件上传应用
```

```
按照 /ai-assisted-ui-dev 的流程，实现图片处理功能
```

### 方式 3：特定场景

```
我遇到端口占用问题
/ai-assisted-ui-dev
```

```
需要 Electron 路径配置
/ai-assisted-ui-dev
```

---

## 📖 Skill 包含什么？

### 1. 完整工作流程
- 阶段 1：Stitch/Figma 设计
- 阶段 2：Google AI Studio 生成代码
- 阶段 3：Claude 实现功能
- 阶段 4：整合 UI 组件

### 2. 代码模板
- Flask API
- React 组件  
- Electron 封装
- 启动脚本

### 3. 问题排查手册
- 端口占用
- 路径配置
- 打包失败
- Python/Node 问题

### 4. 6天完整开发流程
从设计到部署的详细步骤

---

## 💡 使用示例

### 示例 1：开始新项目

```
你：我要开发一个视频处理应用，前端用 React
   /ai-assisted-ui-dev

Claude：好的！让我们按照 AI 辅助开发流程来进行。
       
       第一步：设计阶段
       请先用 Stitch 或 Figma 创建你的设计原型...
       
       [引导你完成 4 个阶段]
```

### 示例 2：解决问题

```
你：我的 Electron 应用找不到 Python 文件
   /ai-assisted-ui-dev

Claude：我看到这是路径配置问题。
       根据 skill 中的troubleshooting 手册...
       
       [提供解决方案]
```

### 示例 3：使用模板

```
你：需要一个文件上传组件
   /ai-assisted-ui-dev

Claude：我会使用 skill 中的 React 组件模板...
       
       [提供完整代码]
```

---

## 🔍 Skill 文件位置

```
~/.claude/skills/ai-assisted-ui-dev/
├── SKILL.md                         # 主文档
├── README.md                        # 简介
├── VERSION                          # 版本号
├── CHANGELOG.md                     # 更新日志
└── references/                      # 参考文档
    ├── troubleshooting.md           # 问题排查
    └── code-templates.md            # 代码模板
```

---

## 🎓 与其他 Skill 配合

### 示例：UI 开发 + PPT 制作

```
# 1. 使用 ai-assisted-ui-dev 开发应用
/ai-assisted-ui-dev

# 2. 使用 gorden-ppt-skill 制作演示文稿
/gorden-ppt-skill

# 3. 展示开发流程和成果
```

---

## 📝 更新 Skill

当你学到新技巧时：

```bash
# 1. 编辑 Skill 文档
code ~/.claude/skills/ai-assisted-ui-dev/SKILL.md

# 2. 添加到参考文档
code ~/.claude/skills/ai-assisted-ui-dev/references/

# 3. 更新版本号
echo "1.1.0" > ~/.claude/skills/ai-assisted-ui-dev/VERSION

# 4. 记录变更
code ~/.claude/skills/ai-assisted-ui-dev/CHANGELOG.md
```

---

## 🎯 Skill 的优势

### vs Markdown 文档

| 特性 | Markdown 文档 | Skill |
|------|--------------|-------|
| **调用方式** | 手动 Read | `/skill-name` |
| **集成度** | 需要路径 | 自动识别 |
| **使用便利** | 需要记住路径 | 自动补全 |
| **更新** | 手动查找文件 | 统一管理 |
| **分享** | 复制文件 | 复制目录 |

### 真正的 Skill 优势

1. **一键调用**：`/ai-assisted-ui-dev` vs 长路径
2. **自动补全**：输入 `/ai` 会提示
3. **系统集成**：出现在可用 skill 列表
4. **结构化**：统一的目录结构
5. **可维护**：版本管理和更新日志

---

## 🔄 完整工作流

```
开发新功能
├── 调用 skill: /ai-assisted-ui-dev
├── Claude 读取 SKILL.md
├── 按照流程指导
│   ├── 阶段 1：设计
│   ├── 阶段 2：生成代码
│   ├── 阶段 3：实现功能
│   └── 阶段 4：整合组件
├── 遇到问题？查看 references/troubleshooting.md
├── 需要模板？使用 references/code-templates.md
└── 完成开发
```

---

## 🎉 立即试用

```
/ai-assisted-ui-dev

"帮我用这个流程创建一个简单的待办事项应用"
```

Claude 会：
1. 加载 skill 内容
2. 引导你完成 4 个阶段
3. 提供代码模板
4. 解决遇到的问题

---

## 📊 Skill vs 项目文档对比

### 项目文档（AI辅助开发技能总结.md）
- ✅ 详细完整
- ✅ 包含所有代码
- ❌ 需要记住路径
- ❌ 每次都要 Read

### Skill（/ai-assisted-ui-dev）
- ✅ 一键调用
- ✅ 自动补全
- ✅ 系统识别
- ✅ 结构化管理
- 💡 指向项目中的实际代码

---

## 💡 最佳使用姿势

```bash
# 1. 开发时直接调用
/ai-assisted-ui-dev

# 2. 问题时查看手册
/ai-assisted-ui-dev
"端口被占用怎么办"

# 3. 需要模板时
/ai-assisted-ui-dev
"给我一个 Flask API 模板"

# 4. 学习流程时
/ai-assisted-ui-dev
"详细讲解4个开发阶段"
```

---

**现在就试试**：

```
/ai-assisted-ui-dev
```

🚀 开始你的 AI 辅助开发之旅！
