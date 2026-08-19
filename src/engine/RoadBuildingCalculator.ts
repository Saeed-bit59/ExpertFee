import {
  calculateCommonFee
} from "./CommonFeeEngine";

import type {
  CommonFeeResult
} from "./CommonFeeEngine";

import {
  ARTICLE_34,
  ARTICLE_35,
  ARTICLE_36,
  ARTICLE_37,
  ARTICLE_38
} from "./RoadBuildingRules";

import {
  ARTICLE_11_GENERAL_MAXIMUM_TOMAN
} from "../config/Tariff1405";

import type {
  Article36ServiceType
} from "./RoadBuildingRules";

import type {
  MissionType
} from "./MissionCalculator";


/*
 * ========================================
 * ExpertFee
 * Group 6 - Articles 33 to 38
 * RoadBuildingCalculator
 * ========================================
 *
 * واحد مبالغ: تومان
 * واحد مساحت: مترمربع
 */


/*
 * ========================================
 * انواع خدمات
 * ========================================
 */

export type RoadBuildingArticle =
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38;


/*
 * ========================================
 * خروجی استاندارد
 * ========================================
 */

export interface RoadBuildingCalculationResult {
  article: RoadBuildingArticle;
  title: string;

  /*
   * دستمزد قبل از مأموریت
   */
  expertFeeToman: number;

  /*
   * مأموریت
   */
  missionType: MissionType;
  missionDays: number;
  missionFeeToman: number;

  /*
   * مبلغ نهایی
   */
  totalPayableToman: number;

  /*
   * جزئیات مشترک، در مواردی که
   * CommonFeeEngine استفاده شده است.
   */
  commonFeeResult:
    CommonFeeResult | null;
}


/*
 * ========================================
 * ورودی مشترک مأموریت
 * ========================================
 */

export interface MissionOptions {
  missionType?: MissionType;
  missionDays?: number;
}


/*
 * ========================================
 * اعتبارسنجی
 * ========================================
 */

function assertPositiveFinite(
  value: number,
  fieldName: string
): void {

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new Error(
      `${fieldName} must be a positive number.`
    );
  }
}


function assertNonNegativeInteger(
  value: number,
  fieldName: string
): void {

  if (
    !Number.isFinite(value) ||
    value < 0 ||
    !Number.isInteger(value)
  ) {
    throw new Error(
      `${fieldName} must be a non-negative integer.`
    );
  }
}


/*
 * ========================================
 * مأموریت برای Calculatorهای اختصاصی
 * ========================================
 *
 * برای یکسان ماندن رفتار کل پروژه،
 * حتی Calculatorهای مساحتی نیز از
 * CommonFeeEngine در حالت FIXED استفاده می‌کنند.
 */

function finalizeFixedFee(
  article: RoadBuildingArticle,
  title: string,
  expertFeeToman: number,
  mission?: MissionOptions
): RoadBuildingCalculationResult {

  const common =
    calculateCommonFee({
      baseMode: "FIXED",
      fixedFeeToman:
        expertFeeToman,
      missionType:
        mission?.missionType,
      missionDays:
        mission?.missionDays
    });

  return {
    article,
    title,

    expertFeeToman:
      common.finalExpertFeeToman,

    missionType:
      common.missionType,

    missionDays:
      common.missionDays,

    missionFeeToman:
      common.missionFeeToman,

    totalPayableToman:
      common.totalPayableToman,

    commonFeeResult:
      common
  };
}


/*
 * ========================================
 * ماده 33
 * ارزیابی
 * ========================================
 */

export interface Article33Input
  extends MissionOptions {

  evaluationValueToman: number;
}


export function calculateArticle33(
  input: Article33Input
): RoadBuildingCalculationResult {

  assertPositiveFinite(
    input.evaluationValueToman,
    "evaluationValueToman"
  );

  const common =
    calculateCommonFee({
      baseMode:
        "ARTICLE_11",

      evaluationValueToman:
        input.evaluationValueToman,

      missionType:
        input.missionType,

      missionDays:
        input.missionDays
    });

  return {
    article: 33,

    title:
      "ارزیابی راه، ساختمان و املاک",

    expertFeeToman:
      common.finalExpertFeeToman,

    missionType:
      common.missionType,

    missionDays:
      common.missionDays,

    missionFeeToman:
      common.missionFeeToman,

    totalPayableToman:
      common.totalPayableToman,

    commonFeeResult:
      common
  };
}


/*
 * ========================================
 * ماده 34
 * تطبیق نقشه معماری یا سازه
 * ========================================
 */

