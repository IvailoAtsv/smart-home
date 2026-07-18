/** Shared code / architecture snippets used by test and full plans. */

export const PIPELINE_CHEAT_SHEET = `Wake word (локално на ATOM Echo / Voice PE)
    → аудио към Home Assistant
    → STT (Home Assistant Cloud, Whisper или Speech-to-Phrase)
    → Assist / автоматизация с изречение
    → Shelly switch / light.turn_on
    → TTS / бийп обратно към сателита`;

export const ARCHITECTURE_OVERVIEW_TEST = `Apple Silicon Mac
  └── UTM → временна Home Assistant OS VM
        └── Assist (първо с Home Assistant Cloud)

Локална Wi-Fi (2.4 GHz)
  ├── Shelly → лампа
  └── ATOM Echo → микрофон / говорител

Интернет: нужен за настройката на VM, прошивката
и Cloud STT/TTS в минималния тест.
След това локалното управление на Shelly остава в LAN.`;

export const ARCHITECTURE_OVERVIEW_FULL = `Mini PC N100 (Home Assistant OS)
  ├── Приложение Whisper (Wyoming, по избор)
  └── Приложение Piper (по избор)

Локална мрежа
  ├── Shelly релета → лампи
  ├── Voice PE (хол) — основен микрофон
  └── ATOM Echo — други стаи

Интернет: първоначална настройка / обновления / Cloud voice, ако е избран.
Управлението и гласът могат да са изцяло локални.`;

export const AUTOMATION_LAMP_YAML = `# Смени light.lampa_hol с твоя entity_id
# (Настройки → Устройства → лампата, или Developer Tools → States)

automation:
  - alias: "Глас — включи лампа хол"
    triggers:
      - trigger: conversation
        command:
          - "Тъмно е в хола"
          - "Пусни лампата в хола"
          - "Стана тъмно"
          - "Включи осветлението"
    actions:
      - action: light.turn_on
        target:
          entity_id: light.lampa_hol
      - set_conversation_response: "Включвам лампата."`;
