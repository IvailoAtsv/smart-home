import type { BuyGroup } from "../types";

/** One Shelly path: with or without neutral. User picks exactly one. */
export const shellyBuyGroups: BuyGroup[] = [
  {
    id: "shelly",
    title: "Shelly реле за лампата",
    description:
      "Първо попитай електротехник дали в кутията на ключа има неутрала (N). После избери само един от двата варианта.",
    pickOne: true,
    items: [
      {
        id: "shelly-with-n",
        label: "С неутрала · Shelly 1PM Mini Gen4",
        store: "ВИКИВАТ",
        approxPrice: "≈ 21 €",
        url: "https://vikiwat.com/wi-fi-smart-elektromer-230vac-shelly-plus-1pm-mini-monofazen-265666",
        notes:
          "8 A, с измерване на ток. Подходящ, ако в кутията има син/черен N проводник.",
      },
      {
        id: "shelly-without-n",
        label: "Без неутрала · Shelly 1L Gen3",
        store: "ВИКИВАТ",
        approxPrice: "≈ 35 €",
        url: "https://vikiwat.com/wi-fi-smart-relay-220-240vac-12a-shelly-1l-gen3-261637",
        notes: "За стари инсталации без N. В комплекта е bypass модул.",
      },
    ],
  },
];
