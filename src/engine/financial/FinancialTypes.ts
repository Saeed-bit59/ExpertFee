/*
 * ============================================================
 * Financial Affairs - Types
 * Group 4 - Articles 25 to 29
 * ============================================================
 */

export type FinancialField =
  | "ACCOUNTING_AUDITING"
  | "COMMERCIAL_AFFAIRS"
  | "ALIMONY"
  | "MONETARY_CREDIT_INVESTMENT"
  | "INSURANCE";


export type AccountingMode =
  | "ARTICLE_25_AUDITING"
  | "ARTICLE_26_SHARE_VALUE"
  | "ARTICLE_26_FINANCIAL_STATEMENTS"
  | "ARTICLE_26_COSTING";


export interface FinancialCalculationInput {

  article11FeeToman: number;

  field: FinancialField;

  accountingMode?: AccountingMode;

}


export interface FinancialCalculationResult {

  field: FinancialField;

  article11FeeToman: number;

  increaseRate: number;

  increaseFeeToman: number;

  feeBeforeLimitsToman: number;

  minimumFeeToman: number;

  maximumFeeToman: number;

  minimumApplied: boolean;

  maximumApplied: boolean;

  finalFeeToman: number;

  articleNumber: number;

  fieldTitle: string;

  subjectTitle: string;

}