import { useMemo, useState } from "react";

import {
  calculateArticle13
} from "../engine/Article13Calculator";

import {
  calculateMission,
  getMissionDailyRate
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
import MissionSelector from "./ui/MissionSelector";


function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

export default function Article13CalculatorPanel() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [missionType, setMissionType] = useState<MissionType>("NONE");
  const [missionDays, setMissionDays] = useState(1);

  const monthlyRentToman = useMemo(
    () => parseMoneyValue(monthlyRent),
    [monthlyRent]
  );

  const result = useMemo(() => {
    if (!submitted || monthlyRentToman <= 0) {
      return null;
    }

    return calculateArticle13({
      monthlyRentToman
    });
  }, [submitted, monthlyRentToman]);

  const missionResult = useMemo(() => {
    if (!result) {
      return null;
    }

    if (missionType === "NONE") {
      return calculateMission({
        expertFeeToman: result.finalFeeToman,
        missionType: "NONE",
        missionDays: 0
      });
    }

    if (
      missionDays < 1 ||
      !Number.isInteger(missionDays)
    ) {
      return null;
    }

    return calculateMission({
      expertFeeToman: result.finalFeeToman,
      missionType,
      missionDays
    });
  }, [result, missionType, missionDays]);

  const dailyMissionRate = useMemo(
    () => getMissionDailyRate(missionType),
    [missionType]
  );

  function handleMissionTypeChange(
    value: MissionType
  ): void {
    setMissionType(value);

    if (value === "NONE") {
      setMissionDays(1);
    }
  }

  return (
    <main
      className="ef-page"
      dir="rtl"
      data-testid="article13-calculator"
    >
      <PageHeader
        eyebrow="ماده ۱۳"
        title="محاسبه دستمزد تعیین اجاره‌بها"
        subtitle="تعرفه ۱۴۰۵ کارشناسان رسمی"
      />

      <div className="ef-form-shell">
        <div className="ef-stack">
          <SectionCard>
            <div className="ef-stack">
              <MoneyInput
                id="article13-monthly-rent"
                label="مبلغ اجاره‌بهای ماهانه (مبنای محاسبه)"
                value={monthlyRent}
                onChange={(value) => {
                  setMonthlyRent(value);
                  setSubmitted(false);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    monthlyRentToman > 0
                  ) {
                    setSubmitted(true);
                  }
                }}
                unit="تومان"
                placeholder="25,000,000"
                error={
                  submitted && !result
                    ? "لطفاً مبلغ معتبر وارد کنید."
                    : undefined
                }
              />

              <CalculateButton
                disabled={monthlyRentToman <= 0}
                onClick={() => setSubmitted(true)}
              >
                محاسبه دستمزد
              </CalculateButton>

              {result && (
                <FeeResultCard
                  feeToman={result.finalFeeToman}
                  title="دستمزد کارشناسی"
                  footer={
                    result.capped
                      ? "سقف مقرر ماده ۱۳ اعمال شده است."
                      : undefined
                  }
                />
              )}
            </div>
          </SectionCard>

          {result && (
            <SectionCard>
              <MissionSelector
                enabled={missionType !== "NONE"}
                onEnabledChange={(enabled) => {
                  if (!enabled) {
                    handleMissionTypeChange("NONE");
                    return;
                  }

                  handleMissionTypeChange(
                    missionType === "OUT_PROVINCE"
                      ? "OUT_PROVINCE"
                      : "IN_PROVINCE"
                  );
                }}
                location={
                  missionType === "OUT_PROVINCE"
                    ? "OUT_PROVINCE"
                    : "IN_PROVINCE"
                }
                onLocationChange={(location) => {
                  handleMissionTypeChange(location);
                }}
                days={missionDays}
                onDaysChange={setMissionDays}
                title="مأموریت کارشناسی"
              />

              {missionType !== "NONE" && (
                <div
                  className="ef-result-card"
                  style={{ marginTop: 16 }}
                >
                  <div className="ef-result-title">
                    فوق‌العاده روزانه مأموریت
                  </div>

                  <div
                    className="ef-result-value"
                    style={{ fontSize: 20 }}
                  >
                    {formatNumber(dailyMissionRate)} تومان
                  </div>

                  {missionResult && (
                    <>
                      <div
                        className="ef-result-title"
                        style={{ marginTop: 12 }}
                      >
                        فوق‌العاده مأموریت
                      </div>

                      <div
                        style={{
                          textAlign: "center",
                          fontWeight: 800
                        }}
                      >
                        {formatNumber(
                          missionResult.missionFeeToman
                        )} تومان
                      </div>

                      <div
                        className="ef-result-title"
                        style={{ marginTop: 12 }}
                      >
                        مبلغ نهایی قابل پرداخت
                      </div>

                      <div
                        className="ef-result-value"
                        style={{ fontSize: 22 }}
                      >
                        {formatNumber(
                          missionResult.totalPayableToman
                        )} تومان
                      </div>
                    </>
                  )}
                </div>
              )}
            </SectionCard>
          )}
        </div>
      </div>
    </main>
  );
}
