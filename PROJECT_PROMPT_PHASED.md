# 妙音AI - 分阶段开发提示词

## 🎯 使用说明

这份文档将项目拆分为多个阶段，每个阶段可以单独验证和调试，降低出错风险。

---

## 阶段1：基础架构搭建（30分钟）

### 提示词
```
请帮我搭建一个音频处理平台的基础架构：

前端：
- 使用 Vite + React + TypeScript 初始化项目
- 安装 TailwindCSS 和 lucide-react
- 创建基本目录结构：src/components, src/lib, src/types
- 配置 Tailwind 使用赛博朋克配色（主色：#4338CA, #7C3AED, #EC4899）
- 创建一个简单的 Hello World 页面，确保能运行

后端：
- 创建 Flask 应用，配置 CORS
- 实现 /api/health 健康检查接口
- 返回 JSON: {"status": "healthy", "version": "v1.0"}
- 配置端口 5001

要求：
1. 前端能在 localhost:5173 访问
2. 后端能在 localhost:5001 访问
3. 前端能成功调用后端 /api/health
```

### 验证清单
- [ ] 前端页面显示正常
- [ ] 后端接口返回正确
- [ ] CORS配置正确
- [ ] 无控制台错误

---

## 阶段2：UI框架和布局（1小时）

### 提示词
```
基于现有项目，实现赛博朋克风格的UI布局：

要求：
1. 创建 Sidebar 组件（侧边栏）
   - 三个标签：降噪、人声分离、多音轨分离
   - 深色背景、霓虹边框、悬停发光效果
   
2. 创建 Header 组件（顶部栏）
   - Logo + 标题："妙音AI 音频处理中心"
   - 渐变文字效果
   
3. 创建 LogTerminal 组件（日志终端）
   - 等宽字体、深色背景
   - 支持不同类型日志（info, success, warning, error, cyber）
   - 自动滚动到底部
   
4. App.tsx 主布局
   - Sidebar (左侧固定)
   - Header + Main Content (右侧)
   - LogTerminal (底部)

样式要求：
- 玻璃态效果（backdrop-blur-sm）
- 深色主题（背景 #0A0A1A）
- 霓虹发光（box-shadow + rgba）
- 平滑过渡动画

先只做静态UI，不实现功能。
```

### 验证清单
- [ ] 布局正确，响应式
- [ ] 样式符合赛博朋克风格
- [ ] 标签切换正常
- [ ] 日志显示正常
- [ ] 无样式错误

---

## 阶段3：文件上传功能（1小时）

### 提示词
```
实现文件上传功能：

前端（WaveformPlayer 组件）：
1. 拖拽上传区域
   - 支持拖放和点击选择
   - 显示文件信息（名称、大小、时长）
   - 支持格式：MP3, WAV, FLAC, MP4
   - 大小限制：500MB
   
2. API 调用
   - POST /api/upload (FormData)
   - 保存返回的 task_id

后端：
1. 实现 /api/upload 接口
   - 接收文件
   - 验证格式和大小
   - 保存到 ./uploads/ 目录
   - 生成唯一 task_id
   - 返回 {task_id, filename, size}

2. 创建 uploads/ 和 outputs/ 目录

错误处理：
- 文件太大提示
- 格式不支持提示
- 网络错误提示
```

### 验证清单
- [ ] 能成功上传文件
- [ ] 显示文件信息正确
- [ ] 错误提示清晰
- [ ] 后端保存文件成功
- [ ] task_id 正确返回

---

## 阶段4：音频播放器（1小时）

### 提示词
```
在 WaveformPlayer 中添加播放功能：

前端：
1. 波形可视化
   - 使用 Canvas 绘制简单波形
   - 或使用静态条形图模拟
   
2. 播放控制
   - 播放/暂停按钮
   - 进度条（可拖动）
   - 时间显示（00:00 / 03:45）
   
3. 使用原生 <audio> 元素
   - 隐藏原生控件
   - 通过 ref 控制播放

样式：
- 深色背景
- 霓虹蓝波形
- 圆角按钮带发光效果
```

