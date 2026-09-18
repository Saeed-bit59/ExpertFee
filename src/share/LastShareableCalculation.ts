import type { ShareResultInput } from "./ShareResult";

const STORAGE_KEY = "expertfee:last-shareable-calculation";

export function saveLastShareableCalculation(input: ShareResultInput): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...input, savedAt: new Date().toISOString() }));
  } catch {
    // Storage can be unavailable in private browsing; the current-page share still works.
  }
}

export function loadLastShareableCalculation(): ShareResultInput | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const value = JSON.parse(raw) as ShareResultInput;
    return Number.isFinite(value.evaluationValueToman) && Number.isFinite(value.calculatedFeeToman)
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}
