import {
  ARTICLE11_INCREASE_RULES,
  ARTICLE11_MAXIMUM_FEE_TOMAN,
  applyArticle11IncreaseRule,
  getArticle11IncreaseRule
} from "../src/engine/Article11IncreaseRules";


function assert(
  condition: boolean,
  name: string
) {

  if (!condition) {
    throw new Error(
      `FAILED: ${name}`
    );
  }

  console.log(
    `PASS: ${name}`
  );
}


function near(
  actual: number,
  expected: number,
  tolerance: number,
  name: string
) {

  assert(
    Math.abs(
      actual - expected
    ) <= tolerance,
    name
  );
}


/*
 * ==========================================
 * TEST 1
 * تعداد Ruleهای تعریف‌شده
 * ==========================================
 */

assert(
  ARTICLE11_INCREASE_RULES.length === 3,
  "Three Article 11 increase rules are available in tariff 1405"
);


/*
 * ==========================================
 * TEST 2
 * کنترل سقف ماده 11
 * ==========================================
 */

assert(
  ARTICLE11_MAXIMUM_FEE_TOMAN ===
    135_000_000,
  "Article 11 maximum fee is 135 million toman"
);


/*
 * ==========================================
 * TEST 3
 * تبصره 3
 * افزایش 100 درصد
 * بدون عبور از سقف
 * ==========================================
 */

const note3Full =
  applyArticle11IncreaseRule({

    baseFeeToman:
      50_000_000,

    ruleCode:
      "NOTE3_CONTRACT_FULL"
  });


assert(
  note3Full.noteNumber === 3,
  "Note 3 full contract rule selected"
);


assert(
  note3Full.increaseRate === 1,
  "Note 3 full contract increase rate is 100 percent"
);


assert(
  note3Full.increaseAmountToman ===
    50_000_000,
  "Note 3 full contract increase amount"
);


assert(
  note3Full.feeAfterIncreaseToman ===
    100_000_000,
  "Note 3 full contract fee after increase"
);


assert(
  note3Full.capped === false,
  "Note 3 full contract remains below cap"
);


assert(
  note3Full.finalFeeToman ===
    100_000_000,
  "Note 3 full contract final fee"
);


/*
 * ==========================================
 * TEST 4
 * تبصره 3
 * افزایش 50 درصد
 * ==========================================
 */

const note3Partial =
  applyArticle11IncreaseRule({

    baseFeeToman:
      60_000_000,

    ruleCode:
      "NOTE3_CONTRACT_PARTIAL"
  });


assert(
  note3Partial.increaseRate === 0.50,
  "Note 3 partial contract increase rate is 50 percent"
);


assert(
  note3Partial.increaseAmountToman ===
    30_000_000,
  "Note 3 partial contract increase amount"
);


assert(
  note3Partial.feeAfterIncreaseToman ===
    90_000_000,
  "Note 3 partial contract fee after increase"
);


assert(
  note3Partial.finalFeeToman ===
    90_000_000,
  "Note 3 partial contract final fee"
);


/*
 * ==========================================
 * TEST 5
 * تبصره 4
 * افزایش 50 درصد
 * بدون عبور از سقف
 * ==========================================
 */

const note4 =
  applyArticle11IncreaseRule({

    baseFeeToman:
      60_000_000,

    ruleCode:
      "NOTE4_INTANGIBLE_ASSETS"
  });


assert(
  note4.noteNumber === 4,
  "Note 4 selected"
);


assert(
  note4.increaseRate === 0.50,
  "Note 4 increase rate is 50 percent"
);


assert(
  note4.increaseAmountToman ===
    30_000_000,
  "Note 4 increase amount"
);


assert(
  note4.finalFeeToman ===
    90_000_000,
  "Note 4 final fee"
);


/*
 * ==========================================
 * TEST 6
 * تبصره 5
 * افزایش 50 درصد
 * ==========================================
 */

const note5 =
  applyArticle11IncreaseRule({

    baseFeeToman:
      70_000_000,

    ruleCode:
      "NOTE4_INTANGIBLE_ASSETS"
  });


assert(
  note5.noteNumber === 4,
  "Only the tariff 1405 intangible-assets rule is selected"
);


assert(
  note5.increaseRate === 0.50,
  "Note 5 increase rate is 50 percent"
);


assert(
  note5.increaseAmountToman ===
    35_000_000,
  "Note 5 increase amount"
);


assert(
  note5.finalFeeToman ===
    105_000_000,
  "Note 5 final fee"
);


/*
 * ==========================================
 * TEST 7
 * تبصره 7
 * افزایش 50 درصد و کنترل سقف
 * ==========================================
 */

const note7 =
  applyArticle11IncreaseRule({

    baseFeeToman:
      118_000_000,

    ruleCode:
      "NOTE4_INTANGIBLE_ASSETS"
  });


assert(
  note7.noteNumber === 4,
  "Intangible assets belongs to Note 4"
);


assert(
  note7.increaseRate === 0.50,
  "Note 7 increase rate is 50 percent"
);


assert(
  note7.increaseAmountToman ===
    59_000_000,
  "Note 7 increase amount calculated"
);


