import {
  calculateArticle11MultiField
} from "../src/engine/Article11MultiFieldEngine";


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
 * هیأت چندرشته‌ای ساده
 *
 * برق      300 میلیارد - یک کارشناس
 * مکانیک   300 میلیارد - یک کارشناس
 * عمران    200 میلیارد - یک کارشناس
 * ==========================================
 */

const simple =
  calculateArticle11MultiField({

    totalEvaluationValueToman:
      800_000_000_000,

    fields: [

      {
        fieldName:
          "برق",

        evaluationShareToman:
          300_000_000_000,

        expertCount:
          1
      },

      {
        fieldName:
          "مکانیک",

        evaluationShareToman:
          300_000_000_000,

        expertCount:
          1
      },

      {
        fieldName:
          "عمران",

        evaluationShareToman:
          200_000_000_000,

        expertCount:
          1
      }
    ]
  });


assert(
  simple.allocationIsValid,
  "Multi-field allocation is valid"
);


assert(
  simple.totalAllocatedValueToman ===
    800_000_000_000,
  "Total allocated value is correct"
);


assert(
  simple.totalExpertCount === 3,
  "Total expert count is correct"
);


assert(
  simple.fields.length === 3,
  "Three field groups returned"
);


/*
 * هیچ رشته‌ای بیش از یک کارشناس ندارد.
 * بنابراین کسر 30 درصد نباید اعمال شود.
 */

assert(
  simple.fields.every(
    field =>
      field
        .thirtyPercentReductionApplied
        === false
  ),
  "No 30 percent reduction for single experts in different fields"
);


/*
 * ==========================================
 * TEST 2
 * حالت ترکیبی
 *
 * برق      400 میلیارد - دو کارشناس
 * مکانیک   250 میلیارد - یک کارشناس
 * عمران    150 میلیارد - یک کارشناس
 *
 * فقط گروه برق باید مشمول تبصره 6 شود.
 * ==========================================
 */

const mixed =
  calculateArticle11MultiField({

    totalEvaluationValueToman:
      800_000_000_000,

    fields: [

      {
        fieldName:
          "برق",

        evaluationShareToman:
          400_000_000_000,

        expertCount:
          2
      },

      {
        fieldName:
          "مکانیک",

        evaluationShareToman:
          250_000_000_000,

        expertCount:
          1
      },

      {
        fieldName:
          "عمران",

        evaluationShareToman:
          150_000_000_000,

        expertCount:
          1
      }
    ]
  });


const electrical =
  mixed.fields.find(
    field =>
      field.fieldName === "برق"
  );


const mechanical =
  mixed.fields.find(
    field =>
      field.fieldName === "مکانیک"
  );


const civil =
  mixed.fields.find(
    field =>
      field.fieldName === "عمران"
  );


assert(
  electrical !== undefined,
  "Electrical field exists"
);


assert(
  mechanical !== undefined,
  "Mechanical field exists"
);


assert(
  civil !== undefined,
  "Civil field exists"
);


assert(
  electrical!
    .thirtyPercentReductionApplied
    === true,
  "30 percent reduction applied to two experts of same field"
);


assert(
  electrical!
    .reductionPerExpertToman > 0,
  "Electrical field has reduction amount"
);


assert(
  mechanical!
    .thirtyPercentReductionApplied
    === false,
  "Mechanical single expert has no reduction"
);


assert(
  civil!
    .thirtyPercentReductionApplied
    === false,
  "Civil single expert has no reduction"
);


/*
 * جمع تعداد کارشناسان:
 *
 * برق      2
 * مکانیک   1
 * عمران    1
 *
 * جمع = 4
 */

assert(
  mixed.totalExpertCount === 4,
  "Mixed panel total expert count is four"
);


/*
 * جمع دستمزد کل باید برابر مجموع
 * دستمزد گروه‌های رشته‌ای باشد.
 */

const calculatedMixedTotal =
  mixed.fields.reduce(
    (sum, field) =>
      sum +
      field.totalFieldFeeToman,
    0
  );


near(
  mixed.totalPanelFeeToman,
  calculatedMixedTotal,
  1,
  "Total panel fee equals sum of field fees"
);


/*
 * ==========================================
 * TEST 3
 * کنترل عدم تطابق سهم رشته‌ها
 *
 * کل = 800 میلیارد
 * سهم‌ها = 700 میلیارد
 *
 * Engine باید خطا بدهد.
 * ==========================================
 */

let invalidAllocationDetected =
  false;


try {

  calculateArticle11MultiField({

    totalEvaluationValueToman:
      800_000_000_000,

    fields: [

      {
        fieldName:
          "برق",

        evaluationShareToman:
          400_000_000_000,

        expertCount:
          1
      },

      {
        fieldName:
          "مکانیک",

        evaluationShareToman:
          300_000_000_000,

        expertCount:
          1
      }
    ]
  });

} catch {

  invalidAllocationDetected =
    true;
}


assert(
  invalidAllocationDetected,
  "Invalid allocation total rejected"
);


/*
 * ==========================================
 * TEST 4
 * سهم بیشتر از مبلغ کل
 * ==========================================
 */

let overAllocationDetected =
  false;


