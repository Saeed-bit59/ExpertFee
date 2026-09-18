import {
  useMemo,
  useState
} from "react";

import {
  calculateArticle11Engine
} from "../engine/Article11Engine";

import {
  calculateArticle23
} from "../engine/movable-property/Article23Calculator";

import type {
  Article23Mode
} from "../engine/movable-property/Article23Types";

import {
  calculateMission,
  getMissionDailyRate
} from "../engine/MissionCalculator";

import type {
  MissionType
} from "../engine/MissionCalculator";
import MoneyInput from "../components/ui/MoneyInput";


interface MovablePropertyPageProps {
  onBack: () => void;
}


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
      .replace(/[^\d.]/g, "");


  if (normalized === "") {
    return 0;
  }


  const result =
    Number(normalized);


  return Number.isFinite(result)
    ? result
    : 0;
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


  const clean =
    normalized.replace(
      /^0+(?=\d)/,
      ""
    );


  return Number(clean)
    .toLocaleString("en-US");
}


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


export default function MovablePropertyPage({
  onBack
}: MovablePropertyPageProps) {


  const [
    mode,
    setMode
  ] =
    useState<Article23Mode>(
      "MOVABLE_PROPERTY"
    );


  const [
    evaluationValueText,
    setEvaluationValueText
  ] =
    useState("");


  const [
    committedValue,
    setCommittedValue
  ] =
    useState(0);


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
    useState(1);


  function commitValue(): void {

    setCommittedValue(
      parseFormattedNumber(
        evaluationValueText
      )
    );

  }


  const article11Result =
    useMemo(
      () => {

        if (
          committedValue <= 0
        ) {
          return null;
        }


        return calculateArticle11Engine({

          evaluationValueToman:
            committedValue,

          expertCount:
            1,

          panelFieldMode:
            "SINGLE_EXPERT",

          increaseRuleCode:
            null

        });

      },
      [
        committedValue
      ]
    );


  const article23Result =
    useMemo(
      () => {

        if (
          article11Result === null
        ) {
          return null;
        }


        return calculateArticle23({

          article11FeeToman:
            article11Result
              .feePerExpertToman,

          mode

        });

      },
      [
        article11Result,
        mode
      ]
    );


  const missionResult =
    useMemo(
      () => {

        if (
          article23Result === null
        ) {
          return null;
        }


        return calculateMission({

          expertFeeToman:
            article23Result
              .finalFeeToman,

          missionType,

          missionDays:
            missionType === "NONE"
              ? 0
              : missionDays

        });

      },
      [
        article23Result,
        missionType,
        missionDays
      ]
    );


  const dailyMissionRate =
    getMissionDailyRate(
      missionType
    );


  return (

    <main
      className="ef-legacy-page ef-specialist-page"
      dir="rtl"
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        fontFamily:
          "Tahoma, Arial, sans-serif",
        lineHeight: 1.8
      }}
    >

      <button
        className="ef-back-button ef-legacy-back-button"
        type="button"
        onClick={onBack}
        style={{
          padding: "9px 16px",
          border:
            "1px solid #cbd5e1",
          borderRadius: 8,
          background: "#ffffff",
          cursor: "pointer",
          fontFamily: "inherit",
          marginBottom: 24
        }}
      >
        ← بازگشت به صفحه اصلی
      </button>


      <div
        className="ef-interior-header"
        style={{
          marginBottom: 28
        }}
      >

        <h1>
          اموال منقول و لوازم خانگی
        </h1>

        <div
          style={{
            opacity: 0.7
          }}
        >
          گروه ۲ ـ اموال منقول
        </div>

        <div
          style={{
            opacity: 0.7
          }}
        >
          ماده ۲۳
        </div>

      </div>


      <section style={sectionStyle}>

        <h2>
          انتخاب موضوع کارشناسی
        </h2>


        <button
          type="button"
          onClick={() =>
            setMode(
              "MOVABLE_PROPERTY"
            )
          }
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            border:
              mode ===
              "MOVABLE_PROPERTY"
                ? "2px solid #334155"
                : "1px solid #d8dee6",
            borderRadius: 10,
            background:
              mode ===
              "MOVABLE_PROPERTY"
                ? "#f1f5f9"
                : "#ffffff",
            textAlign: "right",
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >

          <strong>
            اموال منقول
          </strong>

          <div
            style={{
              marginTop: 6,
              opacity: 0.7
            }}
          >
            آثار هنری و اشیاء نفیسه و کتب خطی،
            اشیاء عتیقه و احجار کریمه،
            ساعت و جواهرات و فرش
          </div>

        </button>


        <button
          type="button"
          onClick={() =>
            setMode(
              "HOUSEHOLD_OFFICE"
            )
          }
          style={{
            width: "100%",
            padding: 16,
            border:
              mode ===
              "HOUSEHOLD_OFFICE"
                ? "2px solid #334155"
                : "1px solid #d8dee6",
            borderRadius: 10,
            background:
              mode ===
              "HOUSEHOLD_OFFICE"
                ? "#f1f5f9"
                : "#ffffff",
            textAlign: "right",
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >

          <strong>
            لوازم خانگی و اداری
          </strong>

          <div
            style={{
              marginTop: 6,
              opacity: 0.7
            }}
          >
            دستمزد ماده ۱۱ با افزایش ۲۰ درصد
          </div>

        </button>

      </section>


      <section style={sectionStyle}>

        <h2>
          ارزش مورد ارزیابی
        </h2>


        <MoneyInput
          id="movable-property-evaluation-value"
          label="ارزش مورد ارزیابی"
          value={evaluationValueText}
          onChange={(value) => setEvaluationValueText(value)}
          onBlur={commitValue}
          onKeyDown={(event) => {
            if (
              event.key === "Enter"
            ) {
              commitValue();
              event.currentTarget
                .blur();
            }
          }}
        />

      </section>


      {article23Result !== null && (

        <section style={sectionStyle}>

          <h2>
            نتیجه محاسبه
          </h2>


          {mode ===
            "HOUSEHOLD_OFFICE" && (

            <>

              <SummaryRow
                title="افزایش ۲۰٪"
                value={
                  article23Result
                    .increaseFeeToman
                }
              />


              {article23Result
                .maximumApplied && (

                <div
                  style={{
                    marginTop: 12
                  }}
                >
                  سقف نهایی
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
              marginTop: 18,
              paddingTop: 18,
              borderTop:
                "2px solid #334155",
              display: "flex",
              justifyContent:
                "space-between",
              fontSize: 20
            }}
          >

            <strong>
              حق‌الزحمه کارشناسی:
            </strong>

            <strong>
              {formatNumber(
                article23Result
                  .finalFeeToman
              )}
              {" "}
              تومان
            </strong>

          </div>

        </section>

      )}


      {article23Result !== null && (

        <section style={sectionStyle}>

          <h2>
            مأموریت کارشناسی
          </h2>


          {[
            [
              "NONE",
              "بدون مأموریت"
            ],
            [
              "IN_PROVINCE",
              "مأموریت داخل استان"
            ],
            [
              "OUT_PROVINCE",
              "مأموریت خارج استان"
            ]
          ].map(
            ([value, label]) => (

              <label
                key={value}
                style={{
                  display: "block",
                  marginBottom: 10
                }}
              >

                <input
                  type="radio"
                  name="article23Mission"
                  checked={
                    missionType ===
                    value
                  }
                  onChange={() =>
                    setMissionType(
                      value as
                        MissionType
                    )
                  }
                />

                {" "}
                {label}

              </label>

            )
          )}


          {missionType !== "NONE" && (

            <>

              <label>
                تعداد روز مأموریت
              </label>

              <input
                type="number"
                min={1}
                value={missionDays}
                onChange={(event) => {

                  setMissionDays(
                    Math.max(
                      1,
                      Math.floor(
                        Number(
                          event.target.value
                        ) || 1
                      )
                    )
                  );

                }}
                style={{
                  ...inputStyle,
                  maxWidth: 180,
                  marginTop: 8
                }}
              />


              <div
                style={{
                  marginTop: 10
                }}
              >
                فوق‌العاده روزانه:
                {" "}
                <strong>
                  {formatNumber(
                    dailyMissionRate
                  )}
                  {" "}
                  تومان
                </strong>
              </div>

            </>

          )}

        </section>

      )}


      {article23Result !== null &&
        missionResult !== null && (

        <section
          style={{
            ...sectionStyle,
            border:
              "2px solid #334155"
          }}
        >

          <h2>
            خلاصه محاسبات
          </h2>


          <div>
            موضوع:
            {" "}
            <strong>
              {article23Result.title}
            </strong>
          </div>


          <SummaryRow
            title="ارزش مورد ارزیابی"
            value={committedValue}
          />


          {mode ===
            "HOUSEHOLD_OFFICE" && (

            <SummaryRow
              title="افزایش ۲۰٪"
              value={
                article23Result
                  .increaseFeeToman
              }
            />

          )}


          <SummaryRow
            title="حق‌الزحمه کارشناسی"
            value={
              article23Result
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
              marginTop: 18,
              paddingTop: 18,
              borderTop:
                "2px solid #334155",
              display: "flex",
              justifyContent:
                "space-between",
              fontSize: 20
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

        </section>

      )}

    </main>

  );
}


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
        display: "flex",
        justifyContent:
          "space-between",
        gap: 20,
        marginTop: 10
      }}
    >

      <span>
        {title}:
      </span>

      <strong>
        {formatNumber(value)}
        {" "}
        تومان
      </strong>

    </div>

  );
}
