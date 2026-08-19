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
import { calculateArticle11Note1 } from "../engine/Article11Note1Calculator";
import {
  formatMoneyInput,
  oppositeCurrencyWords,
  parseMoneyValue,
} from "../components/ui/MoneyInput";
import type { ShareResultInput } from "../share/ShareResult";
import { saveLastShareableCalculation } from "../share/LastShareableCalculation";

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
  onOpenShare?: (input?: ShareResultInput) => void;
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

type CurrencyUnit = "TOMAN" | "RIAL";

function currencyDisplayValue(valueToman: string, unit: CurrencyUnit): string {
  const amount = parseMoneyValue(valueToman);
  if (!valueToman || !Number.isFinite(amount)) return "";
  return formatMoneyInput(String(unit === "RIAL" ? amount * 10 : amount));
}

function tomanValueFromInput(value: string, unit: CurrencyUnit): string {
  const amount = parseMoneyValue(value);
  return formatMoneyInput(String(unit === "RIAL" ? amount / 10 : amount));
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
  onOpenWaterEngineering,
  onOpenMetalsAndMining,
  onOpenMovableProperty,
  onOpenFinancialAffairs,
  onOpenVehicles,
  onOpenRoadBuilding,
  onOpenIndustryTechnology,
  onOpenAgricultureNaturalResources,
  onOpenHistory,
  onOpenShare,
  onOpenSettings,
  onOpenAbout,
}: HomePageProps) {
  const [quickValue, setQuickValue] = useState("");
  const [quickFee, setQuickFee] = useState<number | null>(null);
  const [quickError, setQuickError] = useState("");
  const [quickUnit, setQuickUnit] = useState<CurrencyUnit>("TOMAN");
  const [note1Value, setNote1Value] = useState("");
  const [note1Referral, setNote1Referral] = useState("");
  const [note1Error, setNote1Error] = useState("");
  const [note1Unit, setNote1Unit] = useState<CurrencyUnit>("TOMAN");

  function handleQuickCalculate(): void {
    const value = parseMoneyValue(quickValue);

    if (quickValue.trim() && value === 0) {
      setQuickFee(null);
      setQuickError("مبلغ واردشده معتبر نیست یا از محدوده امن محاسبه خارج است.");
      return;
    }

    if (value <= 0) {
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
      saveLastShareableCalculation({
        evaluationValueToman: value,
        expertCount: 1,
        calculatedFeeToman: result.finalExpertFeeToman,
        calculationTitle: "محاسبه سریع حق‌الزحمه کارشناسی",
        tariffReference: "ماده ۱۱ تعرفه ۱۴۰۵",
      });
    } catch (error) {
      setQuickFee(null);
      setQuickError(
        error instanceof Error ? error.message : "محاسبه انجام نشد.",
      );
    }
  }

  function handleNote1Calculate(): void {
    const value = parseMoneyValue(note1Value);

    if (note1Value.trim() && value === 0) {
      setNote1Referral("");
      setNote1Error("مبلغ واردشده معتبر نیست یا از محدوده امن محاسبه خارج است.");
      return;
    }

    if (value < 5_000_000_000_000) {
      setNote1Referral("");
      setNote1Error("تبصره ۱ ماده ۱۱ برای ارزش ۵ همت تومان یا بیشتر اعمال می‌شود.");
      return;
    }

    try {
      const result = calculateArticle11Note1({
        evaluationValueToman: value,
      });

      setNote1Referral(result.warning);
      setNote1Error("");
    } catch (error) {
      setNote1Referral("");
      setNote1Error(error instanceof Error ? error.message : "محاسبه انجام نشد.");
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
            <h1
              style={{
                margin: 0,
                fontSize: 38,
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: "-1px",
              }}
            >
              ExpertFee
            </h1>

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
          display: "flex",
          flexDirection: "column",
        }}
      >
        <section
          data-testid="home-quick-calculation"
          className="home-quick-calculation"
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
                value={currencyDisplayValue(quickValue, quickUnit)}
                onChange={(event) => {
                  setQuickValue(tomanValueFromInput(event.target.value, quickUnit));
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
                  padding: "16px 18px",
                  fontFamily: "inherit",
                  fontSize: 17,
                  textAlign: "center",
                  color: COLORS.textStrong,
                  background: COLORS.white,
                }}
              />

              <select
                value={quickUnit}
                onChange={(event) => setQuickUnit(event.target.value as CurrencyUnit)}
                aria-label="واحد مبلغ ارزیابی سریع"
                style={{
                  borderRight: `1px solid ${COLORS.border}`,
                  color: COLORS.primaryDark,
                  fontWeight: 800,
                  background: "#fbfdff",
                  border: 0,
                  textAlign: "center",
                  fontFamily: "inherit",
                }}
              >
                <option value="TOMAN">تومان</option>
                <option value="RIAL">ریال</option>
              </select>
            </div>

            {parseMoneyValue(quickValue) > 0 && (
              <div style={{ marginTop: 8, color: COLORS.muted, fontSize: 13, textAlign: "center", lineHeight: 1.9 }}>
                به حروف ({quickUnit === "TOMAN" ? "ریال" : "تومان"}): {oppositeCurrencyWords(parseMoneyValue(quickValue), quickUnit)}
              </div>
            )}

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

                <button
                  type="button"
                  onClick={() => onOpenShare?.({
                    evaluationValueToman: parseMoneyValue(quickValue),
                    expertCount: 1,
                    calculatedFeeToman: quickFee,
                    calculationTitle: "محاسبه سریع حق‌الزحمه کارشناسی",
                    tariffReference: "ماده ۱۱ تعرفه ۱۴۰۵",
                  })}
                  style={{ marginTop: 10, border: 0, background: "transparent", color: COLORS.primary, fontFamily: "inherit", fontWeight: 800, cursor: "pointer" }}
                >
                  اشتراک‌گذاری این نتیجه
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
              title="مهندسی آب"
              meta="مواد ۱۵ تا ۲۱"
              icon={<ShieldCheck size={31} />}
              onClick={onOpenWaterEngineering}
            />

            <ServiceCard
              title="فلزات و معادن"
              meta="ماده ۲۲"
              icon={<Factory size={31} />}
              onClick={onOpenMetalsAndMining}
            />

            <ServiceCard
              title="اموال منقول"
              meta="ماده ۲۳"
              icon={<Save size={31} />}
              onClick={onOpenMovableProperty}
            />

            <ServiceCard
              title="امور مالی"
              meta="مواد ۲۵ تا ۲۹"
              icon={<Calculator size={31} />}
              onClick={onOpenFinancialAffairs}
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
            order: 2,
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
            order: 3,
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
            order: 4,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          <button
            type="button"
            data-testid="home-share-action"
            onClick={() => onOpenShare?.()}
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

        <section
          data-testid="home-article11-note1-calculator"
          style={{
            order: 1,
            marginTop: 34,
            marginBottom: 28,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${COLORS.primaryVeryLight}, #ffffff)`,
            boxShadow: "0 8px 22px rgba(13, 71, 161, 0.06)",
            padding: "24px clamp(18px, 4vw, 38px)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <div style={{ color: COLORS.primaryDark, fontSize: 21, fontWeight: 900 }}>
              ارزیابی ۵ همت تومان یا بیشتر
            </div>
          </div>

          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <label
              htmlFor="article11-note1-value"
              style={{ display: "block", marginBottom: 8, color: COLORS.textStrong, fontWeight: 800 }}
            >
              ارزش مورد کارشناسی
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 110px", border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden", background: COLORS.white }}>
              <input
                id="article11-note1-value"
                data-testid="article11-note1-value"
                inputMode="numeric"
                value={currencyDisplayValue(note1Value, note1Unit)}
                onChange={(event) => {
                  setNote1Value(tomanValueFromInput(event.target.value, note1Unit));
                  setNote1Referral("");
                  setNote1Error("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleNote1Calculate();
                }}
                placeholder="مثال: ۵,۰۰۰,۰۰۰,۰۰۰,۰۰۱"
                style={{ boxSizing: "border-box", width: "100%", border: 0, padding: "16px 18px", fontFamily: "inherit", fontSize: 17, textAlign: "center", color: COLORS.textStrong, background: COLORS.white }}
              />

              <select
                value={note1Unit}
                onChange={(event) => setNote1Unit(event.target.value as CurrencyUnit)}
                aria-label="واحد مبلغ تبصره یک ماده ۱۱"
                style={{ border: 0, borderRight: `1px solid ${COLORS.border}`, padding: "6px 12px", background: "#fbfdff", color: COLORS.primaryDark, fontFamily: "inherit", fontWeight: 800, textAlign: "center" }}
              >
                <option value="TOMAN">تومان</option>
                <option value="RIAL">ریال</option>
              </select>
            </div>

            {parseMoneyValue(note1Value) > 0 && (
              <div style={{ marginTop: 8, color: COLORS.muted, fontSize: 13, textAlign: "center", lineHeight: 1.9 }}>
                به حروف ({note1Unit === "TOMAN" ? "ریال" : "تومان"}): {oppositeCurrencyWords(parseMoneyValue(note1Value), note1Unit)}
              </div>
            )}

            <button
              type="button"
              data-testid="article11-note1-calculate"
              onClick={handleNote1Calculate}
              style={{
                width: "100%",
                marginTop: 14,
                border: 0,
                borderRadius: 13,
                padding: "15px 18px",
                background: "linear-gradient(90deg, #1565c0, #0d5bd7)",
                color: COLORS.white,
                fontFamily: "inherit",
                fontSize: 17,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              بررسی شمول تبصره ۱ ماده ۱۱
            </button>

            {note1Error && (
              <div role="alert" style={{ marginTop: 14, border: "1px solid #fecaca", borderRadius: 12, background: "#fff7f7", color: COLORS.error, padding: "12px 14px", textAlign: "center", fontSize: 14, lineHeight: 1.8 }}>
                {note1Error}
              </div>
            )}

            {note1Referral && (
              <div
                data-testid="article11-note1-referral"
                role="status"
                aria-live="polite"
                style={{ marginTop: 16, border: `1px solid ${COLORS.border}`, borderRadius: 16, background: COLORS.white, padding: "18px 16px", textAlign: "center", color: COLORS.primaryDark, lineHeight: 2 }}
              >
                <strong>نیازمند تصمیم شورای عالی کارشناسان یا مرکز</strong>
                <div style={{ marginTop: 7 }}>{note1Referral}</div>
                <div style={{ marginTop: 7, color: COLORS.muted, fontSize: 12 }}>
                  سقف مندرج در تبصره برای هر کارشناس ۳۰۰ میلیون تومان است؛ این سقف به معنی مبلغ قطعی نیست.
                </div>
              </div>
            )}
          </div>
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