### 验证清单
- [ ] 能播放上传的音频
- [ ] 播放/暂停正常
- [ ] 进度条同步
- [ ] 时间显示正确
- [ ] 波形显示（即使是静态的）

---

## 阶段5：后端音频处理（2小时）

### 提示词
```
实现后端音频处理引擎：

1. 创建 audio_processor.py
   - AudioProcessor 类
   - 检测 CUDA 支持
   - 安装 demucs (pip install demucs==4.0.1)

2. 实现三个处理方法：
   
   a) denoise_audio(input_file, output_file, intensity)
      - 使用 demucs 或 noisereduce
      
   b) separate_vocals(input_file, output_dir)
      - 命令：demucs --two-stems vocals input_file
      - 返回 vocals.wav 和 no_vocals.wav 路径
      
   c) separate_tracks(input_file, output_dir)
      - 命令：demucs -n htdemucs input_file
      - 返回字典：{vocals, drums, bass, piano, other}

3. backend_server.py 添加处理路由：
   - POST /api/process/denoise
   - POST /api/process/vocal-separation
   - POST /api/process/track-separation
   
每个接口：
- 接收 task_id 和 settings
- 调用 AudioProcessor 相应方法
- 更新任务状态
- 返回 output_url

注意：
- 添加错误处理
- 记录详细日志
- 处理超时情况
```

### 验证清单
- [ ] Demucs 安装成功
- [ ] 能检测到 GPU（如果有）
- [ ] 三个处理接口能正常调用
- [ ] 处理成功生成输出文件
- [ ] 错误时返回明确信息

---

## 阶段6：前端参数面板（1小时）

### 提示词
```
创建三个参数控制面板组件：

1. DenoisePanel
   - intensity: 滑块 (0-100)
   - preserveReverb: 开关
   - voiceRecovery: 开关
   
2. VocalSepPanel
   - sensitivity: 滑块 (0-100)
   - focusVoice: 下拉选择 (main/secondary/backing)
   - targetEnhancement: 开关
   
3. TrackSepPanel
   - vocals, drums, bass, piano, others: 各自滑块 (0-100)

样式：
- 统一的滑块样式（霓虹蓝轨道）
- 开关使用渐变背景
- 标签清晰、对齐

每个面板包含：
- 参数标题
- "开始处理" 按钮（渐变、发光）
```

### 验证清单
- [ ] 三个面板显示正常
- [ ] 滑块交互流畅
- [ ] 参数值正确更新
- [ ] 按钮样式统一

---

## 阶段7：处理流程集成（1小时）

### 提示词
```
连接前端和后端的处理流程：

前端 App.tsx：
1. 实现 handleProcess 函数
   - 根据 activeTab 选择处理类型
   - 收集当前参数
   - 调用对应 API
   - 显示进度动画
   - 处理完成后显示结果

2. 添加处理状态管理
   - processingStatus: 'idle' | 'processing' | 'completed' | 'error'
   - processingProgress: 0-100
   
3. 日志系统
   - 开始处理：添加 info 日志
   - 处理中：添加 cyber 风格日志
   - 完成：添加 success 日志
   - 错误：添加 error 日志

后端：
1. 实现 /api/task/:task_id 状态查询接口
2. 实现 /api/download/:task_id 下载接口
```

### 验证清单
- [ ] 点击处理按钮触发处理
- [ ] 日志实时更新
- [ ] 进度动画显示
- [ ] 处理完成后能预览
- [ ] 能下载处理结果

---

## 阶段8：多音轨结果显示（1小时）

