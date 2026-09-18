import { Copy, Mail, MessageCircle, Send, Share2 } from "lucide-react";
import { useState } from "react";
import { numberToPersianWords } from "../components/ui/MoneyInput";
import type { ShareResultInput } from "../share/ShareResult";
import { loadLastShareableCalculation } from "../share/LastShareableCalculation";

interface SharePageProps { onBack: () => void; shareInput?: ShareResultInput; }
type ShareTarget = "WHATSAPP" | "TELEGRAM" | "EMAIL" | "BALE" | "EITAA" | "RUBIKA";

const buttonStyle = {
  minHeight: 86, border: "1px solid #cfe0f5", borderRadius: 15,
  background: "#ffffff", color: "#16345f", cursor: "pointer", fontFamily: "inherit",
  fontWeight: 800, fontSize: 15, display: "flex", flexDirection: "column" as const,
  alignItems: "center", justifyContent: "center", gap: 7,
};

function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

function createShareText(input: ShareResultInput | undefined, pageUrl: string): string {
  if (!input) {
    return ["ExpertFee", "سامانه محاسبه حق‌الزحمه کارشناسان رسمی دادگستری براساس تعرفه ۱۴۰۵", `لینک وب‌اپ: ${pageUrl}`].join("\n");
  }

  return [
    input.calculationTitle ?? "گزارش محاسبه حق‌الزحمه کارشناسی",
    "",
    `مبلغ مورد ارزیابی: ${formatNumber(input.evaluationValueToman)} تومان`,
    `دستمزد محاسبه‌شده: ${formatNumber(input.calculatedFeeToman)} تومان`,
    `دستمزد به حروف: ${numberToPersianWords(Math.round(input.calculatedFeeToman))} تومان`,
    `تعداد کارشناسان: ${input.expertCount.toLocaleString("fa-IR")} نفر`,
    input.tariffReference ? `مبنای محاسبه: ${input.tariffReference}` : "",
    "",
    "محاسبه‌شده توسط نرم‌افزار ExpertFee براساس تعرفه ۱۴۰۵",
    `لینک وب‌اپ: ${pageUrl}`,
  ].join("\n");
}

