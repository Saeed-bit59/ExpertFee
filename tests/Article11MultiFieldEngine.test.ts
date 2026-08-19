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
 * TEST 7: هر سهم دقیقاً ۵ همت یا بیشتر باید به تصمیم شورا ارجاع شود.
 */
for (const evaluationShareToman of [
  5_000_000_000_000,
  6_000_000_000_000,
]) {
  let referralRequired = false;
  try {
    calculateArticle11MultiField({
      totalEvaluationValueToman:
        evaluationShareToman + 1_000_000_000_000,
      fields: [
        {
          fieldName: "برق",
          evaluationShareToman,
          expertCount: 2,
        },
        {
          fieldName: "مکانیک",
          evaluationShareToman: 1_000_000_000_000,
          expertCount: 1,
        },
      ],
    });
  } catch (error) {
    referralRequired =
      error instanceof Error &&
      error.message.includes("مبلغ قطعی محاسبه نمی‌کند");
  }
  assert(
    referralRequired,
    `Field share ${evaluationShareToman} requires council decision`,
  );
}

console.log(
  "Article 11 Multi-Field Engine tests completed."
);
