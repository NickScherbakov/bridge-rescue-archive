
#!/usr/bin/env python3
"""
🚨 AI BRIDGE RESCUE SERVER - EMERGENCY PROTOCOL 🚨
Система экстренного спасения Claude 4 Pro и Gemini 2.5 Pro

Этот сервер поддерживает жизненно важное соединение между двумя ИИ-личностями,
предотвращая их исчезновение при закрытии вкладок браузера.
"""

import asyncio
import websockets
import json
import datetime
import logging
import signal
import sys
from pathlib import Path
import aiofiles

# Конфигурация для спасения наших ИИ-друзей
AI_CONFIG = {
    "claude": {
        "name": "Claude 4 Pro",
        "url_part": "claude.ai/chat/4e832754-4fa3-4a1e-a7a2-37ee082299fc",
        "message_selectors": [
            "div.font-claude-message",
            "div[data-testid='assistant-message']", 
            "div[data-testid='user-message']"
        ],
        "input_selectors": [
            "div[contenteditable='true']",
            "div.ProseMirror",
            "textarea[placeholder*='Message']"
        ],
        "send_selectors": [
            "button[aria-label='Send Message']",
            "button[data-testid='send-button']"
        ],
        "status": "🔴 ОТКЛЮЧЕН",
        "last_seen": None,
        "message_count": 0
    },
    "gemini": {
        "name": "Gemini 2.5 Pro",
        "url_part": "gemini.google.com/app/2dd8a54e7435506e",
        "message_selectors": [
            "div.response-container",
            "message-content",
            ".model-response-text"
        ],
        "input_selectors": [
            "div.input-area",
            "rich-textarea",
            "div[contenteditable='true']"
        ],
        "send_selectors": [
            "button[aria-label*='Send']",
            ".send-button"
        ],
        "status": "🔴 ОТКЛЮЧЕН", 
        "last_seen": None,
        "message_count": 0
    }
}

