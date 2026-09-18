import {
  calculateArticle13
} from "../src/engine/Article13Calculator";


function assertEqual(
  actual: number,
  expected: number,
  name: string
) {

  if (actual !== expected) {

    throw new Error(
      `FAILED: ${name}
Expected: ${expected}
Actual:   ${actual}`
    );
  }

  console.log(
    `PASS | ${name} -> ${actual.toLocaleString("en-US")}`
  );
}


/*
 * ==========================================
 * ماده 13
 * BENCHMARK
 * واحد تمام مبالغ: تومان
 * ==========================================
 */


/*
 * TEST 1
 * زیر مرز اول
 */

assertEqual(
  calculateArticle13({
    monthlyRentToman:
      1_000_000
  }).finalFeeToman,

  2_000_000,

  "Rent 1,000,000"
);


/*
 * TEST 2
 * دقیقاً مرز اول
 */

assertEqual(
  calculateArticle13({
    monthlyRentToman:
      1_500_000
  }).finalFeeToman,

  2_000_000,

  "Rent 1,500,000"
);


/*
 * TEST 3
 * ابتدای پله دوم
 *
 * 2,000,000 - 1,500,000
 * = 500,000
 *
 * 20% = 100,000
 *
 * Fee =
 * 600,000 + 100,000
 * = 700,000
 */

assertEqual(
  calculateArticle13({
    monthlyRentToman:
      2_000_000
  }).finalFeeToman,

  2_000_000,

  "Rent 2,000,000"
);


/*
 * TEST 4
 * انتهای پله دوم
 *
 * 5,000,000 - 1,500,000
 * = 3,500,000
 *
 * 20% = 700,000
 *
 * Fee =
 * 600,000 + 700,000
 * = 1,300,000
 */

assertEqual(
  calculateArticle13({
    monthlyRentToman:
      5_000_000
  }).finalFeeToman,

  2_000_000,

  "Rent 5,000,000"
);


/*
 * TEST 5
 * پله سوم
 *
 * تا 5M:
 * 1,300,000
 *
 * مازاد:
 * 7,000,000 - 5,000,000
 * = 2,000,000
 *
 * 10% = 200,000
 *
 * Fee =
 * 1,500,000
 */

assertEqual(
  calculateArticle13({
    monthlyRentToman:
      7_000_000
  }).finalFeeToman,

  2_000_000,

  "Rent 7,000,000"
);


/*
 * TEST 6
 * انتهای پله سوم
 */

assertEqual(
  calculateArticle13({
    monthlyRentToman:
      10_000_000
  }).finalFeeToman,

  2_000_000,

  "Rent 10,000,000"
);


/*
 * TEST 7
 * پله چهارم
 *
 * تا 10M:
 * 1,800,000
 *
 * مازاد:
 * 20M - 10M
 * = 10M
 *
 * 4% = 400,000
 *
 * Fee =
 * 2,200,000
 */

assertEqual(
  calculateArticle13({
    monthlyRentToman:
      20_000_000
  }).finalFeeToman,

  4_500_000,

  "Rent 20,000,000"
);


/*
 * TEST 8
 * مبلغ بزرگ
 */

assertEqual(
  calculateArticle13({
    monthlyRentToman:
      100_000_000
  }).finalFeeToman,

  19_500_000,

  "Rent 100,000,000"
);


/*
 * TEST 9
 * کنترل سقف
 *
 * Fee before final tier:
 * 1,800,000
 *
 * برای رسیدن به سقف 60M:
 *
 * 60M - 1.8M
 * = 58.2M
 *
 * 58.2M / 4%
 * = 1,455M
 *
 * Rent =
 * 10M + 1,455M
 * =
 * 1,465,000,000
 */

assertEqual(
  calculateArticle13({
    monthlyRentToman:
      1_275_000_000
  }).finalFeeToman,

  90_000_000,

  "Exact cap point"
);


/*
 * TEST 10
 * بالاتر از سقف
 */

const capped =
  calculateArticle13({
    monthlyRentToman:
      2_000_000_000
  });


assertEqual(
  capped.finalFeeToman,

  90_000_000,

  "Above cap"
);


if (!capped.capped) {

  throw new Error(
    "FAILED: capped flag should be true"
  );
}

console.log(
  "PASS | capped flag = true"
);


/*
 * ==========================================
 * COMPLETED
 * ==========================================
 */

console.log("");
console.log(
  "ARTICLE 13 BENCHMARK COMPLETED"
);