assert(
  note7.feeAfterIncreaseToman ===
    177_000_000,
  "Note 7 raw fee after increase"
);


assert(
  note7.capped === true,
  "Article 11 maximum fee activated"
);


assert(
  note7.finalFeeToman ===
    135_000_000,
  "Note 4 final fee capped at 135 million"
);


/*
 * ==========================================
 * TEST 8
 * عبور از سقف با افزایش 100 درصدی
 * ==========================================
 */

const note3Capped =
  applyArticle11IncreaseRule({

    baseFeeToman:
      100_000_000,

    ruleCode:
      "NOTE3_CONTRACT_FULL"
  });


assert(
  note3Capped.feeAfterIncreaseToman ===
    200_000_000,
  "100 percent increase calculated before cap"
);


assert(
  note3Capped.capped === true,
  "100 percent increase activates cap"
);


assert(
  note3Capped.finalFeeToman ===
    135_000_000,
  "100 percent increase final fee capped"
);


/*
 * ==========================================
 * TEST 9
 * مبلغ دقیقاً روی سقف
 * ==========================================
 */

const exactlyCap =
  applyArticle11IncreaseRule({

    baseFeeToman:
      67_500_000,

    ruleCode:
      "NOTE3_CONTRACT_FULL"
  });


assert(
  exactlyCap.feeAfterIncreaseToman ===
    135_000_000,
  "Fee can reach exactly 135 million"
);


assert(
  exactlyCap.capped === false,
  "Exact maximum is not treated as exceeded"
);


assert(
  exactlyCap.finalFeeToman ===
    135_000_000,
  "Exact maximum remains 135 million"
);


/*
 * ==========================================
 * TEST 10
 * مبلغ صفر
 * ==========================================
 */

const zeroFee =
  applyArticle11IncreaseRule({

    baseFeeToman:
      0,

    ruleCode:
      "NOTE4_INTANGIBLE_ASSETS"
  });


assert(
  zeroFee.increaseAmountToman === 0,
  "Zero base fee has zero increase"
);


assert(
  zeroFee.finalFeeToman === 0,
  "Zero base fee remains zero"
);


assert(
  zeroFee.capped === false,
  "Zero fee does not activate cap"
);


/*
 * ==========================================
 * TEST 11
 * مبلغ اعشاری
 * ==========================================
 */

const decimalFee =
  applyArticle11IncreaseRule({

    baseFeeToman:
      10_000_001,

    ruleCode:
      "NOTE4_INTANGIBLE_ASSETS"
  });


near(
  decimalFee.feeAfterIncreaseToman,
  15_000_001.5,
  0.01,
  "Decimal increase calculation correct"
);


near(
  decimalFee.finalFeeToman,
  15_000_001.5,
  0.01,
  "Decimal final fee correct"
);


/*
 * ==========================================
 * TEST 12
 * مبلغ منفی
 * ==========================================
 */

let negativeDetected =
  false;


try {

  applyArticle11IncreaseRule({

    baseFeeToman:
      -1,

    ruleCode:
      "NOTE4_INTANGIBLE_ASSETS"
  });

} catch {

  negativeDetected =
    true;
}


assert(
  negativeDetected,
  "Negative base fee rejected"
);


/*
 * ==========================================
 * TEST 13
 * عنوان تبصره 4
 * ==========================================
 */

const note4Rule =
  getArticle11IncreaseRule(
    "NOTE4_INTANGIBLE_ASSETS"
  );


assert(
  note4Rule.title ===
    "ارزش‌گذاری دارایی‌های نامشهود مانند انواع برندها (ویژند)",
  "Note 4 tariff title preserved"
);


/*
 * ==========================================
 * TEST 14
 * کنترل تبصره 7
 * ==========================================
 */

const note7Rule =
  getArticle11IncreaseRule(
    "NOTE4_INTANGIBLE_ASSETS"
  );


assert(
  note7Rule.noteNumber === 4,
  "Note 7 rule number preserved"
);


assert(
  note7Rule.increaseRate === 0.50,
  "Note 7 rule increase rate preserved"
);


/*
 * ==========================================
 * TEST 15
 * کنترل شماره تبصره تمام Ruleها
 * ==========================================
 */

assert(
  ARTICLE11_INCREASE_RULES.every(
    rule =>
      [3, 4].includes(
        rule.noteNumber
      )
  ),
  "All increase rules belong to Notes 3 or 4"
);


/*
 * ==========================================
 * TEST 16
 * هیچ Rule نباید دستمزد نهایی
 * بیشتر از سقف ایجاد کند
 * ==========================================
 */

for (
  const rule of
  ARTICLE11_INCREASE_RULES
) {

  const result =
    applyArticle11IncreaseRule({

      baseFeeToman:
        135_000_000,

      ruleCode:
        rule.code
    });


  assert(
    result.finalFeeToman <=
      ARTICLE11_MAXIMUM_FEE_TOMAN,

    `${rule.code} never exceeds Article 11 maximum fee`
  );
}


/*
 * ==========================================
 * پایان تست‌ها
 * ==========================================
 */

console.log(
  "Article 11 Increase Rules tests completed."
);
