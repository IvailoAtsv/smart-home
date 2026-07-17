export type HelpArticle = {
  slug: string;
  title: string;
  description: string;
  sections: {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
  }[];
  relatedSteps?: { href: string; label: string }[];
};

export const helpArticles: HelpArticle[] = [
  {
    slug: "kak-raboti",
    title: "Как работи цялата система",
    description:
      "От wake word до лампата — какво се случва във всеки момент и защо може да е offline.",
    sections: [
      {
        heading: "Големият поток",
        paragraphs: [
          "Гласовото устройство (Voice PE или ATOM Echo) стои в стаята и постоянно слуша само за wake word — кратка английска дума като „Okay Nabu“. Това разпознаване става на самото устройство, не в облака.",
          "След wake word устройството записва следващите ти секунди говор и ги изпраща по Wi-Fi към Home Assistant в къщата. HA подава аудиото към избрания STT engine (първоначално може да е Home Assistant Cloud, по-късно локален Whisper), получава текст, пуска Assist/автоматизация и казва на Shelly да включи лампата.",
          "После HA може да върне кратък отговор (бийп или TTS) към говорителя на сателита. Целият кръг може да се случи без интернет, стига устройствата да са в една и съща локална мрежа.",
        ],
      },
      {
        heading: "Какво трябва онлайн",
        paragraphs: [
          "При временния Mac тест интернет е нужен за VM setup, прошивката и Home Assistant Cloud. При пълния план можеш да преминеш към локални apps и тогава критичният поток (глас → лампа) остава в LAN.",
        ],
        bullets: [
          "Shelly Cloud не е нужен — ползваме локалната HA интеграция.",
          "Nabu Casa Cloud е най-бързият първи pipeline, но аудиото за STT/TTS напуска дома. Локалният Whisper/Piper е по-приватният вариант.",
        ],
      },
      {
        heading: "Тест срещу пълен монтаж",
        paragraphs: [
          "Тестовият план ползва Apple Silicon Mac като временен UTM хост за Home Assistant OS и ATOM Echo като микрофон. Пълният план слага постоянен mini PC с Home Assistant OS и Voice PE в хола — същата логика, по-стабилен хардуер.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/", label: "Пълен план" },
      { href: "/test", label: "Тестов план" },
    ],
  },
  {
    slug: "docker-mac",
    title: "Docker на Mac: напреднал експеримент",
    description:
      "Защо Docker Desktop не е основният тестов път и какво губиш спрямо HAOS VM.",
    sections: [
      {
        heading: "Защо не е основният план",
        paragraphs: [
          "Home Assistant Container няма apps като HAOS, а текущата документация на Home Assistant изрично казва, че Docker Desktop не е поддържан runtime за този installation path. Затова Docker Desktop не е надеждната основа за ATOM теста.",
        ],
      },
      {
        heading: "Какво би означавал този експеримент",
        paragraphs: [
          "Можеш да стартираш Home Assistant Container и отделен Wyoming STT контейнер, но ще управляваш ръчно мрежа, обновления и voice services. Това е експеримент за човек, който вече работи уверено с Docker, не най-краткият път до ATOM Echo.",
          "За Apple Silicon и реален voice тест използвай временна ARM64 HAOS VM в UTM от тестовия план.",
        ],
      },
      {
        heading: "Ако все пак експериментираш",
        paragraphs: [
          "Home Assistant Container използва отделни Wyoming услуги за STT/TTS. След това в Settings → Devices & services добавяш Wyoming, а в Settings → Voice assistants избираш STT engine и език.",
        ],
        bullets: [
          "Docker Desktop има различно network поведение от Linux Docker Engine и може да попречи на discovery.",
          "Не го използвай като доказателство, че основната архитектура работи, ако ATOM или Shelly не се откриват.",
        ],
      },
    ],
    relatedSteps: [{ href: "/test#node-laptop", label: "Препоръчителният Mac тест" }],
  },
  {
    slug: "atom-echo-flash",
    title: "Прошивка на M5Stack ATOM Echo",
    description:
      "Chrome на Mac, USB-C с данни, 2.4 GHz Wi-Fi и добавяне в Home Assistant.",
    sections: [
      {
        heading: "Какво ти трябва",
        paragraphs: [
          "ATOM Echo, USB-C кабел с данни (зарядни-only кабели няма да покажат serial порт), Google Chrome на MacBook (не Safari), и паролата за 2.4 GHz Wi-Fi мрежата.",
        ],
      },
      {
        heading: "Стъпки",
        paragraphs: [
          "Отвори официалния guide на Home Assistant за $13 voice remote (https://www.home-assistant.io/voice_control/thirteen-usd-voice-remote/) в Chrome. Свържи ATOM Echo към Mac. Натисни Connect, избери новия USB serial порт, после Install Voice Assistant.",
          "Ако няма порт — инсталирай CH342 драйвера от същата страница и пробвай отново. След прошивката въведи 2.4 GHz Wi-Fi (не 5 GHz — ATOM Echo не го ползва).",
          "Избери Add to Home Assistant. Ще се появи ESPHome интеграцията. В настройките на устройството задай гласовия pipeline, който вече си създал.",
        ],
      },
      {
        heading: "Типични проблеми",
        bullets: [
          "Safari / телефонен браузър — Web Serial не работи. Ползвай Chrome на desktop.",
          "Само 5 GHz Wi-Fi вкъщи — направи отделен 2.4 GHz SSID или включи „legacy“/mixed режим на рутера.",
          "Слаб микрофон — говори близо; за постоянен хол Voice PE е по-добър.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/test#node-atom-flash", label: "Тест · Прошивай ATOM Echo" },
    ],
  },
  {
    slug: "shelly-neutral",
    title: "Shelly: с или без неутрала",
    description: "Как електротехникът избира модела и защо не пипаш сам 220 V.",
    sections: [
      {
        heading: "Какво е неутрала",
        paragraphs: [
          "В кутията на стенния ключ често има фаза (L), връщане към лампата и понякога неутрала (N — обикновено син проводник). Не всички стари инсталации в България имат N в кутията на ключа.",
        ],
      },
      {
        heading: "Кой модел",
        bullets: [
          "Има N → Shelly 1PM Mini Gen4 (по-малък, с измерване на ток).",
          "Няма N → Shelly 1L Gen3 + bypass модул (по инструкциите на Shelly).",
        ],
      },
      {
        heading: "Монтаж",
        paragraphs: [
          "Монтажът е работа за квалифициран електротехник. След монтажа лампата трябва да се включва и ръчно от ключа, и през Wi-Fi. В Home Assistant добавяш Shelly през локалната интеграция — без Shelly Cloud.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/#node-shelly", label: "Пълен план · Монтирай Shelly" },
    ],
  },
  {
    slug: "ha-os-install",
    title: "Инсталация на Home Assistant OS на mini PC",
    description:
      "USB флашка, Balena Etcher, boot от USB и първи вход на :8123.",
    sections: [
      {
        heading: "Подготовка",
        paragraphs: [
          "Нужни са: отделен x86-64 mini PC, USB флашка поне 8 GB (16 GB е практичният избор), Ethernet към рутера и резервно копие на важните данни. N100 с 16 GB RAM е добра цел за локален Whisper. Официалният guide е https://www.home-assistant.io/installation/generic-x86-64/.",
        ],
      },
      {
        heading: "Запис и инсталация",
        paragraphs: [
          "HAOS няма автоматичен installer, който сам избира диска. Препоръчителният метод е Ubuntu Live от USB и Restore Disk Image към вътрешния SSD; Balena Etcher е алтернативен метод, ако SSD-то може безопасно да се свърже към друг компютър.",
          "В BIOS включи UEFI и изключи Secure Boot. След инсталацията махни временния USB, свържи Ethernet и отвори http://homeassistant.local:8123 (или IP адреса на машината). Създай акаунт.",
        ],
      },
      {
        heading: "Защо HA OS, не Docker",
        paragraphs: [
          "HAOS е препоръчителният тип за постоянен сървър, защото включва Supervisor и apps като Whisper, Piper и ESPHome. За Mac теста използваме HAOS във VM, така че macOS остава непокътнат.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/#node-ha-os", label: "Пълен план · Инсталирай HA" },
    ],
  },
  {
    slug: "voice-pipeline",
    title: "Гласов pipeline (Whisper + Assist)",
    description: "Как се връзва STT, език Bulgarian и гласовото устройство.",
    sections: [
      {
        heading: "Какво е pipeline",
        paragraphs: [
          "Pipeline-ът е рецепта: откъде идва аудиото, кой го превръща в текст (Cloud STT или Whisper), как се разбира командата (Assist/automation), и как се връща отговор (Cloud TTS, Piper или бийп).",
        ],
      },
      {
        heading: "На HA OS",
        paragraphs: [
          "На HAOS отвори Settings → Apps и инсталирай Whisper и по желание Piper. Стартирай apps, добави Wyoming от Settings → Devices & services, после в Settings → Voice assistants създай pipeline с Home Assistant conversation agent и език Bulgarian. Виж и https://www.home-assistant.io/voice_control/voice_remote_local_assistant.",
        ],
      },
      {
        heading: "На Container",
        paragraphs: [
          "Няма apps — използваш отделни STT/TTS контейнери и ръчно добавяш Wyoming. Това е възможно, но е напреднал вариант; за Apple Silicon теста използвай HAOS VM.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/#node-pipeline", label: "Пълен план · Pipeline" },
      { href: "/test#node-pipeline", label: "Тест · Pipeline" },
    ],
  },
  {
    slug: "bulgarian-phrases",
    title: "Български фрази и автоматизации",
    description:
      "Защо готовите изречения са по-надеждни от свободен език в началото.",
    sections: [
      {
        heading: "Стратегия",
        paragraphs: [
          "Whisper понякога обърква думи. За критични команди („включи лампата“) първо правиш автоматизации с точни фрази: „Тъмно е в хола“, „Пусни лампата в хола“. После разширяваш.",
        ],
      },
      {
        heading: "Как да добавиш",
        paragraphs: [
          "В HA: Автоматизации → Създай → Тригер: Sentence / Conversation. Или редактирай configuration.yaml / automations.yaml с примерния YAML от плана.",
          "Смени entity_id с реалния от Developer Tools → States (напр. light.lampa_hol или switch.shelly...).",
        ],
      },
      {
        heading: "Имена на устройства",
        paragraphs: [
          "Зона „Хол“ + алтернативни имена („лампата в хола“) помагат на Assist да разбере естествени фрази. За начало експонирай само една лампа към Assist.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/#node-phrases", label: "Пълен план · Фрази" },
      { href: "/test#node-phrases", label: "Тест · Фрази" },
    ],
  },
];

export const helpBySlug = Object.fromEntries(
  helpArticles.map((a) => [a.slug, a]),
) as Record<string, HelpArticle>;
