import { useMemo, useState } from "react";

import { calculateExpertFee } from "../engine/ExpertFeeEngine";
import type { RoadBuildingEngineArticle } from "../engine/RoadBuildingEngine";
import type {
  Article36ServiceType,
  Article39BoundaryMode,
  Article44ServiceType
} from "../engine/RoadBuildingRules";
import type { MissionType } from "../engine/MissionCalculator";

import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import MoneyInput, {
  parseMoneyValue
} from "../components/ui/MoneyInput";
import CalculateButton from "../components/ui/CalculateButton";
import FeeResultCard from "../components/ui/FeeResultCard";
import ExpertCountSelector from "../components/ui/ExpertCountSelector";
import MissionSelector from "../components/ui/MissionSelector";

interface Props {
  onBack: () => void;
}

const titles = {
  33: "ارزیابی راه، ساختمان و املاک",
  34: "تطبیق نقشه معماری یا سازه",
  35: "تطبیق مشخصات قراردادی ساختمان",
  36: "نقشه معماری/سازه/استحکام بنا",
  37: "افراز و قطعه‌بندی",
  38: "تشخیص زمین مسبوق به احیا",
  39: "پیاده کردن محدوده پلاک ثبتی",
  40: "نقشه‌برداری اراضی و تهیه پروفیل",
  41: "مطالعه پرونده ثبتی و تعیین محل پلاک",
  43: "تشخیص حدود ثبتی و اختلاف املاک",
  44: "امور شهرسازی"
} as const;

const selectableArticles = [
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  43,
  44
] as const satisfies readonly RoadBuildingEngineArticle[];

