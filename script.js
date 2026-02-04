document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const display = document.getElementById('chatDisplay');

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Добавляем сообщение пользователя
        display.innerHTML += `<div class="user-msg">${text}</div>`;
        input.value = "";
        
        const loadingId = "ai-" + Date.now();
        display.innerHTML += `<div class="ai-msg" id="${loadingId}">⚙️ Analyzing code...</div>`;
        display.scrollTop = display.scrollHeight;

        try {
            const response = await fetch(GROQ_URL, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${GROQ_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    model: "llama-3.3-70b-versatile", 
                    messages: [
                        { 
                            role: "system", 
                            content: "You are an expert Coding Assistant. Help with programming, debugging, and architecture. Always wrap code in triple backticks." 
                        },
                        { role: "user", content: text }
                    ],
                    temperature: 0.4
                })
            });

            const data = await response.json();
            const aiText = data.choices[0].message.content;
            
            // Рендерим Markdown
            document.getElementById(loadingId).innerHTML = `<strong>Neural Assistant:</strong><br>${marked.parse(aiText)}`;

        } catch (error) {
            document.getElementById(loadingId).innerText = "[CRITICAL ERROR]: Connection lost.";
        }
        display.scrollTop = display.scrollHeight;
    }

    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
});
};
