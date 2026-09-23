import { useMemo, useSyncExternalStore } from "react";

import type { Conversion } from "@/actions/convert";

const STORAGE_KEY = "previous-conversions";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

const getSnapshot = () => localStorage.getItem(STORAGE_KEY);

const getServerSnapshot = () => null;

const usePreviousConversions = () => {
  const saved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const prevConversions: Conversion[] = useMemo(
    () => (saved ? JSON.parse(saved) : []),
    [saved],
  );

  const addConversion = (conversion: Conversion) => {
    const next = [conversion, ...prevConversions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  };

  return { prevConversions, addConversion };
};

export default usePreviousConversions;
