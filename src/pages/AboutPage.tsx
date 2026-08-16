import { useEffect, useMemo, useState } from "react";

interface Props {
  onBack: () => void;
}

const APP_NAME = "ExpertFee";
const APP_VERSION = "0.1.0";
const TARIFF_URL = "/tarife.md";
const LOGO_URL = "/expertfee-logo.jpg";

const FONT =
  'Vazirmatn, IRANSans, "Segoe UI", Tahoma, Arial, sans-serif';

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d7e3f4",
  borderRadius: 18,
  padding: 22,
  marginBottom: 18,
  boxShadow: "0 6px 18px rgba(15,76,150,.05)",
};

const buttonStyle: React.CSSProperties = {
  minHeight: 46,
  borderRadius: 12,
  border: "1px solid #c9dced",
  background: "#fff",
  color: "#17365f",
  padding: "10px 18px",
  cursor: "pointer",
  fontFamily: FONT,
  fontSize: 14,
  fontWeight: 800,
};

function normalize(value: string): string {
  return value
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .toLowerCase();
}

function findSnippets(text: string, query: string): string[] {
  const q = normalize(query).trim();
  if (!q) return [];

  const source = normalize(text);
  const result: string[] = [];
  let cursor = 0;

  while (result.length < 20) {
    const index = source.indexOf(q, cursor);
    if (index < 0) break;

    const start = Math.max(0, index - 100);
    const end = Math.min(text.length, index + q.length + 180);
    result.push(
      `${start > 0 ? "… " : ""}${text
        .slice(start, end)
        .replace(/\s+/g, " ")
        .trim()}${end < text.length ? " …" : ""}`,
    );

    cursor = index + Math.max(q.length, 1);
  }

  return result;
}

