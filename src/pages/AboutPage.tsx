import { Code2, ShieldCheck, UserRound } from "lucide-react";

interface Props { onBack: () => void; }

const FONT = 'Vazirmatn, IRANSans, "Segoe UI", Tahoma, Arial, sans-serif';

const card: React.CSSProperties = { background: "#fff", border: "1px solid #d7e5f5", borderRadius: 20, boxShadow: "0 10px 28px rgba(13,71,161,.07)" };

export default function AboutPage({ onBack }: Props) {
  return <main dir="rtl" className="ef-utility-page ef-about-page" data-testid="expertfee-about-page" style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f3f8ff 0, #f8fafc 360px)", color: "#17365f", fontFamily: FONT, lineHeight: 1.9, padding: "26px 16px 48px" }}>
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <button className="ef-back-button ef-utility-back-button" type="button" onClick={onBack} data-testid="about-back" style={{ border: "1px solid #c9dced", borderRadius: 11, background: "#fff", color: "#173d70", padding: "9px 16px", cursor: "pointer", fontFamily: FONT, fontWeight: 800 }}>← بازگشت به صفحه اصلی</button>

      <section style={{ ...card, marginTop: 18, padding: "clamp(26px, 5vw, 48px)", textAlign: "center", background: "linear-gradient(135deg, #0d47a1, #1565c0 58%, #0b55bd)", color: "#fff" }}>
        <div style={{ display: "inline-grid", placeItems: "center", width: 72, height: 72, borderRadius: 22, background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.25)" }}><Code2 size={38} /></div>
        <h1 data-testid="about-title" style={{ margin: "16px 0 6px", fontSize: "clamp(28px, 5vw, 38px)", letterSpacing: ".2px" }}>ExpertFee</h1>
        <p style={{ margin: 0, fontSize: 17, opacity: .94, fontWeight: 600 }}>سامانه حرفه‌ای محاسبه حق‌الزحمه کارشناسان رسمی دادگستری</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 17, padding: "5px 13px", borderRadius: 999, background: "rgba(255,255,255,.13)", fontSize: 13, fontWeight: 800 }}><ShieldCheck size={16} /> طراحی‌شده برای محاسبه سریع، دقیق و مستند</div>
      </section>

      <section style={{ ...card, marginTop: 20, padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><UserRound color="#1565c0" /><h2 style={{ margin: 0, fontSize: 20 }}>مشخصات نرم‌افزار و توسعه‌دهنده</h2></div>
        <div style={{ display: "grid" }}>
          {[["مرکز", "مرکز کارشناسان رسمی دادگستری استان بوشهر"], ["توسعه‌دهنده", "سعید رادمنش"], ["رشته تخصصی", "برق، ماشین‌آلات و تأسیسات کارخانجات"], ["ایمیل", "saeedradmanesh@gmail.com"], ["تلفن", "۰۹۱۷۷۳۲۱۲۸۴"], ["نسخه", "۱٫۰٫۰ — تعرفه ۱۴۰۵"]].map(([label, value], index) => <div key={label} className="about-meta-row" style={{ borderBottom: index === 5 ? 0 : "1px solid #e6eef7" }}><span style={{ color: "#718198", fontSize: 13 }}>{label}</span><strong style={{ color: "#173d70", fontSize: 14, minWidth: 0, overflowWrap: "anywhere" }}>{value}</strong></div>)}
        </div>
      </section>

      <footer style={{ marginTop: 18, textAlign: "center", color: "#718198", fontSize: 12 }}>حقوق مالکیت و بهره‌برداری از نرم‌افزار ExpertFee محفوظ است.</footer>
    </div>
    <style>{`
      .about-meta-row {
        display: grid;
        grid-template-columns: minmax(90px, 150px) minmax(0, 1fr);
        gap: 16px;
        padding: 13px 4px;
      }

      @media (max-width: 480px) {
        .about-meta-row {
          grid-template-columns: minmax(0, 1fr);
          gap: 3px;
        }
      }
    `}</style>
  </main>;
}
