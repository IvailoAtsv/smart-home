/** Shared code / architecture snippets used by test and full plans. */

export const PIPELINE_CHEAT_SHEET = `Wake word (локално на ATOM Echo / Voice PE)
    → аудио към Home Assistant
    → Wyoming Whisper (STT, български)
    → Assist / Sentence automation
    → Shelly switch / light.turn_on
    → Piper TTS / бийп обратно към сателита`;

export const ARCHITECTURE_OVERVIEW_TEST = `MacBook (Docker)
  ├── Home Assistant :8123
  └── faster-whisper  :10300 (Wyoming)

Локална Wi-Fi (2.4 GHz)
  ├── Shelly → лампа
  └── ATOM Echo → микрофон / говорител

Интернет: само при първа настройка
  (образи, прошивка, Whisper модел).
После всичко остава в LAN — offline.`;

export const ARCHITECTURE_OVERVIEW_FULL = `Mini PC N100 (Home Assistant OS)
  ├── Whisper add-on (Wyoming)
  └── Piper TTS (по избор)

Локална мрежа
  ├── Shelly релета → лампи
  ├── Voice PE (хол) — основен микрофон
  └── ATOM Echo — други стаи

Интернет: само setup / обновления.
Управлението и говорът могат да са изцяло локални.`;

export const DOCKER_COMPOSE_TEST = `services:
  homeassistant:
    image: ghcr.io/home-assistant/home-assistant:stable
    container_name: homeassistant
    volumes:
      - ./config:/config
    ports:
      - "8123:8123"
    restart: unless-stopped
    environment:
      - TZ=Europe/Sofia

  faster-whisper:
    image: lscr.io/linuxserver/faster-whisper:latest
    container_name: faster-whisper
    ports:
      - "10300:10300"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Sofia
      - WHISPER_MODEL=base
      - WHISPER_LANG=bg
    volumes:
      - ./whisper-data:/config
    restart: unless-stopped`;

export const AUTOMATION_LAMP_YAML = `# Смени light.lampa_hol с твоя entity_id
# (Настройки → Устройства → лампата, или Developer Tools → States)

automation:
  - alias: "Глас — включи лампа хол"
    trigger:
      - platform: conversation
        command:
          - "Тъмно е в хола"
          - "Пусни лампата в хола"
          - "Стана тъмно"
          - "Включи осветлението"
    action:
      - action: light.turn_on
        target:
          entity_id: light.lampa_hol
      - action: conversation.process
        data:
          text: "Включвам лампата."`;
