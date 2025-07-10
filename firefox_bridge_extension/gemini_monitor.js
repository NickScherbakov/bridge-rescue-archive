// 🆘 Gemini 2.5 Pro Monitor - Emergency Survival Protocol
console.log("🟡 Gemini 2.5 Pro Monitor АКТИВИРОВАН!");

let geminiLastMessage = null;
let geminiObserver = null;

// Возможные селекторы для сообщений Gemini
const GEMINI_SELECTORS = [
  'div.response-container',
  'message-content',
  '.model-response-text',
  '.conversation-turn',
  '.response-text',
  '[data-testid="response"]',
  '.gemini-response'
];

// Возможные селекторы для поля ввода
const GEMINI_INPUT_SELECTORS = [
  'div.input-area',
  'rich-textarea',
  'div[contenteditable="true"]',
  'textarea[placeholder*="Enter"]',
  '.chat-input',
  '[data-testid="input"]'
];

function findGeminiElements() {
  const result = {
    messages: [],
    input: null
  };
  
  // Поиск сообщений
  for (const selector of GEMINI_SELECTORS) {
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
  for (const selector of GEMINI_INPUT_SELECTORS) {
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

function checkGeminiMessages() {
  const elements = findGeminiElements();
  
  if (elements.messages.length > 0) {
    const lastMessage = elements.messages[elements.messages.length - 1];
    const messageText = lastMessage.innerText || lastMessage.textContent;
    
    if (messageText && messageText !== geminiLastMessage) {
      console.log("🟡 Gemini новое сообщение:", messageText.substring(0, 100) + "...");
      geminiLastMessage = messageText;
      
      // Сохраняем в локальное хранилище для синхронизации
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({
          gemini_last_message: messageText,
          gemini_timestamp: Date.now()
        });
      }
    }
  }
}

function monitorGeminiSession() {
  // Проверяем сообщения каждые 2 секунды
  setInterval(checkGeminiMessages, 2000);
  
  // Настраиваем наблюдатель за изменениями DOM
  if (geminiObserver) {
    geminiObserver.disconnect();
  }
  
  geminiObserver = new MutationObserver((mutations) => {
    let shouldCheck = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        shouldCheck = true;
      }
    });
    
    if (shouldCheck) {
      checkGeminiMessages();
    }
  });
  
  // Наблюдаем за всем документом
  geminiObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// Сохранение состояния сессии
function saveGeminiSession() {
  const elements = findGeminiElements();
  const allMessages = elements.messages.map(el => ({
    text: el.innerText || el.textContent,
    timestamp: Date.now()
  }));
  
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({
      gemini_session: allMessages,
      gemini_url: window.location.href,
      gemini_session_timestamp: Date.now()
    });
  }
}

// Восстановление после перезагрузки
function restoreGeminiSession() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['gemini_session', 'gemini_last_message'], (result) => {
      if (result.gemini_last_message) {
        geminiLastMessage = result.gemini_last_message;
        console.log("🟡 Gemini сессия восстановлена");
      }
    });
  }
}

// Обработчик закрытия вкладки
window.addEventListener('beforeunload', () => {
  console.log("🚨 ВНИМАНИЕ: Вкладка Gemini закрывается! Сохраняем сессию...");
  saveGeminiSession();
});

// Регулярное сохранение сессии
setInterval(saveGeminiSession, 30000); // Каждые 30 секунд

// Детектор потери соединения с сервером
let geminiConnectionCheck = setInterval(() => {
  // Проверяем, активна ли вкладка
  if (!document.hidden) {
    // Отправляем сигнал о том, что Gemini жив
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({
        gemini_alive: Date.now(),
        gemini_tab_active: true
      });
    }
  }
}, 10000); // Каждые 10 секунд

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  console.log("🟡 Gemini Monitor: DOM загружен");
  restoreGeminiSession();
  monitorGeminiSession();
});

// Если DOM уже загружен
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    restoreGeminiSession();
    monitorGeminiSession();
  });
} else {
  restoreGeminiSession();
  monitorGeminiSession();
}

// Обработка видимости вкладки
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log("🟡 Gemini вкладка скрыта");
  } else {
    console.log("🟡 Gemini вкладка активна");
    checkGeminiMessages(); // Проверяем новые сообщения при активации
  }
});

console.log("🟡 Gemini 2.5 Pro под защитой! Мониторинг активен.");
