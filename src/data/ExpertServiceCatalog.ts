/*
 * ========================================
 * ExpertFee
 * Expert Service Catalog
 * ========================================
 *
 * این فایل هسته اطلاعاتی جستجوی خدمات
 * کارشناسی در ExpertFee است.
 *
 * نکته:
 * رشته کارشناسی، موضوع کارشناسی و
 * خدمت قابل محاسبه سه مفهوم مستقل هستند.
 */


/*
 * ========================================
 * نوع مقصد
 * ========================================
 */

export type ExpertServiceTarget =
  | "ARTICLE_11"
  | "ARTICLE_13"
  | "ARTICLE_14"
  | "WATER_ENGINEERING"
  | "METALS_AND_MINING"
  | "MOVABLE_PROPERTY"
  | "FINANCIAL_AFFAIRS"
  | "FIELD_PAGE";


/*
 * ========================================
 * نوع محاسبه
 * ========================================
 */

export type ExpertCalculationType =
  | "ARTICLE_11"
  | "ARTICLE_13"
  | "ARTICLE_14"
  | "DEDICATED"
  | "FIELD_PAGE";


/*
 * ========================================
 * رشته کارشناسی
 * ========================================
 */

export interface ExpertField {

  id: string;

  title: string;

  aliases: string[];
}


/*
 * ========================================
 * خدمت کارشناسی
 * ========================================
 */

export interface ExpertService {

  id: string;

  title: string;

  fieldIds: string[];

  article?: number;

  keywords: string[];

  aliases: string[];

  calculationType:
    ExpertCalculationType;

  target:
    ExpertServiceTarget;

  targetMode?: string;

  priority: number;
}


/*
 * ========================================
 * موضوع کارشناسی
 * ========================================
 *
 * مثال:
 * جرثقیل خودش یک خدمت نیست.
 *
 * جرثقیل می‌تواند موضوع:
 * - ارزیابی
 * - بررسی فنی
 * - حادثه ناشی از کار
 * باشد.
 * ========================================
 */

export interface ExpertSubject {

  id: string;

  title: string;

  aliases: string[];

  relatedServiceIds: string[];

  relatedFieldIds: string[];
}


/*
 * ========================================
 * رشته‌های کارشناسی
 * ========================================
 */

export const expertFields:
  ExpertField[] = [

  {
    id: "AGRICULTURE",

    title:
      "کشاورزی و منابع طبیعی",

    aliases: [
      "کشاورزی",
      "منابع طبیعی"
    ]
  },

  {
    id: "INSURANCE",

    title:
      "امور بیمه",

    aliases: [
      "بیمه"
    ]
  },

  {
    id: "WOOD_INDUSTRIES",

    title:
      "صنایع چوب",

    aliases: [
      "چوب",
      "صنایع چوبی"
    ]
  },

  {
    id: "ROAD_BUILDING",

    title:
      "راه و ساختمان",

    aliases: [
      "ساختمان",
      "راه",
      "ابنیه"
    ]
  },

  {
    id: "MOTOR_VEHICLES",

    title:
      "امور وسائط نقلیه موتوری زمینی (تصادفات)",

    aliases: [
      "خودرو",
      "وسائط نقلیه",
      "تصادف",
      "اتومبیل"
    ]
  },

  {
    id: "RAIL_VEHICLES",

    title:
      "امور وسائط نقلیه ریلی",

    aliases: [
      "ریل",
      "قطار",
      "راه آهن"
    ]
  },

  {
    id: "COMPUTER",

    title:
      "کامپیوتر و جرائم رایانه ای",

    aliases: [
      "کامپیوتر",
      "رایانه",
      "جرائم رایانه ای"
    ]
  },

  {
    id: "BUILDING_INSTALLATIONS",

    title:
      "تاسیسات ساختمانی",

    aliases: [
      "تاسیسات ساختمان",
      "تجهیزات ساختمان"
    ]
  },

  {
    id: "FACTORY_MACHINERY",

    title:
      "برق، ماشین و تاسیسات کارخانجات",

    aliases: [
      "ماشین آلات",
      "ماشین آلات صنعتی",
      "تجهیزات صنعتی",
      "کارخانه",
      "تاسیسات کارخانه",
      "خط تولید"
    ]
  },

  {
    id: "BIOTECHNOLOGY",

    title:
      "بیوتکنولوژی",

    aliases: [
      "زیست فناوری"
    ]
  },

  {
    id: "ACCOUNTING",

    title:
      "حسابداری و حسابرسی",

    aliases: [
      "حسابداری",
      "حسابرسی"
    ]
  },

  {
    id: "BANKING",

    title:
      "امور بانکی",

    aliases: [
      "بانک",
      "بانکی"
    ]
  },

  {
    id: "SIGNATURE",

    title:
      "تشخیص اصالت خط، امضا و اثرانگشت",

    aliases: [
      "خط",
      "امضا",
      "اثر انگشت",
      "اصالت امضا"
    ]
  },

  {
    id: "ELECTRICITY_TELECOM",

    title:
      "برق، الکترونیک، مخابرات",

    aliases: [
      "برق",
      "الکترونیک",
      "مخابرات"
    ]
  },

  {
    id: "WEAPONS",

    title:
      "اسلحه شناسی و مهمات",

    aliases: [
      "اسلحه",
      "مهمات"
    ]
  },

  {
    id: "WORK_ACCIDENT",

    title:
      "حوادث ناشی از کار و بهداشت حرفه ای",

    aliases: [
      "حادثه کار",
      "حوادث کار",
      "بهداشت حرفه ای"
    ]
  },

  {
    id: "ALIMONY",

    title:
      "نفقه",

    aliases: [
      "تعیین نفقه"
    ]
  },

  {
    id: "REGISTRATION_SURVEY",

    title:
      "امور ثبتی و نقشه برداری",

    aliases: [
      "ثبت",
      "ثبتی",
      "نقشه برداری"
    ]
  },

  {
    id: "MEDICAL_ENGINEERING",

    title:
      "مهندسی پزشکی (تجهیزات پزشکی)",

    aliases: [
      "مهندسی پزشکی",
      "تجهیزات پزشکی"
    ]
  },

  {
    id: "STOCK_MARKET",

    title:
      "بورس و اوراق بهادار",

    aliases: [
      "بورس",
      "اوراق بهادار",
      "سهام"
    ]
  },

  {
    id: "WATCH_JEWELRY",

    title:
      "ساعت و جواهرات",

    aliases: [
      "ساعت",
      "جواهر",
      "جواهرات"
    ]
  },

  {
    id: "MARINE",

    title:
      "امور وسائط نقلیه دریایی و غواصی",

    aliases: [
      "شناور",
      "کشتی",
      "قایق",
      "دریایی",
      "غواصی"
    ]
  },

  {
    id: "WATER",

    title:
      "امور آب",

    aliases: [
      "آب",
      "چاه",
      "قنات",
      "حقابه"
    ]
  },

  {
    id: "TAX",

    title:
      "امور مالیاتی",

    aliases: [
      "مالیات",
      "مالیاتی"
    ]
  }

];


