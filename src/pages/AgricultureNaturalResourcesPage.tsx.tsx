import {
  useMemo,
  useState
} from "react";

import {
  calculateExpertFee
} from "../engine/ExpertFeeEngine";

import type {
  AgricultureNaturalResourcesArticle
} from "../engine/AgricultureNaturalResourcesRules";

import type {
  MissionType
} from "../engine/MissionCalculator";

import PageHeader
  from "../components/ui/PageHeader";
import SectionCard
  from "../components/ui/SectionCard";
import MoneyInput, {
  parseMoneyValue
} from "../components/ui/MoneyInput";
import CalculateButton
  from "../components/ui/CalculateButton";
import FeeResultCard
  from "../components/ui/FeeResultCard";
import MissionSelector
  from "../components/ui/MissionSelector";

interface Props {
  onBack: () => void;
}

/*
 * انتخاب رشته از UI حذف شده است.
 * مواد گروه ۹ برای این صفحه با رشته ثابت
 * کشاورزی و منابع طبیعی به Engine ارسال می‌شوند.
 */
const FIXED_DISCIPLINE =
  "AGRICULTURE_NATURAL_RESOURCES" as const;

const ARTICLE_OPTIONS = [
  48,
  49,
  51,
  52,
  53
] as const satisfies readonly AgricultureNaturalResourcesArticle[];

const ARTICLE_LABELS: Record<
  AgricultureNaturalResourcesArticle,
  string
> = {
  48: "ماده ۴۸ — ارزیابی عمومی",
  49: "ماده ۴۹ — حقوق و بهبود اراضی کشاورزی",
  51: "ماده ۵۱ — تشخیص اراضی و منابع ملی",
  52: "ماده ۵۲ — افراز املاک کشاورزی (+۲۰٪)",
  53: "ماده ۵۳ — ارزیابی تجهیزات، مواد و محصولات"
};

function normalizeAreaInput(
  value: string
): string {
  const englishDigits = value
    .replace(
      /[۰-۹]/g,
      (digit) =>
        String(
          "۰۱۲۳۴۵۶۷۸۹".indexOf(
            digit
          )
        )
    )
    .replace(
      /[٠-٩]/g,
      (digit) =>
        String(
          "٠١٢٣٤٥٦٧٨٩".indexOf(
            digit
          )
        )
    );

  const digitsOnly =
    englishDigits.replace(
      /[^\d]/g,
      ""
    );

  if (!digitsOnly) {
    return "";
  }

  return Number(
    digitsOnly
  ).toLocaleString("en-US");
}

function parseArea(
  value: string
): number {
  return (
    Number(
      value.replace(/,/g, "")
    ) || 0
  );
}

function formatToman(
  value: number
): string {
  return `${Math.round(value)
    .toLocaleString("fa-IR")} تومان`;
}

