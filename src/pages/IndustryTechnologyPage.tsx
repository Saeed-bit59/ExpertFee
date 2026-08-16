import {
  useMemo,
  useState
} from "react";

import {
  calculateExpertFee
} from "../engine/ExpertFeeEngine";

import {
  calculateIndustryTechnologyPanel
} from "../engine/IndustryTechnologyPanelCalculator";

import type {
  IndustryTechnologyServiceType
} from "../engine/IndustryTechnologyRules";

import type {
  PanelFieldMode
} from "../engine/Article11PanelRules";

import {
  calculateMission
} from "../engine/MissionCalculator";

import type {
  MissionType
} from "../engine/MissionCalculator";

import PageHeader from "../components/ui/PageHeader";
import SectionCard from "../components/ui/SectionCard";
import MoneyInput, {
  parseMoneyValue
} from "../components/ui/MoneyInput";
import CalculateButton from "../components/ui/CalculateButton";
import FeeResultCard from "../components/ui/FeeResultCard";
import ExpertCountSelector from "../components/ui/ExpertCountSelector";
import MissionSelector from "../components/ui/MissionSelector";
import OptionGroup from "../components/ui/OptionGroup";

interface Props {
  onBack: () => void;
}

type ServiceOption = {
  value: IndustryTechnologyServiceType;
  label: string;
  description: string;
};

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    value: "EVALUATION",
    label: "بدون ضریب افزایشی",
    description:
      "ارزیابی طبق ماده ۴۵ با مبنای دستمزد ماده ۱۱"
  },
  {
    value:
      "MACHINERY_EVALUATION_WITH_TECHNICAL_ASSESSMENT",
    label:
      "افزایش ۴۰٪ ـ ارزیابی ماشین‌آلات همراه با تعیین مشخصات فنی، استهلاک و عمر مفید باقیمانده",
    description:
      "دستمزد ماده ۱۱ به‌اضافه ۴۰ درصد دستمزد ماده ۱۱"
  },
  {
    value: "SOFTWARE_EXPERTISE",
    label:
      "افزایش ۵۰٪ ـ کارشناسی نرم‌افزار طبق ماده ۱۱ به‌اضافه ۵۰ درصد دستمزد ماده ۱۱",
    description:
      "ویژه کارشناسی نرم‌افزار در رشته کامپیوتر و فناوری اطلاعات"
  }
];

function formatToman(
  value: number
): string {
  return `${Math.round(value)
    .toLocaleString("fa-IR")} تومان`;
}

