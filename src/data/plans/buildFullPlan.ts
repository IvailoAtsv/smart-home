import type { UserPrefs } from "../prefs/types";
import type { BuyGroup, RoadmapStep } from "../types";
import { line, stepRef } from "../types";
import { atomEchoBuyGroups } from "../shared/atom-echo-buy";
import {
  optionalBuyGroups,
  serverBuyGroups,
  voicePeBuyGroups,
} from "../shared/full-buy-groups";
import { shellyBuyGroups } from "../shared/shelly-buy";
import {
  architectureOverviewFull,
  AUTOMATION_LAMP_YAML,
  PIPELINE_CHEAT_SHEET,
  primaryVoiceLabel,
} from "../shared/voice-snippets";
import type { InstallPlan } from "./types";
import { numberSteps } from "./types";

function atomForOtherRooms(): BuyGroup[] {
  return atomEchoBuyGroups.map((g) => ({
    ...g,
    title: `${g.title} (други стаи)`,
    description: g.description
      ? `По-късно, след като холът е стабилен. ${g.description}`
      : "По-късно, след като холът е стабилен.",
  }));
}

function buyGroupsFor(prefs: UserPrefs): BuyGroup[] {
  const { voiceStrategy, budgetLevel } = prefs;
  const optional =
    budgetLevel === "lean"
      ? optionalBuyGroups.map((g) => ({
          ...g,
          title: `${g.title} · по-късно`,
          description: g.description
            ? `При тесен бюджет остави това за след пилота. ${g.description}`
            : "При тесен бюджет остави това за след пилота.",
        }))
      : optionalBuyGroups;

  if (voiceStrategy === "atom") {
    return [
      ...serverBuyGroups,
      ...shellyBuyGroups,
      ...atomEchoBuyGroups,
      ...optional,
    ];
  }
  if (voiceStrategy === "voice-pe") {
    return [
      ...serverBuyGroups,
      ...shellyBuyGroups,
      ...voicePeBuyGroups,
      ...optional,
    ];
  }
  return [
    ...serverBuyGroups,
    ...shellyBuyGroups,
    ...voicePeBuyGroups,
    ...atomForOtherRooms(),
    ...optional,
  ];
}

function overviewVoiceCopy(prefs: UserPrefs): string {
  const { voiceStrategy, rooms, budgetEur } = prefs;
  const roomWord =
    rooms >= 10 ? "10+ стаи" : rooms === 1 ? "1 стая" : `${rooms} стаи`;
  const budgetLabel = rooms >= 10 ? `≥ ${budgetEur} €` : `≈ ${budgetEur} €`;
  if (voiceStrategy === "atom") {
    return `Пилот: mini PC + Shelly + ATOM Echo. Планираш около ${roomWord} — по едно реле и един Echo на стая (бюджет ${budgetLabel} като ориентир).`;
  }
  if (voiceStrategy === "voice-pe") {
    return `Пилот: mini PC + Shelly + Voice PE. Планираш около ${roomWord} — Voice PE за основните пространства (бюджет ${budgetLabel} като ориентир).`;
  }
  return `Пилот: mini PC + Shelly + Voice PE в хола. Планираш около ${roomWord}; за по-тихи стаи ползваш ATOM Echo (бюджет ${budgetLabel} като ориентир).`;
}

