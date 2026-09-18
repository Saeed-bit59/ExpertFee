import { applyArticle11Adjustments } from
  "../src/engine/Article11Adjustments";

function assertEqual(
  actual: number,
  expected: number,
  name: string
) {

  if (actual !== expected) {
    throw new Error(
      `${name}: expected ${expected}, received ${actual}`
    );
  }

  console.log(`PASS: ${name}`);
}

const baseFee = 100_000_000;

// تبصره 3 - کل قرارداد: +100%
const contractFull =
  applyArticle11Adjustments(
    baseFee,
    ["CONTRACT_FULL"]
  );

assertEqual(
  contractFull.finalFee,
  135_000_000,
  "Contract full +100%"
);

// تبصره 3 - بخشی از قرارداد: +50%
const contractPartial =
  applyArticle11Adjustments(
    baseFee,
    ["CONTRACT_PARTIAL"]
  );

assertEqual(
  contractPartial.finalFee,
  135_000_000,
  "Contract partial +50%"
);

// ماده ۵۶ - چند کارشناس هم‌رشته: -30%
const multiExpert =
  applyArticle11Adjustments(
    baseFee,
    ["MULTI_EXPERT_SAME_FIELD"]
  );

assertEqual(
  multiExpert.finalFee,
  70_000_000,
  "Same-field experts -30%"
);

// تبصره ۴ - دارایی نامشهود: +50%
const intangible =
  applyArticle11Adjustments(
    baseFee,
    ["INTANGIBLE_ASSET"]
  );

assertEqual(
  intangible.finalFee,
  135_000_000,
  "Intangible asset +50%"
);

console.log(
  "Article 11 adjustment tests completed."
);
