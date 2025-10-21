# AI Hedge Fund 多语言增强版

本项目基于开源项目 [ai-hedge-fund](https://github.com/virattt/ai-hedge-fund) 二次开发，在原有「多智能体投研 + 流程编排 + 回测」能力基础上，重点增强了多语言体验与界面可用性，支持英文（默认），中文，日语，韩语，法语，德语，阿拉伯语。

---

## 🔄 相比原版的主要优化

| 功能 | 原版 | 本仓库改进 |
|------|------|------------|
| 多语言支持 | 命令行输出可选语言，Web UI 主要为英文 | **全局多语言**：Web UI + 流程输出 + 侧边栏/弹窗文案全面支持 EN/CN/JA/KO/AR/FR/DE，内建翻译字典与语言切换面板 |
| 文案管理 | 零散字符串、缺少翻译回退 | 引入统一翻译上下文，所有可见文案通过 `useTranslation` 输出，确保语言切换一致且可维护 |


> 原项目所有智能体、回测、流程编排特性保持一致，本仓库在此基础上专注国际化与体验提升，方便被 Fork、品牌化或整合至多语言产品中。

> **智能体的推理过程仍以英文进行，只对最终展示内容做多语言翻译，以保障分析准确性。**


---

## 🚀 快速开始

在运行 AI Hedge Fund i18n之前，你需要先完成安装并配置 API 密钥。以下步骤适用于 **全栈 Web 应用** 和 **命令行工具（CLI）** 两种方式。

---

### 1. 克隆仓库（Clone the Repository）

```bash
git clone https://github.com/Mai8304/ai-hedge-fund-i18n.git
cd ai-hedge-fund-i18n
```

---

### 2. 设置 API 密钥（Set up API keys）

在项目根目录创建一个 `.env` 文件，用于存放 API 密钥：

```bash
# 在项目根目录创建 .env 文件
cp .env.example .env
```

打开并编辑 `.env` 文件，添加你的 API 密钥：

```bash
# 如果使用 OpenAI 托管的 LLM 模型（gpt-4o、gpt-4o-mini 等）
OPENAI_API_KEY=your-openai-api-key

# 如果需要获取金融数据来驱动 Hedge Fund
FINANCIAL_DATASETS_API_KEY=your-financial-datasets-api-key
```

**重要提示：**  
你必须至少设置一个 LLM API 密钥（如 `OPENAI_API_KEY`、`GROQ_API_KEY`、`ANTHROPIC_API_KEY` 或 `DEEPSEEK_API_KEY`），AI Hedge Fund i18n 才能正常运行。

**金融数据说明：**  
对于 AAPL、GOOGL、MSFT、NVDA 和 TSLA 等股票的数据是免费的，不需要 API 密钥。  
若需访问其他股票，请在 `.env` 文件中设置 `FINANCIAL_DATASETS_API_KEY`。

---

## 如何运行（How to Run）

### ⌨️ 命令行模式（Command Line Interface）

你可以直接通过终端运行 AI Hedge Fund i18n。 
这种方式便于自动化、脚本集成及更精细的控制。


---

#### 快速开始（Quick Start）

1. 安装 Poetry（如果未安装）：
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. 安装依赖：
```bash
poetry install
```

---

#### 运行 AI Hedge Fund i18n
```bash
poetry run python src/main.py --ticker AAPL,MSFT,NVDA
```

你还可以添加 `--ollama` 参数，使用本地部署的 LLM 模型运行：

```bash
poetry run python src/main.py --ticker AAPL,MSFT,NVDA --ollama
```

也可以指定开始与结束日期，以便在特定时间区间内进行决策分析：

```bash
poetry run python src/main.py --ticker AAPL,MSFT,NVDA --start-date 2024-01-01 --end-date 2024-03-01
```

---

#### 运行回测模块（Run the Backtester）
```bash
poetry run python src/backtester.py --ticker AAPL,MSFT,NVDA
```


> 提示：`--ollama`、`--start-date` 和 `--end-date` 参数同样适用于回测模块！

---

### 🖥️ Web 应用（Web Application）

另一种更直观的方式是通过 Web 界面运行 AI Hedge Fund i18n。  
该方式提供了更友好的可视化体验，适合不熟悉命令行的用户。

请参考详细安装与运行指南：  
[查看 Web 应用安装步骤（GitHub 链接）](https://github.com/virattt/ai-hedge-fund/tree/main/app)


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
