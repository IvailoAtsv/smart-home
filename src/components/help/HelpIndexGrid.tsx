import type { ComponentType } from "react";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import {
  Cloud,
  Cpu,
  GitBranch,
  Lightning,
  Microphone,
  Plugs,
  Waveform,
} from "@phosphor-icons/react/dist/ssr";
import type { HelpArticle } from "@/data/help/articles";

const iconBySlug: Record<
  string,
  ComponentType<{ size?: number; weight?: "duotone" | "bold" }>
> = {
  "kak-raboti": GitBranch,
  "docker-mac": Cpu,
  "atom-echo-flash": Microphone,
  "shelly-neutral": Plugs,
  "ha-os-install": Lightning,
  "voice-pipeline": Waveform,
  "bulgarian-phrases": Cloud,
};

type HelpIndexGridProps = {
  articles: HelpArticle[];
};

export function HelpIndexGrid({ articles }: HelpIndexGridProps) {
  return (
    <ul className="divide-y divide-border/50 border-y border-border/50">
      {articles.map((article) => {
        const Icon = iconBySlug[article.slug] ?? GitBranch;
        return (
          <li key={article.slug}>
            <Link
              href={`/help/${article.slug}`}
              className="group flex items-start gap-4 py-5 transition-colors"
            >
              <span className="mt-0.5 text-secondary" aria-hidden>
                <Icon size={22} weight="duotone" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-bold leading-snug text-primary">
                  {article.title}
                </span>
                <span className="mt-1.5 block text-[14px] leading-[1.55] text-muted-foreground">
                  {article.description}
                </span>
              </span>
              <CaretRight
                size={18}
                weight="bold"
                className="mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
