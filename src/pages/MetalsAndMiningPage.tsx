import {
  useMemo,
  useState
} from "react";

import {
  calculateArticle11Engine
} from "../engine/Article11Engine";

import {
  calculateArticle22Metal,
  calculateArticle22Mining
} from "../engine/mining/Article22Calculator";

import type {
  MiningOperationType
} from "../engine/mining/Article22Types";

import {
  calculateMission,
  getMissionDailyRate
} from "../engine/MissionCalculator";

import type {
  MissionType
} from "../engine/MissionCalculator";


type Article22Mode =
  | "METAL"
  | "MINING";


interface MetalsAndMiningPageProps {
  onBack: () => void;
}


/*
 * ============================================================
 * Helpers
 * ============================================================
 */

function formatNumber(
  value: number
): string {

  if (!Number.isFinite(value)) {
    return "0";
  }

  return Math.round(value)
    .toLocaleString("en-US");
}


function normalizeDigits(
  value: string
): string {

  return value
    .replace(/۰/g, "0")
    .replace(/۱/g, "1")
    .replace(/۲/g, "2")
    .replace(/۳/g, "3")
    .replace(/۴/g, "4")
    .replace(/۵/g, "5")
    .replace(/۶/g, "6")
    .replace(/۷/g, "7")
    .replace(/۸/g, "8")
    .replace(/۹/g, "9")
    .replace(/٠/g, "0")
    .replace(/١/g, "1")
    .replace(/٢/g, "2")
    .replace(/٣/g, "3")
    .replace(/٤/g, "4")
    .replace(/٥/g, "5")
    .replace(/٦/g, "6")
    .replace(/٧/g, "7")
    .replace(/٨/g, "8")
    .replace(/٩/g, "9");
}


function parseFormattedNumber(
  value: string
): number {

  const normalized =
    normalizeDigits(value)
      .replace(/,/g, "")
      .replace(/[^\d]/g, "");


  if (normalized === "") {
    return 0;
  }


  const result =
    Number(normalized);


  if (
    !Number.isFinite(result) ||
    result < 0
  ) {
    return 0;
  }


  return result;
}


function formatInputNumber(
  value: string
): string {

  const normalized =
    normalizeDigits(value)
      .replace(/,/g, "")
      .replace(/[^\d]/g, "");


  if (normalized === "") {
    return "";
  }


  /*
   * حذف صفرهای اضافه ابتدای عدد
   */

  const clean =
    normalized.replace(
      /^0+(?=\d)/,
      ""
    );


  const numericValue =
    Number(clean);


  if (!Number.isFinite(numericValue)) {
    return "";
  }


  return numericValue
    .toLocaleString("en-US");
}


/*
 * ============================================================
 * Styles
 * ============================================================
 */

const sectionStyle = {

  border:
    "1px solid #d8dee6",

  borderRadius:
    14,

  padding:
    20,

  marginBottom:
    20,

  background:
    "#ffffff"

};


const inputStyle = {

  width:
    "100%",

  boxSizing:
    "border-box" as const,

  padding:
    12,

  border:
    "1px solid #bbb",

  borderRadius:
    8,

  fontSize:
    18,

  fontFamily:
    "inherit",

  direction:
    "ltr" as const,

  textAlign:
    "left" as const

};


/*
 * ============================================================
 * Main Component
 * ============================================================
 */

