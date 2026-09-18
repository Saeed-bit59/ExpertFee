export type PanelFieldMode =
  | "SINGLE_EXPERT"
  | "SAME_FIELD"
  | "DIFFERENT_FIELDS";


export interface Article11PanelRuleInput {

  /*
   * دستمزد خام هر کارشناس
   * قبل از اعمال سقف تعرفه
   */
  baseFeePerExpertToman: number;

  /*
   * سقف تعرفه ماده 11
   */
  maximumFeeToman: number;

  /*
   * تعداد کارشناسان
   */
  expertCount: number;

  /*
   * وضعیت رشته اعضای هیأت
   */
  fieldMode: PanelFieldMode;

  /*
   * آیا پرونده مشمول تبصره یک است؟
   */
  isNote1: boolean;
}


export interface Article11PanelRuleResult {

  /*
   * دستمزد خام قبل از تبصره 6
   */
  baseFeePerExpertToman: number;

  /*
   * مبلغ پس از کسر 30 درصد
   * و قبل از اعمال سقف
   */
  feeAfterReductionBeforeCapToman: number;

  /*
   * دستمزد نهایی هر کارشناس
   */
  feePerExpertToman: number;

  expertCount: number;

  totalPanelFeeToman: number;

  fieldMode: PanelFieldMode;

  thirtyPercentReductionApplied:
    boolean;

  reductionRate: number;

  reductionPerExpertToman: number;

  /*
   * آیا سقف پس از اعمال
   * تبصره 6 فعال شده است؟
   */
  cappedAfterReduction: boolean;

  maximumFeeToman: number;

  note: string;
}


const SAME_FIELD_REDUCTION_RATE =
  0.30;


export function applyArticle11PanelRules(
  input: Article11PanelRuleInput
): Article11PanelRuleResult {

  const {
    baseFeePerExpertToman,
    maximumFeeToman,
    expertCount,
    fieldMode,
    isNote1
  } = input;


  if (
    !Number.isFinite(
      baseFeePerExpertToman
    ) ||
    baseFeePerExpertToman < 0
  ) {

    throw new Error(
      "Base fee must be a non-negative number."
    );
  }


  if (
    !Number.isFinite(
      maximumFeeToman
    ) ||
    maximumFeeToman < 0
  ) {

    throw new Error(
      "Maximum fee must be a non-negative number."
    );
  }


  if (
    !Number.isInteger(expertCount) ||
    expertCount < 1
  ) {

    throw new Error(
      "Expert count must be a positive integer."
    );
  }


  /*
   * ========================================
   * یک کارشناس
   * ========================================
   *
   * ابتدا سقف عادی ماده 11 اعمال می‌شود.
   */

  if (
    expertCount === 1 ||
    fieldMode === "SINGLE_EXPERT"
  ) {

    const capped =
      baseFeePerExpertToman >
      maximumFeeToman;

    const finalFee =
      Math.min(
        baseFeePerExpertToman,
        maximumFeeToman
      );

    return {

      baseFeePerExpertToman,

      feeAfterReductionBeforeCapToman:
        baseFeePerExpertToman,

      feePerExpertToman:
        finalFee,

      expertCount,

      totalPanelFeeToman:
        finalFee * expertCount,

      fieldMode:
        "SINGLE_EXPERT",

      thirtyPercentReductionApplied:
        false,

      reductionRate:
        0,

      reductionPerExpertToman:
        0,

      cappedAfterReduction:
        capped,

      maximumFeeToman,

      note:
        "کارشناسی توسط یک کارشناس انجام شده و کسر ۳۰ درصد ماده ۵۶ اعمال نمی‌شود."
    };
  }


  /*
   * ========================================
   * تبصره یک ماده 11
   * ========================================
   *
   * طبق Rule تثبیت‌شده پروژه،
   * کاهش 30 درصد هیأت هم‌رشته
   * در این مسیر اعمال نمی‌شود.
   *
   * سقف تبصره یک در Calculator
   * مخصوص همان تبصره کنترل می‌شود.
   */

  if (isNote1) {

    return {

      baseFeePerExpertToman,

      feeAfterReductionBeforeCapToman:
        baseFeePerExpertToman,

      feePerExpertToman:
        baseFeePerExpertToman,

      expertCount,

      totalPanelFeeToman:
        baseFeePerExpertToman *
        expertCount,

      fieldMode,

      thirtyPercentReductionApplied:
        false,

      reductionRate:
        0,

      reductionPerExpertToman:
        0,

      cappedAfterReduction:
        false,

      maximumFeeToman,

      note:
        "در محاسبات ویژه تبصره یک ماده ۱۱، کسر ۳۰ درصد هیأت هم‌رشته اعمال نمی‌شود."
    };
  }


  /*
   * ========================================
   * هیأت کارشناسان هم‌رشته
   * ماده ۵۶ تعرفه ۱۴۰۵
   * ========================================
   *
   * ترتیب محاسبه:
   *
   * 1- محاسبه دستمزد خام
   * 2- کسر 30 درصد
   * 3- کنترل سقف تعرفه
   */

  if (
    fieldMode === "SAME_FIELD"
  ) {

    const reductionPerExpertToman =
      baseFeePerExpertToman *
      SAME_FIELD_REDUCTION_RATE;


    const feeAfterReductionBeforeCapToman =
      baseFeePerExpertToman -
      reductionPerExpertToman;


    /*
     * نکته اصلی تبصره 6:
     *
     * سقف بعد از کسر 30 درصد
     * کنترل می‌شود.
     */

    const cappedAfterReduction =
      feeAfterReductionBeforeCapToman >
      maximumFeeToman;


    const feePerExpertToman =
      Math.min(
        feeAfterReductionBeforeCapToman,
        maximumFeeToman
      );


    return {

      baseFeePerExpertToman,

      feeAfterReductionBeforeCapToman,

      feePerExpertToman,

      expertCount,

      totalPanelFeeToman:
        feePerExpertToman *
        expertCount,

      fieldMode,

      thirtyPercentReductionApplied:
        true,

      reductionRate:
        SAME_FIELD_REDUCTION_RATE,

      reductionPerExpertToman,

      cappedAfterReduction,

      maximumFeeToman,

      note:
        "مطابق ماده ۵۶ تعرفه ۱۴۰۵، ۳۰ درصد از دستمزد خام هر کارشناس هم‌رشته کسر و سپس سقف تعرفه کنترل شده است."
    };
  }


  /*
   * ========================================
   * هیأت کارشناسان با رشته‌های مختلف
   * ========================================
   *
   * سهم هر رشته باید جداگانه
   * محاسبه شود.
   */

  if (
    fieldMode === "DIFFERENT_FIELDS"
  ) {

    const finalFee =
      Math.min(
        baseFeePerExpertToman,
        maximumFeeToman
      );

    return {

      baseFeePerExpertToman,

      feeAfterReductionBeforeCapToman:
        baseFeePerExpertToman,

      feePerExpertToman:
        finalFee,

      expertCount,

      totalPanelFeeToman:
        finalFee *
        expertCount,

      fieldMode,

      thirtyPercentReductionApplied:
        false,

      reductionRate:
        0,

      reductionPerExpertToman:
        0,

      cappedAfterReduction:
        baseFeePerExpertToman >
        maximumFeeToman,

      maximumFeeToman,

      note:
        "در هیأت کارشناسان با رشته‌های مختلف، دستمزد هر رشته باید بر اساس سهم همان رشته از ارزیابی و طبق تعرفه به صورت جداگانه محاسبه شود."
    };
  }


  throw new Error(
    "Invalid panel field mode."
  );
}
