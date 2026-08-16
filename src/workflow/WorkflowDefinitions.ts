import { Question } from "./QuestionTypes";


export type WorkflowId =
  | "VALUATION";


export interface WorkflowDefinition {

  id: WorkflowId;

  title: string;

  article: string;

  questions: Question[];
}


export const WorkflowDefinitions:
  WorkflowDefinition[] = [

  {

    id: "VALUATION",

    title:
      "ارزیابی اموال، ماشین‌آلات و تأسیسات",

    article:
      "ماده 11",

    questions: [

      /*
       * ========================================
       * مبلغ ارزیابی
       * ========================================
       */

      {
        id:
          "evaluationValue",

        title:
          "ارزش موضوع کارشناسی",

        type:
          "money",

        required:
          true,

        help:
          "مبلغ ارزیابی به تومان"
      },


      /*
       * ========================================
       * موضوع کارشناسی
       * ========================================
       *
       * کاربر لازم نیست ماده یا تبصره
       * تعرفه را بشناسد.
       */

      {
        id:
          "subjectType",

        title:
          "موضوع کارشناسی چیست؟",

        type:
          "radio",

        required:
          true,

        options: [

          {
            id:
              "STANDARD_VALUATION",

            title:
              "ارزیابی و تعیین قیمت"
          },

          {
            id:
              "CONTRACT",

            title:
              "بررسی اختلافات و قرارداد"
          },

          {
            id:
              "DAMAGE",

            title:
              "تعیین خسارت"
          },

          {
            id:
              "SPECIAL_ITEMS",

            title:
              "ارزیابی اقلام خاص"
          },

          {
            id:
              "INTANGIBLE_ASSETS",

            title:
              "ارزیابی دارایی‌های نامشهود"
          }

        ]
      },


      /*
       * ========================================
       * نوع رسیدگی قراردادی
       * ========================================
       *
       * فقط وقتی موضوع اصلی CONTRACT باشد
       * نمایش داده می‌شود.
       */

      {
        id:
          "contractScope",

        title:
          "نوع رسیدگی به قرارداد",

        type:
          "radio",

        required:
          true,

        visibleIf:
          "subjectType === CONTRACT",

        options: [

          {
            id:
              "CONTRACT_FULL",

            title:
              "بررسی قرارداد و صورت‌وضعیت"
          },

          {
            id:
              "CONTRACT_PARTIAL",

            title:
              "رسیدگی صرفاً به بخشی از قرارداد"
          }

        ],

        help:
          "در صورت انتخاب موضوع قراردادی، نوع رسیدگی را مشخص کنید."
      },


      /*
       * ========================================
       * تعداد کارشناسان
       * ========================================
       */

      {
        id:
          "expertCount",

        title:
          "تعداد کارشناسان",

        type:
          "number",

        required:
          true,

        defaultValue:
          1
      },


      /*
       * ========================================
       * وضعیت رشته اعضای هیأت
       * ========================================
       */

      {
        id:
          "panelFieldMode",

        title:
          "نوع هیأت",

        type:
          "radio",

        required:
          false,

        visibleIf:
          "expertCount > 1",

        options: [

          {
            id:
              "SAME_FIELD",

            title:
              "هیأت کارشناسان هم‌رشته"
          },

          {
            id:
              "DIFFERENT_FIELDS",

            title:
              "هیأت کارشناسان با رشته‌های مختلف"
          }

        ]
      }

    ]

  }

];