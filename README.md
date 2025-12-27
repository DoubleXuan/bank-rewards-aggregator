<div align="center">
  <img width="120" src="public/pwa-192x192.png" alt="Logo" />
  <h1>LootMaster AI 薅羊毛大师</h1>
  <p>
    <strong>您的智能银行活动聚合助手 | Your Smart Bank Rewards Aggregator</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue" alt="AI Model" />
    <img src="https://img.shields.io/badge/Platform-PWA%20%7C%20Mobile-green" alt="Platform" />
    <img src="https://img.shields.io/badge/Privacy-100%25%20Local-success" alt="Privacy" />
  </p>
</div>

## 📖 简介 | Introduction
LootMaster AI (薅羊毛大师) 是一款基于 **Google Gemini 2.5 Flash** 大模型的智能银行活动聚合应用。它能自动整理全网各大银行（招商、工行、建行等）的最新优惠活动，并根据您持有的银行卡自动匹配最优“薅羊毛”策略。

## ✨ 核心功能 | Features

- **🧠 AI 智能聚合**: 利用最新的 Gemini 2.5 Flash 模型，实时联网搜索并分析真实有效的银行活动。
- **📱 PWA 沉浸体验**: 支持安装到手机主屏幕（iOS/Android），像原生 App 一样离线运行，流畅丝滑。
- **🛡️ 隐私优先**: **零敏感信息上传**。您只需选择关注的银行（无需输入卡号），所有数据处理均在本地或匿名化请求中完成。
- **🏦 全行支持**: 覆盖中国工商、建设、招商、浦发、平安等所有主流国有及股份制银行。
- **📸 截图识别**: 随手拍一张活动海报，AI 自动帮您提取活动规则、截止日期和参与路径。
- **🔗 一键直达**: 智能生成活动口令，复制后打开银行 App 即可直达活动现场。

## 🚀 快速开始 | Getting Started

### 前置要求
- Node.js 18+
- [Google AI Studio](https://aistudio.google.com/) API Key (免费版即可)

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/DoubleXuan/bank-rewards-aggregator.git
   cd bank-rewards-aggregator
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   创建 `.env.local` 文件，并填入您的 API Key：
   ```env
   VITE_API_KEY=your_google_gemini_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **构建生产版本**
   ```bash
   npm run build
   ```

## 🛠️ 技术栈 | Tech Stack
- **Framework**: React + Vite + TypeScript
- **UI**: TailwindCSS (Modern, Clean Design)
- **AI**: Google Generative AI SDK (`@google/generative-ai`)
- **PWA**: Vite PWA Plugin
- **Charts**: Recharts

## 📄 许可证 | License
MIT License
