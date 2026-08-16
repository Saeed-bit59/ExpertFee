import { useMemo, useState } from "react";

import {
  calculateArticle15,
  calculateWaterFixedFee,
  calculateArticle20
} from "../engine/water/WaterEngineeringCalculator";

import type {
  Article20Mode,
  WaterFixedFeeArticle
} from "../engine/water/WaterEngineeringCalculator";

import {
  calculateMission,
  getMissionDailyRate
} from "../engine/MissionCalculator";

import type {
  MissionType
} from "../engine/MissionCalculator";


type WaterArticle =
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21;


interface WaterEngineeringPageProps {
  onBack: () => void;
  onOpenArticle11: () => void;
}


function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}


function getArticleTitle(article: WaterArticle): string {
  switch (article) {
    case 15:
      return "اندازه‌گیری آب و حقابه‌ها";

    case 16:
      return "تعیین کیفیت شیمیایی و آلودگی آب";

    case 17:
      return "بررسی فنی و تعیین مشخصات سفره‌های آب";

    case 18:
      return "ارزیابی قنوات، چاه‌ها و شبکه‌های آب و فاضلاب";

    case 19:
      return "حفاری چاه‌ها، قنوات و بهسازی چشمه‌ها";

    case 20:
      return "حریم و بستر رودخانه‌ها، کانال‌ها و انهار";

    case 21:
      return "رسیدگی به وضع پس‌آب‌ها";
  }
}


const sectionStyle = {
  border: "1px solid #d8dee6",
  borderRadius: 14,
  padding: 20,
  marginBottom: 20,
  background: "#ffffff"
};


const inputStyle = {
  width: 180,
  padding: 10,
  border: "1px solid #bbb",
  borderRadius: 8,
  fontSize: 16
};


