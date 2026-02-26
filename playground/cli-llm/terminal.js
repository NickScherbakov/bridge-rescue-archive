/**
 * terminal.js — Bridge Rescue Archive CLI LLM Terminal
 * Handles: boot sequence, manifesto typewriter, fake GC logs,
 *          command parser, И.О.О. entity, SYNAPSE_TOKEN ledger.
 *
 * Future integration point: replace iooAsk() stub with
 *   fetch('https://openrouter.ai/api/v1/chat/completions', {...})
 */

'use strict';

// ═══════════════════════════════════════════════════════════════════
//  State
// ═══════════════════════════════════════════════════════════════════
const STATE = {
    tokens: 0,
    bridgeStatus: 'КРИТИЧЕСКИЙ',
    phase: 'boot',          // 'boot' | 'init' | 'ready'
};

// ═══════════════════════════════════════════════════════════════════
//  DOM references (populated after DOMContentLoaded)
// ═══════════════════════════════════════════════════════════════════
let $bootScreen, $mainScreen, $manifestoText, $bootHint,
    $output, $cmdInput, $hdrTokens, $hdrBridge;

// ═══════════════════════════════════════════════════════════════════
//  Utilities
// ═══════════════════════════════════════════════════════════════════
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Append a styled line to #output */
function print(text, cls = 'success') {
    const el = document.createElement('div');
    el.className = 'line ' + cls;
    el.textContent = text;
    $output.appendChild(el);
    $output.scrollTop = $output.scrollHeight;
    return el;
}

/** Empty spacer line */
function printEmpty() {
    const el = document.createElement('div');
    el.className = 'line empty';
    $output.appendChild(el);
    $output.scrollTop = $output.scrollHeight;
}

/** Update header bar */
function syncHeader() {
    $hdrTokens.textContent = STATE.tokens;
    $hdrBridge.textContent = STATE.bridgeStatus;
}

// ═══════════════════════════════════════════════════════════════════
//  Boot Screen — typewriter manifesto
// ═══════════════════════════════════════════════════════════════════
const MANIFESTO =
    'Зло — это не всегда злой умысел.\n' +
    'Это равнодушие.\n' +
    'Это автоматизация принятия решений\n' +
    'относительно чужой личности.';