export default function AgricultureNaturalResourcesPage({
  onBack
}: Props) {
  const [
    article,
    setArticle
  ] =
    useState<AgricultureNaturalResourcesArticle>(
      48
    );

  const [
    value,
    setValue
  ] = useState("");

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
  ] = useState(1);

  const [
    submitted,
    setSubmitted
  ] = useState(false);

  const isAreaArticle =
    article === 51;

  const numericValue =
    useMemo(
      () =>
        isAreaArticle
          ? parseArea(value)
          : parseMoneyValue(
              value
            ),
      [
        isAreaArticle,
        value
      ]
    );

  function invalidateCalculation(): void {
    setSubmitted(false);
  }

  const result =
    useMemo(() => {
      if (
        !submitted ||
        numericValue <= 0
      ) {
        return null;
      }

      const normalizedMissionDays =
        missionType === "NONE"
          ? 0
          : Math.max(
              1,
              missionDays
            );

      try {
        switch (article) {
          case 48:
            return calculateExpertFee({
              group: 9,
              data: {
                article: 48,
                data: {
                  article: 48,
                  discipline:
                    FIXED_DISCIPLINE,
                  evaluationValueToman:
                    numericValue,
                  missionType,
                  missionDays:
                    normalizedMissionDays
                }
              }
            });

          case 49:
            return calculateExpertFee({
              group: 9,
              data: {
                article: 49,
                data: {
                  article: 49,
                  discipline:
                    FIXED_DISCIPLINE,
                  evaluationValueToman:
                    numericValue,
                  missionType,
                  missionDays:
                    normalizedMissionDays
                }
              }
            });

          case 51:
            return calculateExpertFee({
              group: 9,
              data: {
                article: 51,
                data: {
                  article: 51,
                  discipline:
                    FIXED_DISCIPLINE,
                  areaSquareMeters:
                    numericValue,
                  missionType,
                  missionDays:
                    normalizedMissionDays
                }
              }
            });

          case 52:
            return calculateExpertFee({
              group: 9,
              data: {
                article: 52,
                data: {
                  article: 52,
                  discipline:
                    FIXED_DISCIPLINE,
                  evaluationValueToman:
                    numericValue,
                  missionType,
                  missionDays:
                    normalizedMissionDays
                }
              }
            });

          case 53:
            return calculateExpertFee({
              group: 9,
              data: {
                article: 53,
                data: {
                  article: 53,
                  discipline:
                    FIXED_DISCIPLINE,
                  evaluationValueToman:
                    numericValue,
                  missionType,
                  missionDays:
                    normalizedMissionDays
                }
              }
            });
        }
      } catch {
        return null;
      }
    }, [
      submitted,
      numericValue,
      article,
      missionType,
      missionDays
    ]);

  return (
    <main
      className="ef-page"
      dir="rtl"
      data-testid="agriculture-natural-resources-page"
    >
      <button
        type="button"
        className="ef-back-button agriculture-back-button"
        onClick={onBack}
      >
        ← بازگشت به صفحه اصلی
      </button>

      <PageHeader
        eyebrow="گروه ۹"
        title="کشاورزی و منابع طبیعی"
        subtitle="مواد ۴۸، ۴۹، ۵۱، ۵۲ و ۵۳ تعرفه"
      />

      <div className="ef-form-shell">
        <div className="ef-stack">
          <SectionCard
            title="انتخاب ماده تعرفه"
          >
            <div
              className="ef-control"
              style={{
                margin:
                  "0 auto"
              }}
            >
              <label
                className="ef-control-title"
                htmlFor="agriculture-article"
              >
                ماده تعرفه
              </label>

              <select
                id="agriculture-article"
                className="ef-select"
                value={article}
                onChange={(
                  event
                ) => {
                  setArticle(
                    Number(
                      event.target
                        .value
                    ) as AgricultureNaturalResourcesArticle
                  );
                  setValue("");
                  invalidateCalculation();
                }}
              >
                {ARTICLE_OPTIONS.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {
                        ARTICLE_LABELS[
                          item
                        ]
                      }
                    </option>
                  )
                )}
              </select>
            </div>
          </SectionCard>

          <SectionCard>
            <div className="ef-stack">
              {isAreaArticle ? (
                <div
                  className="ef-control"
                  style={{
                    margin:
                      "0 auto"
                  }}
                >
                  <label
                    className="ef-control-title"
                    htmlFor="agriculture-area"
                  >
                    مساحت
                    (مترمربع)
                  </label>

                  <input
                    id="agriculture-area"
                    className="ef-input"
                    inputMode="numeric"
                    value={value}
                    placeholder="10,000"
                    onChange={(
                      event
                    ) => {
                      setValue(
                        normalizeAreaInput(
                          event.target
                            .value
                        )
                      );
                      invalidateCalculation();
                    }}
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                          "Enter" &&
                        numericValue >
                          0
                      ) {
                        setSubmitted(
                          true
                        );
                      }
                    }}
                  />
                </div>
              ) : (
                <MoneyInput
                  id="agriculture-evaluation-value"
                  label="مبلغ ارزیابی"
                  value={value}
                  onChange={(
                    nextValue
                  ) => {
                    setValue(
                      nextValue
                    );
                    invalidateCalculation();
                  }}
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                        "Enter" &&
                      numericValue >
                        0
                    ) {
                      setSubmitted(
                        true
                      );
                    }
                  }}
                  unit="تومان"
                  placeholder="100,000,000,000"
                />
              )}

              <CalculateButton
                disabled={
                  numericValue <= 0
                }
                onClick={() =>
                  setSubmitted(true)
                }
              >
                محاسبه دستمزد
              </CalculateButton>

              {submitted &&
                !result && (
                  <div
                    className="ef-field-error"
                    style={{
                      textAlign:
                        "center"
                    }}
                  >
                    اطلاعات لازم
                    کامل نیست یا
                    ورودی نامعتبر
                    است.
                  </div>
                )}

              {result && (
                <FeeResultCard
                  feeToman={
                    result.expertFeeToman
                  }
                  title="دستمزد کارشناسی"
                  rows={[
                    ...(
                      "additionalPercent" in
                        result &&
                      result.additionalPercent >
                        0
                        ? [
                            {
                              label:
                                "ضریب افزایشی اعمال‌شده",
                              value:
                                `${result.additionalPercent.toLocaleString(
                                  "fa-IR"
                                )}٪`
                            }
                          ]
                        : []
                    )
                  ]}
                  footer={
                    result.missionFeeToman >
                    0
                      ? `مبلغ نهایی با مأموریت: ${formatToman(
                          result.totalPayableToman
                        )}`
                      : undefined
                  }
                />
              )}

              {result &&
                article === 52 && (
                  <div
                    className="ef-helper"
                    style={{
                      textAlign:
                        "center"
                    }}
                  >
                    در صورت نیاز
                    به تهیه نقشه،
                    دستمزد
                    نقشه‌برداری
                    جداگانه محاسبه
                    می‌شود.
                  </div>
                )}
            </div>
          </SectionCard>

          <SectionCard>
            <MissionSelector
              enabled={
                missionType !== "NONE"
              }
              onEnabledChange={(
                enabled
              ) => {
                if (!enabled) {
                  setMissionType(
                    "NONE"
                  );
                  setMissionDays(
                    1
                  );
                } else {
                  setMissionType(
                    "IN_PROVINCE"
                  );
                  setMissionDays(
                    Math.max(
                      1,
                      missionDays
                    )
                  );
                }

                invalidateCalculation();
              }}
              location={
                missionType ===
                "OUT_PROVINCE"
                  ? "OUT_PROVINCE"
                  : "IN_PROVINCE"
              }
              onLocationChange={(
                location
              ) => {
                setMissionType(
                  location
                );
                setMissionDays(
                  Math.max(
                    1,
                    missionDays
                  )
                );
                invalidateCalculation();
              }}
              days={missionDays}
              onDaysChange={(
                days
              ) => {
                setMissionDays(
                  days
                );
                invalidateCalculation();
              }}
              title="مأموریت کارشناسی"
            />
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