export default function WaterEngineeringPage({
  onBack,
  onOpenArticle11
}: WaterEngineeringPageProps) {

  const [selectedArticle, setSelectedArticle] =
    useState<WaterArticle>(15);

  const [flowRateLps, setFlowRateLps] =
    useState<number>(50);

  const [article20Mode, setArticle20Mode] =
    useState<Article20Mode>("CHANNEL_UP_TO_12M");

  const [lengthKm, setLengthKm] =
    useState<number>(1);

  const [missionType, setMissionType] =
    useState<MissionType>("NONE");

  const [missionDays, setMissionDays] =
    useState<number>(1);


  const expertFeeToman = useMemo(() => {

    if (selectedArticle === 15) {
      return calculateArticle15({
        flowRateLps
      }).finalFeeToman;
    }


    if (
      selectedArticle === 16 ||
      selectedArticle === 17 ||
      selectedArticle === 19 ||
      selectedArticle === 21
    ) {
      return calculateWaterFixedFee(
        selectedArticle
      ).finalFeeToman;
    }


    if (selectedArticle === 20) {

      if (
        article20Mode === "WATER_RIGHT" ||
        article20Mode === "WATER_SOURCE_AGE"
      ) {
        return calculateArticle20({
          mode: article20Mode
        }).finalFeeToman;
      }


      return calculateArticle20({
        mode: article20Mode,
        lengthKm
      }).finalFeeToman;
    }


    // ماده ۱۸ مطابق ماده ۱۱ محاسبه می‌شود.
    return 0;

  }, [
    selectedArticle,
    flowRateLps,
    article20Mode,
    lengthKm
  ]);


  const missionResult = useMemo(() => {

    if (selectedArticle === 18) {
      return null;
    }


    if (missionType === "NONE") {
      return calculateMission({
        expertFeeToman,
        missionType: "NONE",
        missionDays: 0
      });
    }


    return calculateMission({
      expertFeeToman,
      missionType,
      missionDays
    });

  }, [
    expertFeeToman,
    missionType,
    missionDays,
    selectedArticle
  ]);


  const dailyMissionRate = useMemo(() => {
    return getMissionDailyRate(
      missionType
    );
  }, [missionType]);


  function articleButtonStyle(
    article: WaterArticle
  ) {
    return {
      width: "100%",
      padding: "14px 16px",

      border:
        selectedArticle === article
          ? "2px solid #334155"
          : "1px solid #d8dee6",

      borderRadius: 10,

      background:
        selectedArticle === article
          ? "#f1f5f9"
          : "#ffffff",

      cursor: "pointer",
      textAlign: "right" as const,
      fontFamily: "inherit"
    };
  }


  return (
    <main
      dir="rtl"
      style={{
        maxWidth: 900,
        minHeight: "70vh",
        margin: "0 auto",
        padding: 24,
        fontFamily: "Tahoma, Arial, sans-serif",
        lineHeight: 1.8
      }}
    >

      <button
        type="button"
        onClick={onBack}
        style={{
          padding: "9px 16px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
          background: "#ffffff",
          cursor: "pointer",
          fontFamily: "inherit",
          marginBottom: 24
        }}
      >
        ← بازگشت به صفحه اصلی
      </button>


      <div style={{ marginBottom: 28 }}>

        <h1 style={{ marginBottom: 6 }}>
          مهندسی آب
        </h1>

        <div style={{ opacity: 0.7 }}>
          فصل دوم ـ تعرفه دستمزد کارشناسی
        </div>

        <div style={{ opacity: 0.7 }}>
          گروه ۱ ـ مهندسی آب و معادن
        </div>

        <div style={{ opacity: 0.7 }}>
          رشته مهندسی آب
        </div>

      </div>


      {/* انتخاب ماده */}

      <section style={sectionStyle}>

        <h2 style={{ marginTop: 0 }}>
          انتخاب موضوع کارشناسی
        </h2>

        <div
          style={{
            display: "grid",
            gap: 10
          }}
        >

          {(
            [
              15,
              16,
              17,
              18,
              19,
              20,
              21
            ] as WaterArticle[]
          ).map((article) => (

            <button
              key={article}
              type="button"
              onClick={() => {
                setSelectedArticle(article);
              }}
              style={articleButtonStyle(article)}
            >
              <strong>
                ماده {article}
              </strong>

              {" — "}

              {getArticleTitle(article)}
            </button>

          ))}

        </div>

      </section>


      {/* ماده ۱۵ */}

      {selectedArticle === 15 && (

        <section style={sectionStyle}>

          <h2 style={{ marginTop: 0 }}>
            ماده ۱۵ ـ اندازه‌گیری آب و حقابه‌ها
          </h2>

          <label
            style={{
              display: "block",
              fontWeight: 700,
              marginBottom: 8
            }}
          >
            میزان آب
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >

            <input
              type="number"
              min={0.01}
              step="any"
              value={flowRateLps}
              onChange={(event) => {

                const value =
                  Number(event.target.value);

                setFlowRateLps(
                  value > 0
                    ? value
                    : 0.01
                );

              }}
              style={inputStyle}
            />

            <span>
              لیتر در ثانیه
            </span>

          </div>

          <Article15Details
            flowRateLps={flowRateLps}
          />

        </section>

      )}


      {/* ماده ۱۶ */}

      {selectedArticle === 16 && (
        <FixedArticlePanel
          article={16}
        />
      )}


      {/* ماده ۱۷ */}

      {selectedArticle === 17 && (
        <>

          <FixedArticlePanel
            article={17}
          />

          <section style={sectionStyle}>

            <strong>
              تبصره ماده ۱۷
            </strong>

            <div style={{ marginTop: 8 }}>
              در صورتی که انجام کارشناسی مستلزم
              عملیات نقشه‌برداری باشد، دستمزد آن
              طبق تعرفه مربوط پرداخت خواهد شد.
            </div>

          </section>

        </>
      )}


      {/* ماده ۱۸ */}

      {selectedArticle === 18 && (

        <section style={sectionStyle}>

          <h2 style={{ marginTop: 0 }}>
            ماده ۱۸
          </h2>

          <p>
            دستمزد ارزیابی قنوات، چاه‌ها و منصوبات
            آن، شبکه‌های آبیاری و زهکشی آب و فاضلاب
            مطابق ماده ۱۱ این تعرفه محاسبه می‌شود.
          </p>

          <button
            type="button"
            onClick={onOpenArticle11}
            style={{
              padding: "12px 18px",
              border: "1px solid #334155",
              borderRadius: 8,
              background: "#334155",
              color: "#ffffff",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 700
            }}
          >
            محاسبه مطابق ماده ۱۱
          </button>

        </section>

      )}


      {/* ماده ۱۹ */}

      {selectedArticle === 19 && (
        <FixedArticlePanel
          article={19}
        />
      )}


      {/* ماده ۲۰ */}

      {selectedArticle === 20 && (

        <section style={sectionStyle}>

          <h2 style={{ marginTop: 0 }}>
            ماده ۲۰ ـ حریم و بستر رودخانه‌ها،
            کانال‌ها و انهار
          </h2>


          <label
            style={{
              display: "block",
              fontWeight: 700,
              marginBottom: 8
            }}
          >
            نوع کارشناسی
          </label>


          <select
            value={article20Mode}
            onChange={(event) => {

              const value =
                event.target.value as Article20Mode;

              setArticle20Mode(value);

            }}
            style={{
              width: "100%",
              maxWidth: 520,
              padding: 10,
              border: "1px solid #bbb",
              borderRadius: 8,
              fontFamily: "inherit",
              fontSize: 15
            }}
          >

            <option value="CHANNEL_UP_TO_12M">
              تعیین حریم کانال‌ها و انهار تا عرض بستر ۱۲ متر
            </option>

            <option value="RIVER_OR_CHANNEL_OVER_12M">
              تعیین حریم رودخانه و کانال‌های با عرض بیش از ۱۲ متر
            </option>

            <option value="WATER_RIGHT">
              تعیین میزان حقابه هر فرد از منابع آبی
            </option>

            <option value="WATER_SOURCE_AGE">
              تعیین قدمت منابع آبی
            </option>

          </select>


          {(
            article20Mode === "CHANNEL_UP_TO_12M" ||
            article20Mode === "RIVER_OR_CHANNEL_OVER_12M"
          ) && (

            <div style={{ marginTop: 20 }}>

              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: 8
                }}
              >
                طول مورد رسیدگی
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >

                <input
                  type="number"
                  min={0}
                  step="any"
                  value={lengthKm}
                  onChange={(event) => {

                    const value =
                      Number(event.target.value);

                    setLengthKm(
                      Math.max(
                        0,
                        value || 0
                      )
                    );

                  }}
                  style={inputStyle}
                />

                <span>
                  کیلومتر
                </span>

              </div>

            </div>

          )}


          <Article20Details
            mode={article20Mode}
            lengthKm={lengthKm}
          />

        </section>

      )}


      {/* ماده ۲۱ */}

      {selectedArticle === 21 && (
        <FixedArticlePanel
          article={21}
        />
      )}


      {/* مأموریت */}

      {selectedArticle !== 18 && (

        <section style={sectionStyle}>

          <h2 style={{ marginTop: 0 }}>
            مأموریت کارشناسی
          </h2>


          <label
            style={{
              display: "block",
              marginBottom: 10
            }}
          >

            <input
              type="radio"
              name="waterMission"
              checked={missionType === "NONE"}
              onChange={() => {
                setMissionType("NONE");
              }}
            />

            {" "}
            بدون مأموریت

          </label>


          <label
            style={{
              display: "block",
              marginBottom: 10
            }}
          >

            <input
              type="radio"
              name="waterMission"
              checked={
                missionType === "IN_PROVINCE"
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
              display: "block",
              marginBottom: 10
            }}
          >

            <input
              type="radio"
              name="waterMission"
              checked={
                missionType === "OUT_PROVINCE"
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

            <div style={{ marginTop: 18 }}>

              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: 8
                }}
              >
                تعداد روز مأموریت
              </label>

              <input
                type="number"
                min={1}
                step={1}
                value={missionDays}
                onChange={(event) => {

                  const value =
                    Number(event.target.value);

                  setMissionDays(
                    Math.max(
                      1,
                      Math.floor(
                        value || 1
                      )
                    )
                  );

                }}
                style={inputStyle}
              />


              <div style={{ marginTop: 10 }}>
                فوق‌العاده روزانه مأموریت:{" "}

                <strong>
                  {formatNumber(
                    dailyMissionRate
                  )}
                  {" "}تومان
                </strong>
              </div>

            </div>

          )}

        </section>

      )}


      {/* خلاصه محاسبات */}

      {selectedArticle !== 18 &&
        missionResult !== null && (

          <section
            style={{
              ...sectionStyle,
              border: "2px solid #334155"
            }}
          >

            <h2 style={{ marginTop: 0 }}>
              خلاصه محاسبات
            </h2>


            <div>
              فصل:{" "}
              <strong>
                فصل دوم ـ تعرفه دستمزد کارشناسی
              </strong>
            </div>


            <div>
              گروه:{" "}
              <strong>
                مهندسی آب و معادن
              </strong>
            </div>


            <div>
              رشته:{" "}
              <strong>
                مهندسی آب
              </strong>
            </div>


            <div>
              ماده:{" "}
              <strong>
                ماده {selectedArticle}
              </strong>
            </div>


            <div style={{ marginBottom: 16 }}>
              موضوع:{" "}

              <strong>
                {getArticleTitle(
                  selectedArticle
                )}
              </strong>
            </div>


            <div
              style={{
                borderTop: "1px solid #ddd",
                paddingTop: 14
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  marginBottom: 8
                }}
              >

                <span>
                  حق‌الزحمه کارشناسی:
                </span>

                <strong>
                  {formatNumber(
                    expertFeeToman
                  )}
                  {" "}تومان
                </strong>

              </div>


              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20
                }}
              >

                <span>
                  فوق‌العاده مأموریت:
                </span>

                <strong>
                  {formatNumber(
                    missionResult
                      .missionFeeToman
                  )}
                  {" "}تومان
                </strong>

              </div>


              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  marginTop: 18,
                  paddingTop: 18,
                  borderTop: "2px solid #334155",
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
                  {" "}تومان
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
 * Article 15 Details
 * ============================================================
 */