export interface Article34Input
  extends MissionOptions {

  areaSquareMeters: number;
}


export function calculateArticle34(
  input: Article34Input
): RoadBuildingCalculationResult {

  assertPositiveFinite(
    input.areaSquareMeters,
    "areaSquareMeters"
  );

  const rawFee =
    input.areaSquareMeters *
    ARTICLE_34
      .ratePerSquareMeterToman;

  const expertFee =
    Math.min(
      ARTICLE_34.maximumFeeToman,
      Math.max(
        ARTICLE_34.minimumFeeToman,
        Math.round(rawFee)
      )
    );

  return finalizeFixedFee(
    34,
    "تطبیق نقشه معماری یا سازه با وضعیت محل",
    expertFee,
    input
  );
}


/*
 * ========================================
 * ماده 35
 * تطبیق مشخصات قراردادی ساختمان
 * ========================================
 */

export interface Article35Input
  extends MissionOptions {

  areaSquareMeters: number;
}


export function calculateArticle35(
  input: Article35Input
): RoadBuildingCalculationResult {

  assertPositiveFinite(
    input.areaSquareMeters,
    "areaSquareMeters"
  );

  const rawFee =
    input.areaSquareMeters *
    ARTICLE_35
      .ratePerSquareMeterToman;

  const expertFee =
    Math.min(
      ARTICLE_35.maximumFeeToman,
      Math.max(
        ARTICLE_35.minimumFeeToman,
        Math.round(rawFee)
      )
    );

  return finalizeFixedFee(
    35,
    "تطبیق مشخصات قراردادی ساختمان با وضعیت محل",
    expertFee,
    input
  );
}


/*
 * ========================================
 * ماده 36
 * نقشه معماری / سازه / استحکام بنا
 * ========================================
 */

export interface Article36Input
  extends MissionOptions {

  serviceType:
    Article36ServiceType;

  areaSquareMeters: number;
}


function getArticle36Rule(
  serviceType:
    Article36ServiceType
) {

  switch (serviceType) {

    case "ARCHITECTURE":
      return {
        title:
          "تهیه نقشه معماری",
        rule:
          ARTICLE_36.architecture
      };

    case "STRUCTURE":
      return {
        title:
          "تهیه نقشه سازه",
        rule:
          ARTICLE_36.structure
      };

    case "STRUCTURAL_SAFETY_REPORT":
      return {
        title:
          "گزارش استحکام بنا",
        rule:
          ARTICLE_36
            .structuralSafetyReport
      };

    case "OTHER_DISCIPLINE_STRUCTURAL_SAFETY_REPORT":
      return {
        title:
          "گزارش استحکام بنا برای سایر رشته‌ها",
        rule: {
          ratePerSquareMeterToman:
            ARTICLE_36.structuralSafetyReport.ratePerSquareMeterToman *
            ARTICLE_36.otherDisciplineStructuralSafetyReportPercent /
            100,
          minimumFeeToman:
            ARTICLE_36.structuralSafetyReport.minimumFeeToman *
            ARTICLE_36.otherDisciplineStructuralSafetyReportPercent /
            100,
          maximumFeeToman:
            ARTICLE_36.structuralSafetyReport.maximumFeeToman *
            ARTICLE_36.otherDisciplineStructuralSafetyReportPercent /
            100
        }
      };

    default: {
      const exhaustiveCheck:
        never = serviceType;

      return exhaustiveCheck;
    }
  }
}


export function calculateArticle36(
  input: Article36Input
): RoadBuildingCalculationResult {

  assertPositiveFinite(
    input.areaSquareMeters,
    "areaSquareMeters"
  );

  const selected =
    getArticle36Rule(
      input.serviceType
    );

  const rawFee =
    input.areaSquareMeters *
    selected.rule
      .ratePerSquareMeterToman;

  const expertFee =
    Math.min(
      selected.rule
        .maximumFeeToman,

      Math.max(
        selected.rule
          .minimumFeeToman,

        Math.round(
          rawFee
        )
      )
    );

  return finalizeFixedFee(
    36,
    selected.title,
    expertFee,
    input
  );
}


/*
 * ========================================
 * ماده 37
 * افراز و قطعه‌بندی
 * ========================================
 *
 * بند اصلی:
 * ماده 11 + 20 درصد
 *
 * نکته:
 * تعرفه نقشه‌برداری احتمالی بند 2 ماده 37
 * در این تابع اضافه نمی‌شود و باید در مرحله
 * SurveyCalculator به صورت خدمت مستقل محاسبه شود.
 *
 * تبصره طبقات/بلوک‌های مشابه نیز به دلیل نیاز
 * به تعداد و ساختار پرونده، جداگانه محاسبه می‌شود.
 */

