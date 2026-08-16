import { useMemo, useState } from "react";
import { calculateExpertFee } from "../engine/ExpertFeeEngine";
import type { VehicleService } from "../engine/VehicleCalculator";
import type { MissionType } from "../engine/MissionCalculator";

type VehicleArea = "LAND" | "MARINE";

interface VehiclePageProps {
  onBack: () => void;
}

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

function formatInputNumber(value: string): string {
  const cleaned = value.replace(/[^\d]/g, "");
  return cleaned
    ? Number(cleaned).toLocaleString("en-US")
    : "";
}

function parseNumber(value: string): number {
  const number = Number(value.replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
}

export default function VehiclePage({
  onBack
}: VehiclePageProps) {
  const [area, setArea] =
    useState<VehicleArea>("LAND");

  /*
   * مسیر اصلی هر حوزه، ارزیابی است.
   * سایر خدمات پایین‌تر نمایش داده می‌شوند.
   */
  const [service, setService] =
    useState<VehicleService>("LAND_VALUATION");

  const [evaluationValue, setEvaluationValue] =
    useState("");

  const [missionType, setMissionType] =
    useState<MissionType>("NONE");

  const [missionDays, setMissionDays] =
    useState(0);

  const [submitted, setSubmitted] =
    useState(false);

  const primaryValuationService: VehicleService =
    area === "LAND"
      ? "LAND_VALUATION"
      : "MARINE_VALUATION";

  const isPrimaryValuation =
    service === primaryValuationService;

  const needsValue =
    service === "LAND_VALUATION" ||
    service === "TRANSPORT_CLAIM" ||
    service === "MARINE_VALUATION";

  const evaluationValueToman = useMemo(
    () => parseNumber(evaluationValue),
    [evaluationValue]
  );

  const result = useMemo(() => {
    if (!submitted) {
      return null;
    }

    if (
      needsValue &&
      evaluationValueToman <= 0
    ) {
      return null;
    }

    try {
      return calculateExpertFee({
        group: 5,
        data: {
          service,
          evaluationValueToman:
            needsValue
              ? evaluationValueToman
              : undefined,
          missionType,
          missionDays:
            missionType === "NONE"
              ? 0
              : missionDays
        }
      });
    } catch {
      return null;
    }
  }, [
    submitted,
    service,
    needsValue,
    evaluationValueToman,
    missionType,
    missionDays
  ]);

  function changeArea(
    nextArea: VehicleArea
  ): void {
    setArea(nextArea);

    setService(
      nextArea === "LAND"
        ? "LAND_VALUATION"
        : "MARINE_VALUATION"
    );

    setEvaluationValue("");
    setSubmitted(false);
  }

  function changeService(
    nextService: VehicleService
  ): void {
    setService(nextService);
    setEvaluationValue("");
    setSubmitted(false);
  }

  function changeMission(
    next: MissionType
  ): void {
    setMissionType(next);

    setMissionDays(
      next === "NONE"
        ? 0
        : Math.max(1, missionDays)
    );

    setSubmitted(false);
  }

  const card = {
    border: "1px solid #d7e6f7",
    borderRadius: 16,
    padding: 20,
    background: "#ffffff",
    marginBottom: 18,
    boxShadow:
      "0 6px 18px rgba(13, 71, 161, 0.05)"
  } as const;

  const choice = (
    active: boolean
  ) => ({
    border: active
      ? "2px solid #1565c0"
      : "1px solid #cbd5e1",
    borderRadius: 12,
    padding: "13px 14px",
    cursor: "pointer",
    background: active
      ? "#eef6ff"
      : "#ffffff",
    textAlign: "center" as const,
    fontWeight: active ? 800 : 600
  });

  const radio = {
    display: "flex",
    gap: 9,
    alignItems: "flex-start",
    marginBottom: 12,
    cursor: "pointer"
  } as const;

  function renderCalculationBox() {
    if (!needsValue) {
      return null;
    }

    const label =
      service === "TRANSPORT_CLAIM"
        ? "مبلغ خواسته"
        : area === "LAND"
          ? "مبلغ ارزیابی وسیله نقلیه زمینی"
          : "مبلغ ارزیابی وسیله نقلیه دریایی";

    return (
      <section style={card}>
        <label
          style={{
            display: "block",
            fontWeight: 800,
            marginBottom: 9,
            color: "#16345f"
          }}
        >
          {label}
        </label>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          <input
            type="text"
            inputMode="numeric"
            value={evaluationValue}
            onChange={(event) => {
              setEvaluationValue(
                formatInputNumber(
                  event.target.value
                )
              );
              setSubmitted(false);
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                evaluationValueToman > 0
              ) {
                setSubmitted(true);
              }
            }}
            placeholder="مثال: 2,500,000,000"
            style={{
              flex: 1,
              minWidth: 0,
              border: "1px solid #cbd5e1",
              borderRadius: 10,
              padding: "13px 14px",
              fontSize: 16,
              fontFamily: "inherit",
              direction: "ltr",
              textAlign: "left"
            }}
          />

          <span style={{ fontWeight: 700 }}>
            تومان
          </span>
        </div>

        <div
          style={{
            marginTop: 8,
            color: "#64748b",
            fontSize: 13
          }}
        >
          دستمزد این خدمت مطابق ماده ۱۱ محاسبه می‌شود.
        </div>

        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={evaluationValueToman <= 0}
          style={{
            width: "100%",
            marginTop: 13,
            border: 0,
            borderRadius: 12,
            padding: 14,
            background:
              evaluationValueToman > 0
                ? "#1565c0"
                : "#94a3b8",
            color: "#ffffff",
            fontWeight: 900,
            fontSize: 17,
            fontFamily: "inherit",
            cursor:
              evaluationValueToman > 0
                ? "pointer"
                : "not-allowed"
          }}
        >
          محاسبه دستمزد
        </button>

        {submitted && !result && (
          <div
            style={{
              marginTop: 12,
              color: "#b91c1c",
              textAlign: "center"
            }}
          >
            اطلاعات لازم برای محاسبه کامل نیست.
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: 13,
              padding: 16,
              borderRadius: 13,
              background: "#eef6ff",
              border: "1px solid #b9d5f5",
              textAlign: "center"
            }}
          >
            <div>دستمزد کارشناسی</div>

            <strong
              style={{
                display: "block",
                fontSize: 28,
                color: "#0d47a1",
                direction: "ltr"
              }}
            >
              {formatNumber(
                result.expertFeeToman
              )}{" "}
              تومان
            </strong>

            {result.missionFeeToman > 0 && (
              <div>
                مبلغ نهایی با مأموریت:{" "}
                <strong>
                  {formatNumber(
                    result.totalPayableToman
                  )}{" "}
                  تومان
                </strong>
              </div>
            )}
          </div>
        )}
      </section>
    );
  }

  return (
    <main
      dir="rtl"
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        fontFamily:
          'Vazirmatn, IRANSans, "Segoe UI", Tahoma, Arial, sans-serif',
        lineHeight: 1.9
      }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          padding: "9px 16px",
          border: "1px solid #cbd5e1",
          borderRadius: 9,
          background: "#ffffff",
          cursor: "pointer",
          fontFamily: "inherit"
        }}
      >
        ← بازگشت به صفحه اصلی
      </button>

      <h1
        style={{
          marginBottom: 4,
          color: "#0d47a1",
          textAlign: "center"
        }}
      >
        وسائط نقلیه
      </h1>

      <div
        style={{
          color: "#64748b",
          marginBottom: 22,
          textAlign: "center"
        }}
      >
        محاسبه دستمزد مواد ۳۱ و ۳۲ تعرفه
      </div>

      {/* 1. حوزه کارشناسی */}
      <section style={card}>
        <h2
          style={{
            marginTop: 0,
            fontSize: 19,
            textAlign: "center",
            color: "#16345f"
          }}
        >
          حوزه کارشناسی
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: 10
          }}
        >
          <label style={choice(area === "LAND")}>
            <input
              type="radio"
              checked={area === "LAND"}
              onChange={() => changeArea("LAND")}
              style={{ marginLeft: 6 }}
            />
            وسائط نقلیه موتوری زمینی
          </label>

          <label style={choice(area === "MARINE")}>
            <input
              type="radio"
              checked={area === "MARINE"}
              onChange={() => changeArea("MARINE")}
              style={{ marginLeft: 6 }}
            />
            وسائط نقلیه دریایی و حمل‌ونقل
          </label>
        </div>
      </section>

      {/* 2. مسیر اصلی: ارزیابی همان حوزه */}
      {isPrimaryValuation &&
        renderCalculationBox()}

      {/* 3. سایر گزینه‌ها پایین مسیر اصلی */}
      <section style={card}>
        <h2
          style={{
            marginTop: 0,
            fontSize: 19,
            color: "#16345f"
          }}
        >
          سایر خدمات کارشناسی
        </h2>

        {area === "LAND" ? (
          <>
            <label style={radio}>
              <input
                type="radio"
                checked={
                  service === "LAND_AUTHENTICITY"
                }
                onChange={() =>
                  changeService(
                    "LAND_AUTHENTICITY"
                  )
                }
              />
              رسیدگی به اصالت خودرو
            </label>

            <label style={radio}>
              <input
                type="radio"
                checked={
                  service === "LAND_ACCIDENT"
                }
                onChange={() =>
                  changeService(
                    "LAND_ACCIDENT"
                  )
                }
              />
              رسیدگی به تصادفات
            </label>

            <label style={radio}>
              <input
                type="radio"
                checked={
                  service === "LAND_TONNAGE_MODEL"
                }
                onChange={() =>
                  changeService(
                    "LAND_TONNAGE_MODEL"
                  )
                }
              />
              اظهارنظر فنی تعیین تناژ و مدل
            </label>

            {!isPrimaryValuation && (
              <button
                type="button"
                onClick={() =>
                  changeService(
                    "LAND_VALUATION"
                  )
                }
                style={{
                  marginTop: 6,
                  border: "1px solid #1565c0",
                  borderRadius: 10,
                  padding: "10px 14px",
                  background: "#ffffff",
                  color: "#1565c0",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 800
                }}
              >
                بازگشت به ارزیابی وسیله نقلیه زمینی
              </button>
            )}
          </>
        ) : (
          <>
            <label style={radio}>
              <input
                type="radio"
                checked={
                  service === "TRANSPORT_CLAIM"
                }
                onChange={() =>
                  changeService(
                    "TRANSPORT_CLAIM"
                  )
                }
              />
              دعاوی مربوط به حمل‌ونقل بر اساس مبلغ خواسته
            </label>

            <label style={radio}>
              <input
                type="radio"
                checked={
                  service ===
                  "INLAND_BOAT_COLLISION"
                }
                onChange={() =>
                  changeService(
                    "INLAND_BOAT_COLLISION"
                  )
                }
              />
              تصادم قایق‌های تفریحی و مسافربری در آب‌های داخلی
            </label>

            <label style={radio}>
              <input
                type="radio"
                checked={
                  service ===
                  "SEA_COLLISION_UNDER_500_GT"
                }
                onChange={() =>
                  changeService(
                    "SEA_COLLISION_UNDER_500_GT"
                  )
                }
              />
              تصادم دریایی؛ ظرفیت مبنا کمتر از ۵۰۰ GT
            </label>

            <label style={radio}>
              <input
                type="radio"
                checked={
                  service ===
                  "SEA_COLLISION_500_GT_OR_MORE"
                }
                onChange={() =>
                  changeService(
                    "SEA_COLLISION_500_GT_OR_MORE"
                  )
                }
              />
              تصادم دریایی؛ ظرفیت مبنا ۵۰۰ GT یا بیشتر
            </label>

            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: "#f8fafc",
                borderRadius: 10,
                color: "#475569",
                fontSize: 14
              }}
            >
              در تصادم شناورهای با ظرفیت متفاوت، ظرفیت بالاتر مبنای تعیین دستمزد است. غواصی و عملیات زیرآبی به دلیل ارجاع به ماده ۹ در محاسبات خودکار این صفحه وارد نشده است.
            </div>

            {!isPrimaryValuation && (
              <button
                type="button"
                onClick={() =>
                  changeService(
                    "MARINE_VALUATION"
                  )
                }
                style={{
                  marginTop: 10,
                  border: "1px solid #1565c0",
                  borderRadius: 10,
                  padding: "10px 14px",
                  background: "#ffffff",
                  color: "#1565c0",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 800
                }}
              >
                بازگشت به ارزیابی وسیله نقلیه دریایی
              </button>
            )}
          </>
        )}
      </section>

      {/* خدمات دیگری که به مبلغ نیاز دارند */}
      {!isPrimaryValuation &&
        needsValue &&
        renderCalculationBox()}

      {/* خدمات مبلغ مقطوع */}
      {!needsValue && (
        <section style={card}>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            style={{
              width: "100%",
              border: 0,
              borderRadius: 12,
              padding: 15,
              background: "#1565c0",
              color: "#ffffff",
              fontWeight: 900,
              fontSize: 17,
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            محاسبه دستمزد
          </button>

          {submitted && !result && (
            <div
              style={{
                marginTop: 12,
                color: "#b91c1c",
                textAlign: "center"
              }}
            >
              اطلاعات لازم برای محاسبه کامل نیست.
            </div>
          )}

          {result && (
            <div
              style={{
                marginTop: 13,
                padding: 16,
                borderRadius: 13,
                background: "#eef6ff",
                border: "1px solid #b9d5f5",
                textAlign: "center"
              }}
            >
              <div>دستمزد کارشناسی</div>

              <strong
                style={{
                  display: "block",
                  fontSize: 28,
                  color: "#0d47a1"
                }}
              >
                {formatNumber(
                  result.expertFeeToman
                )}{" "}
                تومان
              </strong>
            </div>
          )}
        </section>
      )}

      {/* مأموریت */}
      <section style={card}>
        <h2
          style={{
            marginTop: 0,
            fontSize: 19,
            textAlign: "center",
            color: "#16345f"
          }}
        >
          مأموریت
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: 10
          }}
        >
          <label
            style={choice(
              missionType === "NONE"
            )}
          >
            <input
              type="radio"
              checked={missionType === "NONE"}
              onChange={() =>
                changeMission("NONE")
              }
              style={{ marginLeft: 6 }}
            />
            بدون مأموریت
          </label>

          <label
            style={choice(
              missionType === "IN_PROVINCE"
            )}
          >
            <input
              type="radio"
              checked={
                missionType === "IN_PROVINCE"
              }
              onChange={() =>
                changeMission("IN_PROVINCE")
              }
              style={{ marginLeft: 6 }}
            />
            داخل استان
          </label>

          <label
            style={choice(
              missionType === "OUT_PROVINCE"
            )}
          >
            <input
              type="radio"
              checked={
                missionType === "OUT_PROVINCE"
              }
              onChange={() =>
                changeMission("OUT_PROVINCE")
              }
              style={{ marginLeft: 6 }}
            />
            خارج استان
          </label>
        </div>

        {missionType !== "NONE" && (
          <div style={{ marginTop: 14 }}>
            <label
              style={{
                display: "block",
                fontWeight: 800,
                marginBottom: 7
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
                setSubmitted(false);
              }}
              style={{
                width: 140,
                border: "1px solid #cbd5e1",
                borderRadius: 9,
                padding: 10,
                fontFamily: "inherit"
              }}
            />
          </div>
        )}
      </section>
    </main>
  );
}