export default function MetalsAndMiningPage({
  onBack
}: MetalsAndMiningPageProps) {


  const [
    mode,
    setMode
  ] =
    useState<Article22Mode>(
      "METAL"
    );


  /*
   * مبلغ ورودی به تومان
   */

  const [
    evaluationValueText,
    setEvaluationValueText
  ] =
    useState<string>(
      ""
    );


  /*
   * برای جلوگیری از نمایش نتیجه
   * هنگام تایپ عدد ناقص
   *
   * نتیجه پس از خروج از Input
   * یا Enter فعال می‌شود.
   */

  const [
    committedEvaluationValue,
    setCommittedEvaluationValue
  ] =
    useState<number>(
      0
    );


  const [
    isUnderground,
    setIsUnderground
  ] =
    useState<boolean>(
      false
    );


  const [
    missionType,
    setMissionType
  ] =
    useState<MissionType>(
      "NONE"
    );


  const [
    missionDays,
    setMissionDays
  ] =
    useState<number>(
      1
    );


  /*
   * ==========================================================
   * Commit Evaluation Value
   * ==========================================================
   */

  function commitEvaluationValue(): void {

    const value =
      parseFormattedNumber(
        evaluationValueText
      );


    setCommittedEvaluationValue(
      value
    );

  }


  /*
   * ==========================================================
   * Article 11 Engine
   *
   * مهم:
   * ورودی Engine بر حسب تومان است.
   * ==========================================================
   */

  const article11Result =
    useMemo(
      () => {

        if (
          committedEvaluationValue <= 0
        ) {
          return null;
        }


        return calculateArticle11Engine({

          evaluationValueToman:
            committedEvaluationValue,

          expertCount:
            1,

          panelFieldMode:
            "SINGLE_EXPERT",

          increaseRuleCode:
            null

        });

      },
      [
        committedEvaluationValue
      ]
    );


  /*
   * ==========================================================
   * Article 22
   * ==========================================================
   */

  const article22Result =
    useMemo(
      () => {

        if (
          article11Result === null
        ) {
          return null;
        }


        /*
         * دستمزد نهایی ماده 11
         * برای یک کارشناس
         */

        const article11FeeToman =
          article11Result
            .feePerExpertToman;


        /*
         * فلزات
         */

        if (
          mode === "METAL"
        ) {

          return calculateArticle22Metal({

            article11FeeToman

          });

        }


        /*
         * معادن
         */

        const operationType:
          MiningOperationType =
            isUnderground
              ? "UNDERGROUND"
              : "SURFACE";


        return calculateArticle22Mining({

          article11FeeToman,

          operationType

        });

      },
      [
        article11Result,
        mode,
        isUnderground
      ]
    );


  /*
   * ==========================================================
   * Mission
   * ==========================================================
   */

  const missionResult =
    useMemo(
      () => {

        if (
          article22Result === null
        ) {
          return null;
        }


        if (
          missionType === "NONE"
        ) {

          return calculateMission({

            expertFeeToman:
              article22Result
                .finalFeeToman,

            missionType:
              "NONE",

            missionDays:
              0

          });

        }


        return calculateMission({

          expertFeeToman:
            article22Result
              .finalFeeToman,

          missionType,

          missionDays

        });

      },
      [
        article22Result,
        missionType,
        missionDays
      ]
    );


  const dailyMissionRate =
    useMemo(
      () => {

        return getMissionDailyRate(
          missionType
        );

      },
      [
        missionType
      ]
    );


  /*
   * ==========================================================
   * UI
   * ==========================================================
   */

  return (

    <main
      dir="rtl"
      style={{
        maxWidth: 900,
        minHeight: "70vh",
        margin: "0 auto",
        padding: 24,
        fontFamily:
          "Tahoma, Arial, sans-serif",
        lineHeight: 1.8
      }}
    >


      {/* Back */}

      <button
        type="button"
        onClick={onBack}
        style={{
          padding:
            "9px 16px",

          border:
            "1px solid #cbd5e1",

          borderRadius:
            8,

          background:
            "#ffffff",

          cursor:
            "pointer",

          fontFamily:
            "inherit",

          marginBottom:
            24
        }}
      >
        ← بازگشت به صفحه اصلی
      </button>


      {/* Header */}

      <div
        style={{
          marginBottom:
            28
        }}
      >

        <h1
          style={{
            marginBottom:
              6
          }}
        >
          فلزات و معادن
        </h1>


        <div
          style={{
            opacity:
              0.7
          }}
        >
          فصل دوم ـ تعرفه دستمزد کارشناسی
        </div>


        <div
          style={{
            opacity:
              0.7
          }}
        >
          ماده ۲۲
        </div>

      </div>


      {/* Service */}

      <section
        style={
          sectionStyle
        }
      >

        <h2
          style={{
            marginTop:
              0
          }}
        >
          انتخاب موضوع کارشناسی
        </h2>


        <div
          style={{
            display:
              "grid",

            gap:
              12
          }}
        >

          <button
            type="button"
            onClick={() => {

              setMode(
                "METAL"
              );

            }}
            style={{
              padding:
                16,

              border:
                mode === "METAL"
                  ? "2px solid #334155"
                  : "1px solid #d8dee6",

              borderRadius:
                10,

              background:
                mode === "METAL"
                  ? "#f1f5f9"
                  : "#ffffff",

              cursor:
                "pointer",

              textAlign:
                "right",

              fontFamily:
                "inherit"
            }}
          >

            <strong>
              ارزیابی در رشته فلزات
            </strong>


            <div
              style={{
                marginTop:
                  4,

                opacity:
                  0.7
              }}
            >
              ماده ۲۲ ـ بند ۱
            </div>

          </button>


          <button
            type="button"
            onClick={() => {

              setMode(
                "MINING"
              );

            }}
            style={{
              padding:
                16,

              border:
                mode === "MINING"
                  ? "2px solid #334155"
                  : "1px solid #d8dee6",

              borderRadius:
                10,

              background:
                mode === "MINING"
                  ? "#f1f5f9"
                  : "#ffffff",

              cursor:
                "pointer",

              textAlign:
                "right",

              fontFamily:
                "inherit"
            }}
          >

            <strong>
              ارزیابی ذخایر معدنی
            </strong>


            <div
              style={{
                marginTop:
                  4,

                opacity:
                  0.7
              }}
            >
              ماده ۲۲ ـ بند ۲
            </div>

          </button>

        </div>

      </section>


      {/* Evaluation Value */}

      <section
        style={
          sectionStyle
        }
      >

        <h2
          style={{
            marginTop:
              0
          }}
        >
          ارزش مورد ارزیابی
        </h2>


        <label
          style={{
            display:
              "block",

            fontWeight:
              700,

            marginBottom:
              8
          }}
        >
          ارزش مورد ارزیابی ـ تومان
        </label>


        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="مثال: 12,000,000,000"
          value={
            evaluationValueText
          }
          onChange={(event) => {

            /*
             * هنگام تایپ فقط عدد را
             * Format می‌کنیم.
             *
             * محاسبه انجام نمی‌شود.
             */

            setEvaluationValueText(

              formatInputNumber(
                event.target.value
              )

            );

          }}
          onBlur={() => {

            commitEvaluationValue();

          }}
          onKeyDown={(event) => {

            if (
              event.key === "Enter"
            ) {

              commitEvaluationValue();

              event.currentTarget
                .blur();

            }

          }}
          style={
            inputStyle
          }
        />


        <div
          style={{
            marginTop:
              10,

            fontSize:
              14,

            opacity:
              0.65
          }}
        >
          مبلغ را به تومان وارد کنید.
          محاسبه پس از تکمیل ورود مبلغ انجام می‌شود.
        </div>

      </section>


      {/* Underground */}

      {mode === "MINING" && (

        <section
          style={
            sectionStyle
          }
        >

          <h2
            style={{
              marginTop:
                0
            }}
          >
            وضعیت معدن
          </h2>


          <label
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                10,

              cursor:
                "pointer"
            }}
          >

            <input
              type="checkbox"
              checked={
                isUnderground
              }
              onChange={(event) => {

                setIsUnderground(
                  event.target.checked
                );

              }}
            />


            <strong>
              معدن زیرزمینی
            </strong>

          </label>


          <div
            style={{
              marginTop:
                8,

              fontSize:
                14,

              opacity:
                0.7
            }}
          >
            در معادن زیرزمینی ۳۵٪ به تعرفه
            مربوط اضافه می‌شود. سقف نهایی
            ۱۱۸,۰۰۰,۰۰۰ تومان رعایت می‌شود.
          </div>

        </section>

      )}


      {/* Result */}

      {article22Result !== null && (

        <section
          style={
            sectionStyle
          }
        >

          <h2
            style={{
              marginTop:
                0
            }}
          >
            نتیجه محاسبه
          </h2>


          {mode === "METAL" && (

            <>

              <div
                style={{
                  marginBottom:
                    14
                }}
              >
                حداقل دستمزد:
                {" "}

                <strong>
                  2,000,000 تومان
                </strong>
              </div>


              <div
                style={{
                  marginBottom:
                    14
                }}
              >
                حداکثر دستمزد:
                {" "}

                <strong>
                  5,000,000 تومان
                </strong>
              </div>


              {"minimumApplied"
                in article22Result &&
                article22Result
                  .minimumApplied && (

                <div
                  style={{
                    marginBottom:
                      14
                  }}
                >
                  دستمزد محاسبه‌شده کمتر از
                  حداقل مقرر ماده ۲۲ است؛
                  حداقل دستمزد اعمال شد.
                </div>

              )}


              {"maximumApplied"
                in article22Result &&
                article22Result
                  .maximumApplied && (

                <div
                  style={{
                    marginBottom:
                      14
                  }}
                >
                  دستمزد محاسبه‌شده بیشتر از
                  حداکثر مقرر ماده ۲۲ است؛
                  حداکثر دستمزد اعمال شد.
                </div>

              )}


              {"minimumApplied"
                in article22Result &&
                "maximumApplied"
                in article22Result &&
                !article22Result
                  .minimumApplied &&
                !article22Result
                  .maximumApplied && (

                <div
                  style={{
                    marginBottom:
                      14
                  }}
                >
                  دستمزد محاسبه‌شده بین حداقل
                  و حداکثر مقرر ماده ۲۲ قرار دارد
                  و مبلغ دقیق محاسبه اعمال شده است.
                </div>

              )}

            </>

          )}


          {mode === "MINING" &&
            "undergroundIncreaseFeeToman"
              in article22Result && (

            <>

              {isUnderground && (

                <SummaryRow
                  title="افزایش ۳۵٪ معدن زیرزمینی"
                  value={
                    article22Result
                      .undergroundIncreaseFeeToman
                  }
                />

              )}


              {article22Result
                .maximumApplied && (

                <div
                  style={{
                    marginTop:
                      12,

                    marginBottom:
                      12
                  }}
                >
                  مبلغ محاسبه‌شده از سقف
                  تعرفه بیشتر است؛ سقف
                  {" "}

                  <strong>
                    118,000,000 تومان
                  </strong>

                  {" "}
                  اعمال شده است.
                </div>

              )}

            </>

          )}


          <div
            style={{
              marginTop:
                18,

              paddingTop:
                18,

              borderTop:
                "2px solid #334155",

              display:
                "flex",

              justifyContent:
                "space-between",

              gap:
                20,

              fontSize:
                20
            }}
          >

            <strong>
              حق‌الزحمه کارشناسی:
            </strong>


            <strong>
              {formatNumber(
                article22Result
                  .finalFeeToman
              )}
              {" "}
              تومان
            </strong>

          </div>

        </section>

      )}


      {/* Mission */}

      {article22Result !== null && (

        <section
          style={
            sectionStyle
          }
        >

          <h2
            style={{
              marginTop:
                0
            }}
          >
            مأموریت کارشناسی
          </h2>


          <label
            style={{
              display:
                "block",

              marginBottom:
                10
            }}
          >

            <input
              type="radio"
              name="article22Mission"
              checked={
                missionType ===
                "NONE"
              }
              onChange={() => {

                setMissionType(
                  "NONE"
                );

              }}
            />

            {" "}
            بدون مأموریت

          </label>


          <label
            style={{
              display:
                "block",

              marginBottom:
                10
            }}
          >

            <input
              type="radio"
              name="article22Mission"
              checked={
                missionType ===
                "IN_PROVINCE"
              }
              onChange={() => {

                setMissionType(
                  "IN_PROVINCE"
                );

              }}
            />

            {" "}
            مأموریت داخل استان

          </label>


          <label
            style={{
              display:
                "block",

              marginBottom:
                10
            }}
          >

            <input
              type="radio"
              name="article22Mission"
              checked={
                missionType ===
                "OUT_PROVINCE"
              }
              onChange={() => {

                setMissionType(
                  "OUT_PROVINCE"
                );

              }}
            />

            {" "}
            مأموریت خارج استان

          </label>


          {missionType !== "NONE" && (

            <div
              style={{
                marginTop:
                  18
              }}
            >

              <label
                style={{
                  display:
                    "block",

                  fontWeight:
                    700,

                  marginBottom:
                    8
                }}
              >
                تعداد روز مأموریت
              </label>


              <input
                type="number"
                min={1}
                step={1}
                value={
                  missionDays
                }
                onChange={(event) => {

                  const value =
                    Number(
                      event.target.value
                    );


                  setMissionDays(

                    Math.max(
                      1,
                      Math.floor(
                        value || 1
                      )
                    )

                  );

                }}
                style={{
                  ...inputStyle,

                  maxWidth:
                    180
                }}
              />


              <div
                style={{
                  marginTop:
                    10
                }}
              >
                فوق‌العاده روزانه مأموریت:
                {" "}

                <strong>
                  {formatNumber(
                    dailyMissionRate
                  )}
                  {" "}
                  تومان
                </strong>
              </div>

            </div>

          )}

        </section>

      )}


      {/* Summary */}

      {article22Result !== null &&
        missionResult !== null && (

        <section
          style={{
            ...sectionStyle,

            border:
              "2px solid #334155"
          }}
        >

          <h2
            style={{
              marginTop:
                0
            }}
          >
            خلاصه محاسبات
          </h2>


          <div>
            رشته:
            {" "}

            <strong>
              فلزات و معادن
            </strong>
          </div>


          <div>
            موضوع:
            {" "}

            <strong>

              {mode === "METAL"
                ? "ارزیابی در رشته فلزات"
                : "ارزیابی ذخایر معدنی"}

            </strong>
          </div>


          {mode === "MINING" && (

            <div>
              وضعیت معدن:
              {" "}

              <strong>

                {isUnderground
                  ? "زیرزمینی"
                  : "عادی"}

              </strong>
            </div>

          )}


          <div
            style={{
              marginTop:
                14,

              paddingTop:
                14,

              borderTop:
                "1px solid #ddd"
            }}
          >

            <SummaryRow
              title="ارزش مورد ارزیابی"
              value={
                committedEvaluationValue
              }
            />


            {mode === "MINING" &&
              isUnderground &&
              "undergroundIncreaseFeeToman"
                in article22Result && (

              <SummaryRow
                title="افزایش ۳۵٪ معدن زیرزمینی"
                value={
                  article22Result
                    .undergroundIncreaseFeeToman
                }
              />

            )}


            <SummaryRow
              title="حق‌الزحمه کارشناسی"
              value={
                article22Result
                  .finalFeeToman
              }
            />


            <SummaryRow
              title="فوق‌العاده مأموریت"
              value={
                missionResult
                  .missionFeeToman
              }
            />


            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                gap:
                  20,

                marginTop:
                  18,

                paddingTop:
                  18,

                borderTop:
                  "2px solid #334155",

                fontSize:
                  20
              }}
            >

              <strong>
                مبلغ نهایی قابل پرداخت:
              </strong>


              <strong>
                {formatNumber(
                  missionResult
                    .totalPayableToman
                )}
                {" "}
                تومان
              </strong>

            </div>

          </div>

        </section>

      )}

    </main>

  );
}


/*
 * ============================================================
 * Summary Row
 * ============================================================
 */

function SummaryRow({
  title,
  value
}: {
  title: string;
  value: number;
}) {

  return (

    <div
      style={{
        display:
          "flex",

        justifyContent:
          "space-between",

        gap:
          20,

        marginBottom:
          8
      }}
    >

      <span>
        {title}:
      </span>


      <strong>
        {formatNumber(
          value
        )}
        {" "}
        تومان
      </strong>

    </div>

  );
}