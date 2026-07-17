import type { BuyGroup } from "../types";

export const atomEchoBuyGroups: BuyGroup[] = [
  {
    id: "atom-device",
    title: "Гласов сателит · ATOM Echo",
    description: "M5Stack ATOM Echo. Избери един магазин.",
    pickOne: true,
    items: [
      {
        id: "atom-mouser-bg",
        label: "M5Stack ATOM Echo C008-C",
        store: "Mouser.bg",
        approxPrice: "≈ 11,61 €",
        url: "https://www.mouser.bg/ProductDetail/M5Stack/C008-C",
        notes: "Българска локализирана дистрибуторска страница; провери ДДС, доставка и наличност.",
      },
      {
        id: "atom-digikey-bg",
        label: "M5Stack ATOM Echo C008-C",
        store: "DigiKey.bg",
        approxPrice: "≈ 13,76 € с ДДС",
        url: "https://www.digikey.bg/en/products/detail/m5stack-technology-co-ltd/C008-C/12174736",
        notes: "Българска локализирана дистрибуторска страница; провери доставката.",
      },
      {
        id: "atom-robotshop",
        label: "M5Stack ATOM Echo Dev Kit",
        store: "RobotShop EU",
        approxPrice: "≈ 14,96 €",
        url: "https://eu.robotshop.com/products/m5stack-atom-echo-smart-speaker-dev-kit",
        notes: "Доставка в ЕС, включително България.",
      },
      {
        id: "atom-m5stack",
        label: "M5Stack ATOM Echo Dev Kit",
        store: "shop.m5stack.com",
        approxPrice: "≈ 13,50 $",
        url: "https://shop.m5stack.com/products/atom-echo-smart-speaker-dev-kit",
        notes: "Официален магазин. Провери доставката.",
      },
    ],
  },
  {
    id: "atom-accessories",
    title: "Кабел за ATOM Echo",
    description: "Задължителен USB-C кабел с данни за прошивка от Mac.",
    items: [
      {
        id: "atom-usbc",
        label: "USB-C кабел с данни",
        store: "Ozone.bg",
        approxPrice: "≈ 19,99 лв.",
        url: "https://www.ozone.bg/product/baseus-crystal-shine-series-fast-charging-data-cable-type-c-to-type-c-100w-2m-blue/",
        notes: "Точен кабел с данни за прошивка; не ползвай кабел само за зареждане.",
      },
    ],
  },
];
