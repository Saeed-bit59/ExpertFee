/*
 * ============================================================
 * Article 23 Types
 * گروه 2 - اموال منقول
 * ============================================================
 */

export type Article23Mode =
  | "MOVABLE_PROPERTY"
  | "HOUSEHOLD_OFFICE";


export interface Article23Input {

  article11FeeToman: number;

  mode: Article23Mode;

}


export interface Article23Result {

  mode: Article23Mode;

  article11FeeToman: number;

  increaseRate: number;

  increaseFeeToman: number;

  feeBeforeLimitsToman: number;

  minimumFeeToman: number;

  maximumFeeToman: number;

  minimumApplied: boolean;

  maximumApplied: boolean;

  finalFeeToman: number;

  title: string;

}