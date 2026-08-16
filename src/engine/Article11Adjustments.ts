import {
  TARIFF_1405,
} from "../config/Tariff1405";

import {
  Article11Adjustment,
  Article11AdjustmentResult,
  Article11AdjustmentType,
} from "../types/Article11Types";

const MAXIMUM_FEE =
  TARIFF_1405.article11.generalMaximumRial /
  TARIFF_1405.rialPerToman;

const ADJUSTMENTS: Record<
  Article11AdjustmentType,
  Article11Adjustment
> = {
  CONTRACT_FULL: {
    type: "CONTRACT_FULL",
    coefficient: 1,
    sourceNote: 3,
    description:
      "بررسی اختلافات قراردادی، کنترل و تعیین صورت وضعیت",
  },

  CONTRACT_PARTIAL: {
    type: "CONTRACT_PARTIAL",
    coefficient: 0.5,
    sourceNote: 3,
    description:
      "رسیدگی صرفاً به بخشی از قرارداد",
  },

  DAMAGE: {
    type: "DAMAGE",
    coefficient: 0.5,
    sourceNote: 4,
    description:
      "تعیین سبب، علت، ارزیابی و تعیین میزان خسارت",
  },

  USED_PARTS: {
    type: "USED_PARTS",
    coefficient: 0.5,
    sourceNote: 5,
    description:
      "ارزیابی مستقل اقلام مشمول تبصره 5",
  },

  MULTI_EXPERT_SAME_FIELD: {
    type: "MULTI_EXPERT_SAME_FIELD",
    coefficient: -0.3,
    sourceNote: 6,
    description:
      "چند کارشناس از یک رشته کارشناسی",
  },

  INTANGIBLE_ASSET: {
    type: "INTANGIBLE_ASSET",
    coefficient: 0.5,
    sourceNote: 7,
    description:
      "ارزیابی دارایی نامشهود",
  },
};

export function applyArticle11Adjustments(
  baseFee: number,
  types: Article11AdjustmentType[],
): Article11AdjustmentResult {
  if (!Number.isFinite(baseFee) || baseFee < 0) {
    throw new Error("Invalid base fee.");
  }

  const uniqueTypes =
    [...new Set(types)];

  const appliedAdjustments =
    uniqueTypes.map(
      type => ADJUSTMENTS[type],
    );

  let adjustedFee =
    baseFee;

  for (
    const adjustment
    of appliedAdjustments
  ) {
    adjustedFee +=
      baseFee *
      adjustment.coefficient;
  }

  adjustedFee =
    Math.round(adjustedFee);

  const finalFee =
    Math.min(
      adjustedFee,
      MAXIMUM_FEE,
    );

  return {
    baseFee,
    adjustedFee,
    finalFee,
    capped:
      adjustedFee >
      MAXIMUM_FEE,
    appliedAdjustments,
  };
}
