import {
  TARIFF_1405,
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
} from "../src/config/Tariff1405";

import {
  calculateArticle11,
} from "../src/engine/Article11Calculator";

import {
  calculateMission,
  getMissionDailyRate,
} from "../src/engine/MissionCalculator";

import {
  applyArticle11Adjustments,
} from "../src/engine/Article11Adjustments";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `TARIFF 1405 CORE REGRESSION FAILED: ${message}`,
    );
  }
}

function assertEqual(
  actual: number | string | boolean,
  expected: number | string | boolean,
  message: string,
): void {
  if (actual !== expected) {
    throw new Error(
      [
        `TARIFF 1405 CORE REGRESSION FAILED: ${message}`,
        `expected=${expected}`,
        `actual=${actual}`,
      ].join(" | "),
    );
  }
}

/* Metadata */
assertEqual(
  TARIFF_1405.metadata.year,
  1405,
  "active tariff year",
);

assertEqual(
  TARIFF_1405.metadata.articleCount,
  59,
  "article count",
);

assertEqual(
  TARIFF_1405.metadata.amendmentCount,
  0,
  "amendment count",
);

/* Article 11 fixed threshold */
const fixed =
  calculateArticle11(
    500_000_000,
  );

assertEqual(
  fixed.finalFee,
  20_000_000,
  "500M Rial fixed fee",
);

const first =
  calculateArticle11(
    1_000_000_000,
  );

assertEqual(
  first.finalFee,
  22_250_000,
  "1B Rial Article 11 fee",
);

const fiveB =
  calculateArticle11(
    5_000_000_000,
  );

assertEqual(
  fiveB.finalFee,
  38_250_000,
  "5B Rial Article 11 fee",
);

const thirtyB =
  calculateArticle11(
    30_000_000_000,
  );

assertEqual(
  thirtyB.finalFee,
  88_250_000,
  "30B Rial Article 11 fee",
);

const oneHundredFiftyB =
  calculateArticle11(
    150_000_000_000,
  );

assertEqual(
  oneHundredFiftyB.finalFee,
  232_250_000,
  "150B Rial Article 11 fee",
);

/* General maximum */
const huge =
  calculateArticle11(
    10_000_000_000_000,
  );

assert(
  huge.capped,
  "general Article 11 cap must apply",
);

assertEqual(
  huge.finalFee,
  TARIFF_1405.article11.generalMaximumRial,
  "general Article 11 maximum",
);

assertEqual(
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN,
  135_000_000,
  "general Article 11 maximum in Toman",
);

/* Mission rates */
assertEqual(
  getMissionDailyRate(
    "IN_PROVINCE",
  ),
  750_000,
  "inside-province daily mission",
);

assertEqual(
  getMissionDailyRate(
    "OUT_OF_PROVINCE",
  ),
  1_500_000,
  "outside-province daily mission",
);

const mission =
  calculateMission({
    expertFeeToman: 50_000_000,
    missionType: "IN_PROVINCE",
    missionDays: 2,
  });

assertEqual(
  mission.missionFeeToman,
  1_500_000,
  "mission fee",
);

assertEqual(
  mission.totalPayableToman,
  51_500_000,
  "total with mission",
);

/* Adjustment cap */
const adjusted =
  applyArticle11Adjustments(
    130_000_000,
    [],
  );

assertEqual(
  adjusted.finalFee,
  130_000_000,
  "adjustment must use 1405 cap",
);

const adjustedAbove =
  applyArticle11Adjustments(
    140_000_000,
    [],
  );

assertEqual(
  adjustedAbove.finalFee,
  135_000_000,
  "adjustment cap must be 135M Toman",
);

console.log(
  "TARIFF 1405 CORE REGRESSION: ALL TESTS PASSED",
);
