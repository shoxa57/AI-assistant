// CONFIGURATION
const HF_TOKEN = "YOUR_HF_TOKEN_HERE"; 
const MODEL_URL = "https://router.huggingface.co/hf-inference/v1/chat/completions";

const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatDisplay = document.getElementById("chatDisplay");

function saveChatHistory() {
    localStorage.setItem("ai_assistant_history", chatDisplay.innerHTML);
}

function loadChatHistory() {
    const savedData = localStorage.getItem("ai_assistant_history");
    if (savedData) {
        chatDisplay.innerHTML = savedData;
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    chatDisplay.innerHTML += `<div class="user-msg">${text}</div>`;
    userInput.value = "";
    
    const loadingId = "loading-" + Date.now();
    chatDisplay.innerHTML += `<div class="ai-msg" id="${loadingId}">[THINKING...]</div>`;
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    
    saveChatHistory(); 

    try {
        const response = await fetch(MODEL_URL, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                model: "mistralai/Mistral-7B-Instruct-v0.2",
                messages: [{ role: "user", content: text }],
                max_tokens: 500
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Рендерим Markdown
        document.getElementById(loadingId).innerHTML = marked.parse(aiResponse);
        
    } catch (error) {
        document.getElementById(loadingId).innerText = "[ERROR]: Connection lost.";
    }
    
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    saveChatHistory(); // 
}


window.onload = loadChatHistory;


sendBtn.onclick = sendMessage;


userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});


document.getElementById("clearChat").onclick = () => {
    if (confirm("Wipe all memory cores?")) {
        chatDisplay.innerHTML = `<div class="ai-msg">Memory cleared. Ready for input.</div>`;
        localStorage.removeItem("ai_assistant_history");
    }
};