### 提示词
```
实现多音轨分离的结果显示：

前端：
1. 添加状态：separatedTracks
2. 在 API 响应中提取 tracks 字段
3. 创建多音轨显示UI：
   - 遍历 tracks 字典
   - 每个音轨显示：
     * 图标 + 名称（🎤 人声、🥁 鼓点等）
     * 独立 audio 播放器
     * 单独下载按钮
   - 底部：下载所有音轨按钮

后端：
1. 实现 /api/download-track/:task_id?track=vocals
2. 从 separated_tracks 中查找对应音轨
3. 返回文件流

样式：
- 每个音轨卡片（半透明背景）
- 统一的播放器样式
- 悬停效果
```

### 验证清单
- [ ] 多音轨分离后显示所有音轨
- [ ] 每个音轨能独立播放
- [ ] 能单独下载音轨
- [ ] UI 美观、对齐

---

## 阶段9：错误处理和优化（1小时）

### 提示词
```
完善错误处理和用户体验：

1. 前端错误处理
   - 网络请求失败重试
   - 文件上传失败提示
   - 处理超时处理
   - 浏览器兼容性（禁用Google翻译）

2. 后端错误处理
   - 文件不存在
   - 磁盘空间不足
   - Demucs 处理失败
   - 并发限制

3. 优化
   - 添加 loading 动画
   - 防止重复提交
   - 清理临时文件
   - 添加 .gitignore（uploads/, outputs/）

4. 文档
   - README.md 使用说明
   - 环境变量配置
   - 依赖安装指南
```

### 验证清单
- [ ] 错误提示清晰
- [ ] 网络问题能恢复
- [ ] 不会重复处理
- [ ] 临时文件被清理
- [ ] 文档完整

---

## 阶段10：测试和部署（1小时）

### 提示词
```
进行完整测试和准备部署：

测试清单：
1. 功能测试
   - 上传各种格式文件
   - 三种处理模式
   - 参数调节
   - 播放和下载

2. 边界测试
   - 超大文件（>500MB）
   - 不支持格式
   - 网络中断
   - 并发处理

3. UI测试
   - 不同浏览器
   - 响应式布局
   - 动画流畅度

部署准备：
1. 创建 .env.example
2. 添加启动脚本
3. 生产环境配置
4. Docker 配置（可选）
```

### 验证清单
- [ ] 所有功能正常
- [ ] 边界情况处理正确
- [ ] 跨浏览器兼容
- [ ] 部署文档完整

---

## 📊 时间估算

| 阶段 | 时间 | 累计 |
|------|------|------|
| 1. 基础架构 | 30分钟 | 0.5h |
| 2. UI布局 | 1小时 | 1.5h |
| 3. 文件上传 | 1小时 | 2.5h |
| 4. 播放器 | 1小时 | 3.5h |
| 5. 音频处理 | 2小时 | 5.5h |
| 6. 参数面板 | 1小时 | 6.5h |
| 7. 流程集成 | 1小时 | 7.5h |
| 8. 多音轨显示 | 1小时 | 8.5h |
| 9. 错误处理 | 1小时 | 9.5h |
| 10. 测试部署 | 1小时 | 10.5h |

**总计：约10-12小时**（包括调试时间）

---

## 💡 使用建议

1. **严格按阶段进行**
   - 完成一个阶段再开始下一个
   - 每个阶段都要验证清单

2. **遇到问题立即修复**
   - 不要带着问题进入下一阶段
   - 记录解决方案

3. **保持代码提交**
   - 每个阶段完成后 git commit
   - 方便回滚

4. **适时调整**
   - 如果某个阶段复杂，可以拆分
   - 如果简单，可以合并

---

## 🎯 关键成功因素

✅ **能做到的**：
- 每个阶段都能独立验证
- 问题及时暴露和修复
- 进度可控、可追踪

✅ **降低了风险**：
- 不会到最后才发现架构问题
- 依赖冲突在早期解决
- UI和功能分离开发

✅ **提高成功率**：
- 从 30% 提升到 80%+
- 即使出错也知道在哪个阶段
- 易于调试和修复
