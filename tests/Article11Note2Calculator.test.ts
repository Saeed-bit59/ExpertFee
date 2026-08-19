import {
  calculateArticle11Note2
} from "../src/engine/Article11Note2Calculator";


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
    Math.abs(actual - expected) <= tolerance,
    name
  );
}


/*
 * ==========================================
 * TEST 1
 * تجمیع چند موضوع
 *
 * 20 + 30 + 50 میلیارد تومان
 * مبنای محاسبه = 100 میلیارد تومان
 * ==========================================
 */

const combined =
  calculateArticle11Note2({

    mode:
      "COMBINED",

    items: [
      {
        valueToman:
          20_000_000_000
      },
      {
        valueToman:
          30_000_000_000
      },
      {
        valueToman:
          50_000_000_000
      }
    ]
  });


assert(
  combined.mode === "COMBINED",
  "Combined mode selected"
);


assert(
  combined.totalEvaluationValueToman ===
    100_000_000_000,
  "Combined evaluation value is 100 billion"
);


assert(
  combined.groupCount === 1,
  "Combined mode creates one calculation group"
);


assert(
  combined.groups[0]
    .totalEvaluationValueToman ===
    100_000_000_000,
  "Combined group contains total evaluation value"
);


assert(
  combined.totalFeeToman ===
    combined.groups[0].feeToman,
  "Combined total fee equals single group fee"
);


/*
 * ==========================================
 * TEST 2
 * تفکیک بر اساس مالک
 *
 * مالک A:
 * 20 + 30 = 50 میلیارد
 *
 * مالک B:
 * 50 میلیارد
 *
 * باید دو محاسبه مستقل ایجاد شود.
 * ==========================================
 */

const byOwner =
  calculateArticle11Note2({

    mode:
      "SEPARATE_BY_OWNER",

    items: [

      {
        valueToman:
          20_000_000_000,

        ownerId:
          "OWNER-A"
      },

      {
        valueToman:
          30_000_000_000,

        ownerId:
          "OWNER-A"
      },

      {
        valueToman:
          50_000_000_000,

        ownerId:
          "OWNER-B"
      }
    ]
  });


assert(
  byOwner.groupCount === 2,
  "Owner mode creates two calculation groups"
);


assert(
  byOwner.totalEvaluationValueToman ===
    100_000_000_000,
  "Owner mode preserves total evaluation value"
);


const ownerA =
  byOwner.groups.find(
    group =>
      group.groupKey === "OWNER-A"
  );


const ownerB =
  byOwner.groups.find(
    group =>
      group.groupKey === "OWNER-B"
  );


assert(
  ownerA !== undefined,
  "Owner A group exists"
);


assert(
  ownerB !== undefined,
  "Owner B group exists"
);


assert(
  ownerA!
    .totalEvaluationValueToman ===
    50_000_000_000,
  "Owner A total is 50 billion"
);


assert(
  ownerA!.itemCount === 2,
  "Owner A contains two evaluation items"
);


assert(
  ownerB!
    .totalEvaluationValueToman ===
    50_000_000_000,
  "Owner B total is 50 billion"
);


assert(
  ownerB!.itemCount === 1,
  "Owner B contains one evaluation item"
);


near(
  byOwner.totalFeeToman,
  ownerA!.feeToman +
    ownerB!.feeToman,
  1,
  "Owner mode total fee equals sum of independent calculations"
);


/*
 * ==========================================
 * TEST 3
 * تفکیک بر اساس محل
 *
 * SITE-A:
 * 10 + 15 = 25 میلیارد
 *
 * SITE-B:
 * 75 میلیارد
 * ==========================================
 */

const byLocation =
  calculateArticle11Note2({

    mode:
      "SEPARATE_BY_LOCATION",

    items: [

      {
        valueToman:
          10_000_000_000,

        locationId:
          "SITE-A"
      },

      {
        valueToman:
          15_000_000_000,

        locationId:
          "SITE-A"
      },

      {
        valueToman:
          75_000_000_000,

        locationId:
          "SITE-B"
      }
    ]
  });


assert(
  byLocation.groupCount === 2,
  "Location mode creates two calculation groups"
);


const siteA =
  byLocation.groups.find(
    group =>
      group.groupKey === "SITE-A"
  );


const siteB =
  byLocation.groups.find(
    group =>
      group.groupKey === "SITE-B"
  );


assert(
  siteA !== undefined,
  "Site A group exists"
);


