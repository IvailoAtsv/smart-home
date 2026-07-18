export type HelpSectionImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type HelpArticle = {
  slug: string;
  title: string;
  description: string;
  sections: {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
    images?: HelpSectionImage[];
  }[];
  relatedSteps?: { href: string; label: string }[];
};

export const helpArticles: HelpArticle[] = [
  {
    slug: "kak-raboti",
    title: "Как работи цялата система",
    description:
      "От wake word до лампата — какво се случва във всеки момент и кога системата може да работи без интернет.",
    sections: [
      {
        heading: "Големият поток",
        images: [
          {
            src: "/images/pipeline.svg",
            alt: "Поток wake → STT → Assist → Shelly",
            caption: "Една команда минава през тези стъпки",
          },
        ],
        paragraphs: [
          "Гласовото устройство (Voice PE или ATOM Echo) стои в стаята и чака wake word — кратка дума като „OK, Nabu“. Когато я разпознае, устройството започва да слуша командата.",
          "След wake word устройството записва следващите секунди говор и ги изпраща по Wi-Fi към Home Assistant. HA подава аудиото към избрания STT engine (Home Assistant Cloud, локален Whisper или Speech-to-Phrase), получава текст, обработва командата чрез Assist и казва на Shelly да включи лампата.",
          "После HA може да върне кратък отговор — бийп или TTS — към говорителя на сателита. При изцяло локална конфигурация целият поток може да работи без интернет, стига устройствата да са в една и съща локална мрежа.",
        ],
      },
      {
        heading: "Три стратегии за глас",
        paragraphs: [
          "При onboarding избираш: само ATOM Echo (евтино, много стаи), само Voice PE (по-добър микрофон), или хибрид — Voice PE в натоварените стаи и ATOM Echo в останалите.",
        ],
        bullets: [
          "ATOM Echo ≈ 13 € · прошивка през Chrome · по-слаб микрофон на разстояние.",
          "Voice PE ≈ 59 € · официален HA сателит · по-добър за хол.",
          "Хибридът е най-честият разумен баланс цена/качество.",
        ],
      },
      {
        heading: "Какво трябва онлайн",
        paragraphs: [
          "При временния тест (macOS, Windows или Linux виртуална машина) интернет е нужен за настройката на VM, добавянето на устройството, прошивката и Home Assistant Cloud. При пълния план можеш да преминеш към локални приложения и тогава критичният поток (глас → лампа) остава в LAN.",
        ],
        bullets: [
          "Shelly Cloud не е нужен — ползваме локалната HA интеграция.",
          "Home Assistant Cloud е най-бързият първи вариант, но аудиото за гласова обработка напуска дома. Локалният Whisper или Speech-to-Phrase плюс Piper е по-приватният вариант.",
        ],
      },
      {
        heading: "Тест срещу пълен монтаж",
        images: [
          {
            src: "/images/architecture-test.svg",
            alt: "Тестова архитектура",
          },
        ],
        paragraphs: [
          "Тестовият план пуска временна Home Assistant OS във виртуална машина на твоя компютър (macOS с UTM, Windows с VirtualBox/Hyper-V или Linux с KVM) и проверява гласовия поток с ATOM Echo или Voice PE. Пълният план използва постоянен mini PC с Home Assistant OS — същата логика, но с по-стабилен хардуер.",
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
      "Защо Docker Desktop не е основният тестов път и какво губиш спрямо HAOS виртуална машина.",
    sections: [
      {
        heading: "Защо не е основният план",
        paragraphs: [
          "Home Assistant Container няма приложения като HAOS, а официалната документация изрично казва, че Docker Desktop не работи за този инсталационен път. Затова Docker Desktop не е надеждната основа за гласовия тест. Виж актуалното ръководство: https://www.home-assistant.io/installation/generic-x86-64/.",
        ],
      },
      {
        heading: "Какво би означавал този експеримент",
        paragraphs: [
          "Можеш да стартираш Home Assistant Container и отделни Wyoming услуги за STT и TTS, но ще управляваш ръчно мрежата, обновленията и гласовите услуги. Това е експеримент за човек, който вече работи уверено с Docker, а не най-краткият път до ATOM Echo.",
          "За Apple Silicon и реален гласов тест използвай временна ARM64 HAOS виртуална машина в UTM от тестовия план.",
        ],
      },
      {
        heading: "Ако все пак експериментираш",
        paragraphs: [
          "Home Assistant Container използва отделни Wyoming услуги за STT и TTS. След това в Settings → Devices & services добавяш Wyoming, а в Settings → Voice assistants избираш STT engine, TTS и език. Помни, че Container няма достъп до HAOS приложенията.",
        ],
        bullets: [
          "Docker Desktop има различно network поведение от Linux Docker Engine и може да попречи на discovery.",
          "Не го използвай като доказателство, че основната архитектура работи, ако ATOM или Shelly не се откриват.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/test#node-laptop", label: "Препоръчителният Mac тест" },
    ],
  },
  {
    slug: "test-windows",
    title: "Минимален тест на Windows",
    description:
      "VirtualBox или Hyper-V, x86-64 HAOS и bridged мрежа към Shelly и гласовото устройство.",
    sections: [
      {
        heading: "Какво ти трябва",
        paragraphs: [
          "Windows 10/11 PC с поне 8 GB RAM (по-добре 16), VirtualBox или Hyper-V (Pro/Enterprise), и Generic x86-64 Home Assistant OS image от официалния сайт.",
        ],
        bullets: [
          "Shelly вече на 2.4 GHz Wi-Fi в същата LAN.",
          "ATOM Echo или Voice PE според избора ти при onboarding.",
          "Desktop Chrome за прошивка на ATOM Echo (ако ползваш Echo).",
        ],
      },
      {
        heading: "VirtualBox стъпки",
        paragraphs: [
          "Създай нова VM (Linux / Other 64-bit или UEFI според HAOS инструкциите). Дай 2+ vCPU и 2–4 GB RAM. Закачи HAOS дисковия образ.",
          "В Network избери Bridged Adapter към реалния Ethernet/Wi-Fi адаптер — не NAT. Иначе Shelly и сателитът няма да се виждат от HA.",
          "Стартирай VM. Отвори http://homeassistant.local:8123 от браузър на Windows. Ако mDNS не работи, вземи IP от VirtualBox/router.",
        ],
      },
      {
        heading: "Hyper-V бележки",
        paragraphs: [
          "На Pro можеш да ползваш Hyper-V с външен virtual switch, вързан към физическия NIC. Същата идея: HAOS трябва да е в същата L2 мрежа като IoT устройствата.",
        ],
        bullets: [
          "Изключи sleep на PC-то по време на теста.",
          "Windows Defender / firewall рядко блокира :8123 локално, но провери ако страницата не се отваря.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/test#node-laptop", label: "Тест · Създай временна HA VM" },
    ],
  },
  {
    slug: "test-linux",
    title: "Минимален тест на Linux",
    description:
      "KVM/Virt-Manager или VirtualBox с x86-64 HAOS и bridged/macvtap мрежа.",
    sections: [
      {
        heading: "Какво ти трябва",
        paragraphs: [
          "Linux desktop/laptop с виртуализация (KVM), Virt-Manager или VirtualBox, и Generic x86-64 Home Assistant OS image.",
        ],
      },
      {
        heading: "KVM / Virt-Manager",
        paragraphs: [
          "Импортирай HAOS диска. Дай 2+ vCPU и 2–4 GB RAM. За мрежата използвай bridge към LAN интерфейса или macvtap в bridge режим — NAT няма да стигне за discovery на Shelly/ESPHome.",
          "Стартирай VM и отвори http://homeassistant.local:8123 (или IP от `virsh` / router).",
        ],
        bullets: [
          "Увери се, че IoT VLAN (ако имаш) е същият, в който е VM.",
          "Не оставяй хоста в suspend по време на теста.",
        ],
      },
      {
        heading: "VirtualBox на Linux",
        paragraphs: [
          "Същият рецепт като на Windows: Bridged Adapter, не NAT. След това продължи тестовия план от „Завърши HA“.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/test#node-laptop", label: "Тест · Създай временна HA VM" },
    ],
  },
  {
    slug: "atom-echo-flash",
    title: "Прошивка на M5Stack ATOM Echo",
      description:
      "Chrome на компютър, USB-C кабел с данни, 2.4 GHz Wi-Fi и добавяне в Home Assistant.",
    sections: [
      {
        heading: "Какво ти трябва",
        images: [
          {
            src: "/images/atom-echo.svg",
            alt: "ATOM Echo и USB-C",
          },
        ],
        paragraphs: [
          "ATOM Echo, USB-C кабел с данни (кабел само за зареждане няма да покаже сериен порт), Google Chrome на компютър (не Safari) и паролата за 2.4 GHz Wi-Fi мрежата.",
        ],
      },
      {
        heading: "Стъпки",
        images: [
          {
            src: "/images/flash-chrome.svg",
            alt: "Chrome Web Serial",
            caption: "Прошивката минава през Web Serial в Chrome",
          },
        ],
        paragraphs: [
          "Отвори официалното ръководство за ATOM Echo (https://www.home-assistant.io/voice_control/thirteen-usd-voice-remote/) в Chrome. Свържи ATOM Echo към компютъра, натисни Connect и избери новия сериен порт, а после Install Voice Assistant.",
          "Ако няма порт, инсталирай CH342 драйвера от същата страница и пробвай отново. След инсталацията въведи 2.4 GHz Wi-Fi; 5 GHz няма да работи.",
          "Избери Add to Home Assistant. Ще се появи ESPHome интеграцията, а съветникът ще ти помогне да избереш wake word, глас и настройки за устройството.",
        ],
      },
      {
        heading: "Типични проблеми",
        bullets: [
          "Safari или браузър на телефон — Web Serial не работи. Ползвай Chrome на компютър.",
          "Само 5 GHz Wi-Fi вкъщи — направи отделен 2.4 GHz SSID или включи „legacy“/mixed режим на рутера.",
          "Слаб микрофон — говори близо; за постоянен хол Voice PE е по-добър.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/test#node-voice-flash", label: "Тест · Инсталирай ATOM Echo" },
      { href: "/#node-voice-flash", label: "Пълен план · Инсталирай ATOM Echo" },
    ],
  },
  {
    slug: "shelly-neutral",
    title: "Shelly: с или без неутрала",
    description: "Как електротехникът избира модела и защо не пипаш сам инсталацията на 220 V.",
    sections: [
      {
        heading: "Какво е неутрала",
        images: [
          {
            src: "/images/shelly-neutral.svg",
            alt: "С или без неутрала",
            caption:
              "Електротехникът казва има ли N — ти купуваш правилния модел",
          },
        ],
        paragraphs: [
          "В кутията на стенния ключ обикновено има фаза (L), проводник към лампата и понякога неутрален проводник (N — често син). Не всички стари инсталации в България имат N в кутията на ключа.",
        ],
      },
      {
        heading: "Кой модел",
        bullets: [
          "Има N → Shelly 1PM Mini Gen4. Моделът изисква L и N и има измерване на мощност. Официална страница: https://www.shelly.com/products/shelly-1pm-mini-gen4.",
          "Няма N → Shelly 1L Gen3 + Shelly Bypass. Bypass е включен в комплекта на 1L Gen3 и е нужен при LED осветление. Официална страница: https://www.shelly.com/products/shelly-1l-gen3.",
        ],
      },
      {
        heading: "Монтаж",
        paragraphs: [
          "Монтажът е работа за квалифициран електротехник. След монтажа лампата трябва да се включва и ръчно от ключа, и през Wi-Fi. В Home Assistant добавяш Shelly през локалната интеграция — без Shelly Cloud. Ръководство: https://www.home-assistant.io/integrations/shelly/.",
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
      "USB флашка, Ubuntu Live или balenaEtcher, стартиране от USB и първи вход на :8123.",
    sections: [
      {
        heading: "Подготовка",
        images: [
          {
            src: "/images/haos-install.svg",
            alt: "USB към HAOS към :8123",
          },
        ],
        paragraphs: [
          "Нужни са: отделен x86-64 mini PC, USB флашка поне 8 GB (16 GB е практичният избор), Ethernet към рутера и резервно копие на важните данни. N100 с 16 GB RAM е разумна цел за локален Whisper. Официалното ръководство е https://www.home-assistant.io/installation/generic-x86-64/.",
        ],
      },
      {
        heading: "Запис и инсталация",
        paragraphs: [
          "HAOS няма автоматичен инсталатор, който сам избира диска. Препоръчителният метод е Ubuntu Live от USB и Restore Disk Image към вътрешния SSD; balenaEtcher е алтернатива, ако SSD-то може безопасно да се свърже към друг компютър.",
          "В BIOS включи UEFI и изключи Secure Boot. След инсталацията махни временния USB, свържи Ethernet и отвори http://homeassistant.local:8123 (или IP адреса на машината). После създай акаунт и завърши onboarding-а.",
        ],
      },
      {
        heading: "Защо HA OS, не Docker",
        paragraphs: [
          "HAOS е препоръчителният тип за постоянен сървър, защото включва Supervisor и поддържа приложения като Whisper, Piper и ESPHome. За теста използваме HAOS във виртуална машина, така че хост операционната система остава непокътната.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/#node-ha-os", label: "Пълен план · Инсталирай HA" },
    ],
  },
  {
    slug: "voice-pipeline",
    title: "Гласова верига (Whisper + Assist)",
    description: "Как се свързват STT, езикът Bulgarian и гласовото устройство.",
    sections: [
      {
        heading: "Какво е гласова верига",
        images: [
          {
            src: "/images/pipeline.svg",
            alt: "Pipeline диаграма",
          },
        ],
        paragraphs: [
          "Гласовата верига е рецептата на Assist: откъде идва аудиото, кой го превръща в текст (Cloud STT, Whisper или Speech-to-Phrase), как се разбира командата и как се връща отговор (Cloud TTS, Piper или бийп).",
        ],
      },
      {
        heading: "На HA OS",
        paragraphs: [
          "На HAOS отвори Settings → Apps и инсталирай Whisper или Speech-to-Phrase за разпознаване, а по желание Piper за локален гласов отговор. Стартирай приложенията; после в Settings → Devices & services добави откритите Wyoming услуги. Накрая в Settings → Voice assistants → Add assistant създай асистент с Conversation agent = Home Assistant и език Bulgarian. Официалното ръководство е https://www.home-assistant.io/voice_control/voice_remote_local_assistant.",
        ],
      },
      {
        heading: "На Container",
        paragraphs: [
          "Няма приложения като в HAOS — използваш отделни STT/TTS контейнери и ръчно добавяш Wyoming. Това е възможно, но е напреднал вариант; за теста използвай HAOS виртуална машина.",
        ],
      },
    ],
    relatedSteps: [
      { href: "/#node-pipeline", label: "Пълен план · Гласова верига" },
      { href: "/test#node-pipeline", label: "Тест · Гласова верига" },
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
          "Whisper понякога обърква думи. За критични команди („включи лампата“) първо направи автоматизации с точни фрази: „Тъмно е в хола“, „Пусни лампата в хола“. После ги разширявай.",
        ],
      },
      {
        heading: "Как да добавиш",
        paragraphs: [
          "В HA: Автоматизации → Създай → Тригер: Sentence / Conversation. За първия опит използвай визуалния редактор; YAML примерът в плана е за по-техническа настройка. Официалният формат е описан тук: https://www.home-assistant.io/docs/automation/trigger/#sentence-trigger.",
          "Смени entity_id с реалния от Developer Tools → States (например light.lampa_hol или switch.shelly...).",
        ],
      },
      {
        heading: "Имена на устройства",
        paragraphs: [
          "Зона „Хол“ и алтернативни имена („лампата в хола“) помагат на Assist да разбере естествени фрази. За начало експонирай само една лампа към Assist. Виж и https://www.home-assistant.io/voice_control/best_practices.",
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
