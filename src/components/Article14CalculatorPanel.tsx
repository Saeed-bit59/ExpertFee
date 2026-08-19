import {
  useMemo,
  useState
} from "react";

import {
  calculateArticle14
} from "../engine/Article14Calculator";

import {
  calculateMission
} from "../engine/MissionCalculator";

import type {
  MissionType
} from "../engine/MissionCalculator";

import PageHeader
  from "./ui/PageHeader";
import SectionCard
  from "./ui/SectionCard";
import CalculateButton
  from "./ui/CalculateButton";
import FeeResultCard
  from "./ui/FeeResultCard";
import MissionSelector
  from "./ui/MissionSelector";

function formatToman(
  value: number
): string {
  return `${Math.round(value)
    .toLocaleString("fa-IR")} تومان`;
}

function normalizeNonNegativeInteger(
  value: string
): number {
  const parsed =
    Math.floor(
      Number(value) || 0
    );

  return Math.max(
    0,
    parsed
  );
}

function normalizePositiveInteger(
  value: string
): number {
  const parsed =
    Math.floor(
      Number(value) || 1
    );

  return Math.max(
    1,
    parsed
  );
}

export default function Article14CalculatorPanel() {
  const [
    pastImageYearCount,
    setPastImageYearCount
  ] = useState(0);

  const [
    hasAdditionalConnectedParcels,
    setHasAdditionalConnectedParcels
  ] = useState(false);

  const [
    additionalConnectedParcelCount,
    setAdditionalConnectedParcelCount
  ] = useState(1);

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

  function invalidateCalculation(): void {
    setSubmitted(false);
  }

  const result =
    useMemo(
      () =>
        submitted
          ? calculateArticle14({
              pastImageYearCount,
              hasAdditionalConnectedParcels,
              additionalConnectedParcelCount
            })
          : null,
      [
        submitted,
        pastImageYearCount,
        hasAdditionalConnectedParcels,
        additionalConnectedParcelCount
      ]
    );

  const mission =
    useMemo(() => {
      if (!result) {
        return null;
      }

      return calculateMission({
        expertFeeToman:
          result.finalFeeToman,
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

  return (
    <main
      className="ef-page"
      dir="rtl"
      data-testid="article14-calculator"
    >
      <PageHeader
        eyebrow="ماده ۱۴"
        title="تفسیر عکس‌های هوایی و ماهواره‌ای"
        subtitle="محاسبه حق‌الزحمه موضوع ماده ۱۴ تعرفه ۱۴۰۵"
      />

      <div className="ef-form-shell">
        <div className="ef-stack">
          <SectionCard
            title="اطلاعات محاسبه ماده ۱۴"
          >
            <div className="ef-stack">
              <label
                className="ef-field-label"
                htmlFor="article14-past-image-years"
              >
                تعداد سال تصاویر سنوات گذشته
              </label>

              <input
                id="article14-past-image-years"
                className="ef-days-input article14-number-input"
                type="number"
                min={0}
                inputMode="numeric"
                value={
                  pastImageYearCount
                }
                onChange={(event) => {
                  setPastImageYearCount(
                    normalizeNonNegativeInteger(
                      event.target.value
                    )
                  );
                  invalidateCalculation();
                }}
              />

              <label
                className="ef-choice"
                data-active={
                  hasAdditionalConnectedParcels
                }
              >
                <input
                  type="checkbox"
                  checked={
                    hasAdditionalConnectedParcels
                  }
                  onChange={(event) => {
                    setHasAdditionalConnectedParcels(
                      event.target.checked
                    );

                    if (
                      !event.target.checked
                    ) {
                      setAdditionalConnectedParcelCount(
                        1
                      );
                    }

                    invalidateCalculation();
                  }}
                />

                <span>
                  پلاک‌های ثبتی متصل اضافی
                  وجود دارد
                </span>
              </label>

              {hasAdditionalConnectedParcels && (
                <>
                  <label
                    className="ef-field-label"
                    htmlFor="article14-additional-parcels"
                  >
                    تعداد پلاک متصل اضافی
                  </label>

                  <input
                    id="article14-additional-parcels"
                    className="ef-days-input article14-number-input"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={
                      additionalConnectedParcelCount
                    }
                    onChange={(event) => {
                      setAdditionalConnectedParcelCount(
                        normalizePositiveInteger(
                          event.target.value
                        )
                      );
                      invalidateCalculation();
                    }}
                  />
                </>
              )}

              <CalculateButton
                onClick={() =>
                  setSubmitted(true)
                }
              >
                محاسبه دستمزد
              </CalculateButton>

              {result && (
                <FeeResultCard
                  feeToman={
                    result.finalFeeToman
                  }
                  title="دستمزد کارشناسی"
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

          <div
            className="ef-helper"
            style={{
              padding: 13
            }}
          >
            طبق ماده ۱۴، مبلغ ارزیابی
            ورودی فرمول این ماده نیست؛
            بنابراین برای حفظ صحت تعرفه،
            ورودی مبلغ ارزیابی به این صفحه
            اضافه نشده است.
          </div>
        </div>
      </div>
    </main>
  );
}
