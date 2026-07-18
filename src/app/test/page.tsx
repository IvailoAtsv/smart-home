import type { Metadata } from "next";
import { InstallApp } from "@/components/InstallApp";

export const metadata: Metadata = {
  title: "Минимален тест · Умен дом",
  description:
    "Бърз тест с временна Home Assistant OS VM, Shelly и гласово устройство — глас на български.",
};

export default function TestPage() {
  return <InstallApp variant="test" />;
}
