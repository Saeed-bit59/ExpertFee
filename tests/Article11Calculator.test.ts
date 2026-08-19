import { calculateArticle11 } from
  "../src/engine/Article11Calculator";

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

const case1 =
  calculateArticle11(250_000_000);

assertEqual(
  case1.finalFee,
  20_000_000,
  "250 million"
);

const case2 =
  calculateArticle11(1_000_000_000);

assertEqual(
  case2.finalFee,
  22_250_000,
  "1 billion"
);

const case3 =
  calculateArticle11(5_000_000_000);

assertEqual(
  case3.finalFee,
  38_250_000,
  "5 billion"
);

console.log(
  "Article 11 calculation tests completed."
);
