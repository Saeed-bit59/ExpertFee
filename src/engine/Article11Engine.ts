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

import type {
  PanelFieldMode
} from "./Article11PanelRules";

import {
  applyArticle11IncreaseRule
} from "./Article11IncreaseRules";

import type {
  Article11IncreaseRuleCode
} from "./Article11IncreaseRules";


/*
 * ==========================================
 * ورودی Engine
 * ==========================================
 */

export interface Article11EngineInput {

  /*
   * مبلغ ارزیابی به تومان
   */
  evaluationValueToman: number;

  /*
   * افزایش 50 درصدی مربوط به تبصره 1
   *
   * فقط در مسیر NOTE_1 استفاده می‌شود.
   */
  applyFiftyPercentIncrease?: boolean;

  /*
   * تبصره 1 فقط در مسیر مستقل و با انتخاب صریح کاربر اجرا می‌شود.
   * مسیر عادی ماده 11، حتی بالاتر از 5 همت، سقف عمومی 135 میلیون تومان دارد.
   */
  useArticle11Note1?: boolean;

  /*
   * تعداد کارشناسان
   */
  expertCount?: number;

  /*
   * وضعیت هیأت
   */
  panelFieldMode?: PanelFieldMode;

  /*
   * ضریب افزایشی انتخاب‌شده توسط کاربر
   *
   * تبصره‌های ۳ و ۴ تعرفه ۱۴۰۵
   *
   * فقط یک Rule قابل انتخاب است.
   */
  increaseRuleCode?:
    Article11IncreaseRuleCode | null;
}


/*
 * ==========================================
 * Mode
 * ==========================================
 */

export type Article11CalculationMode =
  | "STANDARD"
  | "NOTE_1";


/*
 * ==========================================
 * خروجی Engine
 * ==========================================
 */

export interface Article11EngineResult {

  mode:
    Article11CalculationMode;

  evaluationValueToman:
    number;

  /*
   * دستمزد قبل از تعدیلات
   */
  feeBeforeAdjustmentToman:
    number;

  /*
   * دستمزد پس از قواعد داخلی
   * قبل از نتیجه نهایی
   */
  feeAfterAdjustmentToman:
    number;

  /*
   * دستمزد نهایی هر کارشناس
   */
  feePerExpertToman:
    number;

  expertCount:
    number;

  /*
   * مجموع دستمزد هیأت
   */
  totalFeeToman:
    number;

  /*
   * تبصره 1
   */
  fiftyPercentApplied:
    boolean;

  /*
   * آیا سقف فعال شده است؟
   */
  capped:
    boolean;

  warning:
    string | null;

  calculationLabel:
    string;

  /*
   * ماده ۵۶
   */
  sameFieldThirtyPercentReductionApplied:
    boolean;

  sameFieldReductionPerExpertToman:
    number;

  panelFieldMode:
    PanelFieldMode;

  panelRuleNote:
    string | null;

  /*
   * ========================================
   * ضرایب افزایشی تبصره‌های ۳ و ۴
   * ========================================
   */

  increaseRuleApplied:
    boolean;

  increaseRuleCode:
    Article11IncreaseRuleCode | null;

  increaseRuleNoteNumber:
    number | null;

  increaseRuleTitle:
    string | null;

  increaseRate:
    number;

  /*
   * برای کنترل داخلی Engine
   *
   * لازم نیست در UI نمایش داده شود.
   */
  increaseAmountToman:
    number;
}


/*
 * ==========================================
 * تبدیل واحد
 * ==========================================
 */

const RIAL_PER_TOMAN =
  10;


/*
 * ==========================================
 * Engine
 * ==========================================
 */

