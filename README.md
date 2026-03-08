# 🌿 PromptPrint AI Tracker (NEXUS.carbon)

> **Calculate AI Scale. Optimize Emissions.**
> The ultimate carbon profiler for Next-Gen Foundation Models. Auto-detect tokens from AI tools and calculate your real-time carbon footprint.

PromptPrint is a powerful Chrome Extension and Web App built to analyze the hidden environmental cost of AI inference and help users make hyper-efficient, eco-friendly AI choices. 

## ✨ Features

- **Live Telemetry & Token Tracking**: Automatically tracks token usage in real-time when using leading AI chatbots (ChatGPT, Gemini, Claude).
- **Inference Matrix**: Calculate power draw (Wh) and carbon mass (gCO₂) for your prompts across different model architectures (OpenAI, Anthropic, Google, Meta, DeepSeek).
- **Optimization Suggestions**: Instantly discover greener AI models that can process your prompt with a lower environmental impact.
- **Physical World Equivalents**: Translates abstract carbon data into understandable physical metrics (e.g., miles driven, smartphones charged).
- **Protocol Library**: Quick-select from a library of pre-defined prompts and scenarios.
- **Cyber-Aesthetic UI**: An immersive, ultra-modern dark theme built with glassmorphism and performance in mind.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18, Vite
- **Styling**: Tailwind CSS v4, Custom CSS (Glassmorphism & Micro-animations)
- **Routing**: React Router DOM
- **Data Visualization**: Recharts (Smooth Area Charts)
- **Icons**: Lucide React
- **Extension API**: Chrome Extension Manifest V3 (Content Scripts, Service Workers, Storage)

## 🚀 Installation & Usage

### 1. Running the Web App Locally
1. Clone the repository to your local machine.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local server address (usually `http://localhost:5173`).

### 2. Loading as a Chrome Extension
1. Build the final extension bundle:
   ```bash
   npm run build
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** in the top right corner.
4. Click on **"Load unpacked"**.
5. Select the newly generated `dist` folder inside the project directory.
6. The **PromptPrint** extension will now be available in your browser! Pin it to the toolbar for quick access.

## 🌍 Supported Platforms for Live Tracking
The extension's background service worker automatically captures dynamic text input on:
- 🟢 `chatgpt.com`
- 🟢 `claude.ai`
- 🟢 `gemini.google.com`

*Data is stored privately via Chrome's local storage API.*

## 📄 Hackathon Background
This project was developed for the **TreeLine Hackathon**, focusing on promoting sustainable digital architecture and energy-aware coding practices.
