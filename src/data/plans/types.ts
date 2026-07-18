import type { RoadmapStep } from "../types";

export type InstallPlan = {
  id: string;
  storageKey: string;
  title: string;
  subtitle: string;
  badge: string;
  switchLink: { href: string; label: string } | null;
  steps: RoadmapStep[];
};

export function stepsByIdFrom(
  steps: RoadmapStep[],
): Record<string, RoadmapStep> {
  return Object.fromEntries(steps.map((s) => [s.id, s]));
}

/** Assign sequential step numbers after assembling a plan. */
export function numberSteps(steps: Omit<RoadmapStep, "step">[]): RoadmapStep[] {
  return steps.map((s, i) => ({ ...s, step: i + 1 }));
}
