import {
  expertFields,
  expertServices,
  expertSubjects
} from "../data/ExpertServiceCatalog";

import type {
  ExpertField,
  ExpertService,
  ExpertSubject
} from "../data/ExpertServiceCatalog";


/*
 * ========================================
 * نوع نتیجه جستجو
 * ========================================
 */

export type ExpertSearchResultType =
  | "SERVICE"
  | "SUBJECT"
  | "FIELD";


/*
 * ========================================
 * نتیجه جستجو
 * ========================================
 */

export interface ExpertSearchResult {

  id: string;

  type: ExpertSearchResultType;

  title: string;

  subtitle: string;

  score: number;

  article?: number;

  service?: ExpertService;

  subject?: ExpertSubject;

  field?: ExpertField;

  relatedServices: ExpertService[];

  relatedFields: ExpertField[];
}


/*
 * ========================================
 * تنظیمات جستجو
 * ========================================
 */

export interface ExpertSearchOptions {

  limit?: number;

  minimumScore?: number;
}


/*
 * ========================================
 * نرمال سازی فارسی
 * ========================================
 */

export function normalizePersianText(
  input: string
): string {

  if (!input) {
    return "";
  }


  return input

    /*
     * حروف عربی به فارسی
     */

    .replace(/ي/g, "ی")
    .replace(/ى/g, "ی")
    .replace(/ك/g, "ک")


    /*
     * اعداد فارسی و عربی به انگلیسی
     */

    .replace(/[۰-۹]/g, (digit) => {

      const persianDigits =
        "۰۱۲۳۴۵۶۷۸۹";

      return String(
        persianDigits.indexOf(
          digit
        )
      );

    })

    .replace(/[٠-٩]/g, (digit) => {

      const arabicDigits =
        "٠١٢٣٤٥٦٧٨٩";

      return String(
        arabicDigits.indexOf(
          digit
        )
      );

    })


    /*
     * حذف اعراب
     */

    .replace(
      /[\u064B-\u065F\u0670]/g,
      ""
    )


    /*
     * نیم فاصله به فاصله
     */

    .replace(
      /\u200c/g,
      " "
    )


    /*
     * علائم نگارشی به فاصله
     */

    .replace(
      /[.,،؛;:!?؟()[\]{}"'«»/\\_-]/g,
      " "
    )


    /*
     * فاصله های اضافی
     */

    .replace(
      /\s+/g,
      " "
    )

    .trim()

    .toLowerCase();

}


/*
 * ========================================
 * شکستن عبارت به کلمات
 * ========================================
 */

function tokenize(
  input: string
): string[] {

  const normalized =
    normalizePersianText(
      input
    );


  if (!normalized) {
    return [];
  }


  return normalized
    .split(" ")
    .filter(
      (token) =>
        token.length > 0
    );

}


/*
 * ========================================
 * امتیاز تطبیق یک عبارت
 * ========================================
 */

function calculateTextScore(
  query: string,
  candidate: string
): number {

  const normalizedQuery =
    normalizePersianText(
      query
    );

  const normalizedCandidate =
    normalizePersianText(
      candidate
    );


  if (
    !normalizedQuery ||
    !normalizedCandidate
  ) {

    return 0;

  }


  /*
   * تطبیق دقیق
   */

  if (
    normalizedCandidate ===
    normalizedQuery
  ) {

    return 100;

  }


  /*
   * عبارت Candidate با Query شروع شود
   */

  if (
    normalizedCandidate.startsWith(
      normalizedQuery
    )
  ) {

    return 85;

  }


  /*
   * Query داخل Candidate باشد
   */

  if (
    normalizedCandidate.includes(
      normalizedQuery
    )
  ) {

    return 70;

  }


  /*
   * Candidate داخل Query باشد
   */

  if (
    normalizedQuery.includes(
      normalizedCandidate
    )
  ) {

    return 60;

  }


  /*
   * بررسی کلمه به کلمه
   */

  const queryTokens =
    tokenize(
      normalizedQuery
    );

  const candidateTokens =
    tokenize(
      normalizedCandidate
    );


  if (
    queryTokens.length === 0 ||
    candidateTokens.length === 0
  ) {

    return 0;

  }


  let matchedTokens = 0;


  for (
    const queryToken
    of queryTokens
  ) {

    const matched =
      candidateTokens.some(
        (candidateToken) =>

          candidateToken ===
            queryToken ||

          candidateToken.startsWith(
            queryToken
          ) ||

          queryToken.startsWith(
            candidateToken
          )

      );


    if (matched) {
      matchedTokens += 1;
    }

  }


  if (
    matchedTokens === 0
  ) {

    return 0;

  }


  const ratio =
    matchedTokens /
    queryTokens.length;


  return Math.round(
    ratio * 50
  );

}


/*
 * ========================================
 * بهترین امتیاز در مجموعه عبارات
 * ========================================
 */

function getBestTextScore(
  query: string,
  values: string[]
): number {

  let bestScore = 0;


  for (
    const value
    of values
  ) {

    const score =
      calculateTextScore(
        query,
        value
      );


    if (
      score > bestScore
    ) {

      bestScore =
        score;

    }

  }


  return bestScore;

}


/*
 * ========================================
 * یافتن رشته با ID
 * ========================================
 */

export function getExpertFieldById(
  fieldId: string
): ExpertField | undefined {

  return expertFields.find(
    (field) =>
      field.id ===
      fieldId
  );

}


/*
 * ========================================
 * یافتن خدمت با ID
 * ========================================
 */

export function getExpertServiceById(
  serviceId: string
): ExpertService | undefined {

  return expertServices.find(
    (service) =>
      service.id ===
      serviceId
  );

}


/*
 * ========================================
 * رشته های مرتبط با خدمت
 * ========================================
 */

function getFieldsForService(
  service: ExpertService
): ExpertField[] {

  return service.fieldIds
    .map(
      (fieldId) =>
        getExpertFieldById(
          fieldId
        )
    )
    .filter(
      (
        field
      ): field is ExpertField =>
        field !== undefined
    );

}


/*
 * ========================================
 * خدمات مرتبط با موضوع
 * ========================================
 */

function getServicesForSubject(
  subject: ExpertSubject
): ExpertService[] {

  return subject
    .relatedServiceIds
    .map(
      (serviceId) =>
        getExpertServiceById(
          serviceId
        )
    )
    .filter(
      (
        service
      ): service is ExpertService =>
        service !== undefined
    );

}


/*
 * ========================================
 * رشته های مرتبط با موضوع
 * ========================================
 */

function getFieldsForSubject(
  subject: ExpertSubject
): ExpertField[] {

  return subject
    .relatedFieldIds
    .map(
      (fieldId) =>
        getExpertFieldById(
          fieldId
        )
    )
    .filter(
      (
        field
      ): field is ExpertField =>
        field !== undefined
    );

}


/*
 * ========================================
 * ساخت نتیجه خدمت
 * ========================================
 */

function createServiceResult(
  query: string,
  service: ExpertService
): ExpertSearchResult | null {

  const titleScore =
    calculateTextScore(
      query,
      service.title
    );


  const keywordScore =
    getBestTextScore(
      query,
      service.keywords
    );


  const aliasScore =
    getBestTextScore(
      query,
      service.aliases
    );


  const score =
    Math.max(
      titleScore,
      keywordScore,
      aliasScore
    );


  if (
    score <= 0
  ) {

    return null;

  }


  const relatedFields =
    getFieldsForService(
      service
    );


  const articleText =
    service.article
      ? `ماده ${service.article}`
      : "خدمت کارشناسی";


  return {

    id:
      `SERVICE:${service.id}`,

    type:
      "SERVICE",

    title:
      service.title,

    subtitle:
      articleText,

    score:
      score +
      service.priority,

    article:
      service.article,

    service,

    relatedServices: [
      service
    ],

    relatedFields

  };

}


/*
 * ========================================
 * ساخت نتیجه موضوع
 * ========================================
 */

function createSubjectResult(
  query: string,
  subject: ExpertSubject
): ExpertSearchResult | null {

  const titleScore =
    calculateTextScore(
      query,
      subject.title
    );


  const aliasScore =
    getBestTextScore(
      query,
      subject.aliases
    );


  const score =
    Math.max(
      titleScore,
      aliasScore
    );


  if (
    score <= 0
  ) {

    return null;

  }


  const relatedServices =
    getServicesForSubject(
      subject
    );


  const relatedFields =
    getFieldsForSubject(
      subject
    );


  return {

    id:
      `SUBJECT:${subject.id}`,

    type:
      "SUBJECT",

    title:
      subject.title,

    subtitle:
      "موضوع کارشناسی",

    score:
      score + 60,

    subject,

    relatedServices,

    relatedFields

  };

}


/*
 * ========================================
 * ساخت نتیجه رشته
 * ========================================
 */

function createFieldResult(
  query: string,
  field: ExpertField
): ExpertSearchResult | null {

  const titleScore =
    calculateTextScore(
      query,
      field.title
    );


  const aliasScore =
    getBestTextScore(
      query,
      field.aliases
    );


  const score =
    Math.max(
      titleScore,
      aliasScore
    );


  if (
    score <= 0
  ) {

    return null;

  }


  return {

    id:
      `FIELD:${field.id}`,

    type:
      "FIELD",

    title:
      field.title,

    subtitle:
      "رشته کارشناسی",

    score:
      score + 30,

    field,

    relatedServices: [],

    relatedFields: [
      field
    ]

  };

}


/*
 * ========================================
 * حذف نتایج تکراری
 * ========================================
 */

function removeDuplicateResults(
  results: ExpertSearchResult[]
): ExpertSearchResult[] {

  const map =
    new Map<
      string,
      ExpertSearchResult
    >();


  for (
    const result
    of results
  ) {

    const existing =
      map.get(
        result.id
      );


    if (
      !existing ||
      result.score >
        existing.score
    ) {

      map.set(
        result.id,
        result
      );

    }

  }


  return Array.from(
    map.values()
  );

}


/*
 * ========================================
 * موتور اصلی جستجو
 * ========================================
 */

export function searchExpertServices(
  query: string,
  options: ExpertSearchOptions = {}
): ExpertSearchResult[] {

  const normalizedQuery =
    normalizePersianText(
      query
    );


  /*
   * جستجو از دو کاراکتر به بالا
   */

  if (
    normalizedQuery.length < 2
  ) {

    return [];

  }


  const {
    limit = 8,
    minimumScore = 30
  } = options;


  const results:
    ExpertSearchResult[] = [];


  /*
   * خدمات
   */

  for (
    const service
    of expertServices
  ) {

    const result =
      createServiceResult(
        normalizedQuery,
        service
      );


    if (result) {

      results.push(
        result
      );

    }

  }


  /*
   * موضوعات
   */

  for (
    const subject
    of expertSubjects
  ) {

    const result =
      createSubjectResult(
        normalizedQuery,
        subject
      );


    if (result) {

      results.push(
        result
      );

    }

  }


  /*
   * رشته ها
   */

  for (
    const field
    of expertFields
  ) {

    const result =
      createFieldResult(
        normalizedQuery,
        field
      );


    if (result) {

      results.push(
        result
      );

    }

  }


  /*
   * حذف تکراری
   */

  const uniqueResults =
    removeDuplicateResults(
      results
    );


  /*
   * حداقل امتیاز
   */

  const filteredResults =
    uniqueResults.filter(
      (result) =>
        result.score >=
        minimumScore
    );


  /*
   * مرتب سازی
   */

  filteredResults.sort(
    (a, b) => {

      if (
        b.score !==
        a.score
      ) {

        return (
          b.score -
          a.score
        );

      }


      return a.title.localeCompare(
        b.title,
        "fa"
      );

    }
  );


  /*
   * محدودیت تعداد نتایج
   */

  return filteredResults.slice(
    0,
    limit
  );

}


/*
 * ========================================
 * آیا نتیجه مبهم است؟
 * ========================================
 */

export function isAmbiguousSearchResult(
  result: ExpertSearchResult
): boolean {

  /*
   * اگر یک موضوع به بیش از یک رشته
   * یا بیش از یک خدمت مرتبط باشد،
   * کاربر باید مسیر مورد نظر را انتخاب کند.
   */

  if (
    result.type !==
    "SUBJECT"
  ) {

    return false;

  }


  return (
    result.relatedServices.length > 1 ||
    result.relatedFields.length > 1
  );

}