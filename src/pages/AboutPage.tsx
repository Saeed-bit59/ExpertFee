import { useEffect, useMemo, useState } from "react";
import { BookOpen, Code2, Search, ShieldCheck, UserRound } from "lucide-react";

interface Props { onBack: () => void; }

const TARIFF_URL = "/tarife.md";
const ARCHIVE_TARIFF_LABEL = "تعرفه مصوب ۱۳۹۸ و اصلاحیه ۱۴۰۲";
const FONT = 'Vazirmatn, IRANSans, "Segoe UI", Tahoma, Arial, sans-serif';

function normalize(value: string): string {
  return value.replace(/ي/g, "ی").replace(/ك/g, "ک")
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).toLowerCase();
}

function cleanTariffLine(value: string): string {
  return value
    .replace(/<a\b[^>]*>\s*<\/a>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/<[^>]*$/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\s*\[[^\]]*\]/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/^\s*[>*+•-]+\s*/gm, "")
    .replace(/`{1,3}/g, "")
    .replace(/(\*\*|__|\*|_)/g, "")
    .replace(/\|/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&zwnj;/gi, "‌")
    .replace(/\\([\\`*_[\]{}()#+.!-])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

type TariffLine = { type: "chapter" | "article" | "text"; text: string };

function formatTariff(text: string): TariffLine[] {
  const content = tariffContent(text);
  return content.split("\n").flatMap((line) => {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const title = cleanTariffLine(heading[2]);
      return title ? ([{ type: heading[1].length <= 1 ? "chapter" : "article", text: title }] as TariffLine[]) : [];
    }
    const value = cleanTariffLine(line);
    return value ? ([{ type: "text", text: value }] as TariffLine[]) : [];
  });
}

