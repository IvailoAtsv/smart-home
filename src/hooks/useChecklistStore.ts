"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const EMPTY: string[] = [];
const snapshots = new Map<string, string[]>();
const listeners = new Set<() => void>();

function readFromStorage(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return EMPTY;
  }
}

function ensureSnapshot(key: string): string[] {
  if (typeof window === "undefined") return EMPTY;
  if (!snapshots.has(key)) {
    const next = readFromStorage(key);
    snapshots.set(key, next.length === 0 ? EMPTY : next);
  }
  return snapshots.get(key) ?? EMPTY;
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
  return EMPTY;
}

export function useChecklistStore(storageKey: string) {
  const getSnapshot = useCallback(
    () => ensureSnapshot(storageKey),
    [storageKey],
  );

  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const completedItems = useMemo(() => new Set(items), [items]);

  const persist = useCallback(
    (next: string[]) => {
      snapshots.set(storageKey, next.length === 0 ? EMPTY : next);
      localStorage.setItem(
        storageKey,
        JSON.stringify(snapshots.get(storageKey)),
      );
      emit();
    },
    [storageKey],
  );

  const toggle = useCallback(
    (stepId: string) => {
      const current = ensureSnapshot(storageKey);
      const next = current.includes(stepId)
        ? current.filter((k) => k !== stepId)
        : [...current, stepId];
      persist(next);
    },
    [persist, storageKey],
  );

  /** Pick exactly one item in a group (or clear if the same item is clicked again). */
  const selectBuyOne = useCallback(
    (groupKeys: string[], itemKey: string) => {
      const current = ensureSnapshot(storageKey);
      const already = current.includes(itemKey);
      const next = current.filter((k) => !groupKeys.includes(k));
      if (!already) next.push(itemKey);
      persist(next);
    },
    [persist, storageKey],
  );

  return { completedItems, toggle, selectBuyOne };
}
