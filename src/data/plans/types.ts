import type { RoadmapStep } from "../types";

export type InstallPlan = {
  id: string;
  storageKey: string;
  title: string;
  subtitle: string;
  badge: string;
  switchLink: { href: string; label: string };
  steps: RoadmapStep[];
};

export function stepsByIdFrom(
  steps: RoadmapStep[],
): Record<string, RoadmapStep> {
  return Object.fromEntries(steps.map((s) => [s.id, s]));
}