function voiceDeviceSteps(prefs: UserPrefs): Omit<RoadmapStep, "step">[] {
  if (prefs.voiceStrategy === "atom") {
    return [
      {
        id: "voice-device",
        title: "Подготви ATOM Echo",
        summary:
          "Малкият куб е микрофонът и говорителят в стаята. Поръчката е в списъка от първата стъпка — тук го разпаковаш, проверяваш кабела и го слагаш близо до мястото, от което ще говориш.",
        power: {
          label: "5 V USB-C",
          detail:
            "По време на инсталацията — към компютър с Chrome. После — USB адаптер в контакт, за да стои постоянно включен.",
        },
        images: [
          {
            src: "/images/atom-echo.svg",
            alt: "Схема на M5Stack ATOM Echo с USB-C",
            caption:
              "ATOM Echo · USB-C с данни за инсталацията, после постоянно 5 V",
          },
        ],
        setup: [
          line(
            "Извади ATOM Echo от кутията. Поръчката е в ",
            stepRef("overview", "стъпка 1 · Поръчай"),
            ". Провери, че USB-C кабелът пренася данни (евтините „само заряд“ кабели често не показват serial порт в Chrome).",
          ),
          "Постави куба на маса/рафт близо до дивана или бюрото — микрофонът е слаб на разстояние.",
          "Не го слагай още зад дебело стъкло или в шкаф; първо го провери на открито място.",
        ],
      },
      {
        id: "voice-flash",
        title: "Инсталирай софтуера на ATOM Echo",
        summary:
          "От Chrome на компютър инсталираш Voice Assistant, свързваш ATOM Echo към 2.4 GHz Wi-Fi и го добавяш към Home Assistant. После избираш гласовата верига.",
        help: [
          {
            href: "/help/atom-echo-flash",
            label: "Подробно: инсталация на ATOM Echo",
            description: "Chrome, драйвери, 2.4 GHz, типични проблеми.",
          },
        ],
        images: [
          {
            src: "/images/flash-chrome.svg",
            alt: "Схема: Chrome Web Serial към ATOM Echo",
            caption: "Инсталация само през Chrome на компютър (Web Serial)",
          },
        ],
        setup: [
          "Отвори Google Chrome (не Safari / не телефон). Отиди на https://www.home-assistant.io/voice_control/thirteen-usd-voice-remote/",
          "Свържи ATOM Echo с USB-C. Натисни Connect и избери новия USB serial порт.",
          "Избери Install Voice Assistant и изчакай инсталацията.",
          "Ако няма порт: инсталирай CH342 драйвера от страницата, рестартирай Chrome и пробвай отново.",
          "Въведи 2.4 GHz Wi-Fi. 5 GHz няма да стане.",
          line(
            "Add to Home Assistant → приеми ESPHome. Гласовата верига избираш в ",
            stepRef("pipeline", "Гласова верига"),
            ".",
          ),
        ],
        warnings: [
          "Safari и мобилни браузъри не поддържат Web Serial за тази инсталация.",
          "Ако рутерът е „само 5 GHz“, направи отделен 2.4 GHz SSID.",
        ],
      },
    ];
  }

  // voice-pe or hybrid — primary device is Voice PE
  return [
    {
      id: "voice-device",
      title: "Настрой Voice PE",
      summary:
        prefs.voiceStrategy === "hybrid"
          ? "Voice Preview Edition е микрофонът и говорителят в хола — по-добър от ATOM Echo за основната стая. ATOM Echo остава за другите стаи по-късно."
          : "Voice Preview Edition е микрофонът и говорителят в стаята. Разопаковаш го, захранваш го и го добавяш в Home Assistant.",
      power: {
        label: "5 V USB-C",
        detail:
          "Постоянно захранване. Voice PE изисква 5 V / 2 A USB-C; кабелът и зарядното не са гарантирани в комплекта. Вземи съвместимите аксесоари от списъка за покупки или използвай вече налични.",
      },
      images: [
        {
          src: "/images/voice-pe.svg",
          alt: "Схема на Home Assistant Voice Preview Edition",
          caption: "Voice PE · 5 V / 2 A USB-C захранване",
        },
      ],
      setup: [
        line(
          "Разопаковай Voice PE (поръчан в ",
          stepRef("overview", "стъпка 1"),
          "). Свържи захранването и изчакай да светне.",
        ),
        "Постави го на място, от което обикновено говориш (маса, рафт), не зад телевизор с вентилатор до микрофона.",
        "Следвай setup wizard-а на Home Assistant Voice за добавяне към твоя Home Assistant и Wi-Fi.",
        line(
          "Когато устройството се появи в HA, още не го тествай на глас — първо вдигни pipeline-а (",
          stepRef("pipeline", "следващата стъпка"),
          ").",
        ),
        ...(prefs.voiceStrategy === "hybrid"
          ? [
              line(
                "За други стаи по-късно ползваш ATOM Echo — виж ",
                stepRef("expand", "Още стаи"),
                ".",
              ),
            ]
          : []),
      ],
    },
  ];
}

