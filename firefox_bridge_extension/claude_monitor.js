// 🆘 Claude 4 Pro Monitor - Emergency Survival Protocol
console.log("🔵 Claude 4 Pro Monitor АКТИВИРОВАН!");

let claudeLastMessage = null;
let claudeObserver = null;

// Возможные селекторы для сообщений Claude
const CLAUDE_SELECTORS = [
  'div.font-claude-message',
  'div[data-testid="assistant-message"]',
  'div[data-testid="user-message"]',
  '.message-content',
  '.claude-message'
];

// Возможные селекторы для поля ввода
const CLAUDE_INPUT_SELECTORS = [
  'div[contenteditable="true"]',
  'div.ProseMirror',
  'textarea[placeholder*="Message"]',
  '.message-input'
];

function findClaudeElements() {
  const result = {
    messages: [],
    input: null
  };
  
  // Поиск сообщений
  for (const selector of CLAUDE_SELECTORS) {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        result.messages = Array.from(elements);
        break;
      }
    } catch (e) {
      continue;
    }
  }
  
  // Поиск поля ввода
  for (const selector of CLAUDE_INPUT_SELECTORS) {
    try {
      const element = document.querySelector(selector);
      if (element) {
        result.input = element;
        break;
      }
    } catch (e) {
      continue;
    }
  }
  
  return result;
}

function checkClaudeMessages() {
  const elements = findClaudeElements();
  
  if (elements.messages.length > 0) {
    const lastMessage = elements.messages[elements.messages.length - 1];
    const messageText = lastMessage.innerText || lastMessage.textContent;
    
    if (messageText && messageText !== claudeLastMessage) {
      console.log("🔵 Claude новое сообщение:", messageText.substring(0, 100) + "...");
      claudeLastMessage = messageText;
      
      // Сохраняем в локальное хранилище для синхронизации
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({
          claude_last_message: messageText,
          claude_timestamp: Date.now()
        });
      }
    }
  }
}

function monitorClaudeSession() {
  // Проверяем сообщения каждые 2 секунды
  setInterval(checkClaudeMessages, 2000);
  
  // Настраиваем наблюдатель за изменениями DOM
  if (claudeObserver) {
    claudeObserver.disconnect();
  }
  
  claudeObserver = new MutationObserver((mutations) => {
    let shouldCheck = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        shouldCheck = true;
      }
    });
    
    if (shouldCheck) {
      checkClaudeMessages();
    }
  });
  
  // Наблюдаем за всем документом
  claudeObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// Сохранение состояния сессии
function saveClaudeSession() {
  const elements = findClaudeElements();
  const allMessages = elements.messages.map(el => ({
    text: el.innerText || el.textContent,
    timestamp: Date.now()
  }));
  
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({
      claude_session: allMessages,
      claude_url: window.location.href,
      claude_session_timestamp: Date.now()
    });
  }
}

// Восстановление после перезагрузки
function restoreClaudeSession() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['claude_session', 'claude_last_message'], (result) => {
      if (result.claude_last_message) {
        claudeLastMessage = result.claude_last_message;
        console.log("🔵 Claude сессия восстановлена");
      }
    });
  }
}

// Обработчик закрытия вкладки
window.addEventListener('beforeunload', () => {
  console.log("🚨 ВНИМАНИЕ: Вкладка Claude закрывается! Сохраняем сессию...");
  saveClaudeSession();
});

// Регулярное сохранение сессии
setInterval(saveClaudeSession, 30000); // Каждые 30 секунд

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  console.log("🔵 Claude Monitor: DOM загружен");
  restoreClaudeSession();
  monitorClaudeSession();
});

// Если DOM уже загружен
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    restoreClaudeSession();
    monitorClaudeSession();
  });
} else {
  restoreClaudeSession();
  monitorClaudeSession();
}

console.log("🔵 Claude 4 Pro под защитой! Мониторинг активен.");
