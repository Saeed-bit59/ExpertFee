import {
  calculateArticle11
} from "./Article11Calculator";

import {
  calculateArticle11Note1,
  isArticle11Note1Applicable
} from "./Article11Note1Calculator";

import {
  applyArticle11PanelRules
} from "./Article11PanelRules";


const RIAL_PER_TOMAN = 10;


/*
 * اطلاعات هر رشته در هیأت چندرشته‌ای
 */
export interface MultiFieldGroupInput {

  /*
   * عنوان رشته
   * مثال: برق، مکانیک، عمران
   */
  fieldName: string;

  /*
   * سهم این رشته از مبلغ کل ارزیابی
   */
  evaluationShareToman: number;

  /*
   * تعداد کارشناسان همین رشته
   */
  expertCount: number;

  /*
   * افزایش 50 درصدی تبصره یک
   * فقط در صورت مشمول بودن سهم رشته
   */
  applyFiftyPercentIncrease?: boolean;
}


/*
 * ورودی موتور هیأت چندرشته‌ای
 */
export interface Article11MultiFieldInput {

  /*
   * مبلغ کل ارزیابی
   */
  totalEvaluationValueToman: number;

  /*
   * گروه‌های کارشناسی
   */
  fields: MultiFieldGroupInput[];

  /*
   * تبصره یک فقط باید از مسیر مستقل خودش فعال شود.
   */
  useArticle11Note1?: boolean;
}


/*
 * نتیجه محاسبه هر رشته
 */
export interface MultiFieldGroupResult {

  fieldName: string;

  evaluationShareToman: number;

  expertCount: number;

  mode:
    | "STANDARD"
    | "NOTE_1";

  /*
   * دستمزد خام هر کارشناس
   */
  feeBeforeAdjustmentToman: number;

  /*
   * مبلغ کسر 30 درصد
   */
  reductionPerExpertToman: number;

  /*
   * دستمزد پس از تعدیل و قبل از سقف
   */
  feeAfterAdjustmentToman: number;

  /*
   * دستمزد نهایی هر کارشناس این رشته
   */
  feePerExpertToman: number;

  /*
   * جمع دستمزد کارشناسان این رشته
   */
  totalFieldFeeToman: number;

  thirtyPercentReductionApplied:
    boolean;

  fiftyPercentApplied:
    boolean;

  capped:
    boolean;

  warning:
    string | null;

  calculationLabel:
    string;

  note:
    string;
}


/*
 * خروجی نهایی موتور
 */
export interface Article11MultiFieldResult {

  totalEvaluationValueToman:
    number;

  totalAllocatedValueToman:
    number;

  allocationDifferenceToman:
    number;

  allocationIsValid:
    boolean;

  totalExpertCount:
    number;

  fields:
    MultiFieldGroupResult[];

  totalPanelFeeToman:
    number;

  calculationLabel:
    string;
}


/*
 * کنترل اولیه اطلاعات هر رشته
 */
function validateField(
  field: MultiFieldGroupInput,
  index: number
): void {

  if (
    !field.fieldName ||
    !field.fieldName.trim()
  ) {

    throw new Error(
      `Field name is required at index ${index}.`
    );
  }


  if (
    !Number.isFinite(
      field.evaluationShareToman
    ) ||
    field.evaluationShareToman < 0
  ) {

    throw new Error(
      `Invalid evaluation share for field ${field.fieldName}.`
    );
  }


  if (
    !Number.isInteger(
      field.expertCount
    ) ||
    field.expertCount < 1
  ) {

    throw new Error(
      `Invalid expert count for field ${field.fieldName}.`
    );
  }
}


/*
 * محاسبه یک رشته
 */