function tariffContent(text: string): string {
  const chapterStart = text.search(/^#\s+فصل اول/m);
  return chapterStart >= 0 ? text.slice(chapterStart) : text;
}

function findSnippets(text: string, query: string): string[] {
  const q = normalize(query).trim();
  if (!q) return [];
  const sections: Array<{ title: string; body: string }> = [];
  let current = { title: "کلیات تعرفه", body: "" };

  for (const rawLine of tariffContent(text).split("\n")) {
    const article = rawLine.match(/^#{1,6}\s*(ماده\s+\d+)/);
    if (article) {
      if (current.body.trim()) sections.push(current);
      current = { title: cleanTariffLine(article[1]), body: "" };
      continue;
    }
    const line = cleanTariffLine(rawLine);
    if (line) current.body += `${line} `;
  }
  if (current.body.trim()) sections.push(current);

  return sections
    .map((section) => {
      const searchable = normalize(`${section.title} ${section.body}`);
      const index = searchable.indexOf(q);
      if (index < 0) return null;

      const start = Math.max(0, index - 55);
      const end = Math.min(section.body.length, index + q.length + 230);
      const excerpt = cleanTariffLine(section.body.slice(start, end));
      return {
        text: `${section.title} — ${start > 0 ? "… " : ""}${excerpt}${end < section.body.length ? " …" : ""}`,
        priority: index < 180 ? 0 : 1,
      };
    })
    .filter((item): item is { text: string; priority: number } => item !== null)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 20)
    .map((item) => item.text);
}

const card: React.CSSProperties = { background: "#fff", border: "1px solid #d7e5f5", borderRadius: 20, boxShadow: "0 10px 28px rgba(13,71,161,.07)" };

export default function AboutPage({ onBack }: Props) {
  const [tariffText, setTariffText] = useState("");
  const [query, setQuery] = useState("");
  const [showTariff, setShowTariff] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const results = useMemo(() => findSnippets(tariffText, query), [tariffText, query]);
  const tariffLines = useMemo(() => formatTariff(tariffText), [tariffText]);

  useEffect(() => {
    let active = true;
    void fetch(TARIFF_URL, { cache: "no-cache" })
      .then((response) => { if (!response.ok) throw new Error(); return response.text(); })
      .then((text) => { if (active) setTariffText(text); })
      .catch(() => { if (active) setError("متن آرشیوی تعرفه قابل بارگذاری نیست."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <main dir="rtl" data-testid="expertfee-about-page" style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f3f8ff 0, #f8fafc 360px)", color: "#17365f", fontFamily: FONT, lineHeight: 1.9, padding: "26px 16px 48px" }}>
    <div style={{ maxWidth: 1040, margin: "0 auto" }}>
      <button type="button" onClick={onBack} data-testid="about-back" style={{ border: "1px solid #c9dced", borderRadius: 11, background: "#fff", color: "#173d70", padding: "9px 16px", cursor: "pointer", fontFamily: FONT, fontWeight: 800 }}>← بازگشت به صفحه اصلی</button>

      <section style={{ ...card, marginTop: 18, padding: "clamp(26px, 5vw, 48px)", textAlign: "center", background: "linear-gradient(135deg, #0d47a1, #1565c0 58%, #0b55bd)", color: "#fff" }}>
        <div style={{ display: "inline-grid", placeItems: "center", width: 72, height: 72, borderRadius: 22, background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.25)" }}><Code2 size={38} /></div>
        <h1 data-testid="about-title" style={{ margin: "16px 0 6px", fontSize: "clamp(28px, 5vw, 38px)", letterSpacing: ".2px" }}>ExpertFee</h1>
        <p style={{ margin: 0, fontSize: 17, opacity: .94, fontWeight: 600 }}>سامانه محاسبه حق‌الزحمه کارشناسان رسمی دادگستری</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 17, padding: "5px 13px", borderRadius: 999, background: "rgba(255,255,255,.13)", fontSize: 13, fontWeight: 800 }}><ShieldCheck size={16} /> محاسبه، ثبت و گزارش قابلیت‌های پیاده‌سازی‌شده</div>
      </section>

      <section style={{ ...card, marginTop: 20, padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><UserRound color="#1565c0" /><h2 style={{ margin: 0, fontSize: 20 }}>مشخصات نرم‌افزار</h2></div>
        <div style={{ display: "grid" }}>
          {[["نام", "ExpertFee"], ["نسخه", "۱٫۰٫۰"], ["نوع برنامه", "وب‌اپلیکیشن واکنش‌گرا و قابل نصب"], ["ذخیره‌سازی", "محلی در مرورگر کاربر"], ["دامنه", "مواد و قابلیت‌های پیاده‌سازی‌شده"]].map(([label, value], index, items) => <div key={label} className="about-meta-row" style={{ borderBottom: index === items.length - 1 ? 0 : "1px solid #e6eef7" }}><span style={{ color: "#718198", fontSize: 13 }}>{label}</span><strong style={{ color: "#173d70", fontSize: 14, minWidth: 0, overflowWrap: "anywhere" }}>{value}</strong></div>)}
        </div>
      </section>

      <section style={{ ...card, marginTop: 20, overflow: "hidden" }}>
        <div style={{ padding: "22px 22px 20px", background: "linear-gradient(135deg, #f4f9ff, #ffffff)", borderBottom: "1px solid #dce9f7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><BookOpen color="#1565c0" /><h2 style={{ margin: 0, fontSize: 20 }}>جست‌وجوی متن آرشیوی تعرفه</h2></div>
          <p style={{ margin: "7px 0 0", color: "#64748b", fontSize: 14 }}>نام خدمت، شماره ماده یا یک عبارت کلیدی را وارد کنید تا بخش مرتبط را فوراً پیدا کنید.</p>
          <p role="note" style={{ margin: "12px 0 0", padding: "10px 12px", borderRadius: 12, background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412", fontSize: 13 }}>
            این بخش فقط متن آرشیوی {ARCHIVE_TARIFF_LABEL} موجود در پروژه را نمایش می‌دهد و نباید به‌عنوان متن کامل تعرفه ۱۴۰۵ استفاده شود.
          </p>
        </div>
        <div style={{ padding: 22 }}>
          <label htmlFor="about-tariff-search" className="visually-hidden">جست‌وجو در متن آرشیوی تعرفه</label>
          <div style={{ position: "relative" }}><Search size={20} aria-hidden="true" color="#6683a6" style={{ position: "absolute", right: 14, top: 13 }} /><input id="about-tariff-search" data-testid="tariff-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="مثال: ماده ۱۱ یا اجاره‌بها" style={{ boxSizing: "border-box", width: "100%", minHeight: 48, borderRadius: 12, border: "1px solid #c9dced", padding: "10px 43px 10px 14px", fontFamily: FONT, fontSize: 14, background: "#fff" }} /></div>

          {loading && <p data-testid="tariff-loading" role="status">در حال بارگذاری متن آرشیوی تعرفه…</p>}
          {error && <p data-testid="tariff-error" role="alert" style={{ color: "#a33b3b", background: "#fff4f4", border: "1px solid #f0caca", borderRadius: 12, padding: 12 }}>{error}</p>}
          {!loading && !error && query.trim() && <div data-testid="tariff-search-results" aria-live="polite" style={{ marginTop: 18 }}><strong>{results.length.toLocaleString("fa-IR")} نتیجه در متن آرشیوی</strong>{results.length ? <div style={{ display: "grid", gap: 10, marginTop: 10 }}>{results.map((item, index) => <div key={`${index}-${item.slice(0, 18)}`} style={{ borderRight: "4px solid #1565c0", padding: "12px 14px", background: "#fbfdff", borderRadius: 10, border: "1px solid #e0eaf4" }}>{item}</div>)}</div> : <p>عبارت موردنظر در متن آرشیوی پیدا نشد.</p>}</div>}

          <button type="button" data-testid="toggle-tariff" aria-expanded={showTariff} aria-controls="full-tariff-text" onClick={() => setShowTariff((value) => !value)} style={{ marginTop: 20, minHeight: 44, borderRadius: 11, border: "1px solid #bcd7f1", background: "#eef6ff", color: "#0d47a1", padding: "8px 15px", cursor: "pointer", fontFamily: FONT, fontWeight: 800 }}>{showTariff ? "بستن متن آرشیوی تعرفه" : "مشاهده متن آرشیوی تعرفه"}</button>
        {showTariff && !loading && !error && <div id="full-tariff-text" data-testid="full-tariff-text" style={{ marginTop: 14, maxHeight: 650, overflow: "auto", padding: 18, textAlign: "right", background: "#fbfdff", border: "1px solid #dce8f5", borderRadius: 14, fontFamily: FONT, fontSize: 14, lineHeight: 2 }}>
          {tariffLines.map((line, index) => line.type === "chapter" ? <h3 key={index} style={{ margin: "22px 0 8px", color: "#0d47a1", fontSize: 18 }}>{line.text}</h3> : line.type === "article" ? <h4 key={index} style={{ margin: "18px 0 6px", color: "#173d70", fontSize: 15 }}>{line.text}</h4> : <p key={index} style={{ margin: "0 0 8px", color: "#405775" }}>{line.text}</p>)}
        </div>}
        </div>
      </section>

      <footer style={{ marginTop: 18, textAlign: "center", color: "#718198", fontSize: 12 }}>حقوق مالکیت و بهره‌برداری از نرم‌افزار ExpertFee محفوظ است.</footer>
    </div>
    <style>{`
      .about-meta-row { display: grid; grid-template-columns: minmax(90px, 140px) minmax(0, 1fr); gap: 16px; padding: 13px 4px; }
      @media (max-width: 480px) { .about-meta-row { grid-template-columns: 1fr; gap: 3px; } }
    `}</style>
  </main>;
}
