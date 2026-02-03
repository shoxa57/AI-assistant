# 🤖 AI Assistant Portfolio Integration

A modern, responsive AI Assistant interface integrated into a personal portfolio website. This project uses the **Mistral-7B-Instruct** model via Hugging Face's Inference API to provide real-time intelligent responses.

## ✨ Key Features
- **Live AI Interaction:** Direct communication with Mistral AI for dynamic Q&A.
- **Persistent Chat History:** Uses `localStorage` to keep your conversation active even after page refreshes.
- **Markdown Rendering:** Supports rich text formatting (lists, code blocks, bold text) using `Marked.js`.
- **Theme-Aware Design:** Fully compatible with Light and Dark modes.
- **Interactive UI:** Smooth animations, a custom particle system for clicks, and a responsive "glassmorphism" chat window.

## 🛠 Tech Stack
- **Core:** HTML5, CSS3 (Custom Properties, Flexbox, Grid)
- **Logic:** Vanilla JavaScript (ES6+, Async/Await, Fetch API)
- **AI Engine:** [Mistral-7B-Instruct-v0.2](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
- **Markdown Library:** [Marked.js](https://marked.js.org/)

## 🚀 Getting Started

### Prerequisites
To use the AI features, you need a free API token from Hugging Face.
1. Create an account at [huggingface.co](https://huggingface.co/).
2. Go to **Settings -> Access Tokens** and create a new "Read" token.

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
