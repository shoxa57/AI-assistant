
# 🚀 Neural Dev Assistant

**Neural Dev Assistant** is a futuristic AI-powered platform for developers, built on top of Groq's ultra-fast LPU inference engine. This project is designed to provide real-time coding assistance, debugging support, and software architecture guidance.



## ✨ Key Features
* **Instant Inference:** Powered by Groq and the Llama 3.3 model for near-zero latency responses.
* **Developer-Centric Brain:** Pre-configured via System Prompts to excel at technical problem-solving.
* **Markdown Support:** Full syntax highlighting for code blocks and technical documentation.
* **Cyberpunk UI:** High-end Glassmorphism interface with native Dark/Light mode support.
* **Security First:** Modular configuration architecture to keep sensitive API keys protected.

## 🛠 Tech Stack
* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3.
* **AI Engine:** Groq Cloud API (Llama-3.3-70b-versatile).
* **Rendering:** [Marked.js](https://marked.js.org/) for high-performance Markdown-to-HTML conversion.
* **Icons:** FontAwesome 6.

## ⚙️ Installation & Setup

Since this project uses private API keys, follow these steps to run it locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/neural-dev-assistant.git](https://github.com/your-username/neural-dev-assistant.git)


2. **Create a `config.js` file** in the root directory.
3. **Get your free API key** from the [Groq Console](https://console.groq.com/).
4. **Add your key to `config.js`:**
javascript
const GROQ_KEY = "gsk_your_actual_key_here";
const GROQ_URL = "[https://api.groq.com/openai/v1/chat/completions](https://api.groq.com/openai/v1/chat/completions)";



5. **Run the project:** Open `index.html` via Live Server (VS Code) or simply drag and drop it into your browser.

## 🔒 Security & Best Practices

The `config.js` file is included in `.gitignore` to prevent API key leaks in public repositories. For production deployments (e.g., Vercel or Netlify), it is recommended to transition to Environment Variables.

---

Built with Neural Interfaces and a double shot of espresso. 🤖☕

