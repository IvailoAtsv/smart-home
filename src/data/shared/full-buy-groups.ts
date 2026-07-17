import type { BuyGroup } from "../types";

export const serverBuyGroups: BuyGroup[] = [
  {
    id: "mini-pc",
    title: "Mini PC (сървър 24/7)",
    description:
      "Intel N100, 16 GB RAM, SSD ~500 GB. Избери един модел от списъка, после го поръчай.",
    pickOne: true,
    items: [
      {
        id: "pc-beelink-boboox",
        label: "Beelink S12 Pro · N100 · 16 GB · 500 GB",
        store: "boboox.com",
        approxPrice: "240 €",
        url: "https://www.boboox.com/produkt/%d0%bc%d0%b8%d0%bd%d0%b8-%d0%ba%d0%be%d0%bc%d0%bf%d1%8e%d1%82%d1%8a%d1%80-beelink-s12-pro-mini-pc-16gb-500gb-m-2-ssd-intel-n100/",
        notes: "Добър баланс цена/наличност за Home Assistant + Whisper.",
      },
      {
        id: "pc-beelink-emag",
        label: "Beelink Mini S12 Pro · N100 · 16 GB · 500 GB",
        store: "eMAG.bg",
        approxPrice: "271 €",
        url: "https://www.emag.bg/mini-kompjutyr-beelink-mini-s12-pro-16gb-ram-500gb-ssd-windows-11-dual-lan-wifi-6-4k-3-4ghz-mini-tower-8719324329798/pd/DBQ17ZYBM/",
        notes: "Същият клас машина, ако предпочиташ eMAG.",
      },
    ],
  },
  {
    id: "server-accessories",
    title: "За инсталацията на сървъра",
    description: "Двете неща са задължителни заедно с mini PC-то.",
    items: [
      {
        id: "usb-stick",
        label: "USB флашка 16 GB",
        store: "eMAG.bg",
        approxPrice: "≈ 16 €",
        url: "https://www.emag.bg/usb-flash-pamet-sandisk-ultra-fit-16-gb-usb-3-1-cherna-sdcz430-016g-g46/pd/DS80LSBBM/",
        notes: "За запис на Home Assistant OS.",
      },
      {
        id: "ethernet-cable",
        label: "Ethernet кабел Cat6 · 2 m",
        store: "eMAG.bg",
        approxPrice: "≈ 3 €",
        url: "https://www.emag.bg/gembird-utp-kabel-kat-6-2m-zeleno-pp6u-2m-g/pd/DM8RJSBBM/",
        notes: "Свържи mini PC директно към рутера.",
      },
    ],
  },
];

export const voicePeBuyGroups: BuyGroup[] = [
  {
    id: "voice-pe",
    title: "Глас за хола · Voice PE",
    description:
      "Официалният микрофон/говорител на Home Assistant. Избери един магазин. USB-C захранване 20W често не е в кутията.",
    pickOne: true,
    items: [
      {
        id: "voice-pe-domadoo",
        label: "Home Assistant Voice Preview Edition",
        store: "Domadoo",
        approxPrice: "59 €",
        url: "https://www.domadoo.fr/bg/domashen-avtomatizacionen-boks/7558-nabu-casa-asistent-za-glasovo-upravlenie-na-doma-home-assistant-voice-preview-edition-0860011789727.html",
        notes: "Доставка до България.",
      },
      {
        id: "voice-pe-alza",
        label: "Home Assistant Voice Preview Edition",
        store: "Alza.cz",
        approxPrice: "59 €",
        url: "https://www.alza.cz/home-assistant-voice-preview-edition-d12741248.htm",
        notes: "Провери доставката до България.",
      },
    ],
  },
];

export const optionalBuyGroups: BuyGroup[] = [
  {
    id: "optional-ups",
    title: "По избор · UPS",
    description: "Държи сървъра и рутера при кратко спиране на тока.",
    items: [
      {
        id: "ups-njoy",
        label: "UPS NJOY Keen 600 VA",
        store: "eMAG.bg",
        approxPrice: "≈ 40 €",
        url: "https://www.emag.bg/ups-i/c",
        notes: "Потърси „NJOY Keen 600“ в категорията UPS.",
      },
    ],
  },
  {
    id: "optional-cloud",
    title: "По избор · облак за говор",
    description:
      "Само ако локалният Whisper не е достатъчно точен. Управлението на Shelly остава локално.",
    items: [
      {
        id: "nabu-casa",
        label: "Home Assistant Cloud (Nabu Casa)",
        store: "nabucasa.com",
        approxPrice: "7,50 €/мес.",
        url: "https://www.nabucasa.com/",
        notes: "Аудиото за разпознаване напуска къщата.",
      },
    ],
  },
];
