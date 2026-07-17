import type { BuyGroup } from "../types";

export const atomEchoBuyGroups: BuyGroup[] = [
  {
    id: "atom-device",
    title: "Гласов сателит · ATOM Echo",
    description: "M5Stack ATOM Echo. Избери един магазин.",
    pickOne: true,
    items: [
      {
        id: "atom-robotshop",
        label: "M5Stack ATOM Echo Dev Kit",
        store: "RobotShop EU",
        approxPrice: "≈ 13 €",
        url: "https://eu.robotshop.com/products/m5stack-atom-echo-smart-speaker-dev-kit",
        notes: "Доставка в ЕС, включително България.",
      },
      {
        id: "atom-m5stack",
        label: "M5Stack ATOM Echo Dev Kit",
        store: "shop.m5stack.com",
        approxPrice: "≈ 14 $",
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
        store: "eMAG.bg",
        approxPrice: "≈ 8 €",
        url: "https://www.emag.bg/usb-c-kabeli/c",
        notes: "Не ползвай кабел само за зареждане.",
      },
    ],
  },
];
