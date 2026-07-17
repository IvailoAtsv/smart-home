import type { Metadata } from "next";
import { InstallApp } from "@/components/InstallApp";
import { testPlan } from "@/data/plans/test";

export const metadata: Metadata = {
  title: "Минимален тест · Умен дом",
  description:
    "Бърз тест с MacBook, Home Assistant + Whisper в Docker, Shelly и M5Stack ATOM Echo — глас на български.",
};

export default function TestPage() {
  return <InstallApp plan={testPlan} />;
}
