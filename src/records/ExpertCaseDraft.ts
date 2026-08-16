export interface ExpertCaseDraft {
  calculationCategory: string;
  tariffArticle?: number;
  grossFeeToman: number;
  subject?: string;

  sourceCalculation?: string;
  evaluationValueToman?: number;
  expertCount?: number;
  panelFieldMode?: string;

  missionType?: string;
  missionDays?: number;
  missionFeeToman?: number;

  increaseRuleCode?: string | null;
  applyFiftyPercentIncrease?: boolean;
}

export function isExpertCaseDraft(value: unknown): value is ExpertCaseDraft {
  if (!value || typeof value !== "object") return false;

  const draft = value as Partial<ExpertCaseDraft>;

  return (
    typeof draft.calculationCategory === "string" &&
    draft.calculationCategory.trim().length > 0 &&
    typeof draft.grossFeeToman === "number" &&
    Number.isFinite(draft.grossFeeToman) &&
    draft.grossFeeToman > 0
  );
}