export function calculateArticle11Engine(
  input: Article11EngineInput
): Article11EngineResult {

  const {
    evaluationValueToman
  } = input;


  const expertCount =
    input.expertCount ?? 1;


  /*
   * ========================================
   * اعتبارسنجی مبلغ ارزیابی
   * ========================================
   */

  if (
    !Number.isFinite(
      evaluationValueToman
    ) ||
    evaluationValueToman < 0
  ) {

    throw new Error(
      "Evaluation value must be a non-negative number."
    );
  }


  /*
   * ========================================
   * اعتبارسنجی تعداد کارشناسان
   * ========================================
   */

  if (
    !Number.isInteger(
      expertCount
    ) ||
    expertCount < 1
  ) {

    throw new Error(
      "Expert count must be a positive integer."
    );
  }


  /*
   * ========================================
   * تعیین وضعیت هیأت
   * ========================================
   */

  const panelFieldMode:
    PanelFieldMode =

      expertCount === 1

        ? "SINGLE_EXPERT"

        : (
            input.panelFieldMode ??
            "SAME_FIELD"
          );


  /*
   * ========================================
   * مسیر ویژه تبصره 1 ماده 11
   * ========================================
   *
   * این مسیر فعلاً مستقل نگه داشته می‌شود.
   *
   * ضرایب تبصره‌های ۳ و ۴
   * در این مرحله به NOTE_1 متصل نمی‌شوند.
   */

  if (input.useArticle11Note1 === true) {

    if (!isArticle11Note1Applicable(evaluationValueToman)) {
      throw new Error(
        "تبصره یک ماده ۱۱ فقط برای ارزش‌های بیش از ۵ همت تومان قابل استفاده است."
      );
    }

    const result =
      calculateArticle11Note1({

        evaluationValueToman,

        applyFiftyPercentIncrease:
          input
            .applyFiftyPercentIncrease ??
          false,

        expertCount
      });


    return {

      mode:
        "NOTE_1",

      evaluationValueToman,

      feeBeforeAdjustmentToman:
        result.feeBeforeFiftyPercent,

      feeAfterAdjustmentToman:
        result.rawFeeAfterFiftyPercent,

      feePerExpertToman:
        result.feePerExpert,

      expertCount:
        result.expertCount,

      totalFeeToman:
        result.totalPanelFee,

      fiftyPercentApplied:
        result.fiftyPercentApplied,

      capped:
        result.cappedBeforeIncrease ||
        result.cappedAfterIncrease,

      warning:
        result.warning,

      calculationLabel:
        result.calculationLabel,

      sameFieldThirtyPercentReductionApplied:
        false,

      sameFieldReductionPerExpertToman:
        0,

      panelFieldMode,

      panelRuleNote:
        expertCount > 1

          ? "در محاسبات تبصره یک ماده 11، قواعد این مسیر به صورت مستقل اعمال می‌شود."

          : null,

      /*
       * ضرایب افزایشی عمومی در NOTE_1
       * فعلاً اعمال نمی‌شوند.
       */

      increaseRuleApplied:
        false,

      increaseRuleCode:
        null,

      increaseRuleNoteNumber:
        null,

      increaseRuleTitle:
        null,

      increaseRate:
        0,

      increaseAmountToman:
        0
    };
  }


  /*
   * ========================================
   * مسیر عادی ماده 11
   * ========================================
   */

  const evaluationValueRial =
    evaluationValueToman *
    RIAL_PER_TOMAN;


  const standard =
    calculateArticle11(
      evaluationValueRial
    );


  /*
   * مهم:
   *
   * از baseFee استفاده می‌کنیم،
   * نه finalFee.
   *
   * چون ابتدا باید قواعد مربوط به
   * ماده ۵۶ و ضرایب افزایشی بررسی شوند
   * و سپس سقف نهایی کنترل شود.
   */

  const rawFeePerExpertToman =
    standard.baseFee /
    RIAL_PER_TOMAN;


  const maximumFeeToman =
    standard.maximumFee /
    RIAL_PER_TOMAN;


  /*
   * ========================================
   * ماده ۵۶
   * قواعد هیأت
   * ========================================
   */

  const panel =
    applyArticle11PanelRules({

      baseFeePerExpertToman:
        rawFeePerExpertToman,

      maximumFeeToman,

      expertCount,

      fieldMode:
        panelFieldMode,

      isNote1:
        false
    });


  /*
   * ========================================
   * دستمزد حاصل از قواعد هیأت
   * ========================================
   *
   * این مبلغ مبنای بررسی ضریب افزایشی است.
   */

  const feeBeforeIncrease =
    panel.feePerExpertToman;


  /*
   * ========================================
   * حالت بدون ضریب افزایشی
   * ========================================
   */

  if (
    !input.increaseRuleCode
  ) {

    return {

      mode:
        "STANDARD",

      evaluationValueToman,

      feeBeforeAdjustmentToman:
        rawFeePerExpertToman,

      feeAfterAdjustmentToman:
        panel
          .feeAfterReductionBeforeCapToman,

      feePerExpertToman:
        panel.feePerExpertToman,

      expertCount:
        panel.expertCount,

      totalFeeToman:
        panel.totalPanelFeeToman,

      fiftyPercentApplied:
        false,

      capped:
        panel.cappedAfterReduction,

      warning:
        null,

      calculationLabel:
        panel
          .thirtyPercentReductionApplied

          ? "محاسبه دستمزد براساس ماده ۱۱ با اعمال ماده ۵۶"

          : "محاسبه دستمزد براساس ماده 11",

      sameFieldThirtyPercentReductionApplied:
        panel
          .thirtyPercentReductionApplied,

      sameFieldReductionPerExpertToman:
        panel
          .reductionPerExpertToman,

      panelFieldMode:
        panel.fieldMode,

      panelRuleNote:
        panel.note,

      increaseRuleApplied:
        false,

      increaseRuleCode:
        null,

      increaseRuleNoteNumber:
        null,

      increaseRuleTitle:
        null,

      increaseRate:
        0,

      increaseAmountToman:
        0
    };
  }


  /*
   * ========================================
   * اعمال ضریب افزایشی
   * ========================================
   */

  const increase =
    applyArticle11IncreaseRule({

      baseFeeToman:
        feeBeforeIncrease,

      ruleCode:
        input.increaseRuleCode
    });


  /*
   * ========================================
   * دستمزد نهایی هر کارشناس
   * ========================================
   *
   * Article11IncreaseRules خودش
   * سقف ۱۳۵ میلیون تومان را کنترل می‌کند.
   */

  const finalFeePerExpert =
    increase.finalFeeToman;


  /*
   * ========================================
   * مجموع دستمزد هیأت
   * ========================================
   */

  const finalTotalFee =
    finalFeePerExpert *
    expertCount;


  /*
   * ========================================
   * خروجی نهایی
   * ========================================
   */

  return {

    mode:
      "STANDARD",

    evaluationValueToman,

    feeBeforeAdjustmentToman:
      rawFeePerExpertToman,

    feeAfterAdjustmentToman:
      feeBeforeIncrease,

    feePerExpertToman:
      finalFeePerExpert,

    expertCount,

    totalFeeToman:
      finalTotalFee,

    fiftyPercentApplied:
      false,

    capped:
      panel.cappedAfterReduction ||
      increase.capped,

    warning:
      null,

    calculationLabel:
      `محاسبه دستمزد براساس ماده 11 با اعمال تبصره ${increase.noteNumber}`,

    sameFieldThirtyPercentReductionApplied:
      panel
        .thirtyPercentReductionApplied,

    sameFieldReductionPerExpertToman:
      panel
        .reductionPerExpertToman,

    panelFieldMode:
      panel.fieldMode,

    panelRuleNote:
      panel.note,

    increaseRuleApplied:
      true,

    increaseRuleCode:
      increase.ruleCode,

    increaseRuleNoteNumber:
      increase.noteNumber,

    increaseRuleTitle:
      increase.title,

    increaseRate:
      increase.increaseRate,

    increaseAmountToman:
      increase.increaseAmountToman
  };
}
