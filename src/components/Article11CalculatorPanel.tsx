import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  calculateArticle11Engine
} from "../engine/Article11Engine";
import type {
  Article11IncreaseRuleCode
} from "../engine/Article11IncreaseRules";
import {
  ARTICLE11_INCREASE_RULES
} from "../engine/Article11IncreaseRules";
import type {
  PanelFieldMode
} from "../engine/Article11PanelRules";
import {
  calculateMission
} from "../engine/MissionCalculator";
import type {
  MissionType
} from "../engine/MissionCalculator";

import PageHeader from "./ui/PageHeader";
import SectionCard from "./ui/SectionCard";
import MoneyInput, {
  parseMoneyValue
} from "./ui/MoneyInput";
import CalculateButton from "./ui/CalculateButton";
import FeeResultCard from "./ui/FeeResultCard";
import ExpertCountSelector from "./ui/ExpertCountSelector";
import MissionSelector, {
  type MissionLocation
} from "./ui/MissionSelector";
import OptionGroup from "./ui/OptionGroup";
import AdvancedOptions from "./ui/AdvancedOptions";
import type { ExpertCaseDraft } from "../records/ExpertCaseDraft";
import { saveLastShareableCalculation } from "../share/LastShareableCalculation";
import type { ShareResultInput } from "../share/ShareResult";

type IncreaseMode =
  | "NONE"
  | "WITH_INCREASE";

function formatToman(
  value: number
): string {
  return `${Math.round(value)
    .toLocaleString("fa-IR")} تومان`;
}

interface Article11CalculatorPanelProps {
  onSaveCalculation?: (draft: ExpertCaseDraft) => void;
  onShareCalculation?: (input: ShareResultInput) => void;
  useArticle11Note1?: boolean;
}

