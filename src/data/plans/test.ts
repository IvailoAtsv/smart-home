import type { InstallPlan } from "./types";
import { atomEchoBuyGroups } from "../shared/atom-echo-buy";
import {
  ARCHITECTURE_OVERVIEW_TEST,
  AUTOMATION_LAMP_YAML,
  DOCKER_COMPOSE_TEST,
  PIPELINE_CHEAT_SHEET,
} from "../shared/voice-snippets";

export const testPlan: InstallPlan = {
  id: "test",
  storageKey: "smart-home-steps-test-v3",
  title: "Минимален тест",
  subtitle: "MacBook · Shelly · ATOM Echo · глас на български",
  badge: "Тестов план",
  switchLink: { href: "/", label: "← Пълен план за монтаж" },
  steps: [
    {
      id: "overview",
      step: 1,
      title: "Как работи · Поръчай",
      summary:
        "Този тест проверява целия гласов кръг преди да купиш постоянен сървър: казваш wake word на ATOM Echo, MacBook разпознава български с Whisper, Shelly включва лампата. Поръчай липсващото от списъка, маркирай какво вече имаш, после продължи стъпка по стъпка.",
      help: [
        {
          href: "/help/kak-raboti",
          label: "Как работи цялата система",
          description:
            "От wake word до лампата, offline и разликата тест/пълен план.",
        },
      ],
      setup: [
        "Прочети архитектурата и cheat sheet-а по-долу — това е картата на проекта.",
        "Ти вече имаш MacBook, Shelly на Wi-Fi и лампа. Новата покупка е ATOM Echo (+ USB-C кабел с данни).",
        "В списъка за покупки избери един вариант на група (ATOM Echo, магазин). Кабелът се отбелязва отделно.",
        "Docker Desktop е безплатен софтуер — инсталирай го преди стъпка 2.",
        "Когато поръчките са на път (или вече при теб), продължи към „Подготви MacBook“.",
      ],
      buyGroups: [
        {
          id: "software",
          title: "Софтуер (безплатно)",
          description: "Нужен е преди всичко останало на Mac.",
          items: [
            {
              id: "docker-desktop",
              label: "Docker Desktop за Mac",
              store: "docker.com",
              url: "https://www.docker.com/products/docker-desktop/",
              notes:
                "Безплатно за лична употреба. Стартирай го и изчакай кита да стане зелен.",
            },
          ],
        },
        ...atomEchoBuyGroups,
      ],
      code: [
        {
          title: "Архитектура на теста",
          language: "text",
          content: ARCHITECTURE_OVERVIEW_TEST,
        },
        {
          title: "Какво се случва при команда",
          language: "text",
          content: PIPELINE_CHEAT_SHEET,
        },
      ],
    },
    {
      id: "laptop",
      step: 2,
      title: "Подготви MacBook",
      summary:
        "Лаптопът ще бъде временният „сървър“ вкъщи. Важно е да е в същата Wi-Fi мрежа като Shelly и ATOM Echo, да има достатъчно RAM и да не заспива по време на теста.",
      setup: [
        "Инсталирай Docker Desktop от стъпка 1. Отвори го и изчакай статусът да е Running.",
        "Свържи MacBook към същата Wi-Fi мрежа, на която е Shelly. ATOM Echo после също трябва да е на 2.4 GHz от тази мрежа (или guest 2.4 GHz към същия LAN).",
        "Ако имаш 8 GB RAM — тестът пак върви, но Whisper ще е по-бавен. С 16 GB е по-приятно.",
        "Сложи лаптопа на заряд и изключи „заспиване при захранване от адаптер“ за сесията (System Settings → Battery / Energy), за да не спира Docker.",
        "Запиши локалния IP: System Settings → Network → Wi-Fi → Details. Ще ти трябва за телефона и понякога за Wyoming (напр. 192.168.1.42).",
      ],
    },
    {
      id: "ha-stack",
      step: 3,
      title: "HA + Whisper в Docker",
      summary:
        "Вдигаш два контейнера с един файл: Home Assistant (уеб интерфейс и автоматизации) и faster-whisper (разпознаване на български). В Docker няма add-on магазин — затова Whisper е отделно.",
      help: [
        {
          href: "/help/docker-mac",
          label: "Подробно: Docker на Mac",
          description: "Портове, host.docker.internal, типични грешки.",
        },
      ],
      setup: [
        "Създай папка ~/smart-home-test. Вътре създай файл с име docker-compose.yml и постави съдържанието от блока по-долу (бутон Копирай).",
        "Отвори Terminal, изпълни: cd ~/smart-home-test && docker compose up -d",
        "Първият път изтеглянето отнема 2–10 минути. След това и двата контейнера трябва да са „Up“ (провери с docker compose ps).",
        "На Mac отвори http://localhost:8123. Създай потребител и завърши онбординга на Home Assistant.",
        "От телефона (същата Wi-Fi) пробвай http://ТВОЯ-IP:8123 — трябва да видиш същия екран за вход.",
      ],
      code: [
        {
          title: "docker-compose.yml",
          language: "yaml",
          content: DOCKER_COMPOSE_TEST,
        },
      ],
      warnings: [
        "На macOS не ползвай --network=host. Портовете 8123 и 10300 в compose файла са правилният начин.",
        "Първите гласови опити може да са бавни, докато Whisper довърши изтеглянето на модела.",
      ],
    },
    {
      id: "pipeline",
      step: 4,
      title: "Гласов pipeline",
      summary:
        "Сега свързваш Whisper с Assist. Без тази връзка ATOM Echo ще чува wake word, но Home Assistant няма да знае как да превърне българския говор в текст.",
      help: [
        {
          href: "/help/voice-pipeline",
          label: "Какво е гласов pipeline",
          description: "STT, език, Assist — обяснено спокойно.",
        },
      ],
      setup: [
        "В Home Assistant: Настройки → Устройства и услуги → Добави интеграция → потърси Wyoming.",
        "За Host пробвай първо host.docker.internal, порт 10300. Ако не тръгне — ползвай IP адреса на MacBook от стъпка 2, същият порт.",
        "Настройки → Гласови асистенти (Voice assistants). Създай или редактирай асистент.",
        "Speech-to-text: избери Wyoming / faster-whisper. Език: Bulgarian (или bg).",
        "TTS засега може да оставиш празно или по подразбиране — целта е лампата да се включва надеждно; хубавият глас идва после.",
        "Запиши името на pipeline-а — ще го избереш на ATOM Echo след прошивката.",
      ],
      code: [
        {
          title: "Напомняне за потока",
          language: "text",
          content: PIPELINE_CHEAT_SHEET,
        },
      ],
      warnings: [
        "Ако Wyoming показва грешка: docker compose ps и docker compose logs faster-whisper — контейнерът трябва да слуша на 10300.",
      ],
    },
    {
      id: "shelly-ha",
      step: 5,
      title: "Свържи Shelly",
      summary:
        "Релето вече е на Wi-Fi — остава да го „осинови“ Home Assistant през локалната мрежа. Управлението не минава през Shelly Cloud.",
      help: [
        {
          href: "/help/shelly-neutral",
          label: "Ако още монтираш Shelly",
          description: "С или без неутрала, кой модел, безопасност.",
        },
      ],
      setup: [
        "Увери се, че MacBook и Shelly са в една и съща LAN (еднакъв 192.168.x… или един VLAN).",
        "Настройки → Устройства и услуги → Добави интеграция → Shelly. HA често го открива сам; ако не — въведи IP на Shelly от приложението Shelly.",
        "Отвори устройството и го преименувай смислено, напр. „Лампа хол“.",
        "От прегледа на Home Assistant включи и изключи лампата няколко пъти. Ако светва тук, хардуерът е наред.",
        "Отвори Developer Tools → States и си запиши entity_id (напр. light.xxx или switch.xxx). Ще го сложиш в YAML-а по-късно.",
      ],
      warnings: [
        "Ако нямаш монтирано реле: 220 V само с електротехник. Виж пълния план за покупки и монтаж.",
      ],
    },
    {
      id: "area",
      step: 6,
      title: "Назови лампата",
      summary:
        "Assist разбира по-добре български, когато лампата има зона и алтернативни имена. Така „лампата в хола“ сочи към правилното устройство, а не към случайна крушка.",
      setup: [
        "Настройки → Зони (Areas) → Добави зона „Хол“ (или реалното име на стаята).",
        "Отвори устройството на лампата → задай зона Хол.",
        "Добави алтернативни имена / aliases: „лампата в хола“, „осветлението в хола“.",
        "В настройките на Assist / exposed entities остави видима само тази лампа за първия тест — по-малко объркване.",
        "Пробвай писан текст в Assist: „включи лампата в хола“. Ако светне — имената са наред.",
      ],
      code: [
        {
          title: "Примерни имена",
          language: "text",
          content: `Зона: Хол
Устройство: Лампа хол
Алтернативни имена:
- лампата в хола
- осветлението в хола`,
        },
      ],
    },
    {
      id: "atom-echo",
      step: 7,
      title: "Подготви ATOM Echo",
      summary:
        "Малкият куб е микрофонът и говорителят в стаята. Поръчката е в стъпка 1 — тук го разпаковаш, проверяваш кабела и го слагаш близо до мястото, от което ще говориш.",
      power: {
        label: "5 V USB-C",
        detail:
          "По време на прошивката — към MacBook. После — USB адаптер в контакт, за да стои постоянно включен.",
      },
      setup: [
        "Извади ATOM Echo от кутията. Провери, че USB-C кабелът пренася данни (евтините „само заряд“ кабели често не показват serial порт в Chrome).",
        "Постави куба на маса/рафт близо до дивана или бюрото — микрофонът е слаб на разстояние.",
        "Не го слагай още зад дебело стъкло или в шкаф; първо го провери на открито място.",
      ],
    },
    {
      id: "atom-flash",
      step: 8,
      title: "Прошивай ATOM Echo",
      summary:
        "От Chrome на Mac записваш Voice Assistant firmware, свързваш го към 2.4 GHz Wi-Fi и го добавяш в Home Assistant. След това избираш pipeline-а от стъпка 4.",
      help: [
        {
          href: "/help/atom-echo-flash",
          label: "Подробно: прошивка на ATOM Echo",
          description: "Chrome, драйвери, 2.4 GHz, типични проблеми.",
        },
      ],
      setup: [
        "На MacBook отвори Google Chrome (не Safari). Отиди на https://www.home-assistant.io/voice_control/thirteen-usd-voice-remote/",
        "Свържи ATOM Echo с USB-C към Mac. В страницата натисни Connect и избери новия USB serial порт.",
        "Избери Install Voice Assistant и изчакай прошивката да приключи.",
        "Ако няма порт: инсталирай CH342 драйвера от инструкциите на страницата, рестартирай Chrome и пробвай отново.",
        "Въведи име и парола на 2.4 GHz Wi-Fi. 5 GHz няма да стане.",
        "Add to Home Assistant → приеми ESPHome. В настройките на ATOM Echo избери гласовия pipeline от стъпка 4.",
      ],
      warnings: [
        "Safari и мобилни браузъри не поддържат Web Serial за тази прошивка.",
        "Ако рутерът ти е „само 5 GHz“, направи отделен 2.4 GHz SSID за умните устройства.",
      ],
    },
    {
      id: "wake-word",
      step: 9,
      title: "Wake word + глас",
      summary:
        "Първо казваш английска wake дума (устройството светва), после веднага българската команда. Няма готова българска wake дума — така е замислено засега.",
      setup: [
        "В настройките на ATOM Echo / Assist избери wake word, напр. „Okay Nabu“ или „Hey Jarvis“.",
        "Кажи wake word отчетливо. LED-ът трябва да покаже, че слуша (обикновено синьо).",
        "Без дълга пауза кажи командата на български: „Включи лампата в хола“ или „Тъмно е в хола“.",
        "Замълчи. Системата засича тишина (VAD), спира записа и праща аудиото към Whisper.",
        "Ако нищо не се случва: първо тествай същата фраза с писан текст в Assist — така разделяш проблем в микрофона от проблем в автоматизацията.",
      ],
      warnings: [
        "Wake word ≠ команда. Първо английската дума, после българската фраза.",
      ],
      code: [
        {
          title: "Примерен разговор",
          language: "text",
          content: `Ти: „Okay Nabu“
ATOM Echo: светва / слуша

Ти: „Тъмно е в хола“
(спираш)

Системата: тишина → Whisper → automation → лампата светва`,
        },
      ],
    },
    {
      id: "phrases",
      step: 10,
      title: "Български фрази",
      summary:
        "Готовите изречения правят теста надежден, дори когато Whisper обърка дума. Слагаш няколко фрази, които със сигурност включват лампата, и кратък отговор.",
      help: [
        {
          href: "/help/bulgarian-phrases",
          label: "Подробно: фрази и автоматизации",
          description: "Защо sentence trigger, как се сменя entity_id.",
        },
      ],
      setup: [
        "Първо с писан текст в Assist потвърди, че „включи лампата в хола“ вече работи от имената в стъпка 6.",
        "Създай автоматизация: тригер Conversation / Изречение, или копирай YAML-а по-долу в automations.",
        "Смени light.lampa_hol с твоя entity_id от Developer Tools → States.",
        "Добави фрази като „Тъмно е в хола“, „Пусни лампата в хола“, „Стана тъмно“.",
        "Тествай пак с текст, после със глас през ATOM Echo.",
      ],
      code: [
        {
          title: "Автоматизация (YAML)",
          language: "yaml",
          content: AUTOMATION_LAMP_YAML,
        },
      ],
    },
    {
      id: "run-test",
      step: 11,
      title: "Финален тест",
      summary:
        "Един спокоен прогон от начало до край. Ако мине — знаеш, че архитектурата работи и можеш да преминеш към постоянен сървър (пълния план).",
      setup: [
        "Кажи wake word, после „Тъмно е в хола“. Не повтаряй бързо — изчакай цикъла.",
        "Лампата трябва да светне в рамките на няколко секунди (на Mac с Base модел понякога 5–15 сек).",
        "Отбележи приблизителната латентност — полезно е за сравнение после с N100.",
        "Ако текстът в Assist работи, а гласът не: върни се към ATOM Echo / Whisper (стъпки 4, 8, 9), не към Shelly.",
        "Когато си доволен: отвори пълния план за mini PC + Voice PE. Същият pipeline, по-стабилен хардуер.",
      ],
    },
  ],
};
