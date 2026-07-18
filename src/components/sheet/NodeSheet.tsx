"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowSquareOut,
  BookOpen,
  CaretRight,
  Check,
  Copy,
  Plugs,
  Warning,
  X,
} from "@phosphor-icons/react";
import type { BuyGroup, BuyItem, RoadmapStep } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { LinkifiedText } from "@/components/content/LinkifiedText";

export function buyChecklistKey(itemId: string) {
  return `buy:${itemId}`;
}

type NodeSheetProps = {
  steps: RoadmapStep[];
  step: RoadmapStep | null;
  onClose: () => void;
  onNavigate: (id: string) => void;
  done: boolean;
  onToggleDone: (id: string) => void;
  onSelectBuyOne: (groupKeys: string[], itemKey: string) => void;
  completedIds: Set<string>;
};

export function NodeSheet({
  steps,
  step,
  onClose,
  onNavigate,
  done,
  onToggleDone,
  onSelectBuyOne,
  completedIds,
}: NodeSheetProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const open = Boolean(step);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const nextStep = step
    ? steps.find((s) => s.step === step.step + 1)
    : undefined;
  const prevStep = step
    ? steps.find((s) => s.step === step.step - 1)
    : undefined;

  return (
    <AnimatePresence>
      {step ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
          <motion.button
            type="button"
            aria-label="Затвори"
            className="absolute inset-0 cursor-pointer bg-primary/25 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex max-h-[94dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[24px] border border-border bg-surface shadow-[var(--shadow-sheet)] md:max-h-[90dvh] md:max-w-xl md:rounded-[24px]"
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48 }
            }
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
          >
            <div
              className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border md:hidden"
              aria-hidden
            />

            <div className="flex items-start gap-3 border-b border-border/50 px-5 pb-4 pt-3 md:pt-5">
              <button
                type="button"
                onClick={() => onToggleDone(step.id)}
                aria-pressed={done}
                aria-label={
                  done ? "Маркирана като готова" : "Маркирай като готова"
                }
                className={[
                  "mt-0.5 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-95",
                  done
                    ? "border-secondary bg-secondary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-secondary/60 hover:text-primary",
                ].join(" ")}
              >
                <Check size={20} weight="bold" aria-hidden />
              </button>

              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold text-muted-foreground">
                  Стъпка {step.step} от {steps.length}
                </p>
                <h2
                  id={titleId}
                  className="mt-1 text-[22px] font-extrabold leading-[1.2] tracking-tight text-primary md:text-[24px]"
                >
                  {step.title}
                </h2>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-border text-primary transition-colors hover:border-secondary/60 active:scale-[0.98]"
                aria-label="Затвори"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            <div className="flex-1 space-y-10 overflow-y-auto overscroll-contain px-5 py-6">
              <p className="text-[16px] leading-[1.7] text-foreground/95 md:text-[17px]">
                <LinkifiedText>{step.summary}</LinkifiedText>
              </p>

              {step.help && step.help.length > 0 ? (
                <section className="border-t border-border/40 pt-8">
                  <SectionHeading icon={<BookOpen size={18} weight="duotone" />}>
                    Подробни ръководства
                  </SectionHeading>
                  <ul className="divide-y divide-border/40">
                    {step.help.map((h) => (
                      <li key={h.href}>
                        <Link
                          href={h.href}
                          className="group flex min-h-[3.25rem] items-center gap-3 py-3.5 transition-colors"
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] font-semibold text-primary">
                              {h.label}
                            </span>
                            {h.description ? (
                              <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                                {h.description}
                              </span>
                            ) : null}
                          </span>
                          <CaretRight
                            size={18}
                            weight="bold"
                            className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {step.power ? (
                <section className="border-t border-border/40 pt-8">
                  <SectionHeading icon={<Plugs size={18} weight="duotone" />}>
                    Захранване
                  </SectionHeading>
                  <p className="text-[15px] font-bold text-primary">
                    {step.power.label}
                  </p>
                  <p className="mt-2 text-[15px] leading-[1.65] text-muted-foreground">
                    {step.power.detail}
                  </p>
                </section>
              ) : null}

              {step.buyGroups && step.buyGroups.length > 0 ? (
                <section className="space-y-6 border-t border-border/40 pt-8">
                  <div>
                    <SectionHeading>Списък за покупки</SectionHeading>
                    <p className="text-[14px] leading-relaxed text-muted-foreground">
                      При „избери един“ отбележи варианта, който ще поръчаш.
                      Останалите в групата се заключват. За аксесоарите
                      отбележи, когато ги имаш.
                    </p>
                  </div>
                  {step.buyGroups.map((group) => (
                    <BuyGroupBlock
                      key={group.id}
                      group={group}
                      completedIds={completedIds}
                      onToggleItem={(itemId) =>
                        onToggleDone(buyChecklistKey(itemId))
                      }
                      onSelectOne={(itemId) =>
                        onSelectBuyOne(
                          group.items.map((i) => buyChecklistKey(i.id)),
                          buyChecklistKey(itemId),
                        )
                      }
                    />
                  ))}
                </section>
              ) : null}

              <section className="border-t border-border/40 pt-8">
                <SectionHeading>Как да го направиш</SectionHeading>
                <ol className="space-y-5">
                  {step.setup.map((line, index) => (
                    <li
                      key={`${index}-${line.slice(0, 24)}`}
                      className="flex gap-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[14px] font-bold tabular-nums text-secondary">
                        {index + 1}
                      </span>
                      <p className="pt-0.5 text-[15px] leading-[1.7] text-foreground/95">
                        <LinkifiedText>{line}</LinkifiedText>
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              {step.warnings?.length ? (
                <ul className="space-y-3 border-t border-border/40 pt-8">
                  {step.warnings.map((w) => (
                    <li
                      key={w}
                      className="flex gap-3 border-l-[3px] border-danger py-1 pl-4 text-[14px] leading-[1.6] text-danger"
                    >
                      <Warning
                        size={20}
                        weight="fill"
                        className="mt-0.5 shrink-0"
                        aria-hidden
                      />
                      <LinkifiedText>{w}</LinkifiedText>
                    </li>
                  ))}
                </ul>
              ) : null}

              {step.code?.map((block) => (
                <CodeBlock key={block.title} block={block} />
              ))}
            </div>

            {prevStep || nextStep ? (
              <div className="shrink-0 border-t border-border/50 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <div
                  className={
                    prevStep && nextStep ? "grid grid-cols-2 gap-2" : ""
                  }
                >
                  {prevStep ? (
                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={() => onNavigate(prevStep.id)}
                      className="truncate px-2 text-[13px]"
                    >
                      ← Предишна
                    </Button>
                  ) : null}
                  {nextStep ? (
                    <Button
                      variant="secondary"
                      size="md"
                      fullWidth
                      onClick={() => onNavigate(nextStep.id)}
                      className="truncate px-2 text-[13px]"
                    >
                      Следваща →
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function BuyGroupBlock({
  group,
  completedIds,
  onToggleItem,
  onSelectOne,
}: {
  group: BuyGroup;
  completedIds: Set<string>;
  onToggleItem: (itemId: string) => void;
  onSelectOne: (itemId: string) => void;
}) {
  const selectedId = group.pickOne
    ? group.items.find((item) =>
      completedIds.has(buyChecklistKey(item.id)),
    )?.id
    : undefined;

  return (
    <div className="border-t border-border/60 pt-5 first:border-t-0 first:pt-0">
      <div className="mb-3">
        <h4 className="text-[15px] font-bold text-primary">{group.title}</h4>
        {group.description ? (
          <p className="mt-1 text-[14px] leading-[1.55] text-muted-foreground">
            {group.description}
          </p>
        ) : null}
      </div>

      <ul className="space-y-2">
        {group.items.map((item) => {
          const checked = completedIds.has(buyChecklistKey(item.id));
          const disabled = Boolean(
            group.pickOne &&
            selectedId !== undefined &&
            selectedId !== item.id,
          );

          return (
            <BuyItemRow
              key={item.id}
              item={item}
              checked={checked}
              disabled={disabled}
              onActivate={() => {
                if (disabled) return;
                if (group.pickOne) onSelectOne(item.id);
                else onToggleItem(item.id);
              }}
            />
          );
        })}
      </ul>
    </div>
  );
}

function BuyItemRow({
  item,
  checked,
  disabled,
  onActivate,
}: {
  item: BuyItem;
  checked: boolean;
  disabled: boolean;
  onActivate: () => void;
}) {
  return (
    <li
      className={[
        "rounded-[12px] px-1 py-2.5 transition-opacity",
        disabled ? "opacity-45" : "",
      ].join(" ")}
      aria-disabled={disabled || undefined}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onActivate}
          disabled={disabled}
          aria-pressed={checked}
          aria-label={
            checked
              ? `Маркирано: ${item.label}`
              : `Маркирай: ${item.label}`
          }
          className={[
            "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] transition-colors",
            disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-border/30",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-5 w-5 items-center justify-center rounded-[6px] border-2 transition-colors",
              checked
                ? "border-secondary bg-secondary text-primary-foreground"
                : "border-border",
              disabled && !checked ? "border-border/50" : "",
            ].join(" ")}
            aria-hidden
          >
            {checked ? <Check size={12} weight="bold" /> : null}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p
              className={[
                "text-[15px] font-semibold leading-snug",
                checked
                  ? "text-muted-foreground line-through decoration-muted-foreground/50"
                  : "text-primary",
              ].join(" ")}
            >
              {item.label}
            </p>
            {item.approxPrice ? (
              <span className="shrink-0 text-[14px] font-medium tabular-nums text-muted-foreground">
                {item.approxPrice}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {item.store}
          </p>
          {item.notes ? (
            <p className="mt-1.5 text-[14px] leading-[1.55] text-muted-foreground">
              {item.notes}
            </p>
          ) : null}

          {!disabled ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex min-h-10 items-center gap-1.5 rounded-[14px] border-2 border-border px-3 text-[13px] font-semibold text-primary transition-colors hover:border-primary/40 active:scale-[0.98]"
            >
              Виж в {item.store}
              <ArrowSquareOut size={15} weight="bold" aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function SectionHeading({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-[16px] font-bold text-primary">
      {icon ? (
        <span className="text-secondary" aria-hidden>
          {icon}
        </span>
      ) : null}
      {children}
    </h3>
  );
}

function CodeBlock({
  block,
}: {
  block: { title: string; language: string; content: string };
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(block.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [block.content]);

  return (
    <section className="border-t border-border/40 pt-8">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[16px] font-bold text-primary">{block.title}</h3>
        <Button variant="outline" size="sm" onClick={copy}>
          <Copy size={14} weight="bold" aria-hidden />
          {copied ? "Копирано" : "Копирай"}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-[var(--radius)] border border-primary/20 bg-primary p-4 font-mono text-[12px] leading-[1.6] text-primary-foreground md:text-[13px]">
        <code>{block.content}</code>
      </pre>
    </section>
  );
}