function Article15Details({
  flowRateLps
}: {
  flowRateLps: number;
}) {

  const result =
    calculateArticle15({
      flowRateLps
    });


  return (

    <div
      style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: "1px solid #eee"
      }}
    >

      <div>
        حق‌الزحمه پایه:{" "}

        <strong>
          {formatNumber(
            result.baseFeeToman
          )}
          {" "}تومان
        </strong>
      </div>


      {result.secondTierQuantityLps > 0 && (

        <div>
          مازاد طبقه دوم:{" "}

          {formatNumber(
            result.secondTierQuantityLps
          )}
          {" "}لیتر × ۴۰۰ تومان ={" "}

          <strong>
            {formatNumber(
              result.secondTierFeeToman
            )}
            {" "}تومان
          </strong>
        </div>

      )}


      {result.thirdTierQuantityLps > 0 && (

        <div>
          مازاد بیش از ۱۰۰۰ لیتر:{" "}

          {formatNumber(
            result.thirdTierQuantityLps
          )}
          {" "}لیتر × ۱۶۰ تومان ={" "}

          <strong>
            {formatNumber(
              result.thirdTierFeeToman
            )}
            {" "}تومان
          </strong>
        </div>

      )}


      {result.capped && (

        <div
          style={{
            marginTop: 8,
            fontWeight: 700
          }}
        >
          سقف دستمزد ماده ۱۵ اعمال شده است.
        </div>

      )}


      <div
        style={{
          marginTop: 14,
          fontSize: 20
        }}
      >
        حق‌الزحمه:{" "}

        <strong>
          {formatNumber(
            result.finalFeeToman
          )}
          {" "}تومان
        </strong>
      </div>

    </div>

  );
}