export interface Article37Input
  extends MissionOptions {

  evaluationValueToman: number;

  /*
   * تعداد طبقات یا بلوک‌های مشابه مازاد
   * پس از مورد اول.
   *
   * برای هر مورد مشابه، 20 درصد دستمزد
   * اصلی افراز اضافه می‌شود.
   */
  similarAdditionalUnits?: number;
}


export function calculateArticle37(
  input: Article37Input
): RoadBuildingCalculationResult {

  assertPositiveFinite(
    input.evaluationValueToman,
    "evaluationValueToman"
  );

  const similarAdditionalUnits =
    input.similarAdditionalUnits ??
    0;

  assertNonNegativeInteger(
    similarAdditionalUnits,
    "similarAdditionalUnits"
  );


  /*
   * ابتدا ماده 11 + 20 درصد
   * با سقف عمومی ماده 11.
   *
   * مأموریت در این مرحله اعمال نمی‌شود
   * تا قاعده واحدهای مشابه روی خود دستمزد
   * کارشناسی اعمال گردد.
   */

  const primary =
    calculateCommonFee({
      baseMode:
        "ARTICLE_11",

      evaluationValueToman:
        input.evaluationValueToman,

      increasePercent:
        ARTICLE_37
          .increasePercent
    });


  /*
   * تبصره ماده 37:
   * برای موارد مشابه بعد از مورد اول،
   * 20 درصد دستمزد مربوط.
   *
   * این مبلغ به دستمزد اصلی اضافه می‌شود.
   *
   * چون Rule ثبت‌شده برای ماده 37 مقرر کرده
   * سقف نهایی دستمزد ماده 11 رعایت شود،
   * نتیجه نهایی از سقف عمومی عبور نمی‌کند.
   */

  const similarUnitsFee =
    Math.round(
      primary.finalExpertFeeToman *
      (
        ARTICLE_37
          .similarAdditionalUnitPercent /
        100
      ) *
      similarAdditionalUnits
    );


  const combinedBeforeCap =
    primary.finalExpertFeeToman +
    similarUnitsFee;


  const finalWithMission =
    calculateCommonFee({
      baseMode:
        "FIXED",

      fixedFeeToman:
        combinedBeforeCap,

      maximumFeeToman:
        ARTICLE_11_GENERAL_MAXIMUM_TOMAN,

      missionType:
        input.missionType,

      missionDays:
        input.missionDays
    });


  return {
    article: 37,

    title:
      "افراز و قطعه‌بندی",

    expertFeeToman:
      finalWithMission
        .finalExpertFeeToman,

    missionType:
      finalWithMission
        .missionType,

    missionDays:
      finalWithMission
        .missionDays,

    missionFeeToman:
      finalWithMission
        .missionFeeToman,

    totalPayableToman:
      finalWithMission
        .totalPayableToman,

    commonFeeResult:
      finalWithMission
  };
}


/*
 * ========================================
 * ماده 38
 * تشخیص زمین مسبوق به احیا
 * ========================================
 *
 * قاعده مورد تأیید پروژه:
 *
 * تا 1000 مترمربع:
 * 2,000,000 تومان
 *
 * هر بلوک 1000 مترمربع مازاد یا کسری از آن:
 * +300,000 تومان
 *
 * مثال:
 *
 * 1000  => 2,000,000
 * 1001  => 2,300,000
 * 1500  => 2,300,000
 * 2000  => 2,300,000
 * 2001  => 2,600,000
 */

export interface Article38Input
  extends MissionOptions {

  areaSquareMeters: number;
}


export function calculateArticle38(
  input: Article38Input
): RoadBuildingCalculationResult {

  assertPositiveFinite(
    input.areaSquareMeters,
    "areaSquareMeters"
  );


  let expertFee =
    ARTICLE_38.baseFeeToman;


  if (
    input.areaSquareMeters >
    ARTICLE_38.baseAreaSquareMeters
  ) {

    const excessArea =
      input.areaSquareMeters -
      ARTICLE_38
        .baseAreaSquareMeters;


    const additionalBlocks =
      Math.ceil(
        excessArea /
        ARTICLE_38
          .additionalAreaBlockSquareMeters
      );


    expertFee +=
      additionalBlocks *
      ARTICLE_38
        .additionalBlockFeeToman;
  }


  return finalizeFixedFee(
    38,
    "تشخیص زمین مسبوق به احیا",
    expertFee,
    input
  );
}
