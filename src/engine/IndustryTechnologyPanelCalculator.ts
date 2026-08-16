import {
  calculateArticle11Engine
} from "./Article11Engine";

import type {
  PanelFieldMode
} from "./Article11PanelRules";

import {
  getArticle45Rule
} from "./IndustryTechnologyRules";

import type {
  IndustryTechnologyServiceType
} from "./IndustryTechnologyRules";

export interface IndustryTechnologyPanelInput {
  evaluationValueToman: number;
  serviceType: IndustryTechnologyServiceType;
  expertCount: number;
  panelFieldMode: PanelFieldMode;
}

export interface IndustryTechnologyPanelResult {
  article11FeePerExpertToman: number;
  additionalPercent: number;
  additionalFeePerExpertToman: number;
  feePerExpertToman: number;
  expertCount: number;
  totalPanelFeeToman: number;
  panelFieldMode: PanelFieldMode;
  sameFieldThirtyPercentReductionApplied: boolean;
}

export function calculateIndustryTechnologyPanel(
  input: IndustryTechnologyPanelInput
): IndustryTechnologyPanelResult {
  const {
    evaluationValueToman,
    serviceType,
    expertCount
  } = input;

  if (
    !Number.isFinite(evaluationValueToman) ||
    evaluationValueToman <= 0
  ) {
    throw new Error(
      "evaluationValueToman must be a positive number."
    );
  }

  if (
    !Number.isInteger(expertCount) ||
    expertCount < 1
  ) {
    throw new Error(
      "expertCount must be a positive integer."
    );
  }

  const panelFieldMode: PanelFieldMode =
    expertCount === 1
      ? "SINGLE_EXPERT"
      : input.panelFieldMode;

  /*
   * ابتدا قواعد هیأت ماده ۱۱ اجرا می‌شود.
   * سپس درصد اختصاصی ماده ۴۵ روی دستمزد
   * هر کارشناس پس از قواعد هیأت اعمال می‌شود.
   *
   * این ترتیب با معماری Article11Engine سازگار است:
   * panel rules -> increase -> panel total.
   */
  const article11Panel =
    calculateArticle11Engine({
      evaluationValueToman,
      expertCount,
      panelFieldMode
    });

  const rule =
    getArticle45Rule(serviceType);

  const article11FeePerExpertToman =
    article11Panel.feePerExpertToman;

  const additionalFeePerExpertToman =
    Math.round(
      article11FeePerExpertToman *
        rule.additionalPercent /
        100
    );

  const feePerExpertToman =
    article11FeePerExpertToman +
    additionalFeePerExpertToman;

  const totalPanelFeeToman =
    feePerExpertToman *
    expertCount;

  return {
    article11FeePerExpertToman,
    additionalPercent:
      rule.additionalPercent,
    additionalFeePerExpertToman,
    feePerExpertToman,
    expertCount,
    totalPanelFeeToman,
    panelFieldMode,
    sameFieldThirtyPercentReductionApplied:
      article11Panel
        .sameFieldThirtyPercentReductionApplied
  };
}
