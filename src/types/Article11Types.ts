export type Article11AdjustmentType =
  | "CONTRACT_FULL"
  | "CONTRACT_PARTIAL"
  | "DAMAGE"
  | "USED_PARTS"
  | "MULTI_EXPERT_SAME_FIELD"
  | "INTANGIBLE_ASSET";

export interface Article11Adjustment {
  type: Article11AdjustmentType;
  coefficient: number;
  sourceNote: number;
  description: string;
}

export interface Article11AdjustmentResult {
  baseFee: number;
  adjustedFee: number;
  finalFee: number;
  capped: boolean;
  appliedAdjustments: Article11Adjustment[];
}