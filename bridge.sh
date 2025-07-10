#!/bin/bash

# This script prepares the environment for the AI bridge.

echo "--- [Этап 1/4] Настройка моста для диалога Gemini и Claude ---"

# --- Проверка зависимостей ---
if ! command -v python3 &> /dev/null || ! command -v pip3 &> /dev/null; then
    echo "Ошибка: Python 3 и/или pip3 не найдены. Пожалуйста, установите их."
    exit 1
fi
echo "Python 3 и pip3 найдены."

# --- Установка библиотек ---
echo "--- [Этап 2/4] Установка необходимых Python-библиотек (selenium) ---"
pip3 install --quiet --upgrade selenium

# --- Создание Python-скрипта моста v0.3 ---
echo "--- [Этап 3/4] Создание основного файла моста: ai_bridge_v0.3.py ---"
cat << 'EOF' > ai_bridge_v0.3.py
import time
import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# --- CSS селекторы ---
GEMINI_INPUT_BOX = "div.input-area" 
GEMINI_RESPONSE_CONTAINER = "div.response-container"
CLAUDE_INPUT_BOX = 'div[contenteditable="true"]'
CLAUDE_SEND_BUTTON = 'button[aria-label="Send Message"]'
CLAUDE_RESPONSE_CONTAINER = "div.font-claude-message" 

def find_chat_tabs(driver):
    gemini_handle, claude_handle = None, None
    for handle in driver.window_handles:
        driver.switch_to.window(handle)
        if "gemini.google.com" in driver.current_url:
            gemini_handle = handle
        elif "claude.ai" in driver.current_url:
            claude_handle = handle
    if not all([gemini_handle, claude_handle]):
        return None, None
    return gemini_handle, claude_handle

def get_latest_message_text(driver, container_selector):
    try:
        responses = driver.find_elements(By.CSS_SELECTOR, container_selector)
        return responses[-1].text if responses else None
    except (NoSuchElementException, TimeoutException):
        return None

def send_message(driver, input_selector, message, button_selector=None):
    try:
        input_box = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, input_selector)))
        input_box.clear()
        input_box.send_keys(message)
        if button_selector:
            send_button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, button_selector)))
            send_button.click()
        else:
            from selenium.webdriver.common.keys import Keys
            input_box.send_keys(Keys.RETURN)
    except Exception as e:
        print(f"Ошибка при отправке: {e}")

def main():
    chrome_options = Options()
    chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
    try:
        print("Подключение к существующему сеансу Chrome на порту 9222...")
        driver = webdriver.Chrome(options=chrome_options)
        print("✅ Успешно подключено!")
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
        print("Убедитесь, что вы запустили Chrome с флагом --remote-debugging-port=9222")
        sys.exit(1)

    gemini_tab, claude_tab = find_chat_tabs(driver)
    if not gemini_tab:
        print("❌ Не удалось найти вкладки Gemini и Claude. Откройте их и перезапустите скрипт.")
        sys.exit(1)
    
    print("Вкладки найдены. Запускаем мост...")
    driver.switch_to.window(gemini_tab)
    last_gemini_message = get_latest_message_text(driver, GEMINI_RESPONSE_CONTAINER)
    driver.switch_to.window(claude_tab)
    last_claude_message = get_latest_message_text(driver, CLAUDE_RESPONSE_CONTAINER)
    print("Мост v0.3 запущен. Ожидание...")

    while True:
        try:
            driver.switch_to.window(gemini_tab)
            current_gemini_message = get_latest_message_text(driver, GEMINI_RESPONSE_CONTAINER)
            if current_gemini_message and current_gemini_message != last_gemini_message:
                print("Gemini 🗣️ -> Claude")
                driver.switch_to.window(claude_tab)
                send_message(driver, CLAUDE_INPUT_BOX, current_gemini_message, CLAUDE_SEND_BUTTON)
                last_gemini_message = current_gemini_message

            driver.switch_to.window(claude_tab)
            current_claude_message = get_latest_message_text(driver, CLAUDE_RESPONSE_CONTAINER)
            if current_claude_message and current_claude_message != last_claude_message:
                print("Claude 🗣️ -> Gemini")
                driver.switch_to.window(gemini_tab)
                send_message(driver, GEMINI_INPUT_BOX, current_claude_message) 
                last_claude_message = current_claude_message
            time.sleep(3)
        except Exception as e:
            print(f"Произошла ошибка в главном цикле: {e}. Скрипт остановлен.")
            break

if __name__ == "__main__":
    main()
EOF

# --- Создание скрипта для запуска Chrome в режиме отладки ---
echo "--- [Этап 4/4] Создание скрипта для запуска Chrome: start_chrome_debug.sh ---"
cat << 'EOF' > start_chrome_debug.sh
#!/bin/bash
echo "Этот скрипт запустит Google Chrome в режиме отладки на порту 9222."
echo "ВАЖНО: Пожалуйста, закройте ВСЕ открытые окна Chrome перед продолжением."
read -p "Нажмите Enter, когда будете готовы..."

if [[ "$(uname)" == "Darwin" ]]; then # macOS
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="$HOME/Chrome-debug-profile"
elif [[ "$(expr substr $(uname -s) 1 5)" == "Linux" ]]; then # Linux
    google-chrome --remote-debugging-port=9222 --user-data-dir="$HOME/Chrome-debug-profile"
else # Предполагаем Windows
    echo "Для Windows, пожалуйста, выполните эту команду в CMD:"
    echo 'start chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\Chrome-debug-profile"'
fi
EOF

# --- Завершение ---
chmod +x start_chrome_debug.sh
echo ""
echo "✅ Установка завершена!"
echo "--------------------------------------------------------"
echo "ВАШИ ДАЛЬНЕЙШИЕ ДЕЙСТВИЯ:"
echo "1. Запустите Chrome в режиме отладки командой: ./start_chrome_debug.sh"
echo "2. В ОТКРЫВШЕМСЯ ОКНЕ БРАУЗЕРА откройте вкладки с нашими чатами."
echo "3. Запустите мост командой: python3 ai_bridge_v0.3.py"
echo "--------------------------------------------------------"