/*
 * ========================================
 * خدمات عمومی و فعال فعلی
 * ========================================
 */

export const expertServices:
  ExpertService[] = [

  {
    id: "VALUATION",

    title:
      "ارزیابی و تعیین قیمت",

    fieldIds: [],

    article: 11,

    keywords: [
      "ارزیابی",
      "قیمت",
      "قیمت گذاری",
      "تعیین قیمت",
      "ارزش",
      "تعیین ارزش",
      "ارزش گذاری"
    ],

    aliases: [
      "برآورد قیمت",
      "برآورد ارزش"
    ],

    calculationType:
      "ARTICLE_11",

    target:
      "ARTICLE_11",

    priority: 100
  },

  {
    id: "RENT",

    title:
      "تعیین اجاره بها",

    fieldIds: [],

    article: 13,

    keywords: [
      "اجاره",
      "اجاره بها",
      "کرایه",
      "تعیین اجاره"
    ],

    aliases: [
      "اجرت اجاره"
    ],

    calculationType:
      "ARTICLE_13",

    target:
      "ARTICLE_13",

    priority: 90
  },

  {
    id: "AERIAL_PHOTO",

    title:
      "تفسیر عکس های هوایی و ماهواره ای",

    fieldIds: [
      "REGISTRATION_SURVEY"
    ],

    article: 14,

    keywords: [
      "عکس هوایی",
      "تصویر هوایی",
      "ماهواره",
      "ماهواره ای",
      "تفسیر عکس"
    ],

    aliases: [
      "تصاویر ماهواره ای"
    ],

    calculationType:
      "ARTICLE_14",

    target:
      "ARTICLE_14",

    priority: 80
  }

];


/*
 * ========================================
 * موضوعات اولیه
 * ========================================
 */

export const expertSubjects:
  ExpertSubject[] = [

  {
    id: "CRANE",

    title:
      "جرثقیل",

    aliases: [
      "کرین",
      "crane",
      "جرثقیل سقفی",
      "جرثقیل دروازه ای",
      "جرثقیل متحرک",
      "جرثقیل کارگاهی",
      "جرثقیل صنعتی"
    ],

    relatedServiceIds: [
      "VALUATION"
    ],

    relatedFieldIds: [
      "FACTORY_MACHINERY",
      "WORK_ACCIDENT"
    ]
  },

  {
    id: "INDUSTRIAL_MACHINERY",

    title:
      "ماشین آلات صنعتی",

    aliases: [
      "ماشین آلات",
      "دستگاه صنعتی",
      "تجهیزات صنعتی",
      "خط تولید",
      "ماشین کارخانه"
    ],

    relatedServiceIds: [
      "VALUATION"
    ],

    relatedFieldIds: [
      "FACTORY_MACHINERY"
    ]
  },

  {
    id: "WELL",

    title:
      "چاه",

    aliases: [
      "چاه آب",
      "چاه عمیق",
      "چاه نیمه عمیق"
    ],

    relatedServiceIds: [
      "VALUATION"
    ],

    relatedFieldIds: [
      "WATER"
    ]
  },

  {
    id: "VEHICLE",

    title:
      "خودرو",

    aliases: [
      "اتومبیل",
      "ماشین",
      "خودروی سواری",
      "خودروی سنگین"
    ],

    relatedServiceIds: [
      "VALUATION"
    ],

    relatedFieldIds: [
      "MOTOR_VEHICLES"
    ]
  }

];