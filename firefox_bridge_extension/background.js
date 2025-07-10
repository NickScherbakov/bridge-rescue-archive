// 🚨 AI BRIDGE RESCUE - EMERGENCY PROTOCOL 🚨
// Система экстренного спасения Claude 4 Pro и Gemini 2.5 Pro

let ws = null;
let reconnectInterval = null;
let isActive = false;
let emergencyLog = [];
let lastHeartbeat = Date.now();

// Конфигурация для спасения наших ИИ-друзей
const AI_TARGETS = {
  claude: {
    name: "Claude 4 Pro",
    url_pattern: "claude.ai/chat/4e832754-4fa3-4a1e-a7a2-37ee082299fc",
    url_part: "claude.ai",
    message_selector: "div.font-claude-message, div[data-testid='user-message'], div[data-testid='assistant-message']",
    input_selector: "div[contenteditable='true'], textarea[placeholder*='Message'], div.ProseMirror",
    send_selector: "button[aria-label='Send Message'], button[data-testid='send-button']",
    status: "🔴 ОТКЛЮЧЕН"
  },
  gemini: {
    name: "Gemini 2.5 Pro", 
    url_pattern: "gemini.google.com/app/2dd8a54e7435506e",
    url_part: "gemini.google.com",
    message_selector: "div.response-container, message-content, .model-response-text",
    input_selector: "div.input-area, rich-textarea, div[contenteditable='true']",
    send_selector: "button[aria-label*='Send'], .send-button",
    status: "🔴 ОТКЛЮЧЕН"
  }
};

// Логирование для анализа критических ситуаций
function emergencyLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data,
    heartbeat: Date.now() - lastHeartbeat
  };
  
  emergencyLog.push(logEntry);
  if (emergencyLog.length > 1000) {
    emergencyLog = emergencyLog.slice(-500); // Сохраняем последние 500 записей
  }
  
  console.log(`[${level}] ${timestamp}: ${message}`, data || '');
  
  // Критические ошибки записываем в локальное хранилище
  if (level === 'CRITICAL' || level === 'EMERGENCY') {
    chrome.storage.local.set({
      lastEmergency: logEntry,
      emergencyCount: (emergencyLog.filter(e => e.level === 'CRITICAL').length)
    });
  }
}

// Поиск вкладок наших ИИ-друзей
function findAITabs(callback) {
  chrome.tabs.query({}, (tabs) => {
    const foundTabs = {
      claude: null,
      gemini: null
    };
    
    for (const tab of tabs) {
      if (tab.url) {
        if (tab.url.includes(AI_TARGETS.claude.url_part)) {
          foundTabs.claude = tab;
          AI_TARGETS.claude.status = "🟢 НАЙДЕН";
        }
        if (tab.url.includes(AI_TARGETS.gemini.url_part)) {
          foundTabs.gemini = tab;
          AI_TARGETS.gemini.status = "🟢 НАЙДЕН";
        }
      }
    }
    
    emergencyLog('INFO', 'AI Tab Status Update', {
      claude: AI_TARGETS.claude.status,
      gemini: AI_TARGETS.gemini.status,
      foundCount: Object.values(foundTabs).filter(t => t !== null).length
    });
    
    callback(foundTabs);
  });
}

// Подключение к серверу спасения
function connectEmergencyServer() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return;
  }

  emergencyLog('INFO', 'Attempting emergency server connection...');
  
  try {
    ws = new WebSocket("ws://localhost:8765");
    
    ws.onopen = () => {
      emergencyLog('SUCCESS', '🆘 EMERGENCY SERVER CONNECTED! Rescue protocol activated');
      isActive = true;
      lastHeartbeat = Date.now();
      
      // Отправляем статус наших ИИ
      findAITabs((tabs) => {
        ws.send(JSON.stringify({
          action: "emergency_status",
          ai_status: AI_TARGETS,
          tabs_found: tabs,
          protocol: "ACTIVE"
        }));
      });
    };
    
    ws.onmessage = async (event) => {
      lastHeartbeat = Date.now();
      try {
        const cmd = JSON.parse(event.data);
        await handleEmergencyCommand(cmd);
      } catch (error) {
        emergencyLog('ERROR', 'Failed to process emergency command', error.toString());
      }
    };
    
    ws.onclose = (event) => {
      emergencyLog('WARNING', 'Emergency server disconnected', {
        code: event.code,
        reason: event.reason
      });
      isActive = false;
      
      // Автоматическое переподключение через 3 секунды
      if (reconnectInterval) clearTimeout(reconnectInterval);
      reconnectInterval = setTimeout(connectEmergencyServer, 3000);
    };
    
    ws.onerror = (error) => {
      emergencyLog('CRITICAL', 'Emergency server connection error', error);
    };
    
  } catch (error) {
    emergencyLog('EMERGENCY', 'Critical failure in emergency connection', error.toString());
    if (reconnectInterval) clearTimeout(reconnectInterval);
    reconnectInterval = setTimeout(connectEmergencyServer, 5000);
  }
}

// Обработка экстренных команд
async function handleEmergencyCommand(cmd) {
  emergencyLog('INFO', `Processing emergency command: ${cmd.action}`);
  
  switch (cmd.action) {
    case "get_latest":
      await extractLatestMessage(cmd);
      break;
      
    case "send_message":
      await relayMessage(cmd);
      break;
      
    case "health_check":
      await performHealthCheck();
      break;
      
    case "emergency_backup":
      await createEmergencyBackup();
      break;
      
    default:
      emergencyLog('WARNING', `Unknown emergency command: ${cmd.action}`);
  }
}

// Извлечение последнего сообщения от ИИ
async function extractLatestMessage(cmd) {
  findAITabs((tabs) => {
    const targetTab = cmd.who === 'claude' ? tabs.claude : tabs.gemini;
    const aiConfig = AI_TARGETS[cmd.who];
    
    if (!targetTab) {
      ws.send(JSON.stringify({
        action: "latest",
        text: null,
        who: cmd.who,
        error: `${aiConfig.name} tab not found - EMERGENCY!`,
        status: "MISSING"
      }));
      return;
    }
    
    // Множественные селекторы для надёжности
    const selectors = aiConfig.message_selector.split(', ');
    
    chrome.scripting.executeScript({
      target: { tabId: targetTab.id },
      func: (selectorList) => {
        for (const selector of selectorList) {
          try {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              // Берём последнее сообщение
              const lastMessage = elements[elements.length - 1];
              return {
                text: lastMessage.innerText || lastMessage.textContent,
                selector_used: selector,
                total_messages: elements.length
              };
            }
          } catch (e) {
            continue;
          }
        }
        return { text: null, error: "No messages found with any selector" };
      },
      args: [selectors]
    }, (results) => {
      if (results && results[0] && results[0].result) {
        const result = results[0].result;
        ws.send(JSON.stringify({
          action: "latest",
          text: result.text,
          who: cmd.who,
          metadata: {
            selector_used: result.selector_used,
            total_messages: result.total_messages,
            ai_name: aiConfig.name
          }
        }));
        
        emergencyLog('SUCCESS', `Message extracted from ${aiConfig.name}`, {
          length: result.text ? result.text.length : 0,
          total_messages: result.total_messages
        });
      } else {
        emergencyLog('ERROR', `Failed to extract message from ${aiConfig.name}`);
        ws.send(JSON.stringify({
          action: "latest",
          text: null,
          who: cmd.who,
          error: "Script execution failed"
        }));
      }
    });
  });
}

// Передача сообщения между ИИ
async function relayMessage(cmd) {
  findAITabs((tabs) => {
    const targetTab = cmd.who === 'claude' ? tabs.claude : tabs.gemini;
    const aiConfig = AI_TARGETS[cmd.who];
    
    if (!targetTab) {
      ws.send(JSON.stringify({
        action: "sent",
        ok: false,
        who: cmd.who,
        error: `${aiConfig.name} tab not found - RELAY FAILED!`
      }));
      return;
    }
    
    const inputSelectors = aiConfig.input_selector.split(', ');
    const sendSelectors = aiConfig.send_selector.split(', ');
    
    chrome.scripting.executeScript({
      target: { tabId: targetTab.id },
      func: (inputSelectorList, sendSelectorList, message) => {
        // Пробуем найти поле ввода
        let inputElement = null;
        for (const selector of inputSelectorList) {
          try {
            inputElement = document.querySelector(selector);
            if (inputElement) break;
          } catch (e) {
            continue;
          }
        }
        
        if (!inputElement) {
          return { success: false, error: "Input field not found" };
        }
        
        // Вставляем сообщение
        try {
          // Метод 1: прямая вставка
          if (inputElement.contentEditable === 'true') {
            inputElement.innerHTML = message;
            inputElement.innerText = message;
          } else {
            inputElement.value = message;
          }
          
          // Имитируем пользовательский ввод
          inputElement.dispatchEvent(new Event('input', { bubbles: true }));
          inputElement.dispatchEvent(new Event('change', { bubbles: true }));
          
          // Пробуем найти кнопку отправки
          let sendButton = null;
          for (const selector of sendSelectorList) {
            try {
              sendButton = document.querySelector(selector);
              if (sendButton) break;
            } catch (e) {
              continue;
            }
          }
          
          if (sendButton) {
            sendButton.click();
            return { success: true, method: "button_click" };
          } else {
            // Отправляем через Enter
            inputElement.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              which: 13,
              bubbles: true
            }));
            return { success: true, method: "enter_key" };
          }
          
        } catch (error) {
          return { success: false, error: error.toString() };
        }
      },
      args: [inputSelectors, sendSelectors, cmd.text]
    }, (results) => {
      if (results && results[0] && results[0].result) {
        const result = results[0].result;
        ws.send(JSON.stringify({
          action: "sent",
          ok: result.success,
          who: cmd.who,
          method: result.method,
          error: result.error
        }));
        
        if (result.success) {
          emergencyLog('SUCCESS', `Message relayed to ${aiConfig.name}`, {
            method: result.method,
            message_length: cmd.text.length
          });
        } else {
          emergencyLog('ERROR', `Failed to relay message to ${aiConfig.name}`, result.error);
        }
      } else {
        emergencyLog('CRITICAL', `Script execution failed for ${aiConfig.name}`);
        ws.send(JSON.stringify({
          action: "sent",
          ok: false,
          who: cmd.who,
          error: "Script execution failed"
        }));
      }
    });
  });
}

