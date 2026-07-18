"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_PREFS,
  PREFS_STORAGE_KEY,
  normalizePrefs,
  type UserPrefs,
} from "@/data/prefs/types";

const listeners = new Set<() => void>();
let snapshot: UserPrefs | null = null;

function readFromStorage(): UserPrefs {
  try {
    // Prefer v2; fall back to v1 key once for migration
    const raw =
      localStorage.getItem(PREFS_STORAGE_KEY) ??
      localStorage.getItem("smart-home-prefs-v1");
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw) as Partial<UserPrefs>;
    return normalizePrefs(parsed);
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function ensureSnapshot(): UserPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  if (!snapshot) snapshot = readFromStorage();
  return snapshot;
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getServerSnapshot() {
  return DEFAULT_PREFS;
}

function persist(next: UserPrefs) {
  snapshot = normalizePrefs(next);
  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(snapshot));
  emit();
}

export function usePrefsStore() {
  const prefs = useSyncExternalStore(
    subscribe,
    ensureSnapshot,
    getServerSnapshot,
  );

  const setPrefs = useCallback((patch: Partial<UserPrefs>) => {
    const current = ensureSnapshot();
    persist({ ...current, ...patch });
  }, []);

  const completeOnboarding = useCallback(
    (next: Omit<UserPrefs, "onboardingDone">) => {
      persist({ ...next, onboardingDone: true });
    },
    [],
  );

  const reopenOnboarding = useCallback(() => {
    const current = ensureSnapshot();
    persist({ ...current, onboardingDone: false });
  }, []);

  return { prefs, setPrefs, completeOnboarding, reopenOnboarding };
}
