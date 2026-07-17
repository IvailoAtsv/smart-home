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
          "След wake word устройството записва следващите ти секунди говор и ги изпраща по Wi-Fi към Home Assistant в къщата. HA подава аудиото на Whisper (локален speech-to-text), получава български текст, пуска автоматизация или Assist, и казва на Shelly да включи лампата.",
          "После HA може да върне кратък отговор (бийп или TTS) към говорителя на сателита. Целият кръг може да се случи без интернет, стига устройствата да са в една и съща локална мрежа.",
        ],
      },
      {
        heading: "Какво трябва онлайн",
        paragraphs: [
          "Интернет ти трябва само при първа настройка: изтегляне на Docker образи / HA OS, прошивка на ATOM Echo, изтегляне на Whisper модел. След това критичният поток (глас → лампа) остава в LAN.",
        ],
        bullets: [
          "Shelly Cloud не е нужен — ползваме локалната HA интеграция.",
          "Nabu Casa Cloud е опция само ако локалният Whisper греши твърде често на български.",
        ],
      },
      {
        heading: "Тест срещу пълен монтаж",
        paragraphs: [
          "Тестовият план ползва твоя MacBook като временен сървър (Docker) и ATOM Echo като микрофон. Пълният план слага постоянен mini PC с Home Assistant OS и Voice PE в хола — същата логика, по-стабилен хардуер.",
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
    title: "Home Assistant + Whisper на Mac с Docker",
    description:
      "Стъпка по стъпка: Docker Desktop, docker-compose, портове и как HA намира Whisper.",
    sections: [
      {
        heading: "Защо два контейнера",
        paragraphs: [
          "Home Assistant в Docker няма add-on магазин като HA OS. Затова Whisper не се инсталира „вътре“ в HA, а като отделен контейнер (faster-whisper), който говори по протокола Wyoming на порт 10300.",
        ],
      },
      {
        heading: "Как да стартираш",
        paragraphs: [
          "Инсталирай Docker Desktop и го остави включен. Създай папка, напр. ~/smart-home-test. Вътре създай файл docker-compose.yml с двата сервиса (копирай от стъпката в плана).",
          "В Terminal: cd ~/smart-home-test && docker compose up -d. Първият път ще изтегли образите и Whisper модела — може да отнеме няколко минути.",
          "Отвори http://localhost:8123 и си създай акаунт. От телефона ползвай http://IP-на-MacBook:8123 (IP го виждаш в System Settings → Network → Wi-Fi).",
        ],
      },
      {
        heading: "Свързване на Wyoming",
        paragraphs: [
          "В HA: Настройки → Устройства и услуги → Добави интеграция → Wyoming. Host обикновено е host.docker.internal (Mac вижда хоста така от контейнера) или директно IP адреса на MacBook. Порт: 10300.",
          "После: Настройки → Гласови асистенти → pipeline → Speech-to-text = faster-whisper, език Bulgarian.",
        ],
        bullets: [
          "Ако Wyoming не се свързва: docker compose ps — и двата контейнера трябва да са Up.",
          "На macOS не ползвай --network=host; ползвай ports както в compose файла.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/test#node-ha-stack", label: "Тест · HA + Whisper" },
    ],
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
          "Отвори официалния guide на Home Assistant за $13 voice remote в Chrome. Свържи ATOM Echo към Mac. Натисни Connect, избери новия USB serial порт, после Install Voice Assistant.",
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
          "Нужни са: mini PC (x86-64, препоръчително N100 с 16 GB RAM), USB флашка ≥16 GB, Ethernet към рутера. Изтегли официалния HA OS образ за generic x86-64.",
        ],
      },
      {
        heading: "Запис и инсталация",
        paragraphs: [
          "С Balena Etcher запиши образа на флашката. Включи mini PC-а с флашката, влез в BIOS/boot меню и стартирай от USB. Следвай екрана за инсталация върху вътрешния SSD — това изтрива диска.",
          "След рестарт махни флашката. От телефон в същата мрежа отвори http://homeassistant.local:8123 (или IP адреса на машината). Създай акаунт.",
        ],
      },
      {
        heading: "Защо HA OS, не Docker",
        paragraphs: [
          "На постоянния сървър HA OS ти дава add-on магазин (Whisper, Piper, ESPHome) с един клик. На Mac теста ползваме Docker, защото не искаме да преинсталираме лаптопа.",
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
          "Pipeline-ът е рецепта: откъде идва аудиото, кой го превръща в текст (Whisper), как се разбира командата (Assist / automation), и как се връща отговор (Piper / бийп).",
        ],
      },
      {
        heading: "На HA OS",
        paragraphs: [
          "Инсталирай add-on Whisper (и по желание Piper) от Магазина за добавки. Wyoming обикновено ги открива сам. В Гласови асистенти създай pipeline с език Bulgarian и го присвои към Voice PE.",
        ],
      },
      {
        heading: "На Docker (Mac)",
        paragraphs: [
          "Няма add-ons — ползваш отделния faster-whisper контейнер и ръчно добавяш Wyoming интеграцията към host:port 10300. Същият pipeline UI.",
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