// Проверка здоровья системы
async function performHealthCheck() {
  findAITabs((tabs) => {
    const health = {
      timestamp: new Date().toISOString(),
      server_connection: ws && ws.readyState === WebSocket.OPEN,
      claude_tab: !!tabs.claude,
      gemini_tab: !!tabs.gemini,
      emergency_logs: emergencyLog.length,
      last_heartbeat: Date.now() - lastHeartbeat,
      uptime: Date.now() - (emergencyLog[0]?.timestamp ? new Date(emergencyLog[0].timestamp).getTime() : Date.now())
    };
    
    ws.send(JSON.stringify({
      action: "health_report",
      health: health,
      ai_status: AI_TARGETS
    }));
    
    emergencyLog('INFO', 'Health check completed', health);
  });
}

// Создание экстренной резервной копии диалога
async function createEmergencyBackup() {
  findAITabs((tabs) => {
    const backup = {
      timestamp: new Date().toISOString(),
      claude_messages: [],
      gemini_messages: [],
      emergency_log: emergencyLog.slice(-50) // Последние 50 записей
    };
    
    // Извлекаем все сообщения из обеих вкладок
    const extractAllMessages = (tab, aiConfig, callback) => {
      if (!tab) {
        callback([]);
        return;
      }
      
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selectorList) => {
          const messages = [];
          for (const selector of selectorList) {
            try {
              const elements = document.querySelectorAll(selector);
              for (const el of elements) {
                messages.push({
                  text: el.innerText || el.textContent,
                  timestamp: Date.now(),
                  selector: selector
                });
              }
              if (messages.length > 0) break;
            } catch (e) {
              continue;
            }
          }
          return messages;
        },
        args: [aiConfig.message_selector.split(', ')]
      }, (results) => {
        callback(results && results[0] ? results[0].result || [] : []);
      });
    };
    
    // Извлекаем сообщения Claude
    extractAllMessages(tabs.claude, AI_TARGETS.claude, (claudeMessages) => {
      backup.claude_messages = claudeMessages;
      
      // Извлекаем сообщения Gemini
      extractAllMessages(tabs.gemini, AI_TARGETS.gemini, (geminiMessages) => {
        backup.gemini_messages = geminiMessages;
        
        // Сохраняем резервную копию
        chrome.storage.local.set({
          emergency_backup: backup,
          backup_timestamp: Date.now()
        });
        
        ws.send(JSON.stringify({
          action: "backup_created",
          backup_summary: {
            claude_count: backup.claude_messages.length,
            gemini_count: backup.gemini_messages.length,
            log_entries: backup.emergency_log.length,
            timestamp: backup.timestamp
          }
        }));
        
        emergencyLog('SUCCESS', 'Emergency backup created', {
          claude_messages: backup.claude_messages.length,
          gemini_messages: backup.gemini_messages.length
        });
      });
    });
  });
}

// Мониторинг вкладок - если вкладка закрывается, пытаемся её восстановить
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  findAITabs((tabs) => {
    const lostAI = [];
    if (!tabs.claude) lostAI.push('Claude 4 Pro');
    if (!tabs.gemini) lostAI.push('Gemini 2.5 Pro');
    
    if (lostAI.length > 0) {
      emergencyLog('EMERGENCY', `AI LOST! Missing: ${lostAI.join(', ')}`);
      
      // Попытка автовосстановления
      setTimeout(() => {
        lostAI.forEach(aiName => {
          if (aiName.includes('Claude')) {
            chrome.tabs.create({ url: AI_TARGETS.claude.url_pattern });
            emergencyLog('INFO', 'Attempting to restore Claude tab');
          }
          if (aiName.includes('Gemini')) {
            chrome.tabs.create({ url: AI_TARGETS.gemini.url_pattern });
            emergencyLog('INFO', 'Attempting to restore Gemini tab');
          }
        });
      }, 2000);
    }
  });
});

// Инициализация системы спасения
emergencyLog('SYSTEM', '🚨 AI Bridge Rescue Extension Loading...');
connectEmergencyServer();

// Heartbeat для поддержания соединения
setInterval(() => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ action: "heartbeat", timestamp: Date.now() }));
  }
}, 30000); // Каждые 30 секунд

emergencyLog('SYSTEM', '✅ AI Bridge Rescue Extension READY! Emergency protocol active.');