export default function SharePage({ onBack, shareInput }: SharePageProps) {
  const pageUrl = window.location.href;
  const latestCalculation = shareInput ?? loadLastShareableCalculation();
  const [shareText, setShareText] = useState(() => createShareText(latestCalculation, pageUrl));

  async function copyText(target?: "BALE" | "EITAA" | "RUBIKA"): Promise<void> {
    try {
      await navigator.clipboard.writeText(shareText);
      const name = target === "BALE" ? "بله" : target === "EITAA" ? "ایتا" : target === "RUBIKA" ? "روبیکا" : "کلیپ‌بورد";
      window.alert(target ? `متن کپی شد؛ اکنون آن را در ${name} ارسال کنید.` : "متن اشتراک‌گذاری در کلیپ‌بورد کپی شد.");
    } catch { window.alert("امکان کپی خودکار فراهم نشد."); }
  }

  async function shareApplication(): Promise<void> {
    try {
      if (navigator.share) { await navigator.share({ title: "ExpertFee", text: shareText }); return; }
      await copyText();
    } catch { /* user cancelled the share sheet */ }
  }

  function openTarget(target: ShareTarget): void {
    const encodedText = encodeURIComponent(shareText);
    if (target === "WHATSAPP") { window.open(`https://wa.me/?text=${encodedText}`, "_blank", "noopener,noreferrer"); return; }
    if (target === "TELEGRAM") { window.open(`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer"); return; }
    if (target === "EMAIL") { window.location.href = `mailto:?subject=${encodeURIComponent("ExpertFee")}&body=${encodedText}`; return; }
    void copyText(target);
  }

  return (
    <main dir="rtl" className="ef-utility-page ef-share-page" style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px" }}>
      <button className="ef-back-button ef-utility-back-button" type="button" onClick={onBack} style={{ border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", padding: "9px 16px", cursor: "pointer", fontFamily: "inherit" }}>← بازگشت به صفحه اصلی</button>
      <section style={{ marginTop: 20, border: "1px solid #cfe0f5", borderRadius: 20, background: "#fff", boxShadow: "0 8px 22px rgba(13, 71, 161, 0.08)", padding: "34px 24px", textAlign: "center", color: "#16345f" }}>
        <Share2 size={42} color="#1565c0" />
        <h1 style={{ margin: "14px 0 8px", fontSize: 25 }}>اشتراک‌گذاری ExpertFee</h1>
        <p style={{ margin: 0, color: "#64748b", lineHeight: 2 }}>{latestCalculation ? "آخرین نتیجهٔ محاسبهٔ شما آمادهٔ ارسال است. متن زیر را بررسی یا ویرایش کنید؛ همهٔ گزینه‌های ارسال همین متن را استفاده می‌کنند." : "هنوز نتیجهٔ قابل اشتراک‌گذاری ثبت نشده است. ابتدا در یکی از بخش‌های محاسبه، محاسبه را انجام دهید."}</p>
        {latestCalculation && (
          <div style={{ marginTop: 18, border: "1px solid #cfe0f5", borderRadius: 13, padding: "14px 16px", background: "#f5f9ff", textAlign: "right", lineHeight: 2 }}>
            <strong>{latestCalculation.calculationTitle ?? "نتیجه محاسبه"}</strong><br />
            دستمزد نهایی: {formatNumber(latestCalculation.calculatedFeeToman)} تومان
          </div>
        )}
        <textarea
          value={shareText}
          onChange={(event) => setShareText(event.target.value)}
          aria-label="پیش‌نمایش متن اشتراک‌گذاری"
          style={{ boxSizing: "border-box", width: "100%", minHeight: 210, marginTop: 20, resize: "vertical", border: "1px solid #cfe0f5", borderRadius: 13, padding: 14, fontFamily: "inherit", fontSize: 14, lineHeight: 2, color: "#16345f", background: "#f8fbff" }}
        />
        <button type="button" onClick={shareApplication} style={{ marginTop: 22, width: "100%", border: 0, borderRadius: 13, background: "linear-gradient(90deg, #1565c0, #0d5bd7)", color: "#fff", fontFamily: "inherit", fontWeight: 900, fontSize: 17, padding: "14px 24px", cursor: "pointer" }}>اشتراک‌گذاری با برنامه‌های نصب‌شده</button>
        <div style={{ margin: "28px 0 12px", color: "#64748b", fontSize: 14 }}>یا یک مقصد را انتخاب کنید</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          <button type="button" onClick={() => openTarget("WHATSAPP")} style={buttonStyle}><MessageCircle size={23} color="#25D366" />واتساپ</button>
          <button type="button" onClick={() => openTarget("TELEGRAM")} style={buttonStyle}><Send size={23} color="#229ED9" />تلگرام</button>
          <button type="button" onClick={() => openTarget("EMAIL")} style={buttonStyle}><Mail size={23} color="#64748b" />ایمیل</button>
          <button type="button" onClick={() => openTarget("BALE")} style={buttonStyle}><MessageCircle size={23} color="#1f9d55" />بله</button>
          <button type="button" onClick={() => openTarget("EITAA")} style={buttonStyle}><MessageCircle size={23} color="#e2851b" />ایتا</button>
          <button type="button" onClick={() => openTarget("RUBIKA")} style={buttonStyle}><MessageCircle size={23} color="#e83e8c" />روبیکا</button>
        </div>
        <button type="button" onClick={() => void copyText()} style={{ marginTop: 18, border: 0, background: "transparent", color: "#1565c0", cursor: "pointer", fontFamily: "inherit", fontWeight: 800 }}><Copy size={17} style={{ verticalAlign: "middle", marginLeft: 6 }} />کپی متن اشتراک‌گذاری</button>
      </section>
    </main>
  );
}
