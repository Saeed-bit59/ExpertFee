/*
 * ============================================================
 * Article 22 Types
 * رشته فلزات و معادن
 * ============================================================
 */


/*
 * نوع خدمت ماده 22
 */

export type Article22ServiceType =
  | "METAL_EVALUATION"
  | "MINING_RESERVE_EVALUATION";


/*
 * نوع معدن
 */

export type MiningOperationType =
  | "SURFACE"
  | "UNDERGROUND";


/*
 * ============================================================
 * بند 1 ماده 22
 * ارزیابی در رشته فلزات
 * ============================================================
 */

export interface Article22MetalInput {
  article11FeeToman: number;
}


export interface Article22MetalResult {

  serviceType:
    "METAL_EVALUATION";

  article11FeeToman:
    number;

  minimumFeeToman:
    number;

  maximumFeeToman:
    number;

  minimumApplied:
    boolean;

  maximumApplied:
    boolean;

  finalFeeToman:
    number;

  title:
    string;
}


/*
 * ============================================================
 * بند 2 ماده 22
 * ارزیابی ذخایر معدنی
 * ============================================================
 */

export interface Article22MiningInput {

  article11FeeToman:
    number;

  operationType:
    MiningOperationType;
}


export interface Article22MiningResult {

  serviceType:
    "MINING_RESERVE_EVALUATION";

  article11FeeToman:
    number;

  operationType:
    MiningOperationType;

  undergroundIncreaseRate:
    number;

  undergroundIncreaseFeeToman:
    number;

  feeBeforeMaximumToman:
    number;

  maximumFeeToman:
    number;

  maximumApplied:
    boolean;

  finalFeeToman:
    number;

  title:
    string;
}