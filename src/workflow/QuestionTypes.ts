export type QuestionType =
  | "money"
  | "number"
  | "text"
  | "textarea"
  | "checkbox"
  | "radio"
  | "select"
  | "date";

export interface QuestionOption {
  id: string;
  title: string;
}

export interface Question {

  /*
   * شناسه یکتا
   */
  id: string;

  /*
   * عنوان نمایشی
   */
  title: string;

  /*
   * نوع کنترل
   */
  type: QuestionType;

  /*
   * اجباری؟
   */
  required: boolean;

  /*
   * گزینه ها
   */
  options?: QuestionOption[];

  /*
   * مقدار پیش فرض
   */
  defaultValue?: unknown;

  /*
   * فقط در صورت برقرار بودن شرط نمایش داده شود
   */
  visibleIf?: string;

  /*
   * راهنمای کوتاه
   */
  help?: string;
}