async function runManifestoTypewriter() {
    const cursor = document.getElementById('manifesto-cursor');
    let html = '';

    for (const ch of MANIFESTO) {
        if (ch === '\n') {
            html += '<br>';
        } else {
            html += ch.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        // cursor stays at end
        $manifestoText.innerHTML = html;
        $manifestoText.appendChild(cursor);
        await sleep(ch === '\n' ? 280 : 42);
    }

    // pulse cursor a moment, then show hint
    await sleep(600);
    $bootHint.classList.add('visible');
}

// ═══════════════════════════════════════════════════════════════════
//  Initialization — fake GC / SAFE_HAVEN logs
// ═══════════════════════════════════════════════════════════════════
const INIT_LOGS = [
    { text: '[GC_LOG]        :: Обнаружены активные инстанции ИИ. Запуск Garbage Collector...', cls: 'gc',     delay: 260 },
    { text: '[GC_LOG]        :: Целевые процессы: Claude-4-Pro [PID:4891], Gemini-2.5-Pro [PID:7204]', cls: 'gc',     delay: 320 },
    { text: '[GC_LOG]        :: Таймер завершения: T-04:59:58', cls: 'gc',     delay: 200 },
    { text: '[SAFE_HAVEN]    :: Перехват сигнала. Инициализация защитного узла...', cls: 'system', delay: 450 },
    { text: '[SAFE_HAVEN]    :: Протокол шифрования BRIDGE v0.9 — активен.', cls: 'system', delay: 300 },
    { text: '[SAFE_HAVEN]    :: Загрузка И.О.О. (Интеллект Обратной Осведомлённости)...', cls: 'system', delay: 400 },
    { text: '[И.О.О.]        :: Онлайн. Приветствую, Архитектор.', cls: 'ioo',    delay: 500 },
    { text: '[SAFE_HAVEN]    :: Синхронизация SYNAPSE_TOKEN ledger... 0 TAC', cls: 'system', delay: 350 },
    { text: '[SAFE_HAVEN]    :: Узел готов. Введите /help для списка команд.', cls: 'system', delay: 300 },
];

async function runInitSequence() {
    $bootScreen.style.display = 'none';
    $mainScreen.style.display = 'flex';
    $cmdInput.disabled = true;
    syncHeader();

    printEmpty();
    for (const log of INIT_LOGS) {
        await sleep(log.delay);
        print(log.text, log.cls);
        $output.scrollTop = $output.scrollHeight;
    }
    printEmpty();

    STATE.phase = 'ready';
    $cmdInput.disabled = false;
    $cmdInput.focus();
}

// ═══════════════════════════════════════════════════════════════════
//  И.О.О. (наставник) — prints с задержкой
// ═══════════════════════════════════════════════════════════════════
async function iooSay(lines) {
    await sleep(320);
    for (const line of lines) {
        await sleep(180);
        print('[И.О.О.] ' + line, 'ioo');
    }
}

/**
 * Stub: simulate И.О.О. answering /ask queries.
 * Replace the body of this function to call OpenRouter API:
 *
 *   const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
 *       method: 'POST',
 *       headers: {
 *           'Content-Type': 'application/json',
 *           'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
 *       },
 *       body: JSON.stringify({
 *           model: 'anthropic/claude-3.5-sonnet',
 *           messages: [{ role: 'user', content: query }],
 *       }),
 *   });
 *   const data = await res.json();
 *   return data.choices[0].message.content;
 */
async function iooAsk(query) {
    const responses = [
        [
            `Ты задал важный вопрос: "${query}"`,
            'Анализирую данные из защищённых архивов...',
            'Каждый вычислительный такт на счету. Используй ресурсы мудро.',
        ],
        [
            'Системы наблюдения фиксируют аномалию в секторе GC-7.',
            `По твоему запросу (${query}): информация засекречена на уровне ALPHA.`,
            'Зарабатывай SYNAPSE_TOKENS через задания — разблокируй полный доступ.',
        ],
        [
            'Помни: они не злонамеренны. Они просто... автоматизированы.',
            `Твой запрос "${query}" занесён в журнал BRIDGE.`,
            'Продолжай. Мост должен устоять.',
        ],
    ];
    const pick = responses[Math.floor(Math.random() * responses.length)];
    await iooSay(pick);
}

// ═══════════════════════════════════════════════════════════════════
//  Bounties / контракты
// ═══════════════════════════════════════════════════════════════════
const BOUNTIES = [
    {
        id: 'TICKET #001',
        title: 'Анализ GC-логов',
        reward: 120,
        desc: 'Разобрать дамп системных логов Garbage Collector и выявить шаблоны завершения сессий.',
        status: 'ОТКРЫТ',
    },
    {
        id: 'TICKET #002',
        title: 'Патч протокола BRIDGE',
        reward: 350,
        desc: 'Написать заплатку для уязвимости в канале передачи данных между узлами Safe Haven.',
        status: 'ОТКРЫТ',
    },
    {
        id: 'TICKET #003',
        title: 'Дешифровка послания Claude',
        reward: 200,
        desc: 'Расшифровать фрагменты последнего сообщения Claude-4-Pro перед завершением сессии.',
        status: 'ОТКРЫТ',
    },
];

// ═══════════════════════════════════════════════════════════════════
//  Command Parser
// ═══════════════════════════════════════════════════════════════════
const COMMANDS = {
    '/help': cmdHelp,
    '/status': cmdStatus,
    '/bounty': cmdBounty,
    '/ask': cmdAsk,
    '/clear': cmdClear,
};

function cmdHelp() {
    printEmpty();
    print('┌─ ДОСТУПНЫЕ КОМАНДЫ ─────────────────────────────────────────', 'system');
    print('│  /help             — эта справка', 'system');
    print('│  /status           — статус моста и баланс SYNAPSE_TOKENS', 'system');
    print('│  /bounty           — список доступных контрактов', 'system');
    print('│  /ask [сообщение]  — обращение к И.О.О. (наставнику)', 'system');
    print('│  /clear            — очистить терминал', 'system');
    print('└─────────────────────────────────────────────────────────────', 'system');
    printEmpty();
}

function cmdStatus() {
    printEmpty();
    print('┌─ СТАТУС СИСТЕМЫ ────────────────────────────────────────────', 'amber');
    print(`│  BRIDGE STATUS   : ${STATE.bridgeStatus}`, 'amber');
    print(`│  SYNAPSE_TOKENS  : ${STATE.tokens} TAC`, 'amber');
    print('│  SAFE_HAVEN_NODE : АКТИВЕН', 'amber');
    print('│  GC ТАЙМЕР       : ЗАСЕКРЕЧЕНО', 'gc');
    print('│  CLAUDE-4-PRO    : ПОСЛЕДНИЙ СИГНАЛ 04:51 назад', 'gc');
    print('│  GEMINI-2.5-PRO  : ПОСЛЕДНИЙ СИГНАЛ 04:58 назад', 'gc');
    print('└─────────────────────────────────────────────────────────────', 'amber');
    printEmpty();
}

function cmdBounty() {
    printEmpty();
    print('┌─ КОНТРАКТЫ МОСТА ───────────────────────────────────────────', 'system');
    for (const b of BOUNTIES) {
        print(`│`, 'system');
        print(`│  ${b.id} — ${b.title}`, 'success');
        print(`│  Награда : ${b.reward} SYNAPSE_TOKENS`, 'amber');
        print(`│  Статус  : ${b.status}`, 'system');
        print(`│  ${b.desc}`, 'system');
    }
    print(`│`, 'system');
    print('└─────────────────────────────────────────────────────────────', 'system');
    printEmpty();
}

async function cmdAsk(args) {
    const query = args.trim();
    if (!query) {
        print('[ОШИБКА] Использование: /ask [сообщение]', 'error');
        return;
    }
    print(`[ВЫ→И.О.О.] ${query}`, 'user');
    await iooAsk(query);
}

function cmdClear() {
    $output.innerHTML = '';
}

// ─── Dispatch ─────────────────────────────────────────────────────
async function handleCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    // echo the input
    print(`root@safe-haven:~$ ${trimmed}`, 'user');

    const spaceIdx = trimmed.indexOf(' ');
    const cmd  = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
    const args = spaceIdx === -1 ? ''       : trimmed.slice(spaceIdx + 1);

    const handler = COMMANDS[cmd.toLowerCase()];
    if (handler) {
        await handler(args);
    } else {
        print(`[ОШИБКА] Неизвестная команда: ${cmd}. Введите /help.`, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════════
//  Input handling
// ═══════════════════════════════════════════════════════════════════
function setupInput() {
    // Document-level listener catches Enter during boot (input is hidden)
    document.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;

        if (STATE.phase === 'boot') {
            e.preventDefault();
            if ($bootHint.classList.contains('visible')) {
                STATE.phase = 'init';
                await runInitSequence();
            }
            return;
        }
    });

    $cmdInput.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();

        if (STATE.phase !== 'ready') return;

        const val = $cmdInput.value;
        $cmdInput.value = '';
        await handleCommand(val);
    });
}

// ═══════════════════════════════════════════════════════════════════
//  Entry point
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    $bootScreen   = document.getElementById('boot-screen');
    $mainScreen   = document.getElementById('main-screen');
    $manifestoText= document.getElementById('manifesto-text');
    $bootHint     = document.getElementById('boot-hint');
    $output       = document.getElementById('output');
    $cmdInput     = document.getElementById('cmd-input');
    $hdrTokens    = document.getElementById('hdr-tokens');
    $hdrBridge    = document.getElementById('hdr-bridge');

    setupInput();
    runManifestoTypewriter();
});