assert(
  siteB !== undefined,
  "Site B group exists"
);


assert(
  siteA!
    .totalEvaluationValueToman ===
    25_000_000_000,
  "Site A total is 25 billion"
);


assert(
  siteB!
    .totalEvaluationValueToman ===
    75_000_000_000,
  "Site B total is 75 billion"
);


near(
  byLocation.totalFeeToman,
  siteA!.feeToman +
    siteB!.feeToman,
  1,
  "Location total fee equals sum of group fees"
);


/*
 * ==========================================
 * TEST 4
 * تفاوت نتیجه تجمیع و تفکیک
 *
 * این تست بسیار مهم است.
 *
 * برای همان ارزش کل، محاسبه مستقل
 * گروه‌ها نباید الزاماً برابر محاسبه
 * یک‌باره روی مجموع باشد.
 * ==========================================
 */

assert(
  byOwner.totalEvaluationValueToman ===
    combined.totalEvaluationValueToman,
  "Combined and owner modes have same total evaluation value"
);


assert(
  byOwner.totalFeeToman !==
    combined.totalFeeToman,
  "Separate and combined calculations produce different fee results"
);


/*
 * ==========================================
 * TEST 5
 * کنترل سقف برای هر گروه به صورت مستقل
 *
 * دو مالک با مبالغ بسیار بالا
 * هر مالک یک محاسبه مستقل دارد.
 * ==========================================
 */

const cappedOwners =
  calculateArticle11Note2({

    mode:
      "SEPARATE_BY_OWNER",

    items: [

      {
        valueToman:
          4_000_000_000_000,

        ownerId:
          "OWNER-A"
      },

      {
        valueToman:
          4_000_000_000_000,

        ownerId:
          "OWNER-B"
      }
    ]
  });


assert(
  cappedOwners.groupCount === 2,
  "Two high-value owners create two groups"
);


assert(
  cappedOwners.groups.every(
    group =>
      group.feeToman <=
      135_000_000
  ),
  "Article 11 maximum fee enforced independently for each group"
);


/*
 * ==========================================
 * TEST 6
 * نبود ownerId در حالت مالک
 * باید خطا ایجاد کند.
 * ==========================================
 */

let missingOwnerDetected =
  false;


try {

  calculateArticle11Note2({

    mode:
      "SEPARATE_BY_OWNER",

    items: [

      {
        valueToman:
          20_000_000_000
      },

      {
        valueToman:
          30_000_000_000,

        ownerId:
          "OWNER-B"
      }
    ]
  });

} catch {

  missingOwnerDetected =
    true;
}


assert(
  missingOwnerDetected,
  "Missing owner ID rejected"
);


/*
 * ==========================================
 * TEST 7
 * نبود locationId در حالت محل
 * ==========================================
 */

let missingLocationDetected =
  false;


try {

  calculateArticle11Note2({

    mode:
      "SEPARATE_BY_LOCATION",

    items: [

      {
        valueToman:
          20_000_000_000,

        locationId:
          "SITE-A"
      },

      {
        valueToman:
          30_000_000_000
      }
    ]
  });

} catch {

  missingLocationDetected =
    true;
}


assert(
  missingLocationDetected,
  "Missing location ID rejected"
);


/*
 * ==========================================
 * TEST 8
 * مبلغ منفی
 * ==========================================
 */

let negativeValueDetected =
  false;


try {

  calculateArticle11Note2({

    mode:
      "COMBINED",

    items: [

      {
        valueToman:
          50_000_000_000
      },

      {
        valueToman:
          -10_000
      }
    ]
  });

} catch {

  negativeValueDetected =
    true;
}


assert(
  negativeValueDetected,
  "Negative evaluation value rejected"
);


/*
 * ==========================================
 * TEST 9
 * آرایه خالی
 * ==========================================
 */

let emptyItemsDetected =
  false;


try {

  calculateArticle11Note2({

    mode:
      "COMBINED",

    items:
      []
  });

} catch {

  emptyItemsDetected =
    true;
}


assert(
  emptyItemsDetected,
  "Empty evaluation items rejected"
);


/*
 * ==========================================
 * TEST 10
 * عنوان خروجی
 * ==========================================
 */

assert(
  combined.calculationLabel ===
    "محاسبه دستمزد براساس تبصره ۲ ماده ۱۱",
  "Note 2 calculation label available"
);


console.log(
  "Article 11 Note 2 tests completed."
);
