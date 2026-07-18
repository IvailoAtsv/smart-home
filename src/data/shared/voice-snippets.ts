import type { VoiceStrategy } from "../prefs/types";

/** Shared code / architecture snippets used by test and full plans. */

export const PIPELINE_CHEAT_SHEET = `Wake word (локално на ATOM Echo / Voice PE)
    → аудио към Home Assistant
    → STT (Home Assistant Cloud или локален Whisper)
    → Assist / Sentence automation
    → Shelly switch / light.turn_on
    → TTS / бийп обратно към сателита`;

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

export function voiceDeviceLabel(strategy: VoiceStrategy): string {
  if (strategy === "voice-pe") return "Voice PE";
  if (strategy === "atom") return "ATOM Echo";
  return "Voice PE / ATOM Echo";
}

export function primaryVoiceLabel(strategy: VoiceStrategy): string {
  return strategy === "atom" ? "ATOM Echo" : "Voice PE";
}

export function architectureOverviewFull(strategy: VoiceStrategy): string {
  const voiceLines =
    strategy === "atom"
      ? `  └── ATOM Echo — микрофон / говорител`
      : strategy === "voice-pe"
        ? `  └── Voice PE — микрофон / говорител`
        : `  ├── Voice PE (хол / натоварени стаи)
  └── ATOM Echo — други стаи`;

  return `Mini PC N100 (Home Assistant OS)
  ├── Whisper app (Wyoming, по избор)
  └── Piper app (по избор)

Локална мрежа
  ├── Shelly релета → лампи
${voiceLines}

Интернет: setup / обновления / Cloud voice, ако е избран.
Управлението и говорът могат да са изцяло локални.`;
}

export function architectureOverviewTest(
  testOs: "macos" | "windows" | "linux",
  strategy: VoiceStrategy,
): string {
  const host =
    testOs === "macos"
      ? `Apple Silicon Mac
  └── UTM → временна Home Assistant OS VM (ARM64)`
      : testOs === "windows"
        ? `Windows PC
  └── VirtualBox / Hyper-V → временна Home Assistant OS VM (x86-64)`
        : `Linux PC
  └── KVM / VirtualBox → временна Home Assistant OS VM (x86-64)`;

  const voice =
    strategy === "voice-pe"
      ? `  └── Voice PE → микрофон / говорител`
      : `  └── ATOM Echo → микрофон / говорител`;

  return `${host}
        └── Assist (първо с Home Assistant Cloud)

Локална Wi-Fi (2.4 GHz)
  ├── Shelly → лампа
${voice}

Интернет: нужен за VM setup, прошивка / добавяне на устройство
и Cloud STT/TTS в минималния тест.
После локалното управление на Shelly остава в LAN.`;
}
