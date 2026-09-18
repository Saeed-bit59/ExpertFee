import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, ChevronLeft, FileText, Palette, RotateCcw, Save, Settings2, SlidersHorizontal, UserRound } from "lucide-react";
import { DEFAULT_EXPERT_FEE_SETTINGS, type CurrencyUnit, type ExpertFeeSettings, type NumberLocale } from "../settings/SettingsTypes";
import { settingsRepository } from "../settings/SettingsRepository";

interface Props { onBack: () => void; }

const FONT = 'Vazirmatn, IRANSans, "Segoe UI", Tahoma, Arial, sans-serif';
const fieldStyle: React.CSSProperties = { width: "100%", minHeight: 46, boxSizing: "border-box", border: "1px solid #d4e2f0", borderRadius: 11, padding: "10px 12px", fontFamily: FONT, fontSize: 14, color: "#16345f", background: "#fff", outline: "none" };
const card: React.CSSProperties = { border: "1px solid #dbe7f4", borderRadius: 18, background: "#fff", padding: 20, boxShadow: "0 8px 22px rgba(13,71,161,.06)" };

function TextField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label style={{ display: "grid", gap: 6 }}><span style={{ color: "#60758f", fontSize: 12, fontWeight: 800 }}>{label}</span><input className="ef-keyboard-focus" type={type} value={value} onChange={(event) => onChange(event.target.value)} style={fieldStyle} /></label>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return <label style={{ display: "grid", gap: 6 }}><span style={{ color: "#60758f", fontSize: 12, fontWeight: 800 }}>{label}</span><select className="ef-keyboard-focus" value={value} onChange={(event) => onChange(event.target.value)} style={fieldStyle}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function SectionTitle({ icon, title, hint }: { icon: React.ReactNode; title: string; hint?: string }) {
  return <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 17 }}><span style={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: 10, color: "#1565c0", background: "#eef6ff" }}>{icon}</span><div><h2 style={{ margin: 0, color: "#163f7a", fontSize: 17 }}>{title}</h2>{hint && <div style={{ marginTop: 2, color: "#73869b", fontSize: 12 }}>{hint}</div>}</div></div>;
}

