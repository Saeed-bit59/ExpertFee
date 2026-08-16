/*
 * ExpertFee — Tariff 1405 compatibility configuration
 *
 * This file preserves the API expected by the current
 * Article 11 / Mission engines and their regression tests.
 *
 * Monetary input/output used by the application: Toman
 * Tariff source values below are stored in Rial where the
 * engine explicitly expects Rial.
 */

export interface Tariff1405Article11Bracket {
  from: number;
  to: number | null;
  rate: number;

  // Explicit Rial aliases used by the 1405 engine.
  fromRial: number;
  toRial: number | null;
}

/*
 * ماده 11 — تعرفه 1405
 *
 * Source:
 * تا 500,000,000 ریال: مقطوع 20,000,000 ریال
 * سپس:
 * 0.45%, 0.4%, 0.2%, 0.12%, 0.09%,
 * 0.031%, 0.023%, 0.0185%, 0.015%
 *
 * سقف عمومی: 1,350,000,000 ریال
 */

export const TARIFF_1405_ARTICLE11_BRACKETS:
  Tariff1405Article11Bracket[] = [
    {
      from: 500_000_000,
      to: 1_000_000_000,
      fromRial: 500_000_000,
      toRial: 1_000_000_000,
      rate: 0.0045
    },
    {
      from: 1_000_000_000,
      to: 5_000_000_000,
      fromRial: 1_000_000_000,
      toRial: 5_000_000_000,
      rate: 0.004
    },
    {
      from: 5_000_000_000,
      to: 30_000_000_000,
      fromRial: 5_000_000_000,
      toRial: 30_000_000_000,
      rate: 0.002
    },
    {
      from: 30_000_000_000,
      to: 150_000_000_000,
      fromRial: 30_000_000_000,
      toRial: 150_000_000_000,
      rate: 0.0012
    },
    {
      from: 150_000_000_000,
      to: 500_000_000_000,
      fromRial: 150_000_000_000,
      toRial: 500_000_000_000,
      rate: 0.0009
    },
    {
      from: 500_000_000_000,
      to: 1_000_000_000_000,
      fromRial: 500_000_000_000,
      toRial: 1_000_000_000_000,
      rate: 0.00031
    },
    {
      from: 1_000_000_000_000,
      to: 2_000_000_000_000,
      fromRial: 1_000_000_000_000,
      toRial: 2_000_000_000_000,
      rate: 0.00023
    },
    {
      from: 2_000_000_000_000,
      to: 4_000_000_000_000,
      fromRial: 2_000_000_000_000,
      toRial: 4_000_000_000_000,
      rate: 0.000185
    },
    {
      from: 4_000_000_000_000,
      to: null,
      fromRial: 4_000_000_000_000,
      toRial: null,
      rate: 0.00015
    }
  ];

/*
 * Canonical nested structure expected by the current engines.
 */
export const TARIFF_1405 = {
  rialPerToman: 10,

  metadata: {
    year: 1405,
    articleCount: 53,
    amendmentCount: 0
  },

  article11: {
    fixedLimitRial: 500_000_000,
    fixedFeeRial: 20_000_000,
    generalMaximumRial: 1_350_000_000,
    bracketsRial: TARIFF_1405_ARTICLE11_BRACKETS
  },

  article6: {
    // Names used by MissionCalculator and its regression tests.
    missionInsideProvinceDailyRial: 7_500_000,
    missionOutsideProvinceDailyRial: 15_000_000,

    // Short aliases retained for compatibility with older modules.
    inProvinceDailyRial: 7_500_000,
    outProvinceDailyRial: 15_000_000
  },

  // Flat aliases retained for modules already migrated to the
  // simplified configuration API.
  YEAR: 1405,
  ARTICLE11_FIXED_LIMIT: 50_000_000,
  ARTICLE11_FIXED_FEE: 2_000_000,
  ARTICLE11_MAX_FEE: 135_000_000,
  ARTICLE11_BRACKETS: TARIFF_1405_ARTICLE11_BRACKETS,
  ARTICLE11_GENERAL_MAXIMUM_TOMAN: 135_000_000,
  MISSION_IN_PROVINCE: 750_000,
  MISSION_OUT_PROVINCE: 1_500_000
} as const;

/*
 * Compatibility export used by existing modules.
 */
export const Tariff1405 = {
  ARTICLE11_MAX_FEE: TARIFF_1405.ARTICLE11_MAX_FEE,
  MISSION_IN_PROVINCE: TARIFF_1405.MISSION_IN_PROVINCE,
  MISSION_OUT_PROVINCE: TARIFF_1405.MISSION_OUT_PROVINCE,
  ARTICLE11_FIXED_LIMIT: TARIFF_1405.ARTICLE11_FIXED_LIMIT,
  ARTICLE11_FIXED_FEE: TARIFF_1405.ARTICLE11_FIXED_FEE,
  ARTICLE11_BRACKETS: TARIFF_1405.ARTICLE11_BRACKETS
} as const;

export const ARTICLE_11_GENERAL_MAXIMUM_TOMAN =
  TARIFF_1405.ARTICLE11_GENERAL_MAXIMUM_TOMAN;

export type Tariff1405Config =
  typeof Tariff1405;
