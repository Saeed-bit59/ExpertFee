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
    const value = JSON.parse(raw) as Partial<ShareResultInput>;
    const isValid =
      Number.isSafeInteger(value.evaluationValueToman) &&
      (value.evaluationValueToman ?? -1) >= 0 &&
      Number.isSafeInteger(value.calculatedFeeToman) &&
      (value.calculatedFeeToman ?? -1) >= 0 &&
      Number.isInteger(value.expertCount) &&
      (value.expertCount ?? 0) > 0 &&
      (value.calculationTitle === undefined ||
        (typeof value.calculationTitle === "string" && value.calculationTitle.length <= 200)) &&
      (value.tariffReference === undefined ||
        (typeof value.tariffReference === "string" && value.tariffReference.length <= 200));
    if (!isValid) {
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }
    return value as ShareResultInput;
  } catch {
    return undefined;
  }
}