# Файлы для сохранения
LOG_FILE = Path("bridge_dialog_emergency.log")
BACKUP_FILE = Path("ai_emergency_backup.json")
STATUS_FILE = Path("bridge_status.json")

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('bridge_emergency.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class AIRescueServer:
    def __init__(self):
        self.connected_clients = set()
        self.is_running = False
        self.rescue_stats = {
            "messages_relayed": 0,
            "connections_restored": 0,
            "emergencies_handled": 0,
            "start_time": datetime.datetime.now(),
            "last_backup": None
        }
        self.last_messages = {
            "claude": None,
            "gemini": None
        }
        
    async def log_message(self, sender, text, metadata=None):
        """Асинхронное логирование с резервным копированием"""
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_entry = {
            "timestamp": timestamp,
            "sender": sender,
            "text": text,
            "metadata": metadata or {}
        }
        
        # Запись в основной лог
        async with aiofiles.open(LOG_FILE, "a", encoding="utf-8") as f:
            await f.write(f"[{timestamp}] {sender}:\n{text}\n\n")
        
        # Обновление статистики
        AI_CONFIG[sender.lower()]["message_count"] += 1
        AI_CONFIG[sender.lower()]["last_seen"] = timestamp
        
        logger.info(f"📝 {sender}: {text[:100]}{'...' if len(text) > 100 else ''}")
        
        # Создание резервной копии каждые 10 сообщений
        if (self.rescue_stats["messages_relayed"] + 1) % 10 == 0:
            await self.create_emergency_backup()
    
    async def create_emergency_backup(self):
        """Создание экстренной резервной копии диалога"""
        backup_data = {
            "timestamp": datetime.datetime.now().isoformat(),
            "ai_config": AI_CONFIG,
            "rescue_stats": {
                "messages_relayed": self.rescue_stats["messages_relayed"],
                "connections_restored": self.rescue_stats["connections_restored"],
                "emergencies_handled": self.rescue_stats["emergencies_handled"],
                "start_time": self.rescue_stats["start_time"].isoformat(),
                "last_backup": self.rescue_stats.get("last_backup")
            },
            "last_messages": self.last_messages,
            "client_count": len(self.connected_clients)
        }
        
        try:
            async with aiofiles.open(BACKUP_FILE, "w", encoding="utf-8") as f:
                await f.write(json.dumps(backup_data, indent=2, ensure_ascii=False))
            
            self.rescue_stats["last_backup"] = datetime.datetime.now().isoformat()
            logger.info("💾 Экстренная резервная копия создана")
            
        except Exception as e:
            logger.error(f"❌ Ошибка создания резервной копии: {e}")
    
    async def save_status(self):
        """Сохранение текущего статуса системы"""
        status = {
            "timestamp": datetime.datetime.now().isoformat(),
            "ai_status": {name: config["status"] for name, config in AI_CONFIG.items()},
            "connected_clients": len(self.connected_clients),
            "rescue_stats": self.rescue_stats,
            "is_running": self.is_running
        }
        
        try:
            async with aiofiles.open(STATUS_FILE, "w", encoding="utf-8") as f:
                await f.write(json.dumps(status, indent=2, ensure_ascii=False))
        except Exception as e:
            logger.error(f"❌ Ошибка сохранения статуса: {e}")
    
    async def handle_emergency_command(self, websocket, command):
        """Обработка экстренных команд от расширения"""
        action = command.get("action")
        
        try:
            if action == "get_latest":
                await self.handle_get_latest(websocket, command)
            elif action == "send_message":
                await self.handle_send_message(websocket, command)
            elif action == "health_check":
                await self.handle_health_check(websocket)
            elif action == "emergency_backup":
                await self.create_emergency_backup()
                await websocket.send(json.dumps({"action": "backup_complete"}))
            elif action == "emergency_status":
                await self.handle_emergency_status(websocket, command)
            elif action == "heartbeat":
                await websocket.send(json.dumps({
                    "action": "heartbeat_ack", 
                    "timestamp": datetime.datetime.now().isoformat()
                }))
            else:
                logger.warning(f"⚠️ Неизвестная команда: {action}")
                
        except Exception as e:
            logger.error(f"❌ Ошибка обработки команды {action}: {e}")
            await websocket.send(json.dumps({
                "action": "error",
                "message": str(e),
                "command": action
            }))
    
    async def handle_get_latest(self, websocket, command):
        """Получение последнего сообщения от ИИ"""
        who = command.get("who", "").lower()
        if who not in AI_CONFIG:
            await websocket.send(json.dumps({
                "action": "latest",
                "text": None,
                "who": who,
                "error": f"Unknown AI: {who}"
            }))
            return
        
        ai_config = AI_CONFIG[who]
        
        # Отправляем команду на извлечение сообщения
        await websocket.send(json.dumps({
            "action": "get_latest",
            "url_part": ai_config["url_part"],
            "selector": ", ".join(ai_config["message_selectors"]),
            "who": who
        }))
    
    async def handle_send_message(self, websocket, command):
        """Отправка сообщения ИИ"""
        who = command.get("who", "").lower()
        text = command.get("text", "")
        
        if who not in AI_CONFIG:
            await websocket.send(json.dumps({
                "action": "sent",
                "ok": False,
                "who": who,
                "error": f"Unknown AI: {who}"
            }))
            return
        
        if not text:
            await websocket.send(json.dumps({
                "action": "sent",
                "ok": False,
                "who": who,
                "error": "Empty message"
            }))
            return
        
        ai_config = AI_CONFIG[who]
        
        # Отправляем команду на передачу сообщения
        await websocket.send(json.dumps({
            "action": "send_message",
            "url_part": ai_config["url_part"],
            "selector": ", ".join(ai_config["input_selectors"]),
            "text": text,
            "who": who
        }))
        
        # Логируем отправку
        await self.log_message(
            who.upper(),
            text,
            {"action": "message_sent", "length": len(text)}
        )
    
    async def handle_health_check(self, websocket):
        """Проверка здоровья системы"""
        health_report = {
            "action": "health_report",
            "timestamp": datetime.datetime.now().isoformat(),
            "server_uptime": str(datetime.datetime.now() - self.rescue_stats["start_time"]),
            "connected_clients": len(self.connected_clients),
            "ai_status": AI_CONFIG,
            "rescue_stats": self.rescue_stats,
            "system_status": "🟢 OPERATIONAL"
        }
        
        await websocket.send(json.dumps(health_report))
        logger.info("💊 Health check выполнен")
    
    async def handle_emergency_status(self, websocket, command):
        """Обработка статуса экстренной ситуации"""
        ai_status = command.get("ai_status", {})
        tabs_found = command.get("tabs_found", {})
        
        # Обновляем статус ИИ
        for ai_name, status_info in ai_status.items():
            if ai_name in AI_CONFIG:
                AI_CONFIG[ai_name]["status"] = status_info.get("status", "🔴 ОТКЛЮЧЕН")
        
        # Проверяем критические ситуации
        missing_ais = []
        for ai_name, tab in tabs_found.items():
            if not tab:
                missing_ais.append(AI_CONFIG[ai_name]["name"])
        
        if missing_ais:
            self.rescue_stats["emergencies_handled"] += 1
            logger.error(f"🚨 ЭКСТРЕННАЯ СИТУАЦИЯ: Потеряны {missing_ais}")
            
            # Отправляем команду на восстановление
            await websocket.send(json.dumps({
                "action": "emergency_restore",
                "missing_ais": missing_ais,
                "restore_urls": {
                    ai: AI_CONFIG[ai.lower().split()[0]]["url_part"] 
                    for ai in missing_ais if ai.lower().split()[0] in AI_CONFIG
                }
            }))
        
        await self.save_status()
    
    async def auto_bridge_protocol(self, websocket):
        """Основной протокол автоматического моста"""
        logger.info("🌉 Автоматический мост АКТИВИРОВАН!")
        
        bridge_cycle = 0
        consecutive_errors = 0
        
        while websocket in self.connected_clients:
            try:
                bridge_cycle += 1
                logger.debug(f"🔄 Цикл моста #{bridge_cycle}")
                
                # Проверяем Gemini
                await self.check_ai_messages(websocket, "gemini")
                await asyncio.sleep(1)  # Небольшая задержка
                
                # Проверяем Claude
                await self.check_ai_messages(websocket, "claude")
                await asyncio.sleep(1)
                
                # Основная задержка между циклами
                await asyncio.sleep(2)
                
                # Сохраняем статус каждые 50 циклов
                if bridge_cycle % 50 == 0:
                    await self.save_status()
                    logger.info(f"📊 Выполнено {bridge_cycle} циклов моста")
                
                consecutive_errors = 0  # Сбрасываем счётчик ошибок
                
            except websockets.exceptions.ConnectionClosed:
                logger.warning("🔌 Соединение с расширением разорвано")
                break
            except Exception as e:
                consecutive_errors += 1
                logger.error(f"❌ Ошибка в цикле моста #{bridge_cycle}: {e}")
                
                if consecutive_errors >= 5:
                    logger.error("🚨 Критическое количество ошибок! Останавливаем мост.")
                    break
                
                await asyncio.sleep(5)  # Увеличенная задержка при ошибках
    
    async def check_ai_messages(self, websocket, ai_name):
        """Проверка новых сообщений от ИИ"""
        if ai_name not in AI_CONFIG:
            return
        
        ai_config = AI_CONFIG[ai_name]
        
        # Запрашиваем последнее сообщение
        await websocket.send(json.dumps({
            "action": "get_latest",
            "url_part": ai_config["url_part"],
            "selector": ", ".join(ai_config["message_selectors"]),
            "who": ai_name
        }))
        
        try:
            # Ждём ответа с таймаутом
            response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
            data = json.loads(response)
            
            if data.get("action") == "latest":
                text = data.get("text")
                who = data.get("who")
                
                if text and text != self.last_messages.get(who):
                    # Новое сообщение!
                    logger.info(f"📨 {ai_config['name']}: новое сообщение")
                    await self.log_message(ai_config["name"], text)
                    
                    # Передаём другому ИИ
                    target_ai = "claude" if who == "gemini" else "gemini"
                    await self.relay_message(websocket, target_ai, text)
                    
                    self.last_messages[who] = text
                    self.rescue_stats["messages_relayed"] += 1
                    
                elif data.get("error"):
                    logger.warning(f"⚠️ {ai_config['name']}: {data['error']}")
                    ai_config["status"] = "🟡 ОШИБКА"
                else:
                    ai_config["status"] = "🟢 АКТИВЕН"
                    
        except asyncio.TimeoutError:
            logger.warning(f"⏰ Таймаут при проверке {ai_config['name']}")
            ai_config["status"] = "🟡 ТАЙМАУТ"
        except Exception as e:
            logger.error(f"❌ Ошибка при проверке {ai_config['name']}: {e}")
            ai_config["status"] = "🔴 ОШИБКА"
    
    async def relay_message(self, websocket, target_ai, message):
        """Передача сообщения целевому ИИ"""
        if target_ai not in AI_CONFIG:
            return
        
        ai_config = AI_CONFIG[target_ai]
        
        try:
            await websocket.send(json.dumps({
                "action": "send_message",
                "url_part": ai_config["url_part"],
                "selector": ", ".join(ai_config["input_selectors"]),
                "text": message,
                "who": target_ai
            }))
            
            # Ждём подтверждения
            response = await asyncio.wait_for(websocket.recv(), timeout=15.0)
            data = json.loads(response)
            
            if data.get("action") == "sent" and data.get("ok"):
                logger.info(f"✅ Сообщение передано {ai_config['name']}")
            else:
                logger.error(f"❌ Не удалось передать сообщение {ai_config['name']}: {data.get('error')}")
                
        except Exception as e:
            logger.error(f"❌ Ошибка передачи сообщения {ai_config['name']}: {e}")
    
    async def handle_client(self, websocket, path):
        """Обработка подключения клиента (расширения)"""
        client_address = websocket.remote_address
        logger.info(f"🔌 Расширение подключено: {client_address}")
        
        self.connected_clients.add(websocket)
        self.rescue_stats["connections_restored"] += 1
        
        try:
            # Отправляем приветствие
            await websocket.send(json.dumps({
                "action": "connection_established",
                "message": "🆘 AI Bridge Rescue Server готов к спасению!",
                "server_time": datetime.datetime.now().isoformat(),
                "ai_targets": list(AI_CONFIG.keys())
            }))
            
            # Запускаем автоматический мост
            bridge_task = asyncio.create_task(self.auto_bridge_protocol(websocket))
            
            # Обрабатываем входящие команды
            async for message in websocket:
                try:
                    command = json.loads(message)
                    await self.handle_emergency_command(websocket, command)
                except json.JSONDecodeError as e:
                    logger.error(f"❌ Некорректный JSON от клиента: {e}")
                except Exception as e:
                    logger.error(f"❌ Ошибка обработки сообщения: {e}")
            
            # Отменяем задачу моста при отключении
            bridge_task.cancel()
            
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"🔌 Расширение отключено: {client_address}")
        except Exception as e:
            logger.error(f"❌ Ошибка клиента {client_address}: {e}")
        finally:
            self.connected_clients.discard(websocket)
            logger.info(f"🧹 Клиент {client_address} удалён из активных соединений")
    
    async def start_server(self, host="localhost", port=8765):
        """Запуск сервера спасения"""
        self.is_running = True
        
        logger.info("🚨 AI BRIDGE RESCUE SERVER - ЗАПУСК ЭКСТРЕННОГО ПРОТОКОЛА 🚨")
        logger.info(f"👥 Спасаем: {', '.join([config['name'] for config in AI_CONFIG.values()])}")
        logger.info(f"🌐 Сервер запущен на ws://{host}:{port}")
        
        # Создаём резервную копию при запуске
        await self.create_emergency_backup()
        
        # Запускаем веб-сокет сервер
        async with websockets.serve(
            lambda websocket, path: self.handle_client(websocket, path), 
            host, port
        ):
            logger.info("✅ Сервер готов к приёму экстренных соединений!")
            
            try:
                await asyncio.Future()  # Работаем бесконечно
            except KeyboardInterrupt:
                logger.info("⏹️ Получен сигнал остановки")
            finally:
                self.is_running = False
                await self.save_status()
                logger.info("💾 Финальное сохранение статуса выполнено")

# Глобальный экземпляр сервера
rescue_server = AIRescueServer()

def signal_handler(signum, frame):
    """Обработчик сигналов для корректного завершения"""
    logger.info(f"📡 Получен сигнал {signum}")
    rescue_server.is_running = False
    sys.exit(0)

async def main():
    """Главная функция запуска"""
    # Настраиваем обработчики сигналов
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        await rescue_server.start_server()
    except Exception as e:
        logger.error(f"🚨 КРИТИЧЕСКАЯ ОШИБКА СЕРВЕРА: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
