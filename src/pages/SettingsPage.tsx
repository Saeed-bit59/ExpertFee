import { useEffect, useState } from "react";
import {
  DEFAULT_EXPERT_FEE_SETTINGS,
  type CurrencyUnit,
  type ExpertFeeSettings,
  type NumberLocale,
} from "../settings/SettingsTypes";
import { settingsRepository } from "../settings/SettingsRepository";

interface Props {
  onBack: () => void;
}

const font =
  'Vazirmatn, IRANSans, "Segoe UI", Tahoma, Arial, sans-serif';

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #cfe0f5",
  borderRadius: 12,
  padding: "11px 13px",
  fontFamily: "inherit",
  fontSize: 14,
  color: "#17365f",
  background: "#fff",
  outline: "none",
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: "#475569" }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: "#475569" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: "1px solid #d7e3f4",
        borderRadius: 18,
        padding: 20,
        background: "#fff",
        marginBottom: 16,
        boxShadow: "0 6px 18px rgba(15,76,150,.05)",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px",
          color: "#0d47a1",
          fontSize: 17,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SettingsPage({ onBack }: Props) {
  const [settings, setSettings] = useState<ExpertFeeSettings>(
    DEFAULT_EXPERT_FEE_SETTINGS,
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setSettings(settingsRepository.get());
  }, []);

  function update<K extends keyof ExpertFeeSettings>(
    key: K,
    value: ExpertFeeSettings[K],
  ): void {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setMessage("");
    setError("");
  }

  function save(): void {
    setError("");
    setMessage("");

    try {
      const saved = settingsRepository.save(settings);
      setSettings(saved);
      setMessage("تنظیمات با موفقیت ذخیره شد.");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "ذخیره تنظیمات انجام نشد.",
      );
    }
  }

  function reset(): void {
    const confirmed = window.confirm(
      "تنظیمات به مقادیر پیش‌فرض بازگردانده شود؟",
    );

    if (!confirmed) return;

    try {
      const resetSettings = settingsRepository.reset();
      setSettings(resetSettings);
      setError("");
      setMessage("تنظیمات به حالت پیش‌فرض بازگردانده شد.");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "بازگردانی تنظیمات انجام نشد.",
      );
    }
  }

  return (
    <main
      dir="rtl"
      data-testid="expertfee-settings-page"
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: 24,
        fontFamily: font,
        lineHeight: 1.9,
        color: "#17365f",
        background: "#f8fbff",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#0d47a1",
              fontSize: 26,
            }}
          >
            تنظیمات
          </h1>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            تنظیمات شخصی، نمایش، گزارش و اطلاعات مرجع تعرفه
          </div>
        </div>

        <button
          type="button"
          data-testid="settings-back"
          onClick={onBack}
          style={{
            border: "1px solid #cfe0f5",
            background: "#fff",
            borderRadius: 12,
            padding: "9px 16px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 800,
            color: "#17365f",
          }}
        >
          بازگشت
        </button>
      </div>

      <Section title="اطلاعات کارشناس">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <Field
            label="نام کارشناس"
            value={settings.expertName}
            onChange={(v) => update("expertName", v)}
          />
          <Field
            label="کد کارشناس"
            value={settings.expertCode}
            onChange={(v) => update("expertCode", v)}
          />
          <Field
            label="استان"
            value={settings.province}
            onChange={(v) => update("province", v)}
          />
          <Field
            label="مرکز / نهاد"
            value={settings.professionalCenter}
            onChange={(v) => update("professionalCenter", v)}
          />
          <Field
            label="ایمیل"
            type="email"
            value={settings.email}
            onChange={(v) => update("email", v)}
          />
          <Field
            label="شماره تماس"
            value={settings.phone}
            onChange={(v) => update("phone", v)}
          />
        </div>
      </Section>

      <Section title="تنظیمات نمایش و محاسبه">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <SelectField
            label="واحد پول"
            value={settings.currencyUnit}
            onChange={(v) =>
              update("currencyUnit", v as CurrencyUnit)
            }
            options={[
              { value: "TOMAN", label: "تومان" },
              { value: "RIAL", label: "ریال" },
            ]}
          />

          <SelectField
            label="نحوه نمایش اعداد"
            value={settings.numberLocale}
            onChange={(v) =>
              update("numberLocale", v as NumberLocale)
            }
            options={[
              { value: "FA", label: "فارسی" },
              { value: "EN", label: "انگلیسی" },
            ]}
          />

          <SelectField
            label="تعداد اعشار"
            value={String(settings.decimalPlaces)}
            onChange={(v) =>
              update("decimalPlaces", Number(v))
            }
            options={[
              { value: "0", label: "بدون اعشار" },
              { value: "1", label: "۱ رقم اعشار" },
              { value: "2", label: "۲ رقم اعشار" },
              { value: "3", label: "۳ رقم اعشار" },
            ]}
          />
        </div>
      </Section>

      <Section title="تنظیمات گزارش و سوابق">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          <SelectField
            label="بازه پیش‌فرض گزارش"
            value={settings.defaultReportPeriod}
            onChange={(v) =>
              update(
                "defaultReportPeriod",
                v as ExpertFeeSettings["defaultReportPeriod"],
              )
            }
            options={[
              { value: "ALL", label: "همه سوابق" },
              { value: "THIS_YEAR", label: "سال جاری" },
              { value: "THIS_MONTH", label: "ماه جاری" },
            ]}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid #e1eaf5",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <input
              type="checkbox"
              checked={settings.defaultShowReceivedOnly}
              onChange={(e) =>
                update(
                  "defaultShowReceivedOnly",
                  e.target.checked,
                )
              }
            />
            <span>نمایش پیش‌فرض پرونده‌های وصول‌شده</span>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid #e1eaf5",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <input
              type="checkbox"
              checked={settings.defaultShowPendingOnly}
              onChange={(e) =>
                update(
                  "defaultShowPendingOnly",
                  e.target.checked,
                )
              }
            />
            <span>نمایش پیش‌فرض مطالبات وصول‌نشده</span>
          </label>
        </div>
      </Section>

      <Section title="اطلاعات تعرفه مورد استفاده">
        <div
          style={{
            display: "grid",
            gap: 10,
            padding: 14,
            borderRadius: 14,
            background: "#f8fbff",
            border: "1px solid #dbe7f5",
          }}
        >
          <div>
            <strong>مرجع تعرفه:</strong>{" "}
            {settings.tariffSourceTitle}
          </div>
          <div>
            <strong>نسخه:</strong> {settings.tariffVersion}
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            {settings.tariffDescription}
          </div>
          <div
            style={{
              color: "#b45309",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            اطلاعات این بخش صرفاً برای شناسایی مرجع محاسبات است و
            از این صفحه قابل ویرایش نیست.
          </div>
        </div>
      </Section>

      {(message || error) && (
        <div
          role="status"
          data-testid="settings-feedback"
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 12,
            background: error ? "#fff1f2" : "#effdf5",
            color: error ? "#b42318" : "#166534",
            border: `1px solid ${
              error ? "#fecdd3" : "#bbf7d0"
            }`,
            fontWeight: 700,
          }}
        >
          {error || message}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          flexWrap: "wrap",
          paddingBottom: 30,
        }}
      >
        <button
          type="button"
          data-testid="settings-save"
          onClick={save}
          style={{
            border: "none",
            background: "#0d47a1",
            color: "#fff",
            borderRadius: 12,
            padding: "11px 24px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 800,
          }}
        >
          ذخیره تنظیمات
        </button>

        <button
          type="button"
          data-testid="settings-reset"
          onClick={reset}
          style={{
            border: "1px solid #cbd5e1",
            background: "#fff",
            color: "#334155",
            borderRadius: 12,
            padding: "11px 24px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 800,
          }}
        >
          بازگردانی پیش‌فرض
        </button>
      </div>
    </main>
  );
}
