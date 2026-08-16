/*
 * ============================================================
 * Financial Affairs - Rules
 * Articles 25 to 29
 * Unit: Toman
 * ============================================================
 */

export const FINANCIAL_MINIMUM_FEE_TOMAN =
  600_000;


export const FINANCIAL_MAXIMUM_FEE_TOMAN =
  118_000_000;


/*
 * Article 25:
 * Article 11 fee + 50%
 */

export const ARTICLE25_INCREASE_RATE =
  0.50;


export const FIELD_TITLES = {

  ACCOUNTING_AUDITING:
    "حسابداری و حسابرسی",

  COMMERCIAL_AFFAIRS:
    "امور بازرگانی",

  ALIMONY:
    "تعیین نفقه",

  MONETARY_CREDIT_INVESTMENT:
    "سرمایه‌گذاری پولی و اعتباری",

  INSURANCE:
    "بیمه"

} as const;


export const ACCOUNTING_SUBJECT_TITLES = {

  ARTICLE_25_AUDITING:
    "امور حسابرسی",

  ARTICLE_26_SHARE_VALUE:
    "ارزش سهام و سهم‌الشرکه",

  ARTICLE_26_FINANCIAL_STATEMENTS:
    "رسیدگی و حسابرسی ترازنامه و حساب سود و زیان و امور توقف و ورشکستگی",

  ARTICLE_26_COSTING:
    "تعیین قیمت تمام‌شده کالاها"

} as const;