export default function Article11CalculatorPanel({
  onSaveCalculation,
  onShareCalculation,
  useArticle11Note1 = false
}: Article11CalculatorPanelProps) {
  const [
    evaluationValue,
    setEvaluationValue
  ] = useState("");

  const [
    submitted,
    setSubmitted
  ] = useState(false);

  const [
    expertCount,
    setExpertCount
  ] = useState(1);

  const [
    panelFieldMode,
    setPanelFieldMode
  ] = useState<PanelFieldMode>(
    "SINGLE_EXPERT"
  );

  const [
    missionType,
    setMissionType
  ] = useState<MissionType>("NONE");

  const [
    missionDays,
    setMissionDays
  ] = useState(1);

  const [
    increaseMode,
    setIncreaseMode
  ] = useState<IncreaseMode>("NONE");

  const [
    increaseRuleCode,
    setIncreaseRuleCode
  ] =
    useState<Article11IncreaseRuleCode | null>(
      null
    );

  const [
    applyFiftyPercentIncrease,
    setApplyFiftyPercentIncrease
  ] = useState(false);

  const evaluationValueToman =
    useMemo(
      () =>
        parseMoneyValue(
          evaluationValue
        ),
      [evaluationValue]
    );

  const calculation = useMemo(() => {
    if (
      !submitted ||
      evaluationValueToman <= 0
    ) {
      return { result: null, error: "" };
    }

    try {
      return {
        result: calculateArticle11Engine({
          evaluationValueToman,
          useArticle11Note1,
          expertCount,
          panelFieldMode,
          increaseRuleCode:
            increaseMode === "WITH_INCREASE"
              ? increaseRuleCode
              : null,
          applyFiftyPercentIncrease:
            increaseMode === "WITH_INCREASE"
              ? applyFiftyPercentIncrease
              : false,
        }),
        error: "",
      };
    } catch (error) {
      return {
        result: null,
        error:
          error instanceof Error
            ? error.message
            : "محاسبه انجام نشد.",
      };
    }
  }, [
    submitted,
    evaluationValueToman,
    expertCount,
    panelFieldMode,
    increaseMode,
    increaseRuleCode,
    applyFiftyPercentIncrease,
    useArticle11Note1
  ]);

  const result = calculation.result;
  const calculationError = calculation.error;

  const mission = useMemo(() => {
    if (!result) {
      return null;
    }

    return calculateMission({
      expertFeeToman:
        result.totalFeeToman,
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
    result,
    missionType,
    missionDays
  ]);

  const missionEnabled =
    missionType !== "NONE";

  const missionLocation:
    MissionLocation =
      missionType ===
      "OUT_PROVINCE"
        ? "OUT_PROVINCE"
        : "IN_PROVINCE";

  function invalidateCalculation(): void {
    setSubmitted(false);
  }

  function handleExpertCountChange(
    nextValue: number
  ): void {
    const nextCount = Math.max(
      1,
      Math.floor(
        nextValue || 1
      )
    );

    setExpertCount(nextCount);

    if (nextCount === 1) {
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

  function handleMissionEnabledChange(
    enabled: boolean
  ): void {
    setMissionType(
      enabled
        ? missionLocation
        : "NONE"
    );

    if (enabled) {
      setMissionDays(
        Math.max(
          1,
          missionDays
        )
      );
    }

    invalidateCalculation();
  }

  function handleMissionLocationChange(
    location: MissionLocation
  ): void {
    setMissionType(location);
    invalidateCalculation();
  }

  function handleIncreaseModeChange(
    mode: IncreaseMode
  ): void {
    setIncreaseMode(mode);

    if (mode === "NONE") {
      setIncreaseRuleCode(null);
      setApplyFiftyPercentIncrease(
        false
      );
    }

    invalidateCalculation();
  }

  const finalCalculatedFeeToman =
    result
      ? mission &&
        mission.missionFeeToman > 0
        ? mission.totalPayableToman
        : result.totalFeeToman
      : 0;

  useEffect(() => {
    if (!result || finalCalculatedFeeToman <= 0) return;

    saveLastShareableCalculation({
      evaluationValueToman,
      expertCount,
      calculatedFeeToman: finalCalculatedFeeToman,
      calculationTitle: useArticle11Note1
        ? "ارزیابی بالاتر از ۵ همت تومان"
        : "ارزیابی عمومی",
      tariffReference: useArticle11Note1
        ? "تبصره ۱ ماده ۱۱ تعرفه ۱۴۰۵"
        : "ماده ۱۱ تعرفه ۱۴۰۵",
    });
  }, [result, finalCalculatedFeeToman, evaluationValueToman, expertCount, useArticle11Note1]);

  function handleSaveCalculation(): void {
    if (
      !result ||
      finalCalculatedFeeToman <= 0 ||
      !onSaveCalculation
    ) {
      return;
    }

    onSaveCalculation({
      calculationCategory:
        "ارزیابی عمومی",
      tariffArticle: 11,
      grossFeeToman:
        finalCalculatedFeeToman,
      subject:
        "ارزیابی عمومی موضوع ماده ۱۱ تعرفه",
      sourceCalculation:
        "ARTICLE_11",
      evaluationValueToman,
      expertCount,
      panelFieldMode,
      missionType,
      missionDays:
        missionType === "NONE"
          ? 0
          : Math.max(
              1,
              missionDays
            ),
      missionFeeToman:
        mission?.missionFeeToman ?? 0,
      increaseRuleCode:
        increaseMode ===
        "WITH_INCREASE"
          ? increaseRuleCode
          : null,
      applyFiftyPercentIncrease:
        increaseMode ===
        "WITH_INCREASE"
          ? applyFiftyPercentIncrease
          : false
    });
  }

  const resultRows = result
    ? [
        ...(expertCount > 1
          ? [
              {
                label:
                  "دستمزد هر کارشناس",
                value:
                  formatToman(
                    result
                      .feePerExpertToman
                  )
              },
              {
                label:
                  "مجموع دستمزد هیأت",
                value:
                  formatToman(
                    result
                      .totalFeeToman
                  )
              }
            ]
          : []),
        ...(mission &&
        mission.missionFeeToman > 0
          ? [
              {
                label:
                  "فوق‌العاده مأموریت",
                value:
                  formatToman(
                    mission
                      .missionFeeToman
                  )
              },
              {
                label:
                  "مبلغ نهایی با مأموریت",
                value:
                  formatToman(
                    mission
                      .totalPayableToman
                  )
              }
            ]
          : [])
      ]
    : [];

  return (
    <main
      className="ef-page"
      dir="rtl"
      data-testid="article11-reference-ui"
    >
      <div className="ef-form-shell">
        <PageHeader
          eyebrow={
            useArticle11Note1
              ? "تبصره ۱ ماده ۱۱"
              : "ماده ۱۱"
          }
          title={
            useArticle11Note1
              ? "ارزیابی ۵ همت تومان یا بیشتر"
              : "ارزیابی عمومی"
          }
          subtitle={
            useArticle11Note1
              ? "مبلغ این بازه توسط شورای عالی کارشناسان یا مرکز تعیین می‌شود"
              : "محاسبه حق‌الزحمه کارشناسی بر اساس ماده ۱۱ تعرفه"
          }
        />

        <div className="ef-stack">
          <SectionCard>
            <div className="ef-stack">
              <MoneyInput
                id="article11-evaluation-value"
                label="مبلغ ارزیابی"
                value={
                  evaluationValue
                }
                onChange={(value) => {
                  setEvaluationValue(
                    value
                  );
                  invalidateCalculation();
                }}
                unit="تومان"
                placeholder="3,400,000,000"
              />

              <CalculateButton
                disabled={
                  evaluationValueToman <=
                  0
                }
                onClick={() =>
                  setSubmitted(true)
                }
              >
                {useArticle11Note1 ? "بررسی وضعیت تعرفه" : "محاسبه دستمزد"}
              </CalculateButton>

              {submitted && calculationError && (
                <div
                  className="ef-alert ef-alert--info"
                  role="status"
                  aria-live="polite"
                >
                  {calculationError}
                </div>
              )}

              {submitted &&
                result && (
                  <FeeResultCard
                    feeToman={
                      expertCount === 1
                        ? result
                            .feePerExpertToman
                        : result
                            .totalFeeToman
                    }
                    title={
                      expertCount === 1
                        ? "دستمزد کارشناسی"
                        : "مجموع دستمزد هیأت کارشناسی"
                    }
                    rows={
                      resultRows
                    }
                  />
                )}

              {submitted && result && onShareCalculation && (
                <button
                  type="button"
                  onClick={() => onShareCalculation({
                    evaluationValueToman,
                    expertCount,
                    calculatedFeeToman: finalCalculatedFeeToman,
                    calculationTitle: "ارزیابی عمومی",
                    tariffReference: "ماده ۱۱ تعرفه ۱۴۰۵",
                  })}
                  className="ef-calculate-button"
                  data-testid="article11-share-calculation"
                  style={{ width: "100%", marginTop: 12, fontFamily: "inherit" }}
                >
                  اشتراک‌گذاری این نتیجه
                </button>
              )}

              {submitted &&
                result &&
                onSaveCalculation && (
                  <div
                    className="ef-save-result"
                    data-testid="article11-save-result"
                    style={{
                      marginTop: 12,
                      padding: 14,
                      borderRadius: 14,
                      border: "1px solid #b9d6fb",
                      background: "#f3f8ff",
                      textAlign: "center",
                      fontFamily: "inherit",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        marginBottom: 4,
                      }}
                    >
                      نتیجه نهایی قابل ثبت در «ذخیره و سوابق»
                    </div>
                    <strong
                      data-testid="article11-save-amount"
                      style={{
                        display: "block",
                        color: "#0d47a1",
                        fontSize: 21,
                      }}
                    >
                      {formatToman(finalCalculatedFeeToman)}
                    </strong>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 11,
                        color: "#64748b",
                      }}
                    >
                      این مبلغ بدون ورود مجدد کاربر به فرم سوابق منتقل می‌شود.
                    </div>
                  </div>
                )}

              {submitted &&
                result &&
                onSaveCalculation && (
                  <button
                    type="button"
                    onClick={
                      handleSaveCalculation
                    }
                    className="ef-calculate-button"
                    data-testid="article11-save-calculation"
                    aria-label="ذخیره نتیجه نهایی ماده ۱۱ در سوابق"
                    style={{
                      width: "100%",
                      marginTop: 12,
                      fontFamily: "inherit"
                    }}
                  >
                    ذخیره این محاسبه
                  </button>
                )}

              {submitted &&
                evaluationValueToman >
                  0 &&
                !result && (
                  <div
                    role="alert"
                    className="ef-alert"
                  >
                    محاسبه با اطلاعات فعلی امکان‌پذیر نیست.
                  </div>
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
                  name="article11-panel-field-mode"
                  value={
                    panelFieldMode
                  }
                  onChange={(
                    value
                  ) => {
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
                        "کارشناسان با رشته‌های مختلف"
                    }
                  ]}
                />
              </div>
            )}
          </SectionCard>

          <SectionCard>
            <MissionSelector
              enabled={
                missionEnabled
              }
              onEnabledChange={
                handleMissionEnabledChange
              }
              location={
                missionLocation
              }
              onLocationChange={
                handleMissionLocationChange
              }
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

          <AdvancedOptions
            title="تنظیمات پیشرفته"
          >
            <OptionGroup<IncreaseMode>
              title="ضرایب افزایشی"
              name="article11-increase-mode"
              value={increaseMode}
              onChange={
                handleIncreaseModeChange
              }
              options={[
                {
                  value: "NONE",
                  label:
                    "بدون ضرایب افزایشی"
                },
                {
                  value:
                    "WITH_INCREASE",
                  label:
                    "با ضرایب افزایشی"
                }
              ]}
            />

            {increaseMode ===
              "WITH_INCREASE" && (
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop:
                    "1px solid var(--ef-border)"
                }}
              >
                <div className="ef-control-title">
                  انتخاب ضریب افزایشی
                </div>

                <div className="ef-rule-list">
                  {ARTICLE11_INCREASE_RULES.map(
                    (rule) => (
                      <label
                        key={
                          rule.code
                        }
                        className="ef-choice"
                        data-active={
                          increaseRuleCode ===
                          rule.code
                        }
                      >
                        <input
                          type="radio"
                          name="article11-increase-rule"
                          checked={
                            increaseRuleCode ===
                            rule.code
                          }
                          onChange={() => {
                            setIncreaseRuleCode(
                              rule.code
                            );
                            invalidateCalculation();
                          }}
                        />

                        <span>
                          تبصره{" "}
                          {
                            rule.noteNumber
                          }{" "}
                          — {rule.title} (+
                          {Math.round(
                            rule.increaseRate *
                              100
                          )}
                          ٪)
                        </span>
                      </label>
                    )
                  )}
                </div>

                {result?.mode ===
                  "NOTE_1" && (
                  <label
                    className="ef-choice"
                    data-active={
                      applyFiftyPercentIncrease
                    }
                    style={{
                      marginTop: 10
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        applyFiftyPercentIncrease
                      }
                      onChange={(
                        event
                      ) => {
                        setApplyFiftyPercentIncrease(
                          event.target
                            .checked
                        );
                        invalidateCalculation();
                      }}
                    />

                    <span>
                      اعمال افزایش ۵۰ درصدی تبصره یک ماده ۱۱
                    </span>
                  </label>
                )}
              </div>
            )}
          </AdvancedOptions>
        </div>
      </div>
    </main>
  );
}
