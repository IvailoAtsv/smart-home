import type { InstallPlan } from "./types";
import { atomEchoBuyGroups } from "../shared/atom-echo-buy";
import {
  ARCHITECTURE_OVERVIEW_TEST,
  AUTOMATION_LAMP_YAML,
  PIPELINE_CHEAT_SHEET,
} from "../shared/voice-snippets";

export const testPlan: InstallPlan = {
  id: "test",
  storageKey: "smart-home-steps-test-v3",
  title: "Минимален тест",
  subtitle: "Apple Silicon Mac · Shelly · ATOM Echo · глас на български",
  badge: "Тестов план",
  switchLink: { href: "/", label: "← Пълен план за монтаж" },
  steps: [
    {
      id: "overview",
      step: 1,
      title: "Как работи · Поръчай",
      summary:
        "Този тест проверява целия гласов кръг преди да купиш постоянен сървър: временна Home Assistant OS VM работи на Apple Silicon Mac, ATOM Echo изпраща командата, а Shelly включва лампата. Първо използваш Home Assistant Cloud, за да не настройваш Whisper/Piper.",
      help: [
        {
          href: "/help/kak-raboti",
          label: "Как работи цялата система",
          description:
            "От wake word до лампата и разликата между временния тест и пълния план.",
        },
      ],
      setup: [
        "Прочети архитектурата и cheat sheet-а по-долу — това е картата на проекта.",
        "Ти вече имаш MacBook, Shelly на Wi-Fi и лампа. Новата покупка е ATOM Echo и USB-C кабел с данни; след прошивката му трябва обикновено 5 V USB захранване.",
        "В списъка за покупки избери един вариант на група (ATOM Echo, магазин). Кабелът се отбелязва отделно.",
        "Тестът не преинсталира macOS и не пише върху вътрешния диск: Home Assistant живее в един временен VM файл.",
        "Когато поръчките са на път (или вече при теб), продължи към „Създай временна HA VM“.",
      ],
      buyGroups: [
        {
          id: "software",
          title: "Софтуер за временния тест",
          description: "UTM е безплатен и държи Home Assistant изолиран от macOS.",
          items: [
            {
              id: "utm",
              label: "UTM за Apple Silicon Mac",
              store: "utm.app",
              url: "https://utm.app/",
              notes:
                "Безплатно. Използвай го само за временната VM; не променя macOS.",
            },
          ],
        },
        {
          id: "test-voice-backend",
          title: "По избор · Cloud voice за първия тест",
          description:
            "Най-малко настройване: Home Assistant Cloud предоставя STT/TTS. Можеш да го пропуснеш, ако ще настройваш локален pipeline.",
          items: [
            {
              id: "test-nabu-casa",
              label: "Home Assistant Cloud",
              store: "nabucasa.com",
              approxPrice: "≈ 7,50 €/мес.",
              url: "https://www.nabucasa.com/",
              notes:
                "Аудиото за STT/TTS напуска дома; Shelly и Home Assistant остават в твоята VM.",
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
      title: "Създай временна HA VM",
      summary:
        "Home Assistant OS ще работи като временен ARM64 виртуален компютър в UTM. Той не заменя macOS и можеш да го спреш или изтриеш след теста.",
      setup: [
        "Инсталирай UTM от стъпка 1 и изтегли ARM64 Home Assistant OS image от https://www.home-assistant.io/installation/macos/.",
        "Създай VM с поне 2 vCPU и 2 GB RAM; за по-плавен тест дай 4 GB RAM. Запази виртуалния диск в отделна папка, например ~/Home Assistant Test/.",
        "Настрой мрежата като Bridged, за да са Mac VM, Shelly и ATOM Echo в една LAN. ATOM Echo използва 2.4 GHz Wi-Fi.",
        "Стартирай VM, изчакай Home Assistant да се появи и отвори http://homeassistant.local:8123. Ако не се открие, използвай IP адреса на VM.",
        "Дръж MacBook включен към зарядно и не го оставяй да заспи по време на теста. Когато приключиш, Shut Down VM; изтриването на VM премахва теста.",
      ],
    },
    {
      id: "ha-stack",
      step: 3,
      title: "Завърши HA и избери voice pipeline",
      summary:
        "Завършваш първоначалната настройка на Home Assistant. За най-бързия тест използваш Home Assistant Cloud; локалният Whisper/Piper остава за пълния план.",
      help: [
        {
          href: "/help/voice-pipeline",
          label: "Подробно: гласов pipeline",
          description: "Cloud първо, локален Whisper/Piper по-късно.",
        },
      ],
      setup: [
        "Създай потребител, задай локация Europe/Sofia и завърши onboarding-а.",
        "За най-простия тест активирай Home Assistant Cloud. Той предоставя STT/TTS; самият Home Assistant и Shelly остават във VM и в твоята LAN.",
        "В Настройки → Гласови асистенти провери, че има асистент Home Assistant Cloud и език Bulgarian, ако е наличен за профила ти.",
        "Не инсталирай Whisper или Piper още. Ако искаш напълно локален глас, това е отделна стъпка в пълния план.",
      ],
      warnings: [
        "Home Assistant Cloud изпраща аудиото за разпознаване към Nabu Casa. За локална/офлайн обработка използвай Whisper/Piper в пълния план.",
      ],
    },
    {
      id: "pipeline",
      step: 4,
      title: "Гласов pipeline",
      summary:
        "Проверяваш, че Assist има работещ pipeline. Без него ATOM Echo може да чуе wake word, но Home Assistant няма да знае как да превърне говора в команда.",
      help: [
        {
          href: "/help/voice-pipeline",
          label: "Какво е гласов pipeline",
          description: "STT, език, Assist — обяснено спокойно.",
        },
      ],
      setup: [
        "В Настройки → Гласови асистенти избери асистента, който създаде Home Assistant Cloud.",
        "Провери Conversation agent = Home Assistant и избери Bulgarian за STT/TTS, ако езикът е наличен.",
        "Остави Whisper/Piper за по-късно. Първата цел е ATOM Echo да изпрати команда и Shelly да я изпълни.",
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
        "Ако Cloud pipeline не се появява, провери, че Home Assistant Cloud е активиран и че в VM има интернет.",
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
        "От Chrome на Mac записваш Voice Assistant firmware, свързваш ATOM Echo към 2.4 GHz Wi-Fi и го добавяш към временния Home Assistant. След това избираш pipeline-а от стъпка 4.",
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
        "Първо казваш английска wake дума (устройството светва), после веднага българската команда. Готовите wake words са английски; българската команда се обработва от избрания pipeline.",
      setup: [
        "В настройките на ATOM Echo / Assist избери wake word, напр. „Okay Nabu“ или „Hey Jarvis“.",
        "Кажи wake word отчетливо. LED-ът трябва да покаже, че слуша (обикновено синьо).",
        "Без дълга пауза кажи командата на български: „Включи лампата в хола“ или „Тъмно е в хола“.",
        "Замълчи. Системата засича тишина (VAD), спира записа и праща аудиото към избрания STT pipeline.",
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

Системата: тишина → Assist pipeline → automation → лампата светва`,
        },
      ],
    },
    {
      id: "phrases",
      step: 10,
      title: "Български фрази",
      summary:
        "Готовите изречения правят теста надежден. Слагаш няколко фрази, които със сигурност включват лампата, и кратък отговор.",
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
        "Лампата трябва да светне след обработката на Cloud pipeline-а; запиши реалното време вместо да разчиташ на предварителна оценка.",
        "Отбележи приблизителната латентност — полезно е за сравнение после с N100.",
        "Ако текстът в Assist работи, а гласът не: върни се към ATOM Echo / pipeline (стъпки 4, 8, 9), не към Shelly.",
        "Когато си доволен: отвори пълния план за mini PC + Voice PE. Същият pipeline, по-стабилен хардуер.",
      ],
    },
  ],
};