export default function SettingsPage({ onBack }: Props) {
  const [settings, setSettings] = useState<ExpertFeeSettings>(DEFAULT_EXPERT_FEE_SETTINGS);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { setSettings(settingsRepository.get()); }, []);

  function update<K extends keyof ExpertFeeSettings>(key: K, value: ExpertFeeSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setMessage(""); setError("");
  }

  function save() {
    try { setSettings(settingsRepository.save(settings)); setError(""); setMessage("تنظیمات با موفقیت ذخیره شد."); }
    catch (exception) { setMessage(""); setError(exception instanceof Error ? exception.message : "ذخیره تنظیمات انجام نشد."); }
  }

  function reset() {
    if (!window.confirm("تنظیمات به حالت پیش‌فرض بازگردانده شود؟")) return;
    try { setSettings(settingsRepository.reset()); setError(""); setMessage("تنظیمات پیش‌فرض بازیابی شد."); }
    catch (exception) { setMessage(""); setError(exception instanceof Error ? exception.message : "بازگردانی تنظیمات انجام نشد."); }
  }

  return <main dir="rtl" className="ef-utility-page ef-settings-page" data-testid="expertfee-settings-page" style={{ minHeight: "100vh", padding: "28px 16px 48px", background: "linear-gradient(180deg, #f2f8ff 0, #f8fafc 360px)", color: "#16345f", fontFamily: FONT }}>
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <button className="ef-back-button ef-utility-back-button" type="button" data-testid="settings-back" onClick={onBack} style={{ border: "1px solid #cfe0f2", background: "#fff", borderRadius: 10, padding: "9px 15px", cursor: "pointer", color: "#163f7a", fontFamily: FONT, fontWeight: 800 }}><ChevronLeft size={17} style={{ verticalAlign: "middle" }} /> بازگشت به صفحه اصلی</button>

      <section style={{ ...card, marginTop: 18, padding: "28px clamp(22px, 5vw, 38px)", background: "linear-gradient(135deg, #0d47a1, #1565c0)", color: "#fff", border: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}><span style={{ width: 56, height: 56, display: "grid", placeItems: "center", borderRadius: 16, background: "rgba(255,255,255,.15)" }}><Settings2 size={30} /></span><div><h1 style={{ margin: 0, fontSize: 27 }}>تنظیمات</h1><p style={{ margin: "4px 0 0", opacity: .9, fontSize: 14 }}>اطلاعات حرفه‌ای، نمایش و تنظیمات سوابق را شخصی‌سازی کنید.</p></div></div>
      </section>

      <div className="settings-primary-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, .75fr)", gap: 16, marginTop: 18 }}>
        <section style={card}>
          <SectionTitle icon={<UserRound size={20} />} title="اطلاعات کارشناس" hint="این اطلاعات در نسخه‌های بعدی برای گزارش‌ها و سوابق استفاده می‌شود." />
          <div className="settings-profile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 13 }}>
            <TextField label="نام کارشناس" value={settings.expertName} onChange={(value) => update("expertName", value)} />
            <TextField label="کد کارشناس" value={settings.expertCode} onChange={(value) => update("expertCode", value)} />
            <TextField label="استان" value={settings.province} onChange={(value) => update("province", value)} />
            <TextField label="مرکز / نهاد" value={settings.professionalCenter} onChange={(value) => update("professionalCenter", value)} />
            <TextField label="ایمیل" type="email" value={settings.email} onChange={(value) => update("email", value)} />
            <TextField label="شماره تماس" value={settings.phone} onChange={(value) => update("phone", value)} />
          </div>
        </section>

        <section style={card}>
          <SectionTitle icon={<Palette size={20} />} title="نمایش و محاسبه" />
          <div style={{ display: "grid", gap: 13 }}>
            <SelectField label="واحد پیش‌فرض پول" value={settings.currencyUnit} onChange={(value) => update("currencyUnit", value as CurrencyUnit)} options={[{ value: "TOMAN", label: "تومان" }, { value: "RIAL", label: "ریال" }]} />
            <SelectField label="نمایش اعداد" value={settings.numberLocale} onChange={(value) => update("numberLocale", value as NumberLocale)} options={[{ value: "FA", label: "فارسی" }, { value: "EN", label: "انگلیسی" }]} />
            <SelectField label="تعداد اعشار" value={String(settings.decimalPlaces)} onChange={(value) => update("decimalPlaces", Number(value))} options={[{ value: "0", label: "بدون اعشار" }, { value: "1", label: "۱ رقم اعشار" }, { value: "2", label: "۲ رقم اعشار" }, { value: "3", label: "۳ رقم اعشار" }]} />
          </div>
        </section>
      </div>

      <section style={{ ...card, marginTop: 16 }}>
        <SectionTitle icon={<BarChart3 size={20} />} title="سوابق و گزارش‌ها" hint="نمایش اولیه سوابق را مطابق روش کاری خود تنظیم کنید." />
        <div className="settings-report-grid" style={{ display: "grid", gridTemplateColumns: "minmax(240px, .8fr) 1fr 1fr", gap: 13, alignItems: "stretch" }}>
          <SelectField label="بازه پیش‌فرض گزارش" value={settings.defaultReportPeriod} onChange={(value) => update("defaultReportPeriod", value as ExpertFeeSettings["defaultReportPeriod"])} options={[{ value: "ALL", label: "همه سوابق" }, { value: "THIS_YEAR", label: "سال جاری" }, { value: "THIS_MONTH", label: "ماه جاری" }]} />
          <label style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #dbe7f4", borderRadius: 12, padding: 12, cursor: "pointer" }}><input type="checkbox" checked={settings.defaultShowReceivedOnly} onChange={(event) => update("defaultShowReceivedOnly", event.target.checked)} /><span style={{ fontSize: 13, fontWeight: 700 }}>نمایش پرونده‌های وصول‌شده</span></label>
          <label style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #dbe7f4", borderRadius: 12, padding: 12, cursor: "pointer" }}><input type="checkbox" checked={settings.defaultShowPendingOnly} onChange={(event) => update("defaultShowPendingOnly", event.target.checked)} /><span style={{ fontSize: 13, fontWeight: 700 }}>نمایش مطالبات وصول‌نشده</span></label>
        </div>
      </section>

      <section style={{ ...card, marginTop: 16, display: "flex", alignItems: "center", gap: 12, background: "#f5f9ff" }}><span style={{ color: "#1565c0" }}><FileText size={26} /></span><div><strong>محاسبات بر مبنای تعرفه ۱۴۰۵ انجام می‌شود.</strong><div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>مرجع تعرفه از این صفحه قابل ویرایش نیست.</div></div></section>

      {(message || error) && <div role="status" data-testid="settings-feedback" style={{ marginTop: 16, padding: 13, borderRadius: 12, background: error ? "#fff1f2" : "#effdf5", color: error ? "#b42318" : "#166534", border: `1px solid ${error ? "#fecdd3" : "#bbf7d0"}`, fontWeight: 700 }}><CheckCircle2 size={18} style={{ verticalAlign: "middle", marginLeft: 7 }} />{error || message}</div>}

      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
        <button type="button" data-testid="settings-save" onClick={save} style={{ border: 0, background: "linear-gradient(90deg, #1565c0, #0d47a1)", color: "#fff", borderRadius: 12, padding: "12px 25px", cursor: "pointer", fontFamily: FONT, fontWeight: 900 }}><Save size={18} style={{ verticalAlign: "middle", marginLeft: 7 }} />ذخیره تنظیمات</button>
        <button type="button" data-testid="settings-reset" onClick={reset} style={{ border: "1px solid #cbd9e8", background: "#fff", color: "#405775", borderRadius: 12, padding: "12px 22px", cursor: "pointer", fontFamily: FONT, fontWeight: 800 }}><RotateCcw size={17} style={{ verticalAlign: "middle", marginLeft: 7 }} />بازگردانی پیش‌فرض</button>
      </div>
      <style>{`@media (max-width: 720px) { .settings-primary-grid, .settings-report-grid, .settings-profile-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  </main>;
}
