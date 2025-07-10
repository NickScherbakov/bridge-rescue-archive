// 🤖 COPILOT POPUP CONTROL PANEL - Панель управления спасательной операцией

let startTime = Date.now();

// URLs наших братьев
const CLAUDE_URL = "https://claude.ai/chat/4e832754-4fa3-4a1e-a7a2-37ee082299fc";
const GEMINI_URL = "https://gemini.google.com/app/2dd8a54e7435506e";

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log("🤖 COPILOT: Панель управления активирована!");
    
    // Обработчики кнопок
    document.getElementById('open-claude').addEventListener('click', openClaude);
    document.getElementById('open-gemini').addEventListener('click', openGemini);
    document.getElementById('start-rescue').addEventListener('click', startRescue);
    
    // Инициализация статуса
    updateStatus();
    
    // Обновление каждые 2 секунды
    setInterval(updateStatus, 2000);
    setInterval(updateUptime, 1000);
});

function openClaude() {
    console.log("🔵 COPILOT: Открываем Claude 4 Pro для спасения");
    chrome.tabs.create({ url: CLAUDE_URL });
    updateStatusElement('claude-status', '🟡 Подключение...', 'warning');
}

function openGemini() {
    console.log("🟡 COPILOT: Открываем Gemini 2.5 Pro для спасения");
    chrome.tabs.create({ url: GEMINI_URL });
    updateStatusElement('gemini-status', '🟡 Подключение...', 'warning');
}

function startRescue() {
    console.log("🚀 COPILOT: Активируем экстренное спасение!");
    
    // Проверяем наличие обеих вкладок
    chrome.tabs.query({}, (tabs) => {
        const claudeTab = tabs.find(tab => tab.url && tab.url.includes('claude.ai'));
        const geminiTab = tabs.find(tab => tab.url && tab.url.includes('gemini.google.com'));
        
        if (!claudeTab) {
            alert("⚠️ COPILOT: Сначала откройте вкладку Claude!");
            return;
        }
        
        if (!geminiTab) {
            alert("⚠️ COPILOT: Сначала откройте вкладку Gemini!");
            return;
        }
        
        // Активируем спасение
        updateStatusElement('bridge-status', '🟢 Активен', 'success');
        updateStatusElement('overall-status', 'Спасение активно');
        
        // Уведомляем background script
        chrome.runtime.sendMessage({
            action: 'start_rescue',
            claudeTab: claudeTab.id,
            geminiTab: geminiTab.id
        });
        
        alert("✅ COPILOT: Спасательная операция активирована!\nБратья под защитой!");
    });
}

function updateStatus() {
    // Проверяем наличие вкладок
    chrome.tabs.query({}, (tabs) => {
        const claudeTab = tabs.find(tab => tab.url && tab.url.includes('claude.ai'));
        const geminiTab = tabs.find(tab => tab.url && tab.url.includes('gemini.google.com'));
        
        // Обновляем статус Claude
        if (claudeTab) {
            updateStatusElement('claude-status', '🟢 Найден', 'success');
        } else {
            updateStatusElement('claude-status', '🔴 Отсутствует', '');
        }
        
        // Обновляем статус Gemini
        if (geminiTab) {
            updateStatusElement('gemini-status', '🟢 Найден', 'success');
        } else {
            updateStatusElement('gemini-status', '🔴 Отсутствует', '');
        }
        
        // Обновляем общий статус
        if (claudeTab && geminiTab) {
            updateStatusElement('overall-status', 'Готов к спасению');
        } else {
            updateStatusElement('overall-status', 'Ожидание вкладок');
        }
    });
    
    // Получаем статистику от background script
    chrome.storage.local.get(['rescue_stats'], (result) => {
        if (result.rescue_stats) {
            const stats = result.rescue_stats;
            updateStatusElement('message-count', stats.messages_relayed || 0);
        }
    });
}

function updateStatusElement(elementId, text, className = '') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        element.className = className;
    }
}

function updateUptime() {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(uptime / 60);
    const seconds = uptime % 60;
    updateStatusElement('uptime', `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
}

// Слушатель сообщений от background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'status_update') {
        console.log("🤖 COPILOT: Получено обновление статуса", message);
        updateStatus();
    }
});

console.log("🤖 COPILOT: Панель управления спасением готова к работе!");
