import { useState } from "react";
import {
  Building2,
  Calculator,
  Car,
  Factory,
  FileBarChart2,
  Home,
  Image,
  Info,
  Leaf,
  Save,
  Share2,
  ShieldCheck,
} from "lucide-react";

import { calculateCommonFee } from "../engine/CommonFeeEngine";
import { buildShareResult } from "../share/ShareResultBuilder";

interface HomePageProps {
  onOpenArticle11: () => void;
  onOpenArticle13: () => void;
  onOpenArticle14: () => void;
  onOpenWaterEngineering: () => void;
  onOpenMetalsAndMining: () => void;
  onOpenMovableProperty: () => void;
  onOpenFinancialAffairs: () => void;
  onOpenVehicles: () => void;
  onOpenRoadBuilding: () => void;
  onOpenIndustryTechnology: () => void;
  onOpenAgricultureNaturalResources: () => void;
  onOpenHistory?: () => void;
  onOpenSettings?: () => void;
  onOpenAbout?: () => void;
}

type ServiceCardProps = {
  title: string;
  meta: string;
  icon: React.ReactNode;
  onClick: () => void;
};

const COLORS = {
  primary: "#1565c0",
  primaryDark: "#0d47a1",
  primaryLight: "#eaf3ff",
  primaryVeryLight: "#f5f9ff",
  white: "#ffffff",
  text: "#16345f",
  textStrong: "#0b3475",
  muted: "#64748b",
  border: "#cfe0f5",
  page: "#f8fbff",
  error: "#b91c1c",
};

function toEnglishDigits(value: string): string {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

  return value
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)));
}

function parseToman(value: string): number {
  const normalized = toEnglishDigits(value)
    .replace(/[,\s٬،]/g, "")
    .trim();

  if (normalized === "" || !/^\d+$/.test(normalized)) {
    return Number.NaN;
  }

  return Number(normalized);
}

function formatToman(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

function ServiceCard({
  title,
  meta,
  icon,
  onClick,
}: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        minHeight: 170,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        background: COLORS.white,
        boxShadow: "0 8px 22px rgba(13, 71, 161, 0.08)",
        padding: "22px 16px",
        cursor: "pointer",
        fontFamily: "inherit",
        color: COLORS.textStrong,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          background: COLORS.primaryLight,
          color: COLORS.primary,
          display: "grid",
          placeItems: "center",
          marginBottom: 14,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: 19,
          lineHeight: 1.8,
          fontWeight: 800,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 5,
          color: COLORS.primary,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {meta}
      </div>
    </button>
  );
}