function calculateFieldGroup(
  field: MultiFieldGroupInput,
  useArticle11Note1: boolean
): MultiFieldGroupResult {

  const {
    fieldName,
    evaluationShareToman,
    expertCount
  } = field;


  /*
   * =====================================
   * تبصره یک
   * =====================================
   *
   * معیار بررسی تبصره یک در هیأت
   * چندرشته‌ای، سهم ارزیابی همان رشته است.
   */

  if (
    useArticle11Note1 &&
    isArticle11Note1Applicable(
      evaluationShareToman
    )
  ) {

    const note1 =
      calculateArticle11Note1({

        evaluationValueToman:
          evaluationShareToman,

        applyFiftyPercentIncrease:
          field
            .applyFiftyPercentIncrease ??
          false,

        expertCount
      });


    return {

      fieldName,

      evaluationShareToman,

      expertCount,

      mode:
        "NOTE_1",

      feeBeforeAdjustmentToman:
        note1.feeBeforeFiftyPercent,

      reductionPerExpertToman:
        0,

      feeAfterAdjustmentToman:
        note1.rawFeeAfterFiftyPercent,

      feePerExpertToman:
        note1.feePerExpert,

      totalFieldFeeToman:
        note1.totalPanelFee,

      /*
       * طبق Rule تثبیت‌شده پروژه،
       * در تبصره یک کسر 30 درصد
       * اعمال نمی‌شود.
       */
      thirtyPercentReductionApplied:
        false,

      fiftyPercentApplied:
        note1.fiftyPercentApplied,

      capped:
        note1.cappedBeforeIncrease ||
        note1.cappedAfterIncrease,

      warning:
        note1.warning,

      calculationLabel:
        note1.calculationLabel,

      note:
        "سهم این رشته مشمول تبصره یک ماده ۱۱ است و کسر ۳۰ درصد هیأت هم‌رشته در این مسیر اعمال نمی‌شود."
    };
  }


  /*
   * =====================================
   * مسیر عادی ماده 11
   * =====================================
   */

  const evaluationShareRial =
    evaluationShareToman *
    RIAL_PER_TOMAN;


  const standard =
    calculateArticle11(
      evaluationShareRial
    );


  /*
   * برای اجرای صحیح ماده ۵۶
   * باید دستمزد خام قبل از سقف
   * استفاده شود.
   */
  const rawFeePerExpertToman =
    standard.baseFee /
    RIAL_PER_TOMAN;


  const maximumFeeToman =
    standard.maximumFee /
    RIAL_PER_TOMAN;


  /*
   * اگر فقط یک کارشناس در این رشته باشد:
   * SINGLE_EXPERT
   *
   * اگر بیش از یک کارشناس از همین رشته باشد:
   * SAME_FIELD
   */
  const fieldMode =
    expertCount > 1
      ? "SAME_FIELD"
      : "SINGLE_EXPERT";


  const panel =
    applyArticle11PanelRules({

      baseFeePerExpertToman:
        rawFeePerExpertToman,

      maximumFeeToman,

      expertCount,

      fieldMode,

      isNote1:
        false
    });


  return {

    fieldName,

    evaluationShareToman,

    expertCount,

    mode:
      "STANDARD",

    feeBeforeAdjustmentToman:
      rawFeePerExpertToman,

    reductionPerExpertToman:
      panel.reductionPerExpertToman,

    feeAfterAdjustmentToman:
      panel
        .feeAfterReductionBeforeCapToman,

    feePerExpertToman:
      panel.feePerExpertToman,

    totalFieldFeeToman:
      panel.totalPanelFeeToman,

    thirtyPercentReductionApplied:
      panel
        .thirtyPercentReductionApplied,

    fiftyPercentApplied:
      false,

    capped:
      panel.cappedAfterReduction,

    warning:
      null,

    calculationLabel:
      panel
        .thirtyPercentReductionApplied

        ? "محاسبه دستمزد براساس سهم رشته با اعمال ماده ۵۶"

        : "محاسبه دستمزد براساس سهم رشته طبق ماده ۱۱",

    note:
      panel.note
  };
}


/*
 * ==========================================
 * موتور اصلی هیأت کارشناسی چندرشته‌ای
 * ==========================================
 */

export function calculateArticle11MultiField(
  input: Article11MultiFieldInput
): Article11MultiFieldResult {

  const {
    totalEvaluationValueToman,
    fields,
    useArticle11Note1 = false
  } = input;


  /*
   * کنترل مبلغ کل
   */

  if (
    !Number.isFinite(
      totalEvaluationValueToman
    ) ||
    totalEvaluationValueToman <= 0
  ) {

    throw new Error(
      "Total evaluation value must be a positive number."
    );
  }


  /*
   * هیأت چندرشته‌ای باید حداقل
   * دو گروه رشته داشته باشد.
   */

  if (
    !Array.isArray(fields) ||
    fields.length < 2
  ) {

    throw new Error(
      "A multi-field panel must contain at least two fields."
    );
  }


  /*
   * اعتبارسنجی رشته‌ها
   */

  fields.forEach(
    (field, index) =>
      validateField(
        field,
        index
      )
  );


  /*
   * جلوگیری از عنوان رشته تکراری
   */

  const normalizedNames =
    fields.map(
      field =>
        field.fieldName
          .trim()
          .toLocaleLowerCase()
    );


  const uniqueNames =
    new Set(
      normalizedNames
    );


  if (
    uniqueNames.size !==
    normalizedNames.length
  ) {

    throw new Error(
      "Duplicate field names are not allowed."
    );
  }


  /*
   * مجموع سهم رشته‌ها
   */

  const totalAllocatedValueToman =
    fields.reduce(
      (sum, field) =>
        sum +
        field.evaluationShareToman,
      0
    );


  const allocationDifferenceToman =
    totalEvaluationValueToman -
    totalAllocatedValueToman;


  /*
   * چون ورودی‌ها تومان هستند
   * فعلاً تطابق باید دقیق باشد.
   */

  const allocationIsValid =
    allocationDifferenceToman === 0;


  /*
   * اگر جمع سهم‌ها با مبلغ کل
   * برابر نباشد محاسبه متوقف می‌شود.
   */

  if (!allocationIsValid) {

    throw new Error(
      `The sum of field evaluation shares must equal the total evaluation value. Difference: ${allocationDifferenceToman} Toman.`
    );
  }


  /*
   * محاسبه مستقل هر رشته
   */

  const results =
    fields.map(
      field =>
        calculateFieldGroup(
          field,
          useArticle11Note1
        )
    );


  /*
   * تعداد کل کارشناسان
   */

  const totalExpertCount =
    results.reduce(
      (sum, field) =>
        sum +
        field.expertCount,
      0
    );


  /*
   * جمع کل دستمزد هیأت
   */

  const totalPanelFeeToman =
    results.reduce(
      (sum, field) =>
        sum +
        field.totalFieldFeeToman,
      0
    );


  return {

    totalEvaluationValueToman,

    totalAllocatedValueToman,

    allocationDifferenceToman,

    allocationIsValid,

    totalExpertCount,

    fields:
      results,

    totalPanelFeeToman,

    calculationLabel:
      "محاسبه دستمزد هیأت کارشناسی با رشته‌های مختلف براساس سهم هر رشته و ماده ۱۱"
  };
}
