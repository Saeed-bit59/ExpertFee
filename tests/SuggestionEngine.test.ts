import {
  getArticle11Suggestions,
  getArticle11SuggestionByCode
} from "../src/workflow/SuggestionEngine";

import {
  ARTICLE11_INCREASE_RULES
} from "../src/engine/Article11IncreaseRules";


/*
 * ========================================
 * Test Helper
 * ========================================
 */

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


/*
 * ========================================
 * SCENARIO 1
 * ارزیابی عادی
 * ========================================
 *
 * انتظار:
 * هیچ ضریب افزایشی صرفاً به دلیل
 * ارزیابی عادی پیشنهاد نشود.
 */

const standardValuation =
  getArticle11Suggestions({
    subjectType:
      "STANDARD_VALUATION"
  });


assert(
  standardValuation.length === 0,
  "SCENARIO 1 | Standard valuation -> no suggestion"
);


/*
 * ========================================
 * SCENARIO 2
 * بررسی کامل قرارداد
 * ========================================
 *
 * انتظار:
 * تبصره 3
 * NOTE3_CONTRACT_FULL
 * افزایش 100 درصد
 */

const contractFull =
  getArticle11Suggestions({
    subjectType:
      "CONTRACT_FULL"
  });


assert(
  contractFull.length === 1,
  "SCENARIO 2 | Contract full -> one suggestion"
);


assert(
  contractFull[0]?.code ===
    "NOTE3_CONTRACT_FULL",
  "SCENARIO 2 | Correct rule"
);


assert(
  contractFull[0]?.noteNumber === 3,
  "SCENARIO 2 | Note 3"
);


assert(
  contractFull[0]?.increaseRate === 1,
  "SCENARIO 2 | Increase 100%"
);


/*
 * ========================================
 * SCENARIO 3
 * بررسی بخشی از قرارداد
 * ========================================
 *
 * انتظار:
 * تبصره 3
 * NOTE3_CONTRACT_PARTIAL
 * افزایش 50 درصد
 */

const contractPartial =
  getArticle11Suggestions({
    subjectType:
      "CONTRACT_PARTIAL"
  });


assert(
  contractPartial.length === 1,
  "SCENARIO 3 | Contract partial -> one suggestion"
);


assert(
  contractPartial[0]?.code ===
    "NOTE3_CONTRACT_PARTIAL",
  "SCENARIO 3 | Correct rule"
);


assert(
  contractPartial[0]?.noteNumber === 3,
  "SCENARIO 3 | Note 3"
);


assert(
  contractPartial[0]?.increaseRate === 0.5,
  "SCENARIO 3 | Increase 50%"
);


/*
 * ========================================
 * SCENARIO 4
 * خسارت
 * ========================================
 *
 * خسارت در متن معتبر فعلی پروژه افزایش خودکار ندارد.
 */

const damage =
  getArticle11Suggestions({
    subjectType:
      "DAMAGE"
  });


assert(
  damage.length === 0,
  "SCENARIO 4 | Damage -> no unsupported suggestion"
);


/*
 * ========================================
 * SCENARIO 5
 * اقلام خاص
 * ========================================
 *
 * انتظار: پیشنهاد تبصره ۵، با تأیید کاربر.
 */

const specialItems =
  getArticle11Suggestions({
    subjectType:
      "SPECIAL_ITEMS"
  });


assert(
  specialItems.length === 1 &&
    specialItems[0]?.code === "NOTE5_SPECIAL_ITEMS" &&
    specialItems[0]?.increaseRate === 0.5,
  "SCENARIO 5 | Special items -> Note 5 suggestion"
);


/*
 * ========================================
 * SCENARIO 6
 * دارایی نامشهود
 * ========================================
 *
 * انتظار:
 * تبصره 4
 * NOTE4_INTANGIBLE_ASSETS
 * افزایش 50 درصد
 */

const intangibleAssets =
  getArticle11Suggestions({
    subjectType:
      "INTANGIBLE_ASSETS"
  });


assert(
  intangibleAssets.length === 1,
  "SCENARIO 6 | Intangible assets -> one suggestion"
);


assert(
  intangibleAssets[0]?.code ===
    "NOTE4_INTANGIBLE_ASSETS",
  "SCENARIO 6 | Correct rule"
);


assert(
  intangibleAssets[0]?.noteNumber === 4,
  "SCENARIO 6 | Note 4"
);


assert(
  intangibleAssets[0]?.increaseRate === 0.5,
  "SCENARIO 6 | Increase 50%"
);


/*
 * ========================================
 * SAFETY TEST
 * تأیید کاربر الزامی است
 * ========================================
 */

const allScenarioSuggestions = [
  ...contractFull,
  ...contractPartial,
  ...damage,
  ...specialItems,
  ...intangibleAssets
];


assert(
  allScenarioSuggestions.every(
    suggestion =>
      suggestion.requiresUserConfirmation ===
      true
  ),
  "SAFETY | All suggestions require user confirmation"
);


/*
 * ========================================
 * SOURCE OF TRUTH TEST
 * ========================================
 *
 * عنوان و نرخ پیشنهاد باید دقیقاً
 * از Article11IncreaseRules دریافت شود.
 */

for (
  const suggestion of
  allScenarioSuggestions
) {

  const sourceRule =
    ARTICLE11_INCREASE_RULES.find(
      rule =>
        rule.code ===
        suggestion.code
    );


  assert(
    sourceRule !== undefined,
    `SOURCE | Rule exists: ${suggestion.code}`
  );


  assert(
    sourceRule?.title ===
      suggestion.title,
    `SOURCE | Title matches: ${suggestion.code}`
  );


  assert(
    sourceRule?.increaseRate ===
      suggestion.increaseRate,
    `SOURCE | Rate matches: ${suggestion.code}`
  );
}


/*
 * ========================================
 * DIRECT LOOKUP TEST
 * ========================================
 */

const directLookup =
  getArticle11SuggestionByCode(
    "NOTE4_INTANGIBLE_ASSETS"
  );


assert(
  directLookup !== undefined,
  "LOOKUP | Rule lookup works"
);


assert(
  directLookup?.code ===
    "NOTE4_INTANGIBLE_ASSETS",
  "LOOKUP | Correct rule returned"
);


assert(
  directLookup?.requiresUserConfirmation ===
    true,
  "LOOKUP | User confirmation required"
);


/*
 * ========================================
 * SHOW ALL TEST
 * ========================================
 */

const allRules =
  getArticle11Suggestions({
    includeIncreaseRules: true
  });


assert(
  allRules.length ===
    ARTICLE11_INCREASE_RULES.length,
  "ALL RULES | All rules returned"
);


/*
 * ========================================
 * EMPTY CONTEXT TEST
 * ========================================
 */

const emptyContext =
  getArticle11Suggestions({});


assert(
  emptyContext.length === 0,
  "EMPTY | Empty context -> no suggestion"
);


/*
 * ========================================
 * COMPLETED
 * ========================================
 */

console.log("");
console.log(
  "ARTICLE 11 SUGGESTION ENGINE BENCHMARK COMPLETED"
);
