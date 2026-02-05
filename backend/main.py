from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import sqlite3
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- БАЗА ДАННЫХ С ПОДДЕРЖКОЙ ПОЛЬЗОВАТЕЛЕЙ ---
def init_db():
    conn = sqlite3.connect("chat_history.db")
    cursor = conn.cursor()
    # Таблица пользователей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE
        )
    ''')
    # Таблица сообщений, привязанная к user_id
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            role TEXT,
            content TEXT,
            timestamp TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def get_or_create_user(username):
    conn = sqlite3.connect("chat_history.db")
    cursor = conn.cursor()
    # Добавляем пользователя, если его нет
    cursor.execute("INSERT OR IGNORE INTO users (username) VALUES (?)", (username,))
    # Берем его ID
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    user_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()
    return user_id

def save_message(user_id, role, content):
    conn = sqlite3.connect("chat_history.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO messages (user_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                   (user_id, role, content, datetime.now().isoformat()))
    conn.commit()
    conn.close()

def get_history(user_id, limit=10):
    conn = sqlite3.connect("chat_history.db")
    cursor = conn.cursor()
    # Берем историю ТОЛЬКО для конкретного пользователя
    cursor.execute("SELECT role, content FROM messages WHERE user_id = ? ORDER BY id DESC LIMIT ?", (user_id, limit))
    history = cursor.fetchall()
    conn.close()
    return [{"role": h[0], "content": h[1]} for h in reversed(history)]

# --- НАСТРОЙКИ AI ---
GROQ_KEY = "Your_API_Key"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# Обновленная модель данных: теперь ждем и имя, и сообщение
class ChatRequest(BaseModel):
    username: str
    message: str

@app.post("/api/chat")
async def chat_with_ai(data: ChatRequest):
    # 1. Получаем ID пользователя по имени
    user_id = get_or_create_user(data.username)
    
    # 2. Сохраняем сообщение пользователя
    save_message(user_id, "user", data.message)
    
    # 3. Получаем историю только этого пользователя
    history = get_history(user_id)
    
    messages_for_ai = [
        {"role": "system", "content": f"You are an AI Assistant talking to {data.username}. Remember their context."}
    ]
    messages_for_ai.extend(history)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GROQ_URL,
                headers={"Authorization": f"Bearer {GROQ_KEY}"},
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": messages_for_ai,
                    "temperature": 0.7
                }
            )
            res_data = response.json()
            ai_text = res_data['choices'][0]['message']['content']
            
            # 4. Сохраняем ответ ИИ для этого пользователя
            save_message(user_id, "assistant", ai_text)
            
            return {"response": ai_text} # Возвращаем только текст ответа
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