try {

  calculateArticle11MultiField({

    totalEvaluationValueToman:
      800_000_000_000,

    fields: [

      {
        fieldName:
          "برق",

        evaluationShareToman:
          500_000_000_000,

        expertCount:
          1
      },

      {
        fieldName:
          "مکانیک",

        evaluationShareToman:
          400_000_000_000,

        expertCount:
          1
      }
    ]
  });

} catch {

  overAllocationDetected =
    true;
}


assert(
  overAllocationDetected,
  "Over-allocation rejected"
);


/*
 * ==========================================
 * TEST 5
 * نام رشته تکراری
 * ==========================================
 */

let duplicateFieldDetected =
  false;


try {

  calculateArticle11MultiField({

    totalEvaluationValueToman:
      600_000_000_000,

    fields: [

      {
        fieldName:
          "برق",

        evaluationShareToman:
          300_000_000_000,

        expertCount:
          1
      },

      {
        fieldName:
          "برق",

        evaluationShareToman:
          300_000_000_000,

        expertCount:
          1
      }
    ]
  });

} catch {

  duplicateFieldDetected =
    true;
}


assert(
  duplicateFieldDetected,
  "Duplicate field names rejected"
);


/*
 * ==========================================
 * TEST 6
 * تعداد کارشناس نامعتبر
 * ==========================================
 */

let invalidExpertCountDetected =
  false;


try {

  calculateArticle11MultiField({

    totalEvaluationValueToman:
      600_000_000_000,

    fields: [

      {
        fieldName:
          "برق",

        evaluationShareToman:
          300_000_000_000,

        expertCount:
          0
      },

      {
        fieldName:
          "مکانیک",

        evaluationShareToman:
          300_000_000_000,

        expertCount:
          1
      }
    ]
  });

} catch {

  invalidExpertCountDetected =
    true;
}


assert(
  invalidExpertCountDetected,
  "Invalid expert count rejected"
);


/*
 * ==========================================
 * TEST 7
 * تبصره یک در یک رشته از هیأت چندرشته‌ای
 *
 * کل = 7 همت
 *
 * برق = 6 همت
 * مکانیک = 1 همت
 *
 * فقط سهم برق مشمول تبصره یک است.
 * ==========================================
 */

const note1Mixed =
  calculateArticle11MultiField({

    totalEvaluationValueToman:
      7_000_000_000_000,

    fields: [

      {
        fieldName:
          "برق",

        evaluationShareToman:
          6_000_000_000_000,

        expertCount:
          2
      },

      {
        fieldName:
          "مکانیک",

        evaluationShareToman:
          1_000_000_000_000,

        expertCount:
          1
      }
    ]
  });


const note1Electrical =
  note1Mixed.fields.find(
    field =>
      field.fieldName === "برق"
  );


const standardMechanical =
  note1Mixed.fields.find(
    field =>
      field.fieldName === "مکانیک"
  );


assert(
  note1Electrical?.mode ===
    "NOTE_1",
  "Field share above 5 HEMMAT uses Note 1"
);


assert(
  standardMechanical?.mode ===
    "STANDARD",
  "Field share below 5 HEMMAT uses standard calculation"
);


/*
 * طبق Rule تثبیت‌شده:
 * در تبصره یک، کسر 30 درصد
 * برای دو کارشناس برق اعمال نمی‌شود.
 */

assert(
  note1Electrical
    ?.thirtyPercentReductionApplied
    === false,
  "Note 1 field does not receive 30 percent reduction"
);


/*
 * ==========================================
 * TEST 8
 * افزایش 50 درصدی تبصره یک
 * فقط برای همان رشته
 * ==========================================
 */

const note1With50 =
  calculateArticle11MultiField({

    totalEvaluationValueToman:
      7_000_000_000_000,

    fields: [

      {
        fieldName:
          "برق",

        evaluationShareToman:
          6_000_000_000_000,

        expertCount:
          1,

        applyFiftyPercentIncrease:
          true
      },

      {
        fieldName:
          "مکانیک",

        evaluationShareToman:
          1_000_000_000_000,

        expertCount:
          1
      }
    ]
  });


const electricalWith50 =
  note1With50.fields.find(
    field =>
      field.fieldName === "برق"
  );


assert(
  electricalWith50
    ?.fiftyPercentApplied ===
    true,
  "50 percent increase applied to Note 1 field"
);


assert(
  electricalWith50!
    .feePerExpertToman >=
  electricalWith50!
    .feeBeforeAdjustmentToman,
  "Note 1 fee after 50 percent is not lower than base fee"
);


/*
 * ==========================================
 * TEST 9
 * دقیقاً 5 همت
 *
 * مطابق Rule قبلی:
 * دقیقاً 5 همت هنوز STANDARD است.
 * ==========================================
 */

const exactlyFive =
  calculateArticle11MultiField({

    totalEvaluationValueToman:
      6_000_000_000_000,

    fields: [

      {
        fieldName:
          "برق",

        evaluationShareToman:
          5_000_000_000_000,

        expertCount:
          1
      },

      {
        fieldName:
          "مکانیک",

        evaluationShareToman:
          1_000_000_000_000,

        expertCount:
          1
      }
    ]
  });


const exactlyFiveElectrical =
  exactlyFive.fields.find(
    field =>
      field.fieldName === "برق"
  );


assert(
  exactlyFiveElectrical?.mode ===
    "STANDARD",
  "Exactly 5 HEMMAT field share remains standard"
);


console.log(
  "Article 11 Multi-Field Engine tests completed."
);