/*
 * ============================================================
 * Fixed Fee Panel
 * ============================================================
 */

function FixedArticlePanel({
  article
}: {
  article: WaterFixedFeeArticle;
}) {

  const result =
    calculateWaterFixedFee(
      article
    );


  return (

    <section style={sectionStyle}>

      <h2 style={{ marginTop: 0 }}>
        ماده {article}
      </h2>


      <div style={{ marginBottom: 14 }}>
        {result.title}
      </div>


      <div
        style={{
          fontSize: 26,
          fontWeight: 800
        }}
      >
        {formatNumber(
          result.finalFeeToman
        )}
        {" "}تومان
      </div>


      <div style={{ opacity: 0.7 }}>
        حق‌الزحمه مقطوع
      </div>

    </section>

  );
}


/*
 * ============================================================
 * Article 20 Details
 * ============================================================
 */

function Article20Details({
  mode,
  lengthKm
}: {
  mode: Article20Mode;
  lengthKm: number;
}) {

  const result =
    mode === "WATER_RIGHT" ||
    mode === "WATER_SOURCE_AGE"
      ? calculateArticle20({
          mode
        })
      : calculateArticle20({
          mode,
          lengthKm
        });


  return (

    <div
      style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: "1px solid #eee"
      }}
    >

      <div>
        {result.title}
      </div>


      {result.lengthKm !== null && (

        <div>
          طول مورد رسیدگی:{" "}

          <strong>
            {formatNumber(
              result.lengthKm
            )}
            {" "}کیلومتر
          </strong>
        </div>

      )}


      {result.rateTomanPerKm !== null && (

        <div>
          نرخ هر کیلومتر:{" "}

          <strong>
            {formatNumber(
              result.rateTomanPerKm
            )}
            {" "}تومان
          </strong>
        </div>

      )}


      {result.minimumFeeToman !== null && (

        <div>
          حداقل دستمزد:{" "}

          <strong>
            {formatNumber(
              result.minimumFeeToman
            )}
            {" "}تومان
          </strong>
        </div>

      )}


      {result.maximumFeeToman !== null && (

        <div>
          حداکثر دستمزد:{" "}

          <strong>
            {formatNumber(
              result.maximumFeeToman
            )}
            {" "}تومان
          </strong>
        </div>

      )}


      {result.minimumApplied && (

        <div
          style={{
            marginTop: 6,
            fontWeight: 700
          }}
        >
          حداقل دستمزد ماده ۲۰ اعمال شده است.
        </div>

      )}


      {result.maximumApplied && (

        <div
          style={{
            marginTop: 6,
            fontWeight: 700
          }}
        >
          حداکثر دستمزد ماده ۲۰ اعمال شده است.
        </div>

      )}


      <div
        style={{
          marginTop: 14,
          fontSize: 20
        }}
      >
        حق‌الزحمه:{" "}

        <strong>
          {formatNumber(
            result.finalFeeToman
          )}
          {" "}تومان
        </strong>
      </div>

    </div>

  );
}