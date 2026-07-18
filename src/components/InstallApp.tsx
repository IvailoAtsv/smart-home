"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { InstallPlan } from "@/data/plans/types";
import { stepsByIdFrom } from "@/data/plans/types";
import { buildFullPlan } from "@/data/plans/buildFullPlan";
import { buildTestPlan } from "@/data/plans/buildTestPlan";
import { ArchitectureMap } from "@/components/map/ArchitectureMap";
import { NodeSheet } from "@/components/sheet/NodeSheet";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { useChecklistStore } from "@/hooks/useChecklistStore";
import { usePrefsStore } from "@/hooks/usePrefsStore";
import { prefsSummaryChip } from "@/data/prefs/types";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type InstallAppProps = {
  /** Which plan surface this page shows */
  variant: "full" | "test";
};

export function InstallApp({ variant }: InstallAppProps) {
  const { prefs, completeOnboarding, reopenOnboarding } = usePrefsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const plan: InstallPlan | null = useMemo(() => {
    if (!prefs.onboardingDone) return null;
    if (variant === "full") return buildFullPlan(prefs);
    return buildTestPlan(prefs);
  }, [prefs, variant]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background text-[14px] text-muted-foreground">
        Зареждане…
      </div>
    );
  }

  if (!prefs.onboardingDone) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <OnboardingWizard
          initial={{
            voiceStrategy: prefs.voiceStrategy,
            testOs: prefs.testOs,
            budgetLevel: prefs.budgetLevel,
            budgetEur: prefs.budgetEur,
            rooms: prefs.rooms,
          }}
          onComplete={completeOnboarding}
        />
      </div>
    );
  }

  if (variant === "test" && !plan) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col justify-center px-4 py-12 md:max-w-xl">
        <p className="text-[12px] font-bold tracking-wide text-muted-foreground">
          Тестов план
        </p>
        <h1 className="mt-2 text-[26px] font-extrabold text-primary">
          Пропусна теста
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
          В настройките си избрал да отидеш директно към пълния план с Home
          Assistant OS на mini PC. Няма стъпки за временна VM.
        </p>
        <div className="mt-8 space-y-3">
          <Link href="/">
            <Button fullWidth size="lg">
              Към пълния план
            </Button>
          </Link>
          <Button fullWidth variant="outline" onClick={reopenOnboarding}>
            Промени настройките
          </Button>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <PlanView
      plan={plan}
      prefsChip={prefsSummaryChip(prefs)}
      onEditPrefs={reopenOnboarding}
    />
  );
}

function PlanView({
  plan,
  prefsChip,
  onEditPrefs,
}: {
  plan: InstallPlan;
  prefsChip: string;
  onEditPrefs: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { completedItems, toggle, selectBuyOne } = useChecklistStore(
    plan.storageKey,
  );
  const stepsById = useMemo(() => stepsByIdFrom(plan.steps), [plan.steps]);

  const selectedStep = selectedId ? (stepsById[selectedId] ?? null) : null;

  const scrollToNode = useCallback((id: string) => {
    const el = document.getElementById(`node-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const openNode = useCallback(
    (id: string) => {
      if (!stepsById[id]) return;
      setSelectedId(id);
      scrollToNode(id);
      window.history.replaceState(null, "", `#node-${id}`);
    },
    [scrollToNode, stepsById],
  );

  const closeNode = useCallback(() => {
    setSelectedId(null);
    if (window.location.hash.startsWith("#node-")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith("node-")) {
        const id = hash.slice("node-".length);
        if (stepsById[id]) {
          setSelectedId(id);
          requestAnimationFrame(() => scrollToNode(id));
        }
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [scrollToNode, stepsById]);

  const doneCount = plan.steps.filter((s) => completedItems.has(s.id)).length;
  const progress = Math.round((doneCount / plan.steps.length) * 100);

  return (
    <div className="min-h-[100dvh] bg-background">
      <div className="sticky top-0 z-30 bg-background pt-[env(safe-area-inset-top)]">
        <div
          className="relative overflow-hidden border-b border-border/40"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Напредък: ${doneCount} от ${plan.steps.length} стъпки`}
        >
          <div
            className="absolute inset-y-0 left-0 bg-secondary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
          <p className="relative z-10 py-2 text-center text-[11px] font-bold tabular-nums tracking-wide text-primary">
            {doneCount}
            <span className="font-semibold text-muted-foreground">
              /{plan.steps.length}
            </span>
          </p>
        </div>
      </div>

      <main>
        <ArchitectureMap
          steps={plan.steps}
          title={plan.title}
          subtitle={plan.subtitle}
          badge={plan.badge}
          switchLink={plan.switchLink}
          prefsChip={prefsChip}
          onEditPrefs={onEditPrefs}
          selectedId={selectedId}
          completedIds={completedItems}
          onSelectNode={openNode}
        />
      </main>

      <NodeSheet
        steps={plan.steps}
        step={selectedStep}
        onClose={closeNode}
        onNavigate={openNode}
        done={selectedId ? completedItems.has(selectedId) : false}
        onToggleDone={toggle}
        onSelectBuyOne={selectBuyOne}
        completedIds={completedItems}
      />
    </div>
  );
}
