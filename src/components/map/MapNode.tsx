"use client";

import { Check, ShoppingCartSimple } from "@phosphor-icons/react";
import type { RoadmapStep } from "@/data/types";

type RoadmapNodeProps = {
  step: RoadmapStep;
  selected: boolean;
  done: boolean;
  isLast: boolean;
  onSelect: (id: string) => void;
};

export function RoadmapNode({
  step,
  selected,
  done,
  isLast,
  onSelect,
}: RoadmapNodeProps) {
  const hasBuy = Boolean(step.buyGroups?.some((g) => g.items.length > 0));

  return (
    <li className="grid grid-cols-[3rem_1fr] gap-x-3">
      <StepIndicator
        step={step}
        selected={selected}
        done={done}
        isLast={isLast}
        onSelect={onSelect}
      />

      <button
        type="button"
        onClick={() => onSelect(step.id)}
        className={[
          "mb-5 w-full cursor-pointer border-b-2 py-3.5 text-left transition-colors duration-200 active:opacity-80",
          selected
            ? "border-primary"
            : done
              ? "border-secondary/70"
              : "border-border/40 hover:border-border",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Стъпка {step.step}
          </p>
          {hasBuy ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
              <ShoppingCartSimple size={12} weight="bold" aria-hidden />
              Покупки
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[17px] font-bold leading-snug text-primary">
          {step.title}
        </p>
      </button>
    </li>
  );
}

function StepIndicator({
  step,
  selected,
  done,
  isLast,
  onSelect,
}: RoadmapNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        id={`node-${step.id}`}
        onClick={() => onSelect(step.id)}
        aria-pressed={selected}
        aria-label={`Стъпка ${step.step}: ${step.title}`}
        className={[
          "relative z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-sm font-bold transition-all duration-200 active:scale-95",
          selected
            ? "bg-primary text-primary-foreground ring-2 ring-secondary/50"
            : done
              ? "bg-secondary text-primary-foreground"
              : "border-2 border-border text-primary",
        ].join(" ")}
      >
        {done ? <Check size={18} weight="bold" aria-hidden /> : step.step}
      </button>
      {!isLast ? (
        <div
          className={[
            "mt-2 min-h-10 w-0.5 flex-1 rounded-full",
            done ? "bg-secondary" : "bg-border",
          ].join(" ")}
          aria-hidden
        />
      ) : null}
    </div>
  );
}
