export type VoiceStrategy = "atom" | "voice-pe" | "hybrid";

export type TestOs = "macos" | "windows" | "linux" | "skip";

/** Relative spend level — euro amounts scale with room count. */
export type BudgetLevel = "lean" | "comfort" | "full";

export const MAX_ROOMS = 10;

export type UserPrefs = {
  voiceStrategy: VoiceStrategy;
  testOs: TestOs;
  budgetLevel: BudgetLevel;
  /** Cached euro estimate for the selected level at current rooms (for display / plans). */
  budgetEur: number;
  rooms: number;
  onboardingDone: boolean;
};

export const PREFS_STORAGE_KEY = "smart-home-prefs-v2";

export const VOICE_STRATEGY_LABELS: Record<VoiceStrategy, string> = {
  atom: "Само ATOM Echo",
  "voice-pe": "Само Voice PE",
  hybrid: "Хибрид (PE + ATOM)",
};

export const TEST_OS_LABELS: Record<TestOs, string> = {
  macos: "macOS (Apple Silicon)",
  windows: "Windows",
  linux: "Linux",
  skip: "Без тест",
};

export const BUDGET_LEVEL_TITLES: Record<BudgetLevel, string> = {
  lean: "Минимален",
  comfort: "Комфортен",
  full: "Разширен",
};

/** Recommended defaults shown in onboarding (not for test OS). */
export const RECOMMENDED_VOICE: VoiceStrategy = "hybrid";
export const RECOMMENDED_BUDGET: BudgetLevel = "comfort";

function roundTo50(n: number): number {
  return Math.max(100, Math.round(n / 50) * 50);
}

/**
 * Rough hardware envelopes for N rooms (EUR).
 * Server ~250, Shelly ~25/room, ATOM ~15, Voice PE ~60, full adds UPS buffer.
 */
export function budgetAmountsForRooms(
  rooms: number,
): Record<BudgetLevel, number> {
  const n = Math.min(Math.max(rooms, 1), MAX_ROOMS);
  const server = 250;
  const shelly = 25 * n;
  const lean = roundTo50(server + shelly + 15 * n);
  const comfort = roundTo50(
    server + shelly + 60 + 15 * Math.max(0, n - 1) + 40,
  );
  const full = roundTo50(
    server + shelly + 60 * Math.min(n, 3) + 15 * Math.max(0, n - 3) + 120,
  );
  return { lean, comfort, full };
}

export function budgetAmountFor(rooms: number, level: BudgetLevel): number {
  return budgetAmountsForRooms(rooms)[level];
}

export const DEFAULT_PREFS: UserPrefs = {
  voiceStrategy: "hybrid",
  testOs: "macos",
  budgetLevel: "comfort",
  budgetEur: budgetAmountFor(1, "comfort"),
  rooms: 1,
  onboardingDone: false,
};

/** At max rooms we show a floor (“≥”), otherwise an upper guide (“до ~”). */
export function formatBudgetLabel(amount: number, rooms: number): string {
  if (rooms >= MAX_ROOMS) return `≥ ${amount} €`;
  return `До ~${amount} €`;
}

export function budgetLevelDescription(
  level: BudgetLevel,
  rooms: number,
): string {
  const roomWord =
    rooms >= MAX_ROOMS ? "10+ стаи" : rooms === 1 ? "1 стая" : `${rooms} стаи`;
  if (level === "lean") {
    return `Mini PC + Shelly + ATOM Echo за ${roomWord}. UPS и Cloud по-късно.`;
  }
  if (level === "comfort") {
    return `Mini PC + Shelly + Voice PE в основната стая${rooms > 1 ? ` и ATOM Echo за останалите` : ""}. Добър баланс.`;
  }
  return `Повече Voice PE / резерв за UPS и Cloud при ~${roomWord}.`;
}

/** Soft suggestion on the summary screen — does not override the user’s choice. */
export function suggestVoiceStrategy(
  budgetLevel: BudgetLevel,
  rooms: number,
): { strategy: VoiceStrategy; reason: string } {
  if (budgetLevel === "lean" || rooms >= 5) {
    return {
      strategy: "atom",
      reason:
        "При по-малък бюджет или много стаи ATOM Echo покрива повече точки по-евтино.",
    };
  }
  if (budgetLevel === "full" && rooms <= 2) {
    return {
      strategy: "voice-pe",
      reason:
        "При по-голям бюджет и малко стаи Voice PE дава по-добър микрофон в основните пространства.",
    };
  }
  return {
    strategy: "hybrid",
    reason:
      "Voice PE в натоварените стаи и ATOM Echo в останалите е добър баланс цена/качество.",
  };
}

export function prefsSummaryChip(prefs: UserPrefs): string {
  const amount = budgetAmountFor(prefs.rooms, prefs.budgetLevel);
  const parts = [
    VOICE_STRATEGY_LABELS[prefs.voiceStrategy],
    `${prefs.rooms}${prefs.rooms >= MAX_ROOMS ? "+" : ""} ${prefs.rooms === 1 ? "стая" : "стаи"}`,
    formatBudgetLabel(amount, prefs.rooms),
  ];
  if (prefs.testOs !== "skip") {
    parts.push(`тест: ${TEST_OS_LABELS[prefs.testOs]}`);
  }
  return parts.join(" · ");
}

/** Normalize prefs from storage (incl. v1 budgetEur tiers). */
export function normalizePrefs(
  raw: Partial<UserPrefs> & { budgetEur?: number },
): UserPrefs {
  const rooms = Math.min(
    Math.max(typeof raw.rooms === "number" ? raw.rooms : 1, 1),
    MAX_ROOMS,
  );

  let budgetLevel: BudgetLevel = raw.budgetLevel ?? "comfort";
  if (!raw.budgetLevel && typeof raw.budgetEur === "number") {
    // Legacy v1 fixed tiers
    if (raw.budgetEur <= 150) budgetLevel = "lean";
    else if (raw.budgetEur >= 600) budgetLevel = "full";
    else budgetLevel = "comfort";
  }

  return {
    voiceStrategy: raw.voiceStrategy ?? DEFAULT_PREFS.voiceStrategy,
    testOs: raw.testOs ?? DEFAULT_PREFS.testOs,
    budgetLevel,
    budgetEur: budgetAmountFor(rooms, budgetLevel),
    rooms,
    onboardingDone: Boolean(raw.onboardingDone),
  };
}
