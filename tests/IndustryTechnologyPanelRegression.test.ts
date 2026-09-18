import {
  calculateIndustryTechnologyPanel
} from "../src/engine/IndustryTechnologyPanelCalculator";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `INDUSTRY PANEL REGRESSION FAILED: ${message}`
    );
  }
}

const evaluationValueToman =
  100_000_000_000;

const sameField =
  calculateIndustryTechnologyPanel({
    evaluationValueToman,
    serviceType: "EVALUATION",
    expertCount: 3,
    panelFieldMode: "SAME_FIELD"
  });

assert(
  sameField.expertCount === 3,
  "Same-field panel expert count must be preserved"
);

assert(
  sameField.panelFieldMode ===
    "SAME_FIELD",
  "Same-field mode must be preserved"
);

assert(
  sameField.totalPanelFeeToman ===
    sameField.feePerExpertToman * 3,
  "Same-field panel total must equal per-expert fee × count"
);

const differentFields =
  calculateIndustryTechnologyPanel({
    evaluationValueToman,
    serviceType: "EVALUATION",
    expertCount: 3,
    panelFieldMode:
      "DIFFERENT_FIELDS"
  });

assert(
  differentFields.panelFieldMode ===
    "DIFFERENT_FIELDS",
  "Different-fields mode must be preserved"
);

assert(
  differentFields.totalPanelFeeToman ===
    differentFields.feePerExpertToman *
      3,
  "Different-fields panel total must equal per-expert fee × count"
);

const plus40 =
  calculateIndustryTechnologyPanel({
    evaluationValueToman,
    serviceType:
      "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",
    expertCount: 3,
    panelFieldMode: "SAME_FIELD"
  });

assert(
  plus40.additionalPercent === 40,
  "Panel calculation must preserve the 40% Article 45 rule"
);

assert(
  plus40.additionalFeePerExpertToman ===
    Math.round(
      plus40.article11FeePerExpertToman *
        0.4
    ),
  "Panel 40% increase must be calculated from the Article 11 per-expert fee"
);

assert(
  plus40.totalPanelFeeToman ===
    plus40.feePerExpertToman * 3,
  "40% panel total is incorrect"
);

const plus50 =
  calculateIndustryTechnologyPanel({
    evaluationValueToman,
    serviceType:
      "SOFTWARE_EXPERTISE",
    expertCount: 2,
    panelFieldMode:
      "DIFFERENT_FIELDS"
  });

assert(
  plus50.additionalPercent === 50,
  "Panel calculation must preserve the 50% software rule"
);

assert(
  plus50.additionalFeePerExpertToman ===
    Math.round(
      plus50.article11FeePerExpertToman *
        0.5
    ),
  "Panel 50% increase must be calculated from the Article 11 per-expert fee"
);

assert(
  plus50.totalPanelFeeToman ===
    plus50.feePerExpertToman * 2,
  "50% panel total is incorrect"
);

for (const serviceType of [
  "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",
  "SOFTWARE_EXPERTISE"
] as const) {
  const cappedPanel =
    calculateIndustryTechnologyPanel({
      evaluationValueToman:
        1_000_000_000_000_000,
      serviceType,
      expertCount: 2,
      panelFieldMode: "DIFFERENT_FIELDS"
    });

  assert(
    cappedPanel.feePerExpertToman ===
      135_000_000,
    `${serviceType} must cap each expert at the Article 11 general maximum`
  );

  assert(
    cappedPanel.cappedByArticle11Maximum,
    `${serviceType} must report that the Article 11 maximum was applied`
  );
}

console.log(
  "INDUSTRY PANEL REGRESSION: ALL TESTS PASSED"
);