export default function HomePage({
  onOpenArticle11,
  onOpenArticle13,
  onOpenArticle14,
  onOpenVehicles,
  onOpenRoadBuilding,
  onOpenIndustryTechnology,
  onOpenAgricultureNaturalResources,
  onOpenHistory,
  onOpenSettings,
  onOpenAbout,
}: HomePageProps) {
  const [quickValue, setQuickValue] = useState("");
  const [quickFee, setQuickFee] = useState<number | null>(null);
  const [quickError, setQuickError] = useState("");

  function handleQuickCalculate(): void {
    const value = parseToman(quickValue);

    if (!Number.isFinite(value) || value <= 0) {
      setQuickFee(null);
      setQuickError(
        "لطفاً ارزش مورد کارشناسی را به‌صورت عددی و بزرگ‌تر از صفر وارد کنید.",
      );
      return;
    }

    try {
      const result = calculateCommonFee({
        baseMode: "ARTICLE_11",
        evaluationValueToman: value,
      });

      setQuickFee(result.finalExpertFeeToman);
      setQuickError("");
    } catch (error) {
      setQuickFee(null);
      setQuickError(
        error instanceof Error ? error.message : "محاسبه انجام نشد.",
      );
    }
  }

  async function handleShare(): Promise<void> {
    if (quickFee === null) {
      window.alert("ابتدا یک محاسبه انجام دهید تا نتیجه قابل اشتراک‌گذاری ایجاد شود.");
      return;
    }

    const evaluation = parseToman(quickValue);

    const shareResult = buildShareResult({
      evaluationValueToman: evaluation,
      expertCount: 1,
      calculatedFeeToman: quickFee,
    });

    const text = shareResult.text;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareResult.title,
          text,
        });
        return;
      }

      await navigator.clipboard.writeText(text);
      window.alert("متن نتیجه در کلیپ‌بورد کپی شد.");
    } catch {
      // User cancellation or unavailable sharing should not break the page.
    }
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: COLORS.page,
        color: COLORS.text,
        fontFamily: "Tahoma, Arial, sans-serif",
      }}
    >
      {/* Header — intentionally contains branding only. */}
      <header
        style={{
          background:
            "linear-gradient(135deg, #0d47a1 0%, #1565c0 55%, #0b55bd 100%)",
          color: COLORS.white,
          boxShadow: "0 8px 24px rgba(13, 71, 161, 0.18)",
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            minHeight: 122,
            padding: "18px 28px",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 38,
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: "-1px",
              }}
            >
              ExpertFee
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              محاسبه حق‌الزحمه کارشناسان رسمی
            </div>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "42px 24px 0",
        }}
      >
        <section
          style={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 22,
            background:
              `linear-gradient(135deg, ${COLORS.primaryVeryLight}, #ffffff)`,
            boxShadow: "0 10px 30px rgba(13, 71, 161, 0.06)",
            padding: "30px clamp(20px, 5vw, 52px)",
            marginBottom: 38,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div
              style={{
                color: COLORS.primaryDark,
                fontSize: 23,
                lineHeight: 1.8,
                fontWeight: 900,
              }}
            >
              محاسبه سریع با وارد کردن ارزش مورد کارشناسی
            </div>

            <div
              style={{
                marginTop: 5,
                color: COLORS.muted,
                fontSize: 14,
              }}
            >
              مبلغ ارزیابی را وارد کنید و حق‌الزحمه پایه ماده ۱۱ را فوراً مشاهده کنید.
            </div>
          </div>

          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <label
              htmlFor="quick-evaluation-value"
              style={{
                display: "block",
                marginBottom: 8,
                color: COLORS.textStrong,
                fontWeight: 800,
                textAlign: "right",
              }}
            >
              ارزش مورد کارشناسی
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                overflow: "hidden",
                background: COLORS.white,
              }}
            >
              <input
                id="quick-evaluation-value"
                inputMode="numeric"
                value={quickValue}
                onChange={(event) => {
                  setQuickValue(event.target.value);
                  setQuickFee(null);
                  setQuickError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleQuickCalculate();
                  }
                }}
                placeholder="عدد را وارد کنید"
                style={{
                  minWidth: 0,
                  border: 0,
                  outline: "none",
                  padding: "16px 18px",
                  fontFamily: "inherit",
                  fontSize: 17,
                  textAlign: "right",
                  color: COLORS.textStrong,
                  background: COLORS.white,
                }}
              />

              <div
                style={{
                  borderRight: `1px solid ${COLORS.border}`,
                  display: "grid",
                  placeItems: "center",
                  color: COLORS.primaryDark,
                  fontWeight: 800,
                  background: "#fbfdff",
                }}
              >
                تومان
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickCalculate}
              style={{
                width: "100%",
                marginTop: 14,
                border: 0,
                borderRadius: 13,
                padding: "15px 18px",
                background: "linear-gradient(90deg, #1565c0, #0d5bd7)",
                color: COLORS.white,
                fontFamily: "inherit",
                fontSize: 18,
                fontWeight: 900,
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 9,
              }}
            >
              <Calculator size={21} />
              محاسبه سریع
            </button>

            {quickError && (
              <div
                role="alert"
                style={{
                  marginTop: 14,
                  border: "1px solid #fecaca",
                  borderRadius: 12,
                  background: "#fff7f7",
                  color: COLORS.error,
                  padding: "12px 14px",
                  textAlign: "center",
                  fontSize: 14,
                  lineHeight: 1.8,
                }}
              >
                {quickError}
              </div>
            )}

            {quickFee !== null && (
              <div
                style={{
                  marginTop: 16,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 16,
                  background: COLORS.white,
                  padding: "18px 16px",
                  textAlign: "center",
                }}
              >
                <div style={{ color: COLORS.muted, fontSize: 13 }}>
                  حق‌الزحمه پایه بر اساس ماده ۱۱
                </div>

                <div
                  style={{
                    marginTop: 7,
                    color: COLORS.primaryDark,
                    fontSize: 27,
                    fontWeight: 900,
                  }}
                >
                  {formatToman(quickFee)} تومان
                </div>

                <button
                  type="button"
                  onClick={onOpenArticle11}
                  style={{
                    marginTop: 12,
                    border: 0,
                    background: "transparent",
                    color: COLORS.primary,
                    fontFamily: "inherit",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  ورود به محاسبه کامل ماده ۱۱
                </button>
              </div>
            )}
          </div>
        </section>

        <section style={{ textAlign: "center", marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                height: 1,
                flex: 1,
                background:
                  "linear-gradient(90deg, transparent, #72a9ea)",
              }}
            />

            <h2
              style={{
                margin: 0,
                color: COLORS.primaryDark,
                fontSize: 23,
                lineHeight: 1.8,
              }}
            >
              یا نوع کارشناسی مورد نظر خود را انتخاب کنید
            </h2>

            <div
              style={{
                height: 1,
                flex: 1,
                background:
                  "linear-gradient(90deg, #72a9ea, transparent)",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 5,
              color: COLORS.muted,
              fontSize: 14,
            }}
          >
            برای محاسبه دقیق‌تر، نوع خدمت کارشناسی را انتخاب کنید.
          </div>
        </section>

        <section>
          <button
            type="button"
            onClick={onOpenArticle11}
            style={{
              width: "100%",
              minHeight: 165,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 20,
              background: COLORS.white,
              boxShadow: "0 8px 22px rgba(13, 71, 161, 0.08)",
              padding: "24px 18px",
              cursor: "pointer",
              fontFamily: "inherit",
              color: COLORS.textStrong,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: "50%",
                background: COLORS.primaryLight,
                color: COLORS.primary,
                display: "grid",
                placeItems: "center",
                marginBottom: 13,
              }}
            >
              <FileBarChart2 size={31} />
            </div>

            <div style={{ fontSize: 20, fontWeight: 900 }}>
              ارزیابی عمومی
            </div>

            <div
              style={{
                marginTop: 5,
                color: COLORS.primary,
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              ماده ۱۱
            </div>
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 16,
              marginTop: 16,
            }}
          >
            <ServiceCard
              title="اجاره‌بها"
              meta="ماده ۱۳"
              icon={<Home size={31} />}
              onClick={onOpenArticle13}
            />

            <ServiceCard
              title="راه و ساختمان"
              meta="گروه ۶"
              icon={<Building2 size={31} />}
              onClick={onOpenRoadBuilding}
            />

            <ServiceCard
              title="صنعت و فن"
              meta="گروه ۷"
              icon={<Factory size={31} />}
              onClick={onOpenIndustryTechnology}
            />

            <ServiceCard
              title="تفسیر تصاویر و نقشه‌ها"
              meta="ماده ۱۴"
              icon={<Image size={31} />}
              onClick={onOpenArticle14}
            />

            <ServiceCard
              title="کشاورزی و منابع طبیعی"
              meta="گروه ۹"
              icon={<Leaf size={31} />}
              onClick={onOpenAgricultureNaturalResources}
            />

            <ServiceCard
              title="وسائط نقلیه"
              meta="گروه ۵"
              icon={<Car size={31} />}
              onClick={onOpenVehicles}
            />
          </div>
        </section>

        <section
          style={{
            marginTop: 24,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 17,
            background: COLORS.primaryVeryLight,
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              flex: "0 0 42px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: COLORS.primary,
              color: COLORS.white,
            }}
          >
            <Info size={23} />
          </div>

          <div style={{ flex: 1, textAlign: "right" }}>
            <div
              style={{
                color: COLORS.textStrong,
                fontWeight: 900,
                marginBottom: 4,
              }}
            >
              توجه مهم
            </div>

            <div
              style={{
                color: COLORS.muted,
                fontSize: 13,
                lineHeight: 1.9,
              }}
            >
              نتایج محاسبات بر اساس تعرفه جاری سامانه ارائه می‌شود و جنبه
              محاسباتی و اطلاع‌رسانی دارد؛ مسئولیت بررسی نهایی با کارشناس مربوط است.
            </div>
          </div>
        </section>

        {/* Existing records action remains separate. */}
        <section
          data-testid="home-history-action-area"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 22,
            marginBottom: 14,
          }}
        >
          <button
            type="button"
            data-testid="home-history-action"
            onClick={() => onOpenHistory?.()}
            style={{
              minHeight: 70,
              width: "100%",
              maxWidth: 520,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              background: COLORS.white,
              color: COLORS.textStrong,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(13, 71, 161, 0.06)",
            }}
          >
            <Save size={27} color={COLORS.primary} />
            <span>
              <strong>ذخیره و سوابق</strong>
              <br />
              <small style={{ color: COLORS.muted }}>
                ذخیره محاسبات و مشاهده سوابق
              </small>
            </span>
          </button>
        </section>

        {/* Final approved NEW action bar: exactly three actions. */}
        <section
          data-testid="home-bottom-new-actions"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <button
            type="button"
            data-testid="home-share-action"
            onClick={handleShare}
            style={{
              minHeight: 92,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              background: COLORS.white,
              color: COLORS.textStrong,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(13, 71, 161, 0.06)",
            }}
          >
            <Share2 size={28} color={COLORS.primary} />
            <span>
              <strong>اشتراک‌گذاری</strong>
              <br />
              <small style={{ color: COLORS.muted }}>
                ارسال و اشتراک نتایج
              </small>
            </span>
          </button>

          <button
            type="button"
            data-testid="home-about-action"
            onClick={() => onOpenAbout?.()}
            style={{
              minHeight: 92,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              background: COLORS.white,
              color: COLORS.textStrong,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(13, 71, 161, 0.06)",
            }}
          >
            <Info size={28} color={COLORS.primary} />
            <span>
              <strong>درباره نرم‌افزار</strong>
              <br />
              <small style={{ color: COLORS.muted }}>
                اطلاعات و راهنما
              </small>
            </span>
          </button>

          <button
            type="button"
            data-testid="home-settings-action"
            onClick={() => onOpenSettings?.()}
            style={{
              minHeight: 92,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              background: COLORS.white,
              color: COLORS.textStrong,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(13, 71, 161, 0.06)",
            }}
          >
            <ShieldCheck size={28} color={COLORS.primary} />
            <span>
              <strong>تنظیمات</strong>
              <br />
              <small style={{ color: COLORS.muted }}>
                تنظیمات نرم‌افزار
              </small>
            </span>
          </button>
        </section>
      </main>

      <footer
        style={{
          marginTop: 10,
          background: "linear-gradient(135deg, #0d47a1, #0755ba)",
          color: COLORS.white,
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: "0 auto",
            minHeight: 86,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            textAlign: "center",
          }}
        >
          <ShieldCheck size={34} />

          <div>
            <div style={{ fontWeight: 900 }}>ExpertFee</div>
            <div style={{ marginTop: 4, fontSize: 12, opacity: 0.9 }}>
              محاسبه دقیق، شفاف و مستند حق‌الزحمه کارشناسی
            </div>
          </div>
        </div>
      </footer>

      <style>
        {`
          @media (max-width: 700px) {
            main {
              padding-left: 14px !important;
              padding-right: 14px !important;
              padding-top: 24px !important;
            }
          }

          @media (max-width: 560px) {
            [data-testid="home-bottom-new-actions"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}