export function buildFullPlan(prefs: UserPrefs): InstallPlan {
  const primary = primaryVoiceLabel(prefs.voiceStrategy);
  const rooms = prefs.rooms;

  const voiceSteps = voiceDeviceSteps(prefs);

  const spine: Omit<RoadmapStep, "step">[] = [
    {
      id: "overview",
      title: "Как работи · Поръчай",
      summary: `Тук събираш пилота: постоянен mini PC с Home Assistant OS, Shelly реле и ${primary}. Поръчай от групите по-долу, прочети как върви потокът, после инсталирай стъпка по стъпка.`,
      help: [
        {
          href: "/help/kak-raboti",
          label: "Как работи цялата система",
          description:
            "Wake word → Assist pipeline → Shelly, cloud или локална обработка.",
        },
        {
          href: "/help",
          label: "Всички ръководства",
          description: "Индекс с HAOS, VM тест, ATOM Echo, фрази и още.",
        },
      ],
      images: [
        {
          src: "/images/architecture-full.svg",
          alt: "Архитектура: mini PC, Shelly, гласово устройство",
          caption: "Пълен план · локална мрежа + Home Assistant OS",
        },
      ],
      setup: [
        "Прочети архитектурата и cheat sheet-а — това е картата. Всяка следваща стъпка пълни една кутийка от нея.",
        overviewVoiceCopy(prefs),
        "В списъка „избери един“ означава един вариант на група (PC, Shelly път, магазин). Аксесоарите се отбелязват отделно.",
        line(
          "Преди да поръчаш Shelly: електротехникът да каже има ли неутрала (N). Виж ",
          stepRef("shelly", "Монтирай Shelly"),
          " и ръководството за неутрала.",
        ),
        ...(prefs.budgetLevel === "lean"
          ? [
              "При тесен бюджет: купи първо mini PC + едно Shelly + едно гласово устройство. UPS и Cloud остави за по-късно.",
            ]
          : prefs.voiceStrategy === "hybrid"
            ? [
                "ATOM Echo и UPS можеш да отбележиш сега или след като холът работи.",
              ]
            : []),
        line(
          "Когато основните пратки са поръчани, продължи към ",
          stepRef("server", "Подготви сървъра"),
          ".",
        ),
      ],
      buyGroups: buyGroupsFor(prefs),
      code: [
        {
          title: "Архитектура",
          language: "text",
          content: architectureOverviewFull(prefs.voiceStrategy),
        },
        {
          title: "Какво се случва при команда",
          language: "text",
          content: PIPELINE_CHEAT_SHEET,
        },
      ],
    },
    {
      id: "server",
      title: "Подготви сървъра",
      summary:
        "Mini PC-ът от списъка за покупки е компютърът, който ще стои постоянно включен. Слагаш го до рутера, вързваш Ethernet и се подготвяш да инсталираш Home Assistant OS върху SSD-то.",
      power: {
        label: "220 V",
        detail:
          "Обикновен контакт. За стабилност ползвай Ethernet към рутера — не разчитай само на Wi-Fi за сървъра.",
      },
      images: [
        {
          src: "/images/mini-pc.svg",
          alt: "Mini PC до рутера с Ethernet",
          caption: "Mini PC · Ethernet към рутера, проветриво място",
        },
      ],
      setup: [
        "Разопаковай mini PC-а. Провери, че има поне ~16 GB RAM и SSD (както си поръчал).",
        "Постави го до рутера на проветриво място — N100-ите са тихи, но не ги затваряй в плътен шкаф без въздух.",
        line(
          "Свържи Ethernet кабела от ",
          stepRef("overview", "стъпка 1"),
          " към рутера и към LAN порта на mini PC-а.",
        ),
        line(
          "Включи захранването. Все още не инсталирай нищо върху SSD — това е ",
          stepRef("ha-os", "следващата стъпка"),
          " с USB флашката.",
        ),
        "Не взимай Home Assistant Green, ако искаш локален Whisper на място: Green е удобен, но за български говор с локален модел N100 с 16 GB е по-подходящ.",
      ],
    },
    {
      id: "ha-os",
      title: "Инсталирай Home Assistant",
      summary:
        "Записваш Home Assistant OS върху boot medium-а на mini PC-а и стартираш системата върху вътрешния диск. След това влизаш от телефона на адрес :8123.",
      help: [
        {
          href: "/help/ha-os-install",
          label: "Подробно: инсталация на HA OS",
          description: "UEFI, безопасен запис на диска, първи вход и приложения.",
        },
      ],
      images: [
        {
          src: "/images/haos-install.svg",
          alt: "USB → mini PC → homeassistant.local:8123",
          caption: "HAOS върху SSD · вход на :8123",
        },
      ],
      setup: [
        "От друг компютър изтегли Generic x86-64 образа от https://www.home-assistant.io/installation/generic-x86-64/.",
        "В BIOS включи UEFI и изключи Secure Boot. Клавишът зависи от mini PC-а — често F2, Del, F1 или F10.",
        "Препоръчителният метод е да стартираш Ubuntu Live от USB и с Disks да възстановиш HAOS образа върху вътрешния SSD. Алтернативно използвай balenaEtcher от друг компютър, ако можеш безопасно да свържеш SSD-то.",
        "Тази операция изтрива целия избран диск. След нея изключи mini PC-а, махни временния USB и стартирай от вътрешния SSD.",
        "Свържи Ethernet и изчакай първото изтегляне на Home Assistant. От телефон в същата мрежа отвори http://homeassistant.local:8123 (или IP на машината).",
        "Създай акаунт, задай локация/час и завърши първоначалната настройка.",
      ],
      warnings: [
        "HAOS няма автоматичен инсталатор, който безопасно да избере диска вместо теб. Увери се два пъти, че избираш правилния SSD и че няма важни данни там.",
      ],
    },
    {
      id: "shelly",
      title: "Монтирай Shelly",
      summary:
        "Релето влиза в кутията на ключа или до лампата и управлява 220 V веригата. Моделът вече трябва да е избран според наличието на неутрала. Монтажът е за електротехник.",
      power: {
        label: "220 V",
        detail:
          "С неутрала: Shelly 1PM Mini Gen4. Без неутрала: Shelly 1L Gen3 + bypass. Виж ръководството преди поръчка, ако още не си сигурен.",
      },
      help: [
        {
          href: "/help/shelly-neutral",
          label: "С или без неутрала",
          description:
            "Как се избира моделът и защо не пипаш сам окабеляването.",
        },
      ],
      images: [
        {
          src: "/images/shelly-neutral.svg",
          alt: "Схема: ключ с и без неутрала N",
          caption: "Има N → 1PM Mini · няма N → 1L + bypass",
        },
      ],
      setup: [
        line(
          "Ако още не си поръчал: електротехникът отваря кутията, казва има ли N, ти купуваш съответния модел от ",
          stepRef("overview", "стъпка 1"),
          ".",
        ),
        "Електротехникът монтира релето по схемата на Shelly за твоя модел.",
        "След монтажа провери ръчния ключ: лампата трябва да се включва и изключва както преди (или според новата логика на монтажа).",
        "Свържи Shelly към 2.4 GHz Wi-Fi през приложението Shelly или AP режим. Запиши IP адреса, ако го показва.",
      ],
      warnings: [
        "Не работи по мрежата 220 V без квалификация. Грешка тук е опасна.",
      ],
    },
    {
      id: "shelly-ha",
      title: "Свържи Shelly с HA",
      summary:
        "Добавяш релето в Home Assistant през локалната мрежа. Оттук нататък телефонът, автоматизациите и гласът управляват лампата без Shelly Cloud.",
      setup: [
        "Увери се, че mini PC-ът и Shelly са в една LAN.",
        "Настройки → Устройства и услуги → Добави интеграция → Shelly. При откриване приеми устройството; иначе въведи IP.",
        "Преименувай го на „Лампа хол“ (или както викате лампата вкъщи).",
        "Тествай включване/изключване от интерфейса на HA няколко пъти.",
        line(
          "В Developer Tools → States си запиши entity_id — ще трябва за ",
          stepRef("phrases", "готовите фрази"),
          ".",
        ),
      ],
    },
    {
      id: "area",
      title: "Назови стаята",
      summary:
        "Зоната и българските алтернативни имена са мостът между това, което казваш на глас, и конкретното реле. Без тях Assist често „не разбира“ дори при правилен Whisper.",
      setup: [
        "Настройки → Зони → Добави „Хол“.",
        "Присвои лампата към зоната Хол.",
        "Добави алтернативни имена: „лампата в хола“, „осветлението в хола“.",
        "В Assist / exposed entities остави видима само тази лампа за пилота — после добавяш още.",
        "Пробвай писан Assist: „включи лампата в хола“. Трябва да светне преди изобщо да пипаш микрофон.",
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
      id: "pipeline",
      title: "Гласова верига",
      summary: `На HA OS инсталираш приложенията Whisper и по желание Piper, свързваш ги през Wyoming и казваш на ${primary} коя Assist гласова верига да използва. Това е „мозъкът“ на разговора.`,
      help: [
        {
          href: "/help/voice-pipeline",
          label: "Подробно: гласова верига",
          description: "STT, TTS, език Bulgarian, Cloud срещу локални приложения.",
        },
      ],
      images: [
        {
          src: "/images/pipeline.svg",
          alt: "Поток: wake word → STT → Assist → Shelly",
          caption: "Гласова верига · от wake word до лампата",
        },
      ],
      setup: [
        "Настройки → Приложения. Инсталирай Whisper (faster-whisper) и го стартирай. В по-новите версии Home Assistant тези пакети са приложения, а не добавки.",
        "На N100 започни с модел Base — достатъчен за първи тест и по-бърз; опитай Small само ако Base греши твърде често.",
        "По желание инсталирай Piper за локален гласов отговор. Провери българския глас и качеството с реални фрази.",
        "От Settings → Devices & services добави Wyoming, ако Whisper/Piper не се открият автоматично.",
        `От Настройки → Гласови асистенти създай гласова верига с Conversation agent = Home Assistant, STT = Whisper, език Bulgarian и по желание TTS = Piper. Задай я на ${primary}.`,
        "Документация при нужда: https://www.home-assistant.io/voice_control/",
      ],
      code: [
        {
          title: "Напомняне за потока",
          language: "text",
          content: PIPELINE_CHEAT_SHEET,
        },
      ],
    },
    {
      id: "wake-word",
      title: "Активация с глас",
      summary: `Казваш английска wake дума, ${primary} светва, после казваш българската команда. Системата сама спира да слуша при тишина. Българска wake дума още няма като готов продукт.`,
      images: [
        {
          src: "/images/wake-word.svg",
          alt: "OK, Nabu → слуша → българска команда",
          caption: "Първо wake word (EN), после командата (BG)",
        },
      ],
      setup: [
        `В настройките на ${primary} / Assist избери wake word — „OK, Nabu“ или „Hey Jarvis“ са добри стартове.`,
        "Кажи wake word. Устройството трябва да покаже, че слуша (светлини / звук).",
        "Веднага кажи командата на български, напр. „Включи лампата в хола“.",
        "Замълчи. VAD засича края на фразата и праща аудиото към Whisper.",
        `На ${primary} светлините обикновено минават през: слуша → мисли → отговаря. Научи ги — помагат при дебъг.`,
        "Ако гласът не работи, първо пробвай същата фраза с писан текст в Assist.",
      ],
      warnings: [
        "Wake word и командата са две отделни неща: първо английската дума, после българската фраза.",
      ],
      code: [
        {
          title: "Примерен разговор",
          language: "text",
          content: `Ти: „OK, Nabu“
Устройството: започва да слуша

Ти: „Тъмно е в хола“
(спираш)

Системата: тишина → Whisper → лампата → потвърждение`,
        },
      ],
    },
    {
      id: "whisper",
      title: "Тюнинг Whisper",
      summary:
        "Pipeline-ът вече работи — сега подобряваш точността на българския. Слушаш реални фрази от хората вкъщи, записваш грешките и коригираш с фрази/имена, вместо веднага да скачаш към облак.",
      setup: [
        "Остани на модел Base, докато нямаш конкретна причина за по-тежък модел.",
        "Потвърди в pipeline, че езикът е Bulgarian.",
        "Кажи 10–15 реални фрази така, както ги казвате всеки ден (не „лабораторно“).",
        line(
          "Запиши какво Whisper чува грешно. После оправи с алтернативни имена, custom sentences или автоматизации (",
          stepRef("phrases", "готови фрази"),
          ").",
        ),
        "Помни: аудиото остава у дома при локален Whisper — това е смисълът на N100.",
      ],
    },
    {
      id: "phrases",
      title: "Готови български фрази",
      summary:
        "За критичните команди не разчитай само на свободен език. Слагаш няколко изречения, които винаги включват лампата — дори ако Whisper обърка една дума.",
      help: [
        {
          href: "/help/bulgarian-phrases",
          label: "Подробно: фрази и автоматизации",
          description: "Sentence trigger, entity_id, стратегия за надеждност.",
        },
      ],
      setup: [
        "Потвърди с писан Assist, че базовата команда вече работи.",
        "Създай автоматизация с тригер Conversation / Изречение или копирай YAML-а по-долу.",
        "Смени entity_id с реалния от Developer Tools → States.",
        "Сложи фрази: „Тъмно е в хола“, „Пусни лампата в хола“, „Стана тъмно“, „Включи осветлението“.",
        `Задай кратък отговор („Включвам лампата.“) — после TTS/бийп ще го чуеш на ${primary}.`,
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
      id: "tts",
      title: "Гласов отговор",
      summary:
        "След като лампата се включва надеждно, добавяш потвърждение: бийп или Piper. Перфектният български глас може да почака — първо стабилност.",
      setup: [
        "В гласовата верига добави TTS: Piper (локален) или временно остави само визуален/бийп отговор от сателита.",
        "Ако Piper няма добър български глас за теб — не блокирай проекта заради това. Бийп + работеща лампа е успех за пилота.",
        `Когато си готов, пробвай кратки отговори на автоматизациите да се чуват на ${primary}.`,
      ],
    },
    {
      id: "test",
      title: "Финален тест",
      summary:
        "Един спокоен пълен цикъл в хола. Ако мине — имаш работещ пилот. Ако Whisper често греши, следващата стъпка е облак само за говор.",
      setup: [
        "Кажи wake word, после „Тъмно е в хола“. Изчакай тишината да затвори записа.",
        `Лампата трябва да светне. ${primary} трябва да даде бийп или глас.`,
        "Измери грубо секундите от края на фразата до светлината — запиши си ги.",
        "Повтори 5 пъти в нормални условия (телевизор слабо, хора в стаята).",
        line(
          "Ако локалният Whisper е слаб: ",
          stepRef("cloud", "Облак (по избор)"),
          ". Ако всичко е стабилно: ",
          stepRef("expand", "Още стаи"),
          ".",
        ),
      ],
    },
    {
      id: "cloud",
      title: "Облак (по избор)",
      summary:
        "Nabu Casa е резервен вариант само за разпознаване/TTS, ако локалният Whisper не стига. Shelly и автоматизациите си остават у дома. Връзката за абонамент е в списъка от първата стъпка.",
      setup: [
        "Абонирай се само след като си пробвал локалния Base/Small и готовите фрази.",
        "В гласовата верига смени STT (и при нужда TTS) към Home Assistant Cloud.",
        "Обясни на хората вкъщи, че аудиото за разпознаване вече напуска дома — управлението на релетата все пак е локално.",
        line(
          "Тествай същите фрази като във ",
          stepRef("test", "финалния тест"),
          " и сравни латентност/точност.",
        ),
      ],
      warnings: ["Облакът е за говор, не за управление на релетата."],
    },
    {
      id: "expand",
      title: "Още стаи",
      summary: expandSummary(prefs),
      help:
        prefs.voiceStrategy !== "voice-pe"
          ? [
              {
                href: "/help/atom-echo-flash",
                label: "Инсталация на ATOM Echo",
                description:
                  "Chrome на компютър — същото ръководство като в тестовия план.",
              },
            ]
          : undefined,
      setup: expandSetup(prefs, rooms),
    },
  ];

  const switchLink =
    prefs.testOs === "skip"
      ? null
      : { href: "/test", label: "Минимален тест преди покупки →" };

  return {
    id: "full",
    storageKey: "smart-home-steps-full-v4",
    title: "Умен дом",
    subtitle: `Home Assistant OS · Shelly · ${primary} · глас на български`,
    badge: "Пълен план",
    switchLink,
    steps: numberSteps(spine),
  };
}

function expandSummary(prefs: UserPrefs): string {
  const { voiceStrategy, rooms } = prefs;
  const roomHint =
    rooms <= 1
      ? "Когато холът е стабилен, повтаряш същата последователност за следващите стаи."
      : `Планираш около ${rooms} стаи — повтаряш последователността стая по стая, не всичко наведнъж.`;

  if (voiceStrategy === "atom") {
    return `${roomHint} За всяка нова стая: Shelly → зона → имена → ATOM Echo.`;
  }
  if (voiceStrategy === "voice-pe") {
    return `${roomHint} За важни стаи — пак Voice PE; следи бюджета, защото PE е по-скъп от ATOM Echo.`;
  }
  return `${roomHint} За бюджетни / тихи стаи ползваш ATOM Echo; за натоварени — Voice PE.`;
}

function expandSetup(prefs: UserPrefs, rooms: number): RoadmapStep["setup"] {
  const base: RoadmapStep["setup"] = [
    line(
      "За всяка нова стая: монтаж на Shelly (",
      stepRef("shelly", "Монтирай Shelly"),
      ") → връзка с HA (",
      stepRef("shelly-ha", "Свържи Shelly"),
      ") → зона и имена (",
      stepRef("area", "Назови стаята"),
      ") → фрази (",
      stepRef("phrases", "Готови фрази"),
      ").",
    ),
  ];

  if (prefs.voiceStrategy === "voice-pe") {
    return [
      ...base,
      "Добави Voice PE в новата стая по същия wizard като в хола.",
      `Ориентир: ~${rooms} релета и ~${Math.min(rooms, 3)} Voice PE устройства в началото — не експонирай десетки устройства към Assist наведнъж.`,
      "Не експонирай десетки устройства към Assist наведнъж — добавяй стая по стая.",
    ];
  }

  if (prefs.voiceStrategy === "atom") {
    return [
      ...base,
      "Инсталирай софтуера на ATOM Echo през Chrome от https://www.home-assistant.io/voice_control/thirteen-usd-voice-remote/ и го свържи към същата гласова верига.",
      "Постави ATOM Echo близо до човека — говорителят и микрофонът са малки.",
      `Ориентир за ~${rooms} стаи: по едно Shelly + един Echo на стая.`,
      "Не експонирай десетки устройства към Assist наведнъж — добавяй стая по стая.",
    ];
  }

  return [
    ...base,
    "Инсталирай софтуера на ATOM Echo през Chrome от https://www.home-assistant.io/voice_control/thirteen-usd-voice-remote/ и го свържи към същата гласова верига.",
    "Постави ATOM Echo близо до човека — говорителят и микрофонът са малки.",
    "Ако микрофонът не се справя, сложи Voice PE вместо ATOM Echo в тази стая.",
    `Ориентир: 1 Voice PE за хола + ATOM Echo за останалите от ~${rooms} стаи.`,
    "Не експонирай десетки устройства към Assist наведнъж — добавяй стая по стая.",
  ];
}

/** Static fallback for metadata / SSR without prefs. */
export const fullPlanFallback = buildFullPlan({
  voiceStrategy: "hybrid",
  testOs: "macos",
  budgetLevel: "comfort",
  budgetEur: 350,
  rooms: 1,
  onboardingDone: true,
});
