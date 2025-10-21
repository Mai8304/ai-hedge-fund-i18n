# AI Hedge Fund 多语言增强版

本项目基于开源项目 [ai-hedge-fund](https://github.com/virattt/ai-hedge-fund) 二次开发，在原有「多智能体投研 + 流程编排 + 回测」能力基础上，重点增强了多语言体验与界面可用性，适合需要跨语言团队协作或面向全球用户的场景。

---

## 🔄 相比原版的主要优化

| 功能 | 原版 | 本仓库改进 |
|------|------|------------|
| 多语言支持 | 命令行输出可选语言，Web UI 主要为英文 | **全局多语言**：Web UI + 流程输出 + 侧边栏/弹窗文案全面支持 EN/CN/JA/KO/AR/FR/DE，内建翻译字典与语言切换面板 |
| 文案管理 | 零散字符串、缺少翻译回退 | 引入统一翻译上下文，所有可见文案通过 `useTranslation` 输出，确保语言切换一致且可维护 |
| Flow 管理体验 | 流程列表为英文提示 | 流程列表、状态、弹窗、搜索框全面汉化，可根据用户语言调整时间格式与按钮文案 |
| API 密钥 & 模型设置 | 多处英文 | 设置页面支持多语言文本，API 密钥类别说明 & 错误提示也可本地化 |
| 样式一致性 | 部分弹窗未对齐主题 | 调整上下文菜单/弹窗背景使用主题 token，深浅色模式保持一致 |
| 语言配置 | CLI + Web 可切换 | 增强语言状态持久化，Web 端语言切换即刻生效，提示说明均同步更新 |

> 原项目所有智能体、回测、流程编排特性保持一致，本仓库在此基础上专注国际化与体验提升，方便被 Fork、品牌化或整合至多语言产品中。

---

## ✨ 核心能力总览

- **多智能体投研体系**：内置十余位投资风格化身（巴菲特、木头姐等），可编排协同作业。
- **可视化流程编排**：可视化拖拽节点、保存模板，实时查看智能体推理进度。
- **支持多模型引擎**：OpenAI / Anthropic / DeepSeek / Groq / Google / OpenRouter / Ollama。
- **回测与执行**：提供区间回测、信号分析、持仓曝光等经典量化指标。
- **本地与云端灵活部署**：Poetry 管理 Python 依赖，前端 Vite + React，自宿主运行即可。

---

## 🛠 环境准备

| 组件            | 推荐版本                  |
|-----------------|---------------------------|
| Python          | 3.11+                     |
| Poetry          | 1.6+                      |
| Node.js         | 18 LTS / 20 LTS           |
| pnpm / npm      | 任意                      |
| Ollama（可选）  | 用于本地模型推理          |

---

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/<your-account>/ai-hedge-fund-i18n.git
cd ai-hedge-fund-i18n
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

在 `.env` 中填入至少一个大模型密钥，例如：

```dotenv
OPENAI_API_KEY=your-openai-key
FINANCIAL_DATASETS_API_KEY=your-financialdatasets-key
```

若使用本地 Ollama，可省略云端密钥，但需预先安装并拉取模型。

### 3. 安装依赖

```bash
poetry install                    # 后端/核心
cd app/frontend && pnpm install   # 或 npm install
```

### 4. 启动服务

后端（FastAPI）：

```bash
cd app/backend
poetry run uvicorn app.backend.main:app --reload --host 0.0.0.0 --port 8000
```

前端（Vite）：

```bash
cd app/frontend
pnpm dev      # 或 npm run dev
```

访问 `http://localhost:5173` 即可体验多语言界面与流程编排。

---

## ⌨️ 命令行示例

```bash
poetry run python src/main.py \
  --tickers AAPL,MSFT,NVDA \
  --start-date 2024-01-01 \
  --end-date 2024-03-01 \
  --language CN \
  --show-reasoning
```

常用参数与原版一致：

- `--tickers`：股票代码列表（必填，逗号分隔）
- `--language`：输出语言（EN/CN/JA/KO/AR/FR/DE）
- `--model`/`--model-provider`：指定云端模型
- `--ollama`：使用本地 Ollama
- `--show-reasoning`：展示详细推理

回测命令：

```bash
poetry run python src/backtester.py \
  --tickers TSLA,AMZN \
  --start-date 2023-01-01 \
  --end-date 2023-12-31 \
  --language JA
```

---

## 🌐 Web 端多语言体验

- 「设置 → 语言」面板可切换 UI 语言；
- 切换后前端 UI、流程面板、日志、弹窗文案实时变更；
- 命令行和 Web 运行任务的分析报告会同步采用选择的语言；

已内置的翻译（可按需扩展）：

```
EN · English
CN · 简体中文
JA · 日本語
KO · 한국어
AR · العربية
FR · Français
DE · Deutsch
```

继续扩展新语言时，仅需在 `app/frontend/src/locales/` 新增对应 JSON，并注册于 `language-context` 中即可。

---

## 🔐 模型与 API 管理

在 Web 控制台的「设置」可填写以下服务的密钥（同样支持多语言说明）：

| 服务商      | 说明                                  |
|-------------|---------------------------------------|
| OpenAI      | GPT-4o / GPT-4o mini 等               |
| Anthropic   | Claude 系列                           |
| DeepSeek    | deepseek-chat / deepseek-reasoner     |
| Groq        | Groq 托管模型（DeepSeek、Llama3 等）  |
| Google      | Gemini 2.5 Flash / Pro                |
| OpenRouter  | 聚合多家模型                          |
| FinancialDatasets | 行业/财务数据，非必填            |

### 使用本地 Ollama

1. 安装并启动 Ollama
2. Web 设置中开启「Use Ollama」，或 CLI 加 `--ollama`
3. 拉取需要的模型，例如 `ollama pull llama3`

---

## ✅ 测试

```bash
poetry run pytest            # 后端/回测测试
cd app/frontend && pnpm lint # 前端格式检查
```

---

## 🤝 贡献与定制

欢迎针对多语言或新功能提交 Issue / PR：

1. Fork 仓库，新建分支 `feature/your-feature`
2. 开发完成后确保测试通过
3. 提交 PR 描述改动与语言支持情况

如需扩展新的语言包，可以直接复制 `en.json` 为模版，翻译后在 `language-context.tsx` 注册即可。

---

## 📄 许可协议

本项目基于原项目相同的 [MIT License](LICENSE) 许可发布。欢迎在遵循许可证的前提下自由使用、定制和商用。

---

## 🙏 鸣谢

- 原项目作者 [virattt](https://github.com/virattt) 提供的开源基础设施
- 所有参与翻译与体验优化的贡献者

如果这个多语言版本对你有帮助，欢迎 **Star** 或分享，让更多团队受益。也期待你将实际使用反馈回社区，一起打磨更优秀的投研工具！
