import type { Metadata } from "next";
import { InstallApp } from "@/components/InstallApp";

export const metadata: Metadata = {
  title: "Минимален тест · Умен дом",
  description:
    "Бърз тест с временна Home Assistant OS виртуална машина, Shelly и гласово устройство — български глас.",
};

export default function TestPage() {
  return <InstallApp variant="test" />;
}
