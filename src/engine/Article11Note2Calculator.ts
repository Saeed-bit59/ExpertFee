import {
  calculateArticle11
} from "./Article11Calculator";


export type Article11Note2Mode =
  | "COMBINED"
  | "SEPARATE_BY_LOCATION"
  | "SEPARATE_BY_OWNER";


export interface Article11Note2Item {

  /*
   * مبلغ هر موضوع ارزیابی به تومان
   */
  valueToman: number;

  /*
   * شناسه محل
   * فقط در حالت تفکیک بر اساس محل استفاده می‌شود.
   */
  locationId?: string;

  /*
   * شناسه مالک
   * فقط در حالت تفکیک بر اساس مالک استفاده می‌شود.
   */
  ownerId?: string;
}


export interface Article11Note2Input {

  items: Article11Note2Item[];

  mode: Article11Note2Mode;
}


export interface Article11Note2GroupResult {

  groupKey: string;

  totalEvaluationValueToman: number;

  feeToman: number;

  capped: boolean;

  itemCount: number;
}


export interface Article11Note2Result {

  mode: Article11Note2Mode;

  totalEvaluationValueToman: number;

  totalFeeToman: number;

  groupCount: number;

  groups: Article11Note2GroupResult[];

  calculationLabel: string;

  note: string;
}


const RIAL_PER_TOMAN = 10;


/*
 * محاسبه دستمزد یک گروه
 */
function calculateGroupFee(
  items: Article11Note2Item[],
  groupKey: string
): Article11Note2GroupResult {

  const totalEvaluationValueToman =
    items.reduce(
      (sum, item) =>
        sum + item.valueToman,
      0
    );


  const result =
    calculateArticle11(
      totalEvaluationValueToman *
      RIAL_PER_TOMAN
    );


  return {

    groupKey,

    totalEvaluationValueToman,

    feeToman:
      result.finalFee /
      RIAL_PER_TOMAN,

    capped:
      result.capped,

    itemCount:
      items.length
  };
}


/*
 * محاسبه تبصره ۲ ماده ۱۱
 */
export function calculateArticle11Note2(
  input: Article11Note2Input
): Article11Note2Result {

  const {
    items,
    mode
  } = input;


  /*
   * اعتبارسنجی اولیه
   */
  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {

    throw new Error(
      "At least one evaluation item is required."
    );
  }


  for (const item of items) {

    if (
      !Number.isFinite(
        item.valueToman
      ) ||
      item.valueToman < 0
    ) {

      throw new Error(
        "Each evaluation value must be a non-negative number."
      );
    }
  }


  const totalEvaluationValueToman =
    items.reduce(
      (sum, item) =>
        sum + item.valueToman,
      0
    );


  /*
   * ========================================
   * حالت اول
   * تجمیع موضوعات
   * ========================================
   */

  if (
    mode === "COMBINED"
  ) {

    const group =
      calculateGroupFee(
        items,
        "COMBINED"
      );


    return {

      mode,

      totalEvaluationValueToman,

      totalFeeToman:
        group.feeToman,

      groupCount:
        1,

      groups:
        [group],

      calculationLabel:
        "محاسبه دستمزد براساس تبصره ۲ ماده ۱۱",

      note:
        "ارزش موضوعات کارشناسی برای محاسبه دستمزد با یکدیگر تجمیع شده است."
    };
  }


  /*
   * ========================================
   * حالت دوم
   * تفکیک بر اساس محل
   * ========================================
   */

  if (
    mode === "SEPARATE_BY_LOCATION"
  ) {

    const map =
      new Map<
        string,
        Article11Note2Item[]
      >();


    for (const item of items) {

      const key =
        item.locationId?.trim();


      if (!key) {

        throw new Error(
          "Location ID is required when calculation mode is SEPARATE_BY_LOCATION."
        );
      }


      const group =
        map.get(key) ?? [];


      group.push(item);

      map.set(
        key,
        group
      );
    }


    const groups =
      Array.from(
        map.entries()
      ).map(
        ([key, groupItems]) =>
          calculateGroupFee(
            groupItems,
            key
          )
      );


    return {

      mode,

      totalEvaluationValueToman,

      totalFeeToman:
        groups.reduce(
          (sum, group) =>
            sum + group.feeToman,
          0
        ),

      groupCount:
        groups.length,

      groups,

      calculationLabel:
        "محاسبه دستمزد براساس تبصره ۲ ماده ۱۱",

      note:
        "موضوعات کارشناسی بر اساس محل تفکیک و دستمزد هر گروه به صورت جداگانه محاسبه شده است."
    };
  }


  /*
   * ========================================
   * حالت سوم
   * تفکیک بر اساس مالک
   * ========================================
   */

  if (
    mode === "SEPARATE_BY_OWNER"
  ) {

    const map =
      new Map<
        string,
        Article11Note2Item[]
      >();


    for (const item of items) {

      const key =
        item.ownerId?.trim();


      if (!key) {

        throw new Error(
          "Owner ID is required when calculation mode is SEPARATE_BY_OWNER."
        );
      }


      const group =
        map.get(key) ?? [];


      group.push(item);

      map.set(
        key,
        group
      );
    }


    const groups =
      Array.from(
        map.entries()
      ).map(
        ([key, groupItems]) =>
          calculateGroupFee(
            groupItems,
            key
          )
      );


    return {

      mode,

      totalEvaluationValueToman,

      totalFeeToman:
        groups.reduce(
          (sum, group) =>
            sum + group.feeToman,
          0
        ),

      groupCount:
        groups.length,

      groups,

      calculationLabel:
        "محاسبه دستمزد براساس تبصره ۲ ماده ۱۱",

      note:
        "موضوعات کارشناسی بر اساس مالک تفکیک و دستمزد هر گروه به صورت جداگانه محاسبه شده است."
    };
  }


  throw new Error(
    "Invalid Article 11 Note 2 calculation mode."
  );
}