export default function AboutPage({ onBack }: Props) {
  const [tariffText, setTariffText] = useState("");
  const [query, setQuery] = useState("");
  const [showTariff, setShowTariff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTariff() {
      try {
        const response = await fetch(TARIFF_URL, { cache: "no-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const text = await response.text();
        if (active) setTariffText(text);
      } catch {
        if (active) {
          setError(
            "متن تعرفه قابل بارگذاری نیست. فایل tarife.md را در پوشه public بررسی کنید.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadTariff();

    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(
    () => findSnippets(tariffText, query),
    [tariffText, query],
  );

  function checkUpdate() {
    setUpdateMessage(
      "سامانه بررسی آنلاین به‌روزرسانی در نسخه فعلی فعال نشده است و برای توسعه آینده آماده است.",
    );
  }

  return (
    <main
      dir="rtl"
      data-testid="expertfee-about-page"
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#17365f",
        fontFamily: FONT,
        lineHeight: 1.9,
        padding: "24px 16px 40px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <button
          type="button"
          onClick={onBack}
          data-testid="about-back"
          style={{ ...buttonStyle, marginBottom: 18 }}
        >
          ← بازگشت
        </button>

        <section style={{ ...cardStyle, textAlign: "center", padding: 30 }}>
          <img
            src={LOGO_URL}
            alt={`لوگوی ${APP_NAME}`}
            data-testid="expertfee-logo"
            style={{
              width: 150,
              height: 150,
              objectFit: "contain",
              display: "block",
              margin: "0 auto 16px",
              borderRadius: 24,
            }}
          />

          <h1
            data-testid="about-title"
            style={{
              margin: 0,
              color: "#173d70",
              fontSize: 32,
              fontWeight: 900,
            }}
          >
            {APP_NAME}
          </h1>

          <p style={{ margin: "8px 0 4px", fontSize: 17, fontWeight: 700 }}>
            سامانه هوشمند محاسبه و مدیریت حق‌الزحمه کارشناسان رسمی
          </p>

          <div
            style={{
              display: "inline-block",
              marginTop: 10,
              padding: "4px 12px",
              borderRadius: 999,
              background: "#eef6ff",
              border: "1px solid #cfe2f6",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            نسخه {APP_VERSION}
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>اطلاعات نرم‌افزار</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 12,
            }}
          >
            <Info
              label="مرکز"
              value="مرکز کارشناسان رسمی دادگستری استان بوشهر"
            />
            <Info label="توسعه‌دهنده" value="سعید رادمنش" />
            <Info label="ایمیل" value="saeedradmanesh@gmail.com" />
            <Info label="تلفن" value="09177321284" />
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>اطلاعات تعرفه</h2>

          <p>
            مرجع تعرفه مورد استفاده نرم‌افزار، مطابق داده‌های فایل تعرفه
            تجمیعی مورد استفاده برنامه است و شامل تعرفه مصوب ۱۳۹۸ و اصلاحات
            درج‌شده تا سال ۱۴۰۲ می‌باشد.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              type="button"
              data-testid="toggle-tariff"
              onClick={() => setShowTariff((value) => !value)}
              style={buttonStyle}
            >
              {showTariff
                ? "بستن متن کامل تعرفه"
                : "مشاهده متن کامل تعرفه"}
            </button>
          </div>

          <label
            style={{
              display: "grid",
              gap: 7,
              marginTop: 16,
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            جستجو در متن تعرفه
            <input
              data-testid="tariff-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="مثلاً: ماده ۱۱، هیأت کارشناسی، ۵۰ درصد"
              style={{
                minHeight: 46,
                boxSizing: "border-box",
                borderRadius: 12,
                border: "1px solid #c9dced",
                padding: "10px 14px",
                fontFamily: FONT,
                fontSize: 14,
                textAlign: "right",
              }}
            />
          </label>

          {loading && <p data-testid="tariff-loading">در حال بارگذاری...</p>}

          {error && (
            <p
              data-testid="tariff-error"
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 12,
                color: "#a33b3b",
                background: "#fff4f4",
                border: "1px solid #f0caca",
              }}
            >
              {error}
            </p>
          )}

          {!loading && !error && query.trim() && (
            <div data-testid="tariff-search-results" style={{ marginTop: 16 }}>
              <strong>
                {results.length.toLocaleString("fa-IR")} نتیجه پیدا شد
              </strong>

              {results.length === 0 ? (
                <p>عبارت موردنظر پیدا نشد.</p>
              ) : (
                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                  {results.map((item, index) => (
                    <div
                      key={`${index}-${item.slice(0, 20)}`}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        background: "#f7faff",
                        border: "1px solid #dce8f5",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showTariff && !loading && !error && (
            <pre
              data-testid="full-tariff-text"
              style={{
                marginTop: 18,
                maxHeight: 650,
                overflow: "auto",
                padding: 18,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                direction: "rtl",
                textAlign: "right",
                background: "#fbfdff",
                border: "1px solid #dce8f5",
                borderRadius: 14,
                fontFamily: FONT,
                fontSize: 13,
                lineHeight: 2,
              }}
            >
              {tariffText}
            </pre>
          )}
        </section>

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>حقوق مالکیت نرم‌افزار</h2>
          <p style={{ margin: 0 }}>
            حقوق مالکیت و بهره‌برداری از نرم‌افزار {APP_NAME} محفوظ است.
          </p>
        </section>

        <section style={{ ...cardStyle, textAlign: "center" }}>
          <button
            type="button"
            data-testid="check-update"
            onClick={checkUpdate}
            style={{
              ...buttonStyle,
              background: "#eef6ff",
              borderColor: "#bcd7f1",
              minWidth: 220,
            }}
          >
            بررسی به‌روزرسانی
          </button>

          {updateMessage && (
            <p data-testid="update-message" style={{ fontSize: 13 }}>
              {updateMessage}
            </p>
          )}

          <div style={{ marginTop: 16, color: "#718198", fontSize: 12 }}>
            {APP_NAME} · نسخه {APP_VERSION}
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 13,
        borderRadius: 12,
        background: "#f8fbff",
        border: "1px solid #e0eaf4",
      }}
    >
      <div style={{ fontSize: 12, color: "#72839a", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontWeight: 800 }}>{value}</div>
    </div>
  );
}
