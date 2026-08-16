import { buildShareResult } from "../src/share/ShareResultBuilder";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `SHARE RESULT BUILDER TEST FAILED: ${message}`,
    );
  }
}

const result = buildShareResult({
  evaluationValueToman: 3_400_000_000,
  expertCount: 3,
  calculatedFeeToman: 52_000_000,
});

assert(
  result.title === "نتیجه محاسبه ExpertFee",
  "share title mismatch",
);

assert(
  result.text.includes(
    "مبلغ مورد ارزیابی: ۳,۴۰۰,۰۰۰,۰۰۰ تومان",
  ),
  "evaluation amount missing",
);

assert(
  result.text.includes("تعداد کارشناسان: ۳ نفر"),
  "expert count missing",
);

assert(
  result.text.includes(
    "دستمزد محاسبه‌شده: ۵۲,۰۰۰,۰۰۰ تومان",
  ),
  "calculated fee missing",
);

assert(
  result.text.includes("تولیدشده توسط:"),
  "attribution missing",
);

assert(
  result.text.includes("ExpertFee"),
  "ExpertFee branding missing",
);

assert(
  !result.text.includes("ExpertFee-AI"),
  "ExpertFee-AI branding must not exist",
);

const invalidInputs = [
  {
    evaluationValueToman: 0,
    expertCount: 1,
    calculatedFeeToman: 10,
  },
  {
    evaluationValueToman: 100,
    expertCount: 0,
    calculatedFeeToman: 10,
  },
  {
    evaluationValueToman: 100,
    expertCount: 1,
    calculatedFeeToman: -1,
  },
];

for (const invalid of invalidInputs) {
  let failed = false;

  try {
    buildShareResult(invalid);
  } catch {
    failed = true;
  }

  assert(failed, "invalid share input was accepted");
}

console.log("SHARE RESULT BUILDER: ALL TESTS PASSED");
