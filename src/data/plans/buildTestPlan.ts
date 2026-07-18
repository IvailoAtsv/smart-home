import type { TestOs, UserPrefs, VoiceStrategy } from "../prefs/types";
import type { BuyGroup, RoadmapStep, SetupLine } from "../types";
import { line, stepRef } from "../types";
import { atomEchoBuyGroups } from "../shared/atom-echo-buy";
import { voicePeBuyGroups } from "../shared/full-buy-groups";
import {
  architectureOverviewTest,
  AUTOMATION_LAMP_YAML,
  PIPELINE_CHEAT_SHEET,
  primaryVoiceLabel,
} from "../shared/voice-snippets";
import type { InstallPlan } from "./types";
import { numberSteps } from "./types";

type ActiveTestOs = Exclude<TestOs, "skip">;

function testSoftwareBuyGroup(os: ActiveTestOs): BuyGroup {
  if (os === "macos") {
    return {
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
    };
  }
  if (os === "windows") {
    return {
      id: "software",
      title: "Софтуер за временния тест",
      description:
        "VirtualBox е безплатен. Hyper-V също работи на Pro/Enterprise, ако вече го ползваш.",
      items: [
        {
          id: "virtualbox-win",
          label: "Oracle VirtualBox",
          store: "virtualbox.org",
          url: "https://www.virtualbox.org/",
          notes:
            "Безплатно. Създай x86-64 VM с bridged networking към твоята LAN.",
        },
      ],
    };
  }
  return {
    id: "software",
    title: "Софтуер за временния тест",
    description:
      "KVM/Virt-Manager или VirtualBox — избери това, с което си свикнал.",
    items: [
      {
        id: "virt-manager",
        label: "Virt-Manager (KVM)",
        store: "virt-manager.org",
        url: "https://virt-manager.org/",
        notes: "Препоръчително на Linux. Алтернатива: VirtualBox.",
      },
    ],
  };
}

function cloudBuyGroup(): BuyGroup {
  return {
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
          "Аудиото за STT/TTS напуска дома; Shelly и Home Assistant остават във VM.",
      },
    ],
  };
}

function voiceBuyGroups(strategy: VoiceStrategy): BuyGroup[] {
  return strategy === "voice-pe" ? voicePeBuyGroups : atomEchoBuyGroups;
}

function hostLabel(os: ActiveTestOs): string {
  if (os === "macos") return "Apple Silicon Mac";
  if (os === "windows") return "Windows PC";
  return "Linux PC";
}