function formatFa(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

function formatPlainNumber(value: string): string {
  const cleaned = value.replace(/[^\d]/g, "");
  return cleaned
    ? Number(cleaned).toLocaleString("en-US")
    : "";
}

export default function RoadBuildingPage({
  onBack
}: Props) {
  const [article, setArticle] =
    useState<RoadBuildingEngineArticle>(33);

  const [primary, setPrimary] = useState("");
  const [extra, setExtra] = useState("0");
  const [choice, setChoice] =
    useState("ARCHITECTURE");
  const [flag, setFlag] = useState(false);

  const [missionType, setMission] =
    useState<MissionType>("NONE");
  const [days, setDays] = useState(0);
  const [submitted, setSubmitted] =
    useState(false);
  const [expertCount, setExpertCount] =
    useState(1);

  const x = useMemo(
    () => parseMoneyValue(primary),
    [primary]
  );

  const y = useMemo(
    () => parseMoneyValue(extra),
    [extra]
  );

  const result = useMemo(() => {
    if (!submitted) {
      return null;
    }

    try {
      const mission = {
        missionType,
        missionDays:
          missionType === "NONE"
            ? 0
            : days
      };

      switch (article) {
        case 33:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 33,
              data: {
                evaluationValueToman: x,
                ...mission
              }
            }
          });

        case 34:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 34,
              data: {
                areaSquareMeters: x,
                ...mission
              }
            }
          });

        case 35:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 35,
              data: {
                areaSquareMeters: x,
                ...mission
              }
            }
          });

        case 36:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 36,
              data: {
                serviceType:
                  choice as Article36ServiceType,
                areaSquareMeters: x,
                ...mission
              }
            }
          });

        case 37:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 37,
              data: {
                evaluationValueToman: x,
                similarAdditionalUnits: y,
                ...mission
              }
            }
          });

        case 38:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 38,
              data: {
                areaSquareMeters: x,
                ...mission
              }
            }
          });

        case 39:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 39,
              data: {
                areaSquareMeters: x,
                boundaryMode:
                  choice as Article39BoundaryMode,
                geographicPointCount: y,
                ...mission
              }
            }
          });

        case 40:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 40,
              data: {
                areaSquareMeters: x,
                geographicPointCount: y,
                ...mission
              }
            }
          });

        case 41:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 41,
              data: {
                areaSquareMeters: x,
                outsideBoundaryIncreasePercent: y,
                ...mission
              }
            }
          });

        case 42:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 42
            }
          });

        case 43:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 43,
              data: {
                areaSquareMeters: x,
                aerialMapPlacement: flag,
                ...mission
              }
            }
          });

        case 44:
          return calculateExpertFee({
            group: 6,
            data: {
              article: 44,
              data: {
                serviceType:
                  choice as Article44ServiceType,
                itemCount: x,
                ...mission
              }
            }
          });
      }
    } catch {
      return null;
    }
  }, [
    submitted,
    article,
    x,
    y,
    choice,
    flag,
    missionType,
    days
  ]);

  const needsPrimary = article !== 42;

  /*
   * Articles whose fee basis is valuation-based and therefore
   * use the same expert-panel presentation pattern as Article 11.
   */
  const supportsExpertPanel =
    article === 33 || article === 37;

  const baseFeeToman =
    result && !("automaticCalculationSupported" in result)
      ? result.expertFeeToman
      : 0;

  const feePerExpertToman =
    expertCount > 0
      ? Math.round(baseFeeToman / expertCount)
      : baseFeeToman;

  const primaryLabel =
    article === 33 || article === 37
      ? "ارزش موضوع کارشناسی"
      : article === 44
        ? "تعداد موارد"
        : "مساحت";

  const primaryUnit =
    article === 33 || article === 37
      ? "تومان"
      : article === 44
        ? "مورد"
        : "مترمربع";

  const handleArticleChange = (
    value: RoadBuildingEngineArticle
  ) => {
    setArticle(value);
    setPrimary("");
    setExtra("0");
    setChoice("ARCHITECTURE");
    setFlag(false);
    setExpertCount(1);
    setSubmitted(false);
  };

  const handleMissionEnabled = (
    enabled: boolean
  ) => {
    if (!enabled) {
      setMission("NONE");
      setDays(0);
    } else {
      setMission("IN_PROVINCE");
      setDays(Math.max(1, days));
    }

    setSubmitted(false);
  };

  return (
    <main
      className="ef-page"
      dir="rtl"
      data-testid="road-building-page"
    >
      <button
        type="button"
        className="ef-back-button road-building-back-button"
        onClick={onBack}
      >
        ← بازگشت به صفحه اصلی
      </button>

      <PageHeader
        eyebrow="مواد ۳۳ تا ۴۴"
        title="راه و ساختمان"
        subtitle="محاسبه دستمزد کارشناسی خدمات راه، ساختمان، ثبتی و شهرسازی"
      />

      <div className="ef-form-shell">
        <div className="ef-stack">
          <SectionCard>
            <div className="ef-stack">
              <label
                className="ef-field-label"
                htmlFor="road-building-article"
              >
                ماده و خدمت
              </label>

              <select
                id="road-building-article"
                className="ef-select"
                value={article}
                onChange={(event) =>
                  handleArticleChange(
                    Number(
                      event.target.value
                    ) as RoadBuildingEngineArticle
                  )
                }
              >
                {selectableArticles.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    ماده {item} — {titles[item]}
                  </option>
                ))}
              </select>
            </div>
          </SectionCard>

          {needsPrimary && (
            <SectionCard>
              <div className="ef-stack">
                <MoneyInput
                  id="road-building-primary"
                  label={primaryLabel}
                  value={primary}
                  onChange={(value) => {
                    setPrimary(value);
                    setSubmitted(false);
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      x > 0
                    ) {
                      setSubmitted(true);
                    }
                  }}
                  unit={primaryUnit}
                  placeholder={
                    article === 33 ||
                    article === 37
                      ? "3,400,000,000"
                      : "1,000"
                  }
                />

                {article === 36 && (
                  <div className="ef-stack">
                    <label
                      className="ef-field-label"
                      htmlFor="article36-service"
                    >
                      نوع خدمت
                    </label>

                    <select
                      id="article36-service"
                      className="ef-select"
                      value={choice}
                      onChange={(event) => {
                        setChoice(
                          event.target.value
                        );
                        setSubmitted(false);
                      }}
                    >
                      <option value="ARCHITECTURE">
                        نقشه معماری
                      </option>
                      <option value="STRUCTURE">
                        نقشه سازه
                      </option>
                      <option value="STRUCTURAL_SAFETY_REPORT">
                        گزارش استحکام بنا
                      </option>
                    </select>
                  </div>
                )}

                {article === 39 && (
                  <div className="ef-stack">
                    <label
                      className="ef-field-label"
                      htmlFor="article39-boundary"
                    >
                      وضعیت گذربند
                    </label>

                    <select
                      id="article39-boundary"
                      className="ef-select"
                      value={choice}
                      onChange={(event) => {
                        setChoice(
                          event.target.value
                        );
                        setSubmitted(false);
                      }}
                    >
                      <option value="KNOWN_BOUNDARY">
                        گذربند مشخص
                      </option>
                      <option value="UNKNOWN_BOUNDARY">
                        گذربند نامشخص
                      </option>
                    </select>
                  </div>
                )}

                {article === 44 && (
                  <div className="ef-stack">
                    <label
                      className="ef-field-label"
                      htmlFor="article44-service"
                    >
                      نوع خدمت شهرسازی
                    </label>

                    <select
                      id="article44-service"
                      className="ef-select"
                      value={choice}
                      onChange={(event) => {
                        setChoice(
                          event.target.value
                        );
                        setSubmitted(false);
                      }}
                    >
                      <option value="SUBDIVISION_PLAN">
                        طرح تفکیک
                      </option>
                      <option value="LAND_USE_COMPLIANCE">
                        انطباق کاربری
                      </option>
                      <option value="BUILDING_URBAN_COMPLIANCE">
                        انطباق شهری ساختمان
                      </option>
                    </select>
                  </div>
                )}

                {[37, 39, 40, 41].includes(
                  article
                ) && (
                  <div className="ef-stack">
                    <label
                      className="ef-field-label"
                      htmlFor="road-building-extra"
                    >
                      {article === 37
                        ? "واحد مشابه مازاد"
                        : article === 41
                          ? "درصد افزایش خارج محدوده"
                          : "تعداد نقاط جغرافیایی"}
                    </label>

                    <input
                      id="road-building-extra"
                      className="ef-money-input"
                      inputMode="numeric"
                      value={extra}
                      onChange={(event) => {
                        setExtra(
                          formatPlainNumber(
                            event.target.value
                          )
                        );
                        setSubmitted(false);
                      }}
                    />
                  </div>
                )}

                {article === 43 && (
                  <label className="ef-choice">
                    <input
                      type="checkbox"
                      checked={flag}
                      onChange={(event) => {
                        setFlag(
                          event.target.checked
                        );
                        setSubmitted(false);
                      }}
                    />
                    جانمایی روی نقشه هوایی
                  </label>
                )}

                <CalculateButton
                  disabled={x <= 0}
                  onClick={() =>
                    setSubmitted(true)
                  }
                >
                  محاسبه دستمزد
                </CalculateButton>

                {submitted && !result && (
                  <div
                    className="ef-field-error"
                    style={{
                      textAlign: "center"
                    }}
                  >
                    اطلاعات لازم کامل نیست یا
                    ورودی نامعتبر است.
                  </div>
                )}

                {result &&
                  ("automaticCalculationSupported" in
                  result ? (
                    <FeeResultCard
                      feeToman={
                        result.minimumFeeToman
                      }
                      title="حداقل دستمزد کارشناسی"
                      footer="محاسبه خودکار این خدمت پشتیبانی نمی‌شود و حداکثر دستمزد طبق ماده ۹ تعیین می‌شود."
                    />
                  ) : (
                    <FeeResultCard
                      feeToman={baseFeeToman}
                      title={
                        supportsExpertPanel &&
                        expertCount > 1
                          ? "مجموع دستمزد هیأت کارشناسی"
                          : "دستمزد کارشناسی"
                      }
                      rows={
                        supportsExpertPanel &&
                        expertCount > 1
                          ? [
                              {
                                label:
                                  "دستمزد هر کارشناس",
                                value:
                                  `${formatFa(
                                    feePerExpertToman
                                  )} تومان`
                              },
                              {
                                label:
                                  "مجموع دستمزد هیأت",
                                value:
                                  `${formatFa(
                                    baseFeeToman
                                  )} تومان`
                              }
                            ]
                          : []
                      }
                      footer={
                        result.missionFeeToman > 0
                          ? `مبلغ نهایی با مأموریت: ${formatFa(
                              result.totalPayableToman
                            )} تومان`
                          : undefined
                      }
                    />
                  ))}
              </div>
            </SectionCard>
          )}

          {supportsExpertPanel && (
            <SectionCard>
              <ExpertCountSelector
                title="تعداد کارشناسان"
                value={expertCount}
                onChange={(value) => {
                  setExpertCount(value);
                  setSubmitted(false);
                }}
              />
            </SectionCard>
          )}

          {article !== 42 && (
            <SectionCard>
              <MissionSelector
                enabled={
                  missionType !== "NONE"
                }
                onEnabledChange={
                  handleMissionEnabled
                }
                location={
                  missionType ===
                  "OUT_PROVINCE"
                    ? "OUT_PROVINCE"
                    : "IN_PROVINCE"
                }
                onLocationChange={(
                  location
                ) => {
                  setMission(location);
                  setDays(
                    Math.max(1, days)
                  );
                  setSubmitted(false);
                }}
                days={days}
                onDaysChange={(value) => {
                  setDays(value);
                  setSubmitted(false);
                }}
                title="مأموریت کارشناسی"
              />
            </SectionCard>
          )}
        </div>
      </div>
    </main>
  );
}
