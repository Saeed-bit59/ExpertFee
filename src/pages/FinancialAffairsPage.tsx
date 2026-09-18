import {
  useMemo,
  useState
} from "react";

import {
  calculateArticle11Engine
} from "../engine/Article11Engine";

import {
  calculateFinancialAffairs
} from "../engine/financial/FinancialCalculator";
import { FINANCIAL_MAXIMUM_FEE_TOMAN } from "../engine/financial/FinancialRules";

import type {
  AccountingMode,
  FinancialField
} from "../engine/financial/FinancialTypes";

import {
  calculateMission
} from "../engine/MissionCalculator";

import type {
  MissionType
} from "../engine/MissionCalculator";
import MoneyInput from "../components/ui/MoneyInput";


interface FinancialAffairsPageProps {
  onBack: () => void;
}


type FinancialSelection =
  | ""
  | FinancialField;


const MAX_FINAL_FEE_TOMAN =
  FINANCIAL_MAXIMUM_FEE_TOMAN;


/* ============================================================
   Number Helpers
   ============================================================ */

function normalizeDigits(
  value: string
): string {

  const persianDigits =
    "۰۱۲۳۴۵۶۷۸۹";

  const arabicDigits =
    "٠١٢٣٤٥٦٧٨٩";


  return value
    .replace(
      /[۰-۹]/g,
      (digit) =>
        String(
          persianDigits.indexOf(
            digit
          )
        )
    )
    .replace(
      /[٠-٩]/g,
      (digit) =>
        String(
          arabicDigits.indexOf(
            digit
          )
        )
    );

}


function parseAmount(
  value: string
): number {

  const normalized =
    normalizeDigits(
      value
    )
      .replace(
        /,/g,
        ""
      )
      .replace(
        /٬/g,
        ""
      )
      .replace(
        /\s/g,
        ""
      );


  const numericValue =
    normalized.replace(
      /[^\d.]/g,
      ""
    );


  if (!numericValue) {
    return 0;
  }


  const result =
    Number(
      numericValue
    );


  if (
    !Number.isFinite(
      result
    )
  ) {
    return 0;
  }


  return result;

}


function formatAmountInput(
  value: string
): string {

  const amount =
    parseAmount(
      value
    );


  if (amount <= 0) {
    return "";
  }


  return amount.toLocaleString(
    "en-US"
  );

}


function formatToman(
  value: number
): string {

  return Math.round(
    value
  ).toLocaleString(
    "en-US"
  );

}


/* ============================================================
   Styles
   ============================================================ */

const cardStyle = {
  width: "100%",
  textAlign: "right" as const,
  padding: 18,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  cursor: "pointer",
  fontFamily: "inherit",
  boxSizing: "border-box" as const
};


const selectedCardStyle = {
  ...cardStyle,
  border: "2px solid #334155",
  background: "#f8fafc"
};


const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  fontFamily: "inherit",
  fontSize: 17,
  textAlign: "left" as const,
  direction: "ltr" as const,
  background: "#ffffff"
};


const sectionStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 20,
  marginTop: 20
};


const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap" as const,
  padding: "5px 0"
};


/* ============================================================
   Component
   ============================================================ */

export default function FinancialAffairsPage({
  onBack
}: FinancialAffairsPageProps) {

  const [
    selectedField,
    setSelectedField
  ] =
    useState<FinancialSelection>(
      ""
    );


  const [
    accountingMode,
    setAccountingMode
  ] =
    useState<AccountingMode>(
      "ARTICLE_25_AUDITING"
    );


  const [
    amountText,
    setAmountText
  ] =
    useState<string>(
      ""
    );


  const [
    missionType,
    setMissionType
  ] =
    useState<MissionType>(
      "NONE"
    );


  const [
    missionDaysText,
    setMissionDaysText
  ] =
    useState<string>(
      "1"
    );


  const amountToman =
    useMemo(
      () =>
        parseAmount(
          amountText
        ),
      [
        amountText
      ]
    );


  const missionDays =
    useMemo(
      () => {

        if (
          missionType ===
          "NONE"
        ) {
          return 0;
        }


        const value =
          parseAmount(
            missionDaysText
          );


        if (
          !Number.isInteger(
            value
          ) ||
          value < 1
        ) {
          return 0;
        }


        return value;

      },
      [
        missionType,
        missionDaysText
      ]
    );


  /* ============================================================
     Main Financial Calculation
     ============================================================ */

  const calculation =
    useMemo(
      () => {

        if (
          !selectedField ||
          amountToman <= 0
        ) {

          return null;

        }


        try {

          /*
           * STEP 1
           *
           * Calculate Article 11 from
           * the actual financial amount.
           */

          const article11Result =
            calculateArticle11Engine({
              evaluationValueToman:
                amountToman
            });


          const article11FeeToman =
            article11Result
              .feePerExpertToman;


          /*
           * STEP 2
           *
           * Apply the relevant financial
           * affairs rule.
           */

          const financialResult =
            selectedField ===
            "ACCOUNTING_AUDITING"

              ? calculateFinancialAffairs({
                  field:
                    selectedField,

                  accountingMode,

                  article11FeeToman
                })

              : calculateFinancialAffairs({
                  field:
                    selectedField,

                  article11FeeToman
                });


          /*
           * STEP 3
           *
           * Final expert-fee ceiling.
           */

          const finalFeeToman =
            Math.min(
              financialResult
                .finalFeeToman,

              MAX_FINAL_FEE_TOMAN
            );


          return {

            article11Result,

            financialResult,

            finalFeeToman

          };


        } catch (
          error
        ) {

          console.error(
            error
          );

          return null;

        }

      },
      [
        selectedField,
        accountingMode,
        amountToman
      ]
    );


  /* ============================================================
     Mission Calculation
     ============================================================ */

  const missionCalculation =
    useMemo(
      () => {

        if (
          !calculation
        ) {

          return null;

        }


        if (
          missionType !== "NONE" &&
          missionDays < 1
        ) {

          return null;

        }


        try {

          return calculateMission({

            expertFeeToman:
              calculation
                .finalFeeToman,

            missionType,

            missionDays:
              missionType ===
              "NONE"
                ? 0
                : missionDays

          });


        } catch (
          error
        ) {

          console.error(
            error
          );

          return null;

        }

      },
      [
        calculation,
        missionType,
        missionDays
      ]
    );


  /* ============================================================
     Actions
     ============================================================ */

  function selectField(
    field: FinancialField
  ): void {

    setSelectedField(
      field
    );

    setAmountText(
      ""
    );


    if (
      field ===
      "ACCOUNTING_AUDITING"
    ) {

      setAccountingMode(
        "ARTICLE_25_AUDITING"
      );

    }

  }


  function selectAccountingMode(
    mode: AccountingMode
  ): void {

    setAccountingMode(
      mode
    );

    setAmountText(
      ""
    );

  }


  function handleAmountChange(
    value: string
  ): void {

    setAmountText(
      formatAmountInput(
        value
      )
    );

  }


  function handleMissionDaysChange(
    value: string
  ): void {

    const normalized =
      normalizeDigits(
        value
      )
        .replace(
          /[^\d]/g,
          ""
        );


    setMissionDaysText(
      normalized
    );

  }


  function selectMission(
    value: MissionType
  ): void {

    setMissionType(
      value
    );


    if (
      value ===
      "NONE"
    ) {

      setMissionDaysText(
        "1"
      );

    }

  }


  /* ============================================================
     Labels
     ============================================================ */

  function getAmountLabel():
    string {

    if (
      selectedField ===
      "ACCOUNTING_AUDITING"
    ) {

      if (
        accountingMode ===
        "ARTICLE_25_AUDITING"
      ) {

        return "جمع ارقام حساب‌های مورد رسیدگی";

      }


      if (
        accountingMode ===
        "ARTICLE_26_SHARE_VALUE"
      ) {

        return "مبلغ مبنای ارزش سهام و سهم‌الشرکه";

      }


      if (
        accountingMode ===
        "ARTICLE_26_FINANCIAL_STATEMENTS"
      ) {

        return "مبلغ مبنای رسیدگی";

      }


      return "مبلغ مبنای تعیین قیمت تمام‌شده";

    }


    if (
      selectedField ===
      "COMMERCIAL_AFFAIRS"
    ) {

      return "ارزش مورد ارزیابی";

    }


    if (
      selectedField ===
      "ALIMONY"
    ) {

      return "مبلغ مبنای تعیین نفقه";

    }


    if (
      selectedField ===
      "MONETARY_CREDIT_INVESTMENT"
    ) {

      return "ارزش مورد ارزیابی";

    }


    if (
      selectedField ===
      "INSURANCE"
    ) {

      return "ارزش مورد ارزیابی";

    }


    return "مبلغ مبنا";

  }


  function getMissionTitle():
    string {

    switch (
      missionType
    ) {

      case "NONE":

        return "بدون مأموریت";


      case "IN_PROVINCE":

        return "داخل استان";


      case "OUT_PROVINCE":

        return "خارج استان";


      default:

        return "";

    }

  }


  /* ============================================================
     UI
     ============================================================ */

  return (

    <main
      className="ef-legacy-page ef-specialist-page"
      dir="rtl"
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        fontFamily:
          "Tahoma, Arial, sans-serif"
      }}
    >

      {/* ======================================================
          Back
          ====================================================== */}

      <button
        className="ef-back-button ef-legacy-back-button"
        type="button"
        onClick={onBack}
        style={{
          padding: "9px 16px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          background: "#ffffff",
          cursor: "pointer",
          fontFamily: "inherit"
        }}
      >
        ← بازگشت به صفحه اصلی
      </button>


      {/* ======================================================
          Header
          ====================================================== */}

      <div
        className="ef-interior-header"
        style={{
          marginTop: 24,
          marginBottom: 24
        }}
      >

        <h1
          style={{
            marginBottom: 8
          }}
        >
          گروه ۴ ـ امور مالی
        </h1>


        <div
          style={{
            lineHeight: 2,
            opacity: 0.75
          }}
        >
          حسابداری و حسابرسی،
          امور بازرگانی، تعیین نفقه،
          سرمایه‌گذاری پولی و اعتباری
          و بیمه
        </div>


        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            opacity: 0.65
          }}
        >
          مواد ۲۵ تا ۲۹ تعرفه
          دستمزد کارشناسان رسمی
        </div>

      </div>


      {/* ======================================================
          Field Selection
          ====================================================== */}

      <section
        style={sectionStyle}
      >

        <h2
          style={{
            marginTop: 0
          }}
        >
          انتخاب رشته
        </h2>


        <div
          style={{
            display: "grid",
            gap: 12
          }}
        >

          <button
            type="button"
            onClick={() =>
              selectField(
                "ACCOUNTING_AUDITING"
              )
            }
            style={
              selectedField ===
              "ACCOUNTING_AUDITING"
                ? selectedCardStyle
                : cardStyle
            }
          >
            <strong>
              حسابداری و حسابرسی
            </strong>

            <div
              style={{
                marginTop: 6,
                opacity: 0.7
              }}
            >
              مواد ۲۵ و ۲۶
            </div>
          </button>


          <button
            type="button"
            onClick={() =>
              selectField(
                "COMMERCIAL_AFFAIRS"
              )
            }
            style={
              selectedField ===
              "COMMERCIAL_AFFAIRS"
                ? selectedCardStyle
                : cardStyle
            }
          >
            <strong>
              امور بازرگانی
            </strong>

            <div
              style={{
                marginTop: 6,
                opacity: 0.7
              }}
            >
              ماده ۲۷ ـ ارزیابی
            </div>
          </button>


          <button
            type="button"
            onClick={() =>
              selectField(
                "ALIMONY"
              )
            }
            style={
              selectedField ===
              "ALIMONY"
                ? selectedCardStyle
                : cardStyle
            }
          >
            <strong>
              تعیین نفقه
            </strong>

            <div
              style={{
                marginTop: 6,
                opacity: 0.7
              }}
            >
              ماده ۲۸
            </div>
          </button>


          <button
            type="button"
            onClick={() =>
              selectField(
                "MONETARY_CREDIT_INVESTMENT"
              )
            }
            style={
              selectedField ===
              "MONETARY_CREDIT_INVESTMENT"
                ? selectedCardStyle
                : cardStyle
            }
          >
            <strong>
              سرمایه‌گذاری پولی و اعتباری
            </strong>

            <div
              style={{
                marginTop: 6,
                opacity: 0.7
              }}
            >
              ماده ۲۹ ـ ارزیابی
            </div>
          </button>


          <button
            type="button"
            onClick={() =>
              selectField(
                "INSURANCE"
              )
            }
            style={
              selectedField ===
              "INSURANCE"
                ? selectedCardStyle
                : cardStyle
            }
          >
            <strong>
              بیمه
            </strong>

            <div
              style={{
                marginTop: 6,
                opacity: 0.7
              }}
            >
              ماده ۲۹ ـ ارزیابی
            </div>
          </button>

        </div>

      </section>


      {/* ======================================================
          Accounting Subjects
          ====================================================== */}

      {selectedField ===
        "ACCOUNTING_AUDITING" && (

        <section
          style={sectionStyle}
        >

          <h2
            style={{
              marginTop: 0
            }}
          >
            موضوع کارشناسی
          </h2>


          <div
            style={{
              display: "grid",
              gap: 10
            }}
          >

            <button
              type="button"
              onClick={() =>
                selectAccountingMode(
                  "ARTICLE_25_AUDITING"
                )
              }
              style={
                accountingMode ===
                "ARTICLE_25_AUDITING"
                  ? selectedCardStyle
                  : cardStyle
              }
            >
              <strong>
                امور حسابرسی
              </strong>

              <div
                style={{
                  marginTop: 6,
                  opacity: 0.7
                }}
              >
                ماده ۲۵ ـ دستمزد ماده
                ۱۱ به اضافه ۵۰ درصد
              </div>
            </button>


            <button
              type="button"
              onClick={() =>
                selectAccountingMode(
                  "ARTICLE_26_SHARE_VALUE"
                )
              }
              style={
                accountingMode ===
                "ARTICLE_26_SHARE_VALUE"
                  ? selectedCardStyle
                  : cardStyle
              }
            >
              <strong>
                ارزش سهام و سهم‌الشرکه
              </strong>

              <div
                style={{
                  marginTop: 6,
                  lineHeight: 1.9,
                  opacity: 0.7
                }}
              >
                ماده ۲۶ ـ با توجه به
                مجموع دارایی‌های جاری،
                بدهی‌ها و ذخایر
                رسیدگی‌شده به اضافه
                قیمت تمام‌شده دفتری
                دارایی‌های ثابت
              </div>
            </button>


            <button
              type="button"
              onClick={() =>
                selectAccountingMode(
                  "ARTICLE_26_FINANCIAL_STATEMENTS"
                )
              }
              style={
                accountingMode ===
                "ARTICLE_26_FINANCIAL_STATEMENTS"
                  ? selectedCardStyle
                  : cardStyle
              }
            >
              <strong>
                رسیدگی و حسابرسی
                ترازنامه و حساب سود و زیان
              </strong>

              <div
                style={{
                  marginTop: 6,
                  opacity: 0.7
                }}
              >
                شامل امور توقف و
                ورشکستگی ـ ماده ۲۶
              </div>
            </button>


            <button
              type="button"
              onClick={() =>
                selectAccountingMode(
                  "ARTICLE_26_COSTING"
                )
              }
              style={
                accountingMode ===
                "ARTICLE_26_COSTING"
                  ? selectedCardStyle
                  : cardStyle
              }
            >
              <strong>
                تعیین قیمت تمام‌شده کالاها
              </strong>

              <div
                style={{
                  marginTop: 6,
                  opacity: 0.7
                }}
              >
                با توجه به ارقام
                تشکیل‌دهنده قیمت
                تمام‌شده ـ ماده ۲۶
              </div>
            </button>

          </div>

        </section>

      )}


      {/* ======================================================
          Other Article Descriptions
          ====================================================== */}

      {selectedField ===
        "COMMERCIAL_AFFAIRS" && (

        <section
          style={sectionStyle}
        >

          <strong>
            ماده ۲۷ ـ ارزیابی
          </strong>

          <p
            style={{
              lineHeight: 2,
              marginBottom: 0
            }}
          >
            دستمزد کارشناسی ارزیابی
            در رشته امور بازرگانی
            مطابق ماده ۱۱ محاسبه
            می‌شود.
          </p>

        </section>

      )}


      {selectedField ===
        "ALIMONY" && (

        <section
          style={sectionStyle}
        >

          <strong>
            ماده ۲۸ ـ تعیین نفقه
          </strong>

          <p
            style={{
              lineHeight: 2,
              marginBottom: 0
            }}
          >
            شامل تعیین نفقه جاریه
            زوجه و اقارب، نفقه معوقه،
            اجرت‌المثل، نحله،
            مهرالمثل و سایر موارد
            مشمول ماده ۲۸ است.
            دستمزد بر مبنای ماده ۱۱
            محاسبه می‌شود.
          </p>

        </section>

      )}


      {selectedField ===
        "MONETARY_CREDIT_INVESTMENT" && (

        <section
          style={sectionStyle}
        >

          <strong>
            ماده ۲۹ ـ سرمایه‌گذاری
            پولی و اعتباری
          </strong>

          <p
            style={{
              lineHeight: 2,
              marginBottom: 0
            }}
          >
            در این بخش، ارزیابی موضوع
            ماده ۲۹ محاسبه می‌شود و
            دستمزد آن مطابق ماده ۱۱
            است.
          </p>

        </section>

      )}


      {selectedField ===
        "INSURANCE" && (

        <section
          style={sectionStyle}
        >

          <strong>
            ماده ۲۹ ـ بیمه
          </strong>

          <p
            style={{
              lineHeight: 2,
              marginBottom: 0
            }}
          >
            در این بخش، ارزیابی موضوع
            ماده ۲۹ محاسبه می‌شود و
            دستمزد آن مطابق ماده ۱۱
            است.
          </p>

        </section>

      )}


      {/* ======================================================
          Amount
          ====================================================== */}

      {selectedField && (

        <section
          style={sectionStyle}
        >

          <h2
            style={{
              marginTop: 0
            }}
          >
            مبلغ مبنای محاسبه
          </h2>


          <MoneyInput
            id="financial-affairs-amount"
            label={getAmountLabel()}
            value={amountText}
            onChange={handleAmountChange}
            placeholder="مثال: 1,000,000,000"
          />


          {amountToman > 0 && (

            <div
              style={{
                marginTop: 10,
                fontSize: 14,
                opacity: 0.7
              }}
            >
              مبلغ واردشده:{" "}
              <strong>
                {formatToman(
                  amountToman
                )}
              </strong>{" "}
              تومان
            </div>

          )}

        </section>

      )}


      {/* ======================================================
          Mission
          ====================================================== */}

      {calculation && (

        <section
          style={sectionStyle}
        >

          <h2
            style={{
              marginTop: 0,
              marginBottom: 8
            }}
          >
            مأموریت
          </h2>


          <div
            style={{
              fontSize: 14,
              opacity: 0.7,
              marginBottom: 16
            }}
          >
            هزینه مأموریت پس از
            محاسبه حق‌الزحمه کارشناسی
            اضافه می‌شود و مشمول سقف
            ۱۳۵ میلیون تومان نیست.
          </div>


          <div
            style={{
              display: "grid",
              gap: 10
            }}
          >

            <button
              type="button"
              onClick={() =>
                selectMission(
                  "NONE"
                )
              }
              style={
                missionType ===
                "NONE"
                  ? selectedCardStyle
                  : cardStyle
              }
            >
              بدون مأموریت
            </button>


            <button
              type="button"
              onClick={() =>
                selectMission(
                  "IN_PROVINCE"
                )
              }
              style={
                missionType ===
                "IN_PROVINCE"
                  ? selectedCardStyle
                  : cardStyle
              }
            >
              مأموریت داخل استان
            </button>


            <button
              type="button"
              onClick={() =>
                selectMission(
                  "OUT_PROVINCE"
                )
              }
              style={
                missionType ===
                "OUT_PROVINCE"
                  ? selectedCardStyle
                  : cardStyle
              }
            >
              مأموریت خارج استان
            </button>

          </div>


          {missionType !==
            "NONE" && (

            <div
              style={{
                marginTop: 18
              }}
            >

              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 700
                }}
              >
                تعداد روز مأموریت
              </label>


              <input
                type="text"
                inputMode="numeric"
                value={
                  missionDaysText
                }
                onChange={(event) =>
                  handleMissionDaysChange(
                    event.target.value
                  )
                }
                style={inputStyle}
              />


              {missionDays < 1 && (

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14
                  }}
                >
                  تعداد روز مأموریت
                  باید حداقل یک روز
                  باشد.
                </div>

              )}

            </div>

          )}

        </section>

      )}


      {/* ======================================================
          Summary
          ====================================================== */}

      {calculation && (

        <section
          style={{
            ...sectionStyle,
            border:
              "2px solid #94a3b8"
          }}
        >

          <h2
            style={{
              marginTop: 0
            }}
          >
            خلاصه محاسبات
          </h2>


          <div
            style={summaryRowStyle}
          >
            <strong>
              گروه
            </strong>

            <span>
              امور مالی
            </span>
          </div>


          <div
            style={summaryRowStyle}
          >
            <strong>
              رشته
            </strong>

            <span>
              {
                calculation
                  .financialResult
                  .fieldTitle
              }
            </span>
          </div>


          <div
            style={summaryRowStyle}
          >
            <strong>
              ماده
            </strong>

            <span>
              {
                calculation
                  .financialResult
                  .articleNumber
              }
            </span>
          </div>


          <div
            style={summaryRowStyle}
          >
            <strong>
              موضوع
            </strong>

            <span>
              {
                calculation
                  .financialResult
                  .subjectTitle
              }
            </span>
          </div>


          <hr
            style={{
              border: 0,
              borderTop:
                "1px solid #e2e8f0",
              margin: "14px 0"
            }}
          />


          <div
            style={summaryRowStyle}
          >
            <strong>
              مبلغ مبنای محاسبه
            </strong>

            <span>
              {formatToman(
                amountToman
              )}{" "}
              تومان
            </span>
          </div>


          <div
            style={summaryRowStyle}
          >
            <strong>
              دستمزد طبق ماده ۱۱
            </strong>

            <span>
              {formatToman(
                calculation
                  .financialResult
                  .article11FeeToman
              )}{" "}
              تومان
            </span>
          </div>


          {calculation
            .financialResult
            .increaseRate > 0 && (

            <>

              <div
                style={summaryRowStyle}
              >
                <strong>
                  درصد افزایش
                </strong>

                <span>
                  {
                    calculation
                      .financialResult
                      .increaseRate *
                    100
                  }
                  ٪
                </span>
              </div>


              <div
                style={summaryRowStyle}
              >
                <strong>
                  مبلغ افزایش
                </strong>

                <span>
                  {formatToman(
                    calculation
                      .financialResult
                      .increaseFeeToman
                  )}{" "}
                  تومان
                </span>
              </div>


              <div
                style={summaryRowStyle}
              >
                <strong>
                  حاصل قبل از کنترل سقف
                </strong>

                <span>
                  {formatToman(
                    calculation
                      .financialResult
                      .feeBeforeLimitsToman
                  )}{" "}
                  تومان
                </span>
              </div>

            </>

          )}


          {calculation
            .financialResult
            .maximumApplied && (

            <div
              style={{
                marginTop: 12,
                marginBottom: 12,
                padding: 12,
                border:
                  "1px solid #cbd5e1",
                borderRadius: 8,
                background:
                  "#f8fafc",
                lineHeight: 1.9
              }}
            >
              حاصل محاسبه از سقف
              تعرفه عبور کرده است؛
              سقف نهایی
              ۱۳۵,۰۰۰,۰۰۰ تومان
              برای حق‌الزحمه کارشناسی
              اعمال شد.
            </div>

          )}


          <div
            style={{
              ...summaryRowStyle,
              marginTop: 8,
              fontSize: 18
            }}
          >
            <strong>
              حق‌الزحمه کارشناسی
            </strong>

            <strong>
              {formatToman(
                calculation
                  .finalFeeToman
              )}{" "}
              تومان
            </strong>
          </div>


          {/* ================================================
              Mission Summary
              ================================================ */}

          <hr
            style={{
              border: 0,
              borderTop:
                "1px solid #e2e8f0",
              margin: "18px 0"
            }}
          />


          <div
            style={summaryRowStyle}
          >
            <strong>
              مأموریت
            </strong>

            <span>
              {getMissionTitle()}
            </span>
          </div>


          {missionType !==
            "NONE" && (

            <>

              <div
                style={summaryRowStyle}
              >
                <strong>
                  تعداد روز مأموریت
                </strong>

                <span>
                  {missionDays}
                </span>
              </div>


              {missionCalculation && (

                <>

                  <div
                    style={summaryRowStyle}
                  >
                    <strong>
                      نرخ روزانه مأموریت
                    </strong>

                    <span>
                      {formatToman(
                        missionCalculation
                          .dailyMissionRateToman
                      )}{" "}
                      تومان
                    </span>
                  </div>


                  <div
                    style={summaryRowStyle}
                  >
                    <strong>
                      هزینه مأموریت
                    </strong>

                    <span>
                      {formatToman(
                        missionCalculation
                          .missionFeeToman
                      )}{" "}
                      تومان
                    </span>
                  </div>

                </>

              )}

            </>

          )}


          {/* ================================================
              Final Total
              ================================================ */}

          {missionCalculation && (

            <div
              style={{
                marginTop: 22,
                padding: 18,
                borderRadius: 12,
                background:
                  "#f1f5f9",
                border:
                  "2px solid #64748b"
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: 20,
                  flexWrap: "wrap"
                }}
              >

                <strong
                  style={{
                    fontSize: 19
                  }}
                >
                  جمع کل قابل پرداخت
                </strong>


                <strong
                  style={{
                    fontSize: 23
                  }}
                >
                  {formatToman(
                    missionCalculation
                      .totalPayableToman
                  )}{" "}
                  تومان
                </strong>

              </div>

            </div>

          )}

        </section>

      )}

    </main>

  );

}