function vmSetupSteps(os: ActiveTestOs, strategy: VoiceStrategy): SetupLine[] {
  const voice = primaryVoiceLabel(strategy);
  if (os === "macos") {
    return [
      line(
        "Инсталирай UTM от ",
        stepRef("overview", "стъпка 1"),
        " и изтегли ARM64 Home Assistant OS image от https://www.home-assistant.io/installation/macos/.",
      ),
      "Създай VM с поне 2 vCPU и 2 GB RAM; за по-плавен тест дай 4 GB RAM. Запази виртуалния диск в отделна папка, например ~/Home Assistant Test/.",
      `Настрой мрежата като Bridged, за да са Mac, VM, Shelly и ${voice} в една LAN. Гласовите сателити ползват 2.4 GHz Wi-Fi.`,
      "Стартирай VM, изчакай Home Assistant да се появи и отвори http://homeassistant.local:8123. Ако не се открие, използвай IP адреса на VM.",
      "Дръж MacBook включен към зарядно и не го оставяй да заспи по време на теста. Когато приключиш, Shut Down VM; изтриването на VM премахва теста.",
    ];
  }
  if (os === "windows") {
    return [
      line(
        "Инсталирай VirtualBox (или подготви Hyper-V) от ",
        stepRef("overview", "стъпка 1"),
        ". Изтегли Generic x86-64 Home Assistant OS image от https://www.home-assistant.io/installation/generic-x86-64/.",
      ),
      "Създай VM с поне 2 vCPU и 2–4 GB RAM. Импортирай/закачи HAOS диска според инструкциите за VirtualBox или Hyper-V.",
      `Мрежата трябва да е Bridged (не NAT), за да са Windows хостът, VM, Shelly и ${voice} в една LAN.`,
      "Стартирай VM, изчакай Home Assistant и отвори http://homeassistant.local:8123 (или IP на VM).",
      "Изключи sleep/hibernate на PC-то по време на теста. Shut Down на VM спира теста; изтриването на VM го маха изцяло.",
      "За подробности виж ръководството за Windows тест.",
    ];
  }
  return [
    line(
      "Инсталирай Virt-Manager/KVM (или VirtualBox) от ",
      stepRef("overview", "стъпка 1"),
      ". Изтегли Generic x86-64 HAOS image от https://www.home-assistant.io/installation/generic-x86-64/.",
    ),
    "Създай VM с поне 2 vCPU и 2–4 GB RAM. Използвай bridged/macvtap мрежа към LAN интерфейса.",
    `Увери се, че Linux хостът, VM, Shelly и ${voice} са в една и съща L2 мрежа (еднакви VLAN-и).`,
    "Стартирай VM и отвори http://homeassistant.local:8123 (или IP).",
    "Не оставяй машината в suspend по време на теста. Изтриването на VM премахва временния Home Assistant.",
    "За подробности виж ръководството за Linux тест.",
  ];
}

function voiceDeviceTestSteps(
  strategy: VoiceStrategy,
): Omit<RoadmapStep, "step">[] {
  if (strategy === "voice-pe") {
    return [
      {
        id: "voice-device",
        title: "Настрой Voice PE",
        summary:
          "Voice PE е микрофонът за теста. Поръчката е в първата стъпка — тук го захранваш и го добавяш към временния Home Assistant.",
        power: {
          label: "5 V USB-C",
          detail: "Постоянно 5 V / 2 A. Кабелът и зарядното често са отделно.",
        },
        images: [
          {
            src: "/images/voice-pe.svg",
            alt: "Voice Preview Edition",
            caption: "Voice PE за първия тест",
          },
        ],
        setup: [
          line(
            "Разопаковай Voice PE от ",
            stepRef("overview", "стъпка 1"),
            ". Свържи захранването.",
          ),
          "Постави го близо до мястото, от което ще говориш.",
          "Добави го към Home Assistant през Voice setup wizard и Wi-Fi.",
          line(
            "В настройките му избери pipeline-а от ",
            stepRef("pipeline", "Гласов pipeline"),
            ".",
          ),
        ],
      },
    ];
  }

  return [
    {
      id: "voice-device",
      title: "Подготви ATOM Echo",
      summary:
        "Малкият куб е микрофонът и говорителят в стаята. Поръчката е в първата стъпка — тук го разпаковаш, проверяваш кабела и го слагаш близо до мястото, от което ще говориш.",
      power: {
        label: "5 V USB-C",
        detail:
          "По време на прошивката — към компютъра с Chrome. После — USB адаптер в контакт.",
      },
      images: [
        {
          src: "/images/atom-echo.svg",
          alt: "ATOM Echo",
          caption: "ATOM Echo · USB-C с данни",
        },
      ],
      setup: [
        line(
          "Извади ATOM Echo (от ",
          stepRef("overview", "стъпка 1"),
          "). Провери, че USB-C кабелът пренася данни.",
        ),
        "Постави куба на маса/рафт близо до дивана или бюрото.",
        "Не го слагай още зад дебело стъкло или в шкаф.",
      ],
    },
    {
      id: "voice-flash",
      title: "Прошивай ATOM Echo",
      summary:
        "От Chrome на desktop записваш Voice Assistant firmware, свързваш ATOM Echo към 2.4 GHz Wi-Fi и го добавяш към временния Home Assistant.",
      help: [
        {
          href: "/help/atom-echo-flash",
          label: "Подробно: прошивка на ATOM Echo",
          description: "Chrome, драйвери, 2.4 GHz, типични проблеми.",
        },
      ],
      images: [
        {
          src: "/images/flash-chrome.svg",
          alt: "Chrome Web Serial",
          caption: "Прошивка през Chrome на desktop",
        },
      ],
      setup: [
        "Отвори Google Chrome (не Safari / Edge без Web Serial поддръжка по същия начин). Отиди на https://www.home-assistant.io/voice_control/thirteen-usd-voice-remote/",
        "Свържи ATOM Echo с USB-C. Connect → избери USB serial порта.",
        "Install Voice Assistant и изчакай.",
        "Ако няма порт: CH342 драйвер от страницата, рестарт на Chrome.",
        "Въведи 2.4 GHz Wi-Fi (не 5 GHz).",
        line(
          "Add to Home Assistant → ESPHome. Избери pipeline от ",
          stepRef("pipeline", "Гласов pipeline"),
          ".",
        ),
      ],
      warnings: [
        "Мобилни браузъри не поддържат Web Serial за тази прошивка.",
        "Ако рутерът е „само 5 GHz“, направи отделен 2.4 GHz SSID.",
      ],
    },
  ];
}

/**
 * Returns null when the user skipped testing — page should show empty state.
 */
export function buildTestPlan(prefs: UserPrefs): InstallPlan | null {
  if (prefs.testOs === "skip") return null;

  const os = prefs.testOs;
  const strategy = prefs.voiceStrategy;
  const primary = primaryVoiceLabel(strategy);
  const host = hostLabel(os);

  const voiceSteps = voiceDeviceTestSteps(strategy);

  const steps: Omit<RoadmapStep, "step">[] = [
    {
      id: "overview",
      title: "Как работи · Поръчай",
      summary: `Този тест проверява целия гласов кръг преди постоянен сървър: временна Home Assistant OS VM на ${host}, ${primary} изпраща командата, Shelly включва лампата. Първо Home Assistant Cloud — без Whisper/Piper.`,
      help: [
        {
          href: "/help/kak-raboti",
          label: "Как работи цялата система",
          description:
            "От wake word до лампата и разликата между временния тест и пълния план.",
        },
        ...(os === "windows"
          ? [
              {
                href: "/help/test-windows",
                label: "Тест на Windows",
                description: "VirtualBox / Hyper-V и bridged мрежа.",
              },
            ]
          : os === "linux"
            ? [
                {
                  href: "/help/test-linux",
                  label: "Тест на Linux",
                  description: "KVM / VirtualBox и bridged мрежа.",
                },
              ]
            : []),
      ],
      images: [
        {
          src: "/images/architecture-test.svg",
          alt: "Тестова архитектура с VM",
          caption: `Тест · ${host} → HAOS VM → ${primary} + Shelly`,
        },
      ],
      setup: [
        "Прочети архитектурата и cheat sheet-а по-долу — това е картата на проекта.",
        strategy === "voice-pe"
          ? `Ти вече имаш ${host}, Shelly на Wi-Fi и лампа. Новата покупка е Voice PE (+ захранване).`
          : `Ти вече имаш ${host}, Shelly на Wi-Fi и лампа. Новата покупка е ATOM Echo и USB-C кабел с данни; после обикновено 5 V USB захранване.`,
        "В списъка за покупки избери един вариант на група. Аксесоарите се отбелязват отделно.",
        "Тестът не преинсталира хост ОС и не пише върху основния ти диск: Home Assistant живее във временен VM файл.",
        line(
          "Когато поръчките са на път (или вече при теб), продължи към ",
          stepRef("laptop", "Създай временна HA VM"),
          ".",
        ),
      ],
      buyGroups: [
        testSoftwareBuyGroup(os),
        cloudBuyGroup(),
        ...voiceBuyGroups(strategy),
      ],
      code: [
        {
          title: "Архитектура на теста",
          language: "text",
          content: architectureOverviewTest(os, strategy),
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
      title: "Създай временна HA VM",
      summary: `Home Assistant OS ще работи като временен виртуален компютър на ${host}. Той не заменя хост ОС и можеш да го спреш или изтриеш след теста.`,
      help:
        os === "windows"
          ? [
              {
                href: "/help/test-windows",
                label: "Подробно: Windows VM",
                description: "VirtualBox, Hyper-V, bridged LAN.",
              },
            ]
          : os === "linux"
            ? [
                {
                  href: "/help/test-linux",
                  label: "Подробно: Linux VM",
                  description: "KVM, VirtualBox, мрежа.",
                },
              ]
            : [
                {
                  href: "/help/docker-mac",
                  label: "Защо не Docker Desktop",
                  description: "HAOS VM е препоръчителният път на Mac.",
                },
              ],
      images: [
        {
          src: "/images/haos-install.svg",
          alt: "VM с Home Assistant OS",
          caption: "Временна HAOS VM · bridged мрежа",
        },
      ],
      setup: vmSetupSteps(os, strategy),
    },
    {
      id: "ha-stack",
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
        "В Настройки → Гласови асистенти провери, че има асистент Home Assistant Cloud и език Bulgarian, ако е наличен.",
        "Не инсталирай Whisper или Piper още. Ако искаш напълно локален глас, това е в пълния план.",
      ],
      warnings: [
        "Home Assistant Cloud изпраща аудиото за разпознаване към Nabu Casa. За локална обработка използвай Whisper/Piper в пълния план.",
      ],
    },
    {
      id: "pipeline",
      title: "Гласов pipeline",
      summary: `Проверяваш, че Assist има работещ pipeline. Без него ${primary} може да чуе wake word, но Home Assistant няма да знае как да превърне говора в команда.`,
      help: [
        {
          href: "/help/voice-pipeline",
          label: "Какво е гласов pipeline",
          description: "STT, език, Assist — обяснено спокойно.",
        },
      ],
      images: [
        {
          src: "/images/pipeline.svg",
          alt: "Гласов pipeline",
          caption: "Cloud STT/TTS за минималния тест",
        },
      ],
      setup: [
        "В Настройки → Гласови асистенти избери асистента, който създаде Home Assistant Cloud.",
        "Провери Conversation agent = Home Assistant и избери Bulgarian за STT/TTS, ако езикът е наличен.",
        `Остави Whisper/Piper за по-късно. Първата цел е ${primary} да изпрати команда и Shelly да я изпълни.`,
        `Запиши името на pipeline-а — ще го избереш на ${primary} след като го добавиш.`,
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
        `Увери се, че ${host} (хостът), VM и Shelly са в една и съща LAN.`,
        "Настройки → Устройства и услуги → Добави интеграция → Shelly. HA често го открива сам; ако не — въведи IP.",
        "Отвори устройството и го преименувай смислено, напр. „Лампа хол“.",
        "От прегледа на Home Assistant включи и изключи лампата няколко пъти.",
        line(
          "Отвори Developer Tools → States и си запиши entity_id. Ще го сложиш в YAML-а в ",
          stepRef("phrases", "Български фрази"),
          ".",
        ),
      ],
      warnings: [
        "Ако нямаш монтирано реле: 220 V само с електротехник. Виж пълния план за покупки и монтаж.",
      ],
    },
    {
      id: "area",
      title: "Назови лампата",
      summary:
        "Assist разбира по-добре български, когато лампата има зона и алтернативни имена.",
      setup: [
        "Настройки → Зони (Areas) → Добави зона „Хол“.",
        "Отвори устройството на лампата → задай зона Хол.",
        "Добави алтернативни имена: „лампата в хола“, „осветлението в хола“.",
        "В Assist / exposed entities остави видима само тази лампа за първия тест.",
        "Пробвай писан текст в Assist: „включи лампата в хола“.",
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
    ...voiceSteps,
    {
      id: "wake-word",
      title: "Wake word + глас",
      summary:
        "Първо казваш английска wake дума (устройството светва), после веднага българската команда.",
      images: [
        {
          src: "/images/wake-word.svg",
          alt: "Wake word поток",
          caption: "EN wake word → BG команда",
        },
      ],
      setup: [
        `В настройките на ${primary} / Assist избери wake word, напр. „Okay Nabu“ или „Hey Jarvis“.`,
        "Кажи wake word отчетливо. Устройството трябва да покаже, че слуша.",
        "Без дълга пауза кажи командата на български: „Включи лампата в хола“ или „Тъмно е в хола“.",
        "Замълчи. Системата засича тишина (VAD) и праща аудиото към pipeline-а.",
        "Ако нищо не се случва: първо тествай същата фраза с писан текст в Assist.",
      ],
      warnings: [
        "Wake word ≠ команда. Първо английската дума, после българската фраза.",
      ],
      code: [
        {
          title: "Примерен разговор",
          language: "text",
          content: `Ти: „Okay Nabu“
${primary}: светва / слуша

Ти: „Тъмно е в хола“
(спираш)

Системата: тишина → Assist pipeline → automation → лампата светва`,
        },
      ],
    },
    {
      id: "phrases",
      title: "Български фрази",
      summary:
        "Готовите изречения правят теста надежден. Слагаш няколко фрази, които със сигурност включват лампата.",
      help: [
        {
          href: "/help/bulgarian-phrases",
          label: "Подробно: фрази и автоматизации",
          description: "Защо sentence trigger, как се сменя entity_id.",
        },
      ],
      setup: [
        line(
          "Първо с писан текст в Assist потвърди, че „включи лампата в хола“ вече работи от имената в ",
          stepRef("area", "Назови лампата"),
          ".",
        ),
        "Създай автоматизация: тригер Conversation / Изречение, или копирай YAML-а по-долу.",
        "Смени light.lampa_hol с твоя entity_id от Developer Tools → States.",
        "Добави фрази като „Тъмно е в хола“, „Пусни лампата в хола“, „Стана тъмно“.",
        `Тествай пак с текст, после със глас през ${primary}.`,
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
      title: "Финален тест",
      summary:
        "Един спокоен прогон от начало до край. Ако мине — архитектурата работи и можеш да преминеш към постоянен сървър (пълния план).",
      setup: [
        "Кажи wake word, после „Тъмно е в хола“. Не повтаряй бързо — изчакай цикъла.",
        "Лампата трябва да светне след обработката; запиши реалното време.",
        "Отбележи приблизителната латентност — полезно е за сравнение после с N100.",
        line(
          "Ако текстът в Assist работи, а гласът не: върни се към ",
          stepRef("pipeline", "pipeline"),
          " / ",
          stepRef("voice-device", primary),
          " / ",
          stepRef("wake-word", "wake word"),
          ", не към Shelly.",
        ),
        "Когато си доволен: отвори пълния план за mini PC + Home Assistant OS. Същият поток, по-стабилен хардуер.",
      ],
    },
  ];

  return {
    id: "test",
    storageKey: "smart-home-steps-test-v4",
    title: "Минимален тест",
    subtitle: `${host} · Shelly · ${primary} · глас на български`,
    badge: "Тестов план",
    switchLink: { href: "/", label: "← Пълен план за монтаж" },
    steps: numberSteps(steps),
  };
}

export const testPlanFallback = buildTestPlan({
  voiceStrategy: "atom",
  testOs: "macos",
  budgetLevel: "comfort",
  budgetEur: 350,
  rooms: 1,
  onboardingDone: true,
})!;