export default function IndustryTechnologyPage({
  onBack
}: Props) {
  const [
    evaluationValue,
    setEvaluationValue
  ] = useState("");

  const [
    serviceType,
    setServiceType
  ] =
    useState<IndustryTechnologyServiceType>(
      "EVALUATION"
    );

  const [
    expertCount,
    setExpertCount
  ] = useState(1);

  const [
    panelFieldMode,
    setPanelFieldMode
  ] =
    useState<PanelFieldMode>(
      "SINGLE_EXPERT"
    );

  const [
    missionType,
    setMissionType
  ] =
    useState<MissionType>("NONE");

  const [
    missionDays,
    setMissionDays
  ] = useState(1);

  const [
    submitted,
    setSubmitted
  ] = useState(false);

  const evaluationValueToman =
    useMemo(
      () =>
        parseMoneyValue(
          evaluationValue
        ),
      [evaluationValue]
    );

  function invalidateCalculation(): void {
    setSubmitted(false);
  }

  function handleExpertCountChange(
    value: number
  ): void {
    setExpertCount(value);

    if (value <= 1) {
      setPanelFieldMode(
        "SINGLE_EXPERT"
      );
    } else if (
      panelFieldMode ===
      "SINGLE_EXPERT"
    ) {
      setPanelFieldMode(
        "SAME_FIELD"
      );
    }

    invalidateCalculation();
  }

  /*
   * محاسبه پایه ماده ۴۵.
   *
   * برای نرم‌افزار، discipline باید
   * COMPUTER_INFORMATION_TECHNOLOGY باشد؛
   * در غیر این صورت Calculator طبق قرارداد
   * موجود محاسبه را رد می‌کند.
   */
  const singleExpertResult =
    useMemo(() => {
      if (
        !submitted ||
        evaluationValueToman <= 0
      ) {
        return null;
      }

      try {
        return calculateExpertFee({
          group: 7,
          data: {
            article: 45,
            data: {
              discipline:
                serviceType ===
                "SOFTWARE_EXPERTISE"
                  ? "COMPUTER_INFORMATION_TECHNOLOGY"
                  : "ELECTRICAL_MACHINERY_FACTORY_INSTALLATIONS",
              serviceType,
              evaluationValueToman,
              missionType: "NONE",
              missionDays: 0
            }
          }
        });
      } catch {
        return null;
      }
    }, [
      submitted,
      evaluationValueToman,
      serviceType
    ]);

  /*
   * محاسبه هیأت بر مبنای قواعد تثبیت‌شده
   * Article11Engine و سپس ضریب ماده ۴۵.
   */
  const panelResult =
    useMemo(() => {
      if (
        !submitted ||
        evaluationValueToman <= 0
      ) {
        return null;
      }

      try {
        return calculateIndustryTechnologyPanel({
          evaluationValueToman,
          serviceType,
          expertCount,
          panelFieldMode
        });
      } catch {
        return null;
      }
    }, [
      submitted,
      evaluationValueToman,
      serviceType,
      expertCount,
      panelFieldMode
    ]);

  const expertFeeBeforeMission =
    panelResult?.totalPanelFeeToman ??
    singleExpertResult?.expertFeeToman ??
    0;

  const mission =
    useMemo(() => {
      if (
        !submitted ||
        expertFeeBeforeMission <= 0
      ) {
        return null;
      }

      return calculateMission({
        expertFeeToman:
          expertFeeBeforeMission,
        missionType,
        missionDays:
          missionType === "NONE"
            ? 0
            : Math.max(
                1,
                missionDays
              )
      });
    }, [
      submitted,
      expertFeeBeforeMission,
      missionType,
      missionDays
    ]);

  const additionalPercent =
    panelResult?.additionalPercent ??
    singleExpertResult
      ?.additionalPercent ??
    0;

  const additionalFeeToman =
    expertCount > 1
      ? (
          panelResult
            ?.additionalFeePerExpertToman ??
          0
        ) * expertCount
      : singleExpertResult
          ?.additionalFeeToman ??
        0;

  return (
    <main
      className="ef-page"
      dir="rtl"
      data-testid="industry-technology-page"
    >
      <button
        type="button"
        className="ef-back-button industry-technology-back-button"
        onClick={onBack}
      >
        ← بازگشت به صفحه اصلی
      </button>

      <PageHeader
        eyebrow="ماده ۴۵"
        title="صنعت و فن"
        subtitle="محاسبه دستمزد کارشناسی گروه صنعت و فن"
      />

      <div className="ef-form-shell">
        <div className="ef-stack">
          <SectionCard>
            <div className="ef-stack">
              <MoneyInput
                id="industry-evaluation-value"
                label="مبلغ ارزیابی"
                value={evaluationValue}
                onChange={(value) => {
                  setEvaluationValue(
                    value
                  );
                  invalidateCalculation();
                }}
                onKeyDown={(event) => {
                  if (
                    event.key ===
                      "Enter" &&
                    evaluationValueToman >
                      0
                  ) {
                    setSubmitted(true);
                  }
                }}
                unit="تومان"
                placeholder="100,000,000,000"
              />

              <div>
                <div className="ef-control-title">
                  ضرایب قابل اعمال در
                  محاسبه
                </div>

                <div className="ef-rule-list">
                  {SERVICE_OPTIONS.map(
                    (option) => (
                      <label
                        key={
                          option.value
                        }
                        className="ef-choice"
                        data-active={
                          serviceType ===
                          option.value
                        }
                      >
                        <input
                          type="radio"
                          name="industry-service-type"
                          checked={
                            serviceType ===
                            option.value
                          }
                          onChange={() => {
                            setServiceType(
                              option.value
                            );
                            invalidateCalculation();
                          }}
                        />

                        <span>
                          <strong>
                            {option.label}
                          </strong>
                          <span
                            style={{
                              display:
                                "block",
                              marginTop: 4,
                              opacity: 0.78
                            }}
                          >
                            {
                              option.description
                            }
                          </span>
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <CalculateButton
                disabled={
                  evaluationValueToman <=
                  0
                }
                onClick={() =>
                  setSubmitted(true)
                }
              >
                محاسبه دستمزد
              </CalculateButton>

              {submitted &&
                (!singleExpertResult ||
                  !panelResult) && (
                  <div
                    className="ef-field-error"
                    style={{
                      textAlign:
                        "center"
                    }}
                  >
                    اطلاعات لازم کامل
                    نیست یا ورودی
                    نامعتبر است.
                  </div>
                )}

              {submitted &&
                singleExpertResult &&
                panelResult && (
                  <FeeResultCard
                    feeToman={
                      expertFeeBeforeMission
                    }
                    title={
                      expertCount > 1
                        ? "مجموع دستمزد هیأت کارشناسی"
                        : "دستمزد کارشناسی"
                    }
                    rows={[
                      {
                        label:
                          "دستمزد پایه ماده ۱۱",
                        value:
                          expertCount > 1
                            ? formatToman(
                                panelResult
                                  .article11FeePerExpertToman *
                                  expertCount
                              )
                            : formatToman(
                                singleExpertResult
                                  .article11FeeToman
                              )
                      },
                      {
                        label:
                          "ضریب افزایشی اعمال‌شده",
                        value:
                          additionalPercent >
                          0
                            ? `${additionalPercent.toLocaleString(
                                "fa-IR"
                              )}٪`
                            : "بدون افزایش"
                      },
                      ...(additionalPercent >
                      0
                        ? [
                            {
                              label:
                                "مبلغ افزایش ناشی از ضریب",
                              value:
                                formatToman(
                                  additionalFeeToman
                                )
                            }
                          ]
                        : []),
                      ...(expertCount > 1
                        ? [
                            {
                              label:
                                "دستمزد هر کارشناس",
                              value:
                                formatToman(
                                  panelResult
                                    .feePerExpertToman
                                )
                            },
                            {
                              label:
                                "مجموع دستمزد هیأت",
                              value:
                                formatToman(
                                  panelResult
                                    .totalPanelFeeToman
                                )
                            }
                          ]
                        : [])
                    ]}
                    footer={
                      mission &&
                      mission.missionFeeToman >
                        0
                        ? `مبلغ نهایی با مأموریت: ${formatToman(
                            mission.totalPayableToman
                          )}`
                        : undefined
                    }
                  />
                )}
            </div>
          </SectionCard>

          <SectionCard>
            <ExpertCountSelector
              title="تعداد کارشناسان"
              value={expertCount}
              onChange={
                handleExpertCountChange
              }
            />

            {expertCount > 1 && (
              <div
                style={{
                  marginTop: 16
                }}
              >
                <OptionGroup<PanelFieldMode>
                  title="ترکیب رشته اعضای هیأت"
                  name="industry-panel-field-mode"
                  value={
                    panelFieldMode
                  }
                  onChange={(value) => {
                    setPanelFieldMode(
                      value
                    );
                    invalidateCalculation();
                  }}
                  options={[
                    {
                      value:
                        "SAME_FIELD",
                      label:
                        "کارشناسان هم‌رشته"
                    },
                    {
                      value:
                        "DIFFERENT_FIELDS",
                      label:
                        "کارشناسان با رشته‌های مختلف (غیرهم‌رشته)"
                    }
                  ]}
                />
              </div>
            )}
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
                  setMissionDays(1);
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
              onDaysChange={(days) => {
                setMissionDays(days);
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
