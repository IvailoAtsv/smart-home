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
        store: "Technomarket.bg",
        approxPrice: "≈ 1,99 €",
        url: "https://www.technomarket.bg/kompyuterni-kabeli/gembird-pp6-2m-w-09219414",
        notes: "Свържи mini PC директно към рутера; провери наличността преди поръчка.",
      },
    ],
  },
];

export const voicePeBuyGroups: BuyGroup[] = [
  {
    id: "voice-pe",
    title: "Глас за хола · Voice PE",
    description:
      "Официалният микрофон/говорител на Home Assistant. Избери един магазин. Кабелът и зарядното не са гарантирани в комплекта.",
    pickOne: true,
    items: [
      {
        id: "voice-pe-domadoo",
        label: "Home Assistant Voice Preview Edition",
        store: "Domadoo",
        approxPrice: "59 €",
        url: "https://www.domadoo.fr/bg/domashen-avtomatizacionen-boks/7558-nabu-casa-asistent-za-glasovo-upravlenie-na-doma-home-assistant-voice-preview-edition-0860011789727.html",
        notes: "EU retailer; провери актуална наличност и доставка до България.",
      },
      {
        id: "voice-pe-alza",
        label: "Home Assistant Voice Preview Edition",
        store: "Alza.cz",
        approxPrice: "59 €",
        url: "https://www.alza.cz/home-assistant-voice-preview-edition-d12741248.htm",
        notes: "EU retailer; провери актуална наличност и доставка до България.",
      },
    ],
  },
  {
    id: "voice-pe-power",
    title: "Захранване и кабел · Voice PE",
    description:
      "Нужни са USB-C захранване 5 V / 2 A и кабел, ако вече нямаш съвместими у дома.",
    items: [
      {
        id: "voice-pe-charger-technopolis",
        label: "Apple USB-C Power Adapter 20 W",
        store: "Technopolis.bg",
        approxPrice: "≈ 51,83 лв.",
        url: "https://www.technopolis.bg/bg/Aksesoari-za-mobilni-telefoni/APPLE-USB-C-POWER-ADAPTER-20-W-MD3J4ZM-A/p/507444",
        notes: "Зарядното е USB-C; кабелът се купува отделно или използвай наличен.",
      },
      {
        id: "voice-pe-cable-ozone",
        label: "USB-C ↔ USB-C кабел с данни · 2 m",
        store: "Ozone.bg",
        approxPrice: "≈ 19,99 лв.",
        url: "https://www.ozone.bg/product/baseus-crystal-shine-series-fast-charging-data-cable-type-c-to-type-c-100w-2m-blue/",
        notes: "Подходящ за USB-C захранване; провери наличността преди поръчка.",
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
        store: "Onlinemashini.bg",
        approxPrice: "≈ 52,66 €",
        url: "https://www.onlinemashini.bg/ups-ustroistbo-njoy-keen-600/87115",
        notes: "Точна продуктова страница; провери наличността и цената преди поръчка.",
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
        url: "https://www.nabucasa.com/pricing/",
        notes: "Аудиото за разпознаване напуска дома.",
      },
    ],
  },
];
