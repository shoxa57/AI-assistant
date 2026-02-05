

// ============================================
// 2. PARTICLE SYSTEM (Эффекты частиц)
// ============================================
class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.particles');
    }
    createParticle(x, y) {
        if (!this.container) return;
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 4;
        const tx = Math.cos(angle) * velocity * 100;
        const ty = Math.sin(angle) * velocity * 100;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        this.container.appendChild(particle);
        setTimeout(() => particle.remove(), 3000);
    }
    burst(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.createParticle(x, y), i * 30);
        }
    }
}
const particleSystem = new ParticleSystem();

// ============================================
// 3. THEME MANAGER (Темная/Светлая тема)
// ============================================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.innerText = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.onclick = () => {
        let theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerText = newTheme === 'dark' ? '☀️' : '🌙';
    };
}

// ============================================
// 4. NAVIGATION & SCROLL (Навигация)
// ============================================
class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }
    init() {
        this.navLinks.forEach(link => {
            link.onclick = (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const section = document.getElementById(targetId);
                if (section) {
                    e.preventDefault();
                    section.scrollIntoView({ behavior: 'smooth' });
                    this.closeMenu();
                }
            };
        });
        if (this.hamburger) {
            this.hamburger.onclick = () => {
                this.navMenu.classList.toggle('active');
                this.hamburger.classList.toggle('active');
            };
        }
    }
    closeMenu() {
        if (this.navMenu) {
            this.navMenu.classList.remove('active');
            this.hamburger.classList.remove('active');
        }
    }
}

// ============================================
// 5. AI CHAT SYSTEM (FIXED)
// ============================================
// Переменная для хранения имени пользователя в течение сессии
let currentUsername = "";

async function sendMessage() {
    const input = document.getElementById("userInput");
    const display = document.getElementById("chatDisplay");
    
    if (!input || !display || !input.value.trim()) return;

    // --- НОВОЕ: Проверка имени пользователя ---
    if (!currentUsername) {
        currentUsername = prompt("Please enter your name to start the secure link:", "Guest");
        if (!currentUsername) currentUsername = "Anonymous"; // Запасной вариант
    }

    const text = input.value.trim();
    display.innerHTML += `<div class="user-msg"><strong>${currentUsername}:</strong> ${text}</div>`;
    input.value = "";
    
    const loadingId = "loading-" + Date.now();
    display.innerHTML += `<div class="ai-msg" id="${loadingId}">[SYSTEM]: Neural Link Established for ${currentUsername}...</div>`;
    display.scrollTop = display.scrollHeight;

    try {
        const response = await fetch("http://127.0.0.1:8000/api/chat", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            // --- ИЗМЕНЕНО: Отправляем и имя, и сообщение ---
            body: JSON.stringify({ 
                username: currentUsername, 
                message: text 
            }) 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Error ${response.status}`);
        }

        const data = await response.json();
        
        // --- ИЗМЕНЕНО: Мы упростили ответ в Python, теперь текст лежит в data.response ---
        const aiText = data.response;
        
        const htmlContent = typeof marked !== 'undefined' ? marked.parse(aiText) : aiText;
        document.getElementById(loadingId).innerHTML = `<strong>AI:</strong> <div class="markdown-body">${htmlContent}</div>`;

    } catch (error) {
        console.error("Backend Error:", error);
        document.getElementById(loadingId).innerText = `[OFFLINE]: Connection failed. Ensure main.py is running!`;
    }
    display.scrollTop = display.scrollHeight;
}

function saveChatHistory() {
    const display = document.getElementById("chatDisplay");
    if (display) {
        localStorage.setItem("chat_history", display.innerHTML);
    }
}

// Загрузка истории при старте
function loadChatHistory() {
    const display = document.getElementById("chatDisplay");
    const saved = localStorage.getItem("chat_history");
    if (saved && display) {
        display.innerHTML = saved;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadChatHistory();

    new Navigation();

    // Слушатель Enter
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
    }

    // Кнопка очистки
    const clearBtn = document.getElementById("clearChat");
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm("Clear chat?")) {
                document.getElementById("chatDisplay").innerHTML = "";
                localStorage.removeItem("chat_history");
            }
        };
    }

    // Анимации при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up, .fade-in-down').forEach(el => observer.observe(el));

    // Частицы при клике
    document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link, .btn, .project-card')) {
            particleSystem.burst(e.clientX, e.clientY, 10);
        }
    });
});


// ============================================
// MOVIE NEXUS - FINAL LOGIC
// ============================================
const TMDB_KEY = 'f18d699584cca1e4e104116ccc977c68';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/original';

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const movieInput = document.getElementById('movieSearch');
    const movieGrid = document.getElementById('movieGrid');
    const closeModal = document.getElementById('closeModal');
    const modal = document.getElementById('movieModal');

    // 1. Загрузка популярных фильмов при старте
    if (movieGrid) {
        fetchMovies(`${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}`);
    }

    // 2. Логика поиска по Enter
    if (movieInput) {
        movieInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = movieInput.value;
                if (query) {
                    fetchMovies(`${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${query}`);
                }
            }
        });
    }

    // 3. Закрытие модального окна
    if (closeModal) {
        closeModal.onclick = () => {
            modal.style.display = 'none';
            document.getElementById('videoContainer').innerHTML = ''; // Чистим плеер
            document.body.style.overflow = 'auto';
        };
    }
});

async function fetchMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderMovies(data.results);
    } catch (err) {
        console.error("Connection failed:", err);
    }
}

function renderMovies(movies) {
    const grid = document.getElementById('movieGrid');
    if (!grid) return;
    grid.innerHTML = '';

    movies.forEach(movie => {
        if (!movie.poster_path) return;
        
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span class="rating-badge">★ ${movie.vote_average.toFixed(1)}</span>
            </div>
        `;

        // Клик открывает плеер
        card.onclick = () => {
            openPlayer(
                movie.id, 
                movie.title, 
                movie.overview, 
                movie.vote_average, 
                movie.release_date
            );
        };

        // Наведение меняет фон сайта
        card.onmouseenter = () => {
            if (movie.backdrop_path) {
                document.body.style.backgroundImage = `linear-gradient(rgba(13, 17, 23, 0.8), rgba(13, 17, 23, 0.8)), url(${TMDB_IMG + movie.backdrop_path})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = 'fixed';
            }
        };

        grid.appendChild(card);
    });
}

function openPlayer(id, title, overview, rating, date) {
    const modal = document.getElementById('movieModal');
    const container = document.getElementById('videoContainer');
    
    // Заполняем данные
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDesc').innerText = overview || "No description available.";
    document.getElementById('modalRating').innerText = `★ ${rating.toFixed(1)}`;
    document.getElementById('modalDate').innerText = date ? date.split('-')[0] : "";

    // Очищаем и вставляем НОВЫЙ iframe с правами доступа
    container.innerHTML = `
        <iframe 
            src="https://vidsrc.to/embed/movie/${id}" 
            style="width: 100%; height: 100%; border: none;" 
            allowfullscreen 
            referrerpolicy="origin"
            allow="autoplay; fullscreen; picture-in-picture">
        </iframe>`;
    
    // Показываем модалку
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

document.addEventListener('DOMContentLoaded', () => {
    new Navigation(); // Инициализация навигации и гамбургера
    initTheme();      // Если хотите, чтобы переключатель темы тоже работал
});