import {
  calculateArticle45
} from "../src/engine/IndustryTechnologyCalculator";

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `INDUSTRY 40/50 REGRESSION FAILED: ${message}`
    );
  }
}

const evaluationValueToman =
  100_000_000_000;

const base = calculateArticle45({
  discipline:
    "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",
  serviceType:
    "EVALUATION",
  evaluationValueToman,
  missionType: "NONE",
  missionDays: 0
});

const plus40 = calculateArticle45({
  discipline:
    "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",
  serviceType:
    "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",
  evaluationValueToman,
  missionType: "NONE",
  missionDays: 0
});

const plus50 = calculateArticle45({
  discipline:
    "COMPUTER_INFORMATION_TECHNOLOGY",
  serviceType:
    "SOFTWARE_EXPERTISE",
  evaluationValueToman,
  missionType: "NONE",
  missionDays: 0
});

assert(
  base.additionalPercent === 0,
  "Base evaluation must have 0% increase"
);

assert(
  plus40.additionalPercent === 40,
  "Machinery technical assessment must apply 40%"
);

assert(
  plus40.additionalFeeToman ===
    Math.round(
      plus40.article11FeeToman *
        0.4
    ),
  "40% additional fee calculation is incorrect"
);

assert(
  plus40.expertFeeToman ===
    plus40.article11FeeToman +
      plus40.additionalFeeToman,
  "40% final fee must equal Article 11 + 40%"
);

assert(
  plus50.discipline ===
    "COMPUTER_INFORMATION_TECHNOLOGY",
  "Software calculation must use computer/IT discipline"
);

assert(
  plus50.additionalPercent === 50,
  "Software expertise must apply 50%"
);

assert(
  plus50.additionalFeeToman ===
    Math.round(
      plus50.article11FeeToman *
        0.5
    ),
  "50% additional fee calculation is incorrect"
);

assert(
  plus50.expertFeeToman ===
    plus50.article11FeeToman +
      plus50.additionalFeeToman,
  "50% final fee must equal Article 11 + 50%"
);

let invalidSoftwareRejected = false;

try {
  calculateArticle45({
    discipline:
      "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",
    serviceType:
      "SOFTWARE_EXPERTISE",
    evaluationValueToman,
    missionType: "NONE",
    missionDays: 0
  });
} catch {
  invalidSoftwareRejected = true;
}

assert(
  invalidSoftwareRejected,
  "Software expertise must reject a non-computer discipline"
);

console.log(
  "INDUSTRY 40/50 REGRESSION: ALL TESTS PASSED"
);
