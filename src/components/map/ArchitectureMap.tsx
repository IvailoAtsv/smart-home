"use client";

import Link from "next/link";
import { GearSix } from "@phosphor-icons/react";
import type { RoadmapStep } from "@/data/types";
import { RoadmapNode } from "./MapNode";

type ArchitectureMapProps = {
  steps: RoadmapStep[];
  title: string;
  subtitle: string;
  badge: string;
  switchLink: { href: string; label: string } | null;
  prefsChip?: string;
  onEditPrefs?: () => void;
  selectedId: string | null;
  completedIds: Set<string>;
  onSelectNode: (id: string) => void;
};

export function ArchitectureMap({
  steps,
  title,
  subtitle,
  badge,
  switchLink,
  prefsChip,
  onEditPrefs,
  selectedId,
  completedIds,
  onSelectNode,
}: ArchitectureMapProps) {
  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-[max(8rem,env(safe-area-inset-bottom))] pt-5 md:max-w-xl md:pt-8">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[12px] font-bold tracking-wide text-muted-foreground">
            {badge}
          </p>
          {onEditPrefs ? (
            <button
              type="button"
              onClick={onEditPrefs}
              className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-[12px] border border-border px-2.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              aria-label="Настройки"
            >
              <GearSix size={16} weight="bold" aria-hidden />
              Настройки
            </button>
          ) : null}
        </div>
        <h1 className="mt-2 text-[26px] font-extrabold leading-tight tracking-tight text-primary md:text-[28px]">
          {title}
        </h1>
        <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
        {prefsChip ? (
          <p className="mt-3 text-[12px] font-medium leading-snug text-muted-foreground">
            {prefsChip}
          </p>
        ) : null}
        <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
          Докосни стъпка, за да видиш какво правиш. Маркирай я, когато е готова.
        </p>
      </header>

      <ol className="list-none p-0">
        {steps.map((step, index) => (
          <RoadmapNode
            key={step.id}
            step={step}
            selected={selectedId === step.id}
            done={completedIds.has(step.id)}
            isLast={index === steps.length - 1}
            onSelect={onSelectNode}
          />
        ))}
      </ol>

      <footer className="mt-10 space-y-4 border-t border-border/50 pt-6">
        <Link
          href="/help"
          className="flex min-h-12 items-center justify-center text-[14px] font-semibold text-primary underline decoration-border underline-offset-4 transition-colors hover:decoration-secondary"
        >
          Подробни ръководства
        </Link>
        {switchLink ? (
          <p className="text-center">
            <Link
              href={switchLink.href}
              className="inline-flex min-h-11 items-center text-[13px] font-semibold text-muted-foreground underline-offset-2 transition-colors hover:text-primary hover:underline"
            >
              {switchLink.label}
            </Link>
          </p>
        ) : null}
      </footer>
    </div>
  );
}
