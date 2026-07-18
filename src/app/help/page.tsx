import type { Metadata } from "next";
import { HelpIndexGrid } from "@/components/help/HelpIndexGrid";
import { HelpShell } from "@/components/help/HelpShell";
import { helpArticles } from "@/data/help/articles";

export const metadata: Metadata = {
  title: "Ръководства · Умен дом",
  description:
    "Подробни уроци за Home Assistant, Shelly, ATOM Echo, Voice PE и глас на български.",
};

export default function HelpIndexPage() {
  return (
    <HelpShell
      backHref="/"
      backLabel="Към плана за монтаж"
      title="Ръководства"
      description="По-дълги уроци за частите, които не се побират в една стъпка. Отвори ръководство, прочети спокойно, после се върни към плана и продължи монтажа."
    >
      <HelpIndexGrid articles={helpArticles} />
    </HelpShell>
  );
}
