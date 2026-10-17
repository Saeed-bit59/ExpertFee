import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Building2, Calculator, Car, Droplets, Factory, FileBarChart2,
  History, Image, Info, Landmark, Leaf, Mountain, PackageOpen, Settings2,
  Share2, ShieldCheck,
} from "lucide-react";

import { calculateCommonFee } from "../engine/CommonFeeEngine";
import { formatMoneyInput, oppositeCurrencyWords, parseMoneyValue } from "../components/ui/MoneyInput";
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

type CurrencyUnit = "TOMAN" | "RIAL";
type ServiceItem = {
  title: string; meta: string; description: string; icon: ReactNode;
  to: string; featured?: boolean;
};

function formatToman(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <Link to={item.to} className="ef-home-service-card ef-keyboard-focus"
      data-featured={item.featured || undefined}>
      <span className="ef-home-service-icon" aria-hidden="true">{item.icon}</span>
      <span className="ef-home-service-copy"><strong>{item.title}</strong><small>{item.description}</small></span>
      <span className="ef-home-service-meta">{item.meta}</span>
      <ArrowLeft size={18} aria-hidden="true" />
    </Link>
  );
}

function ToolButton({ icon, title, hint, to }: {
  icon: ReactNode; title: string; hint: string; to: string;
}) {
  return (
    <Link to={to} className="ef-home-tool ef-keyboard-focus">
      <span aria-hidden="true">{icon}</span>
      <span><strong>{title}</strong><small>{hint}</small></span>
    </Link>
  );
}

export default function HomePage({
  onOpenShare,
}: HomePageProps) {
  const [quickValue, setQuickValue] = useState("");
  const [quickFee, setQuickFee] = useState<number | null>(null);
  const [quickError, setQuickError] = useState("");
  const [quickUnit, setQuickUnit] = useState<CurrencyUnit>("TOMAN");
  const evaluationValueToman = parseMoneyValue(quickValue);

  function updateQuickValue(displayValue: string): void {
    const enteredValue = parseMoneyValue(displayValue);
    const tomanValue = quickUnit === "RIAL" ? enteredValue / 10 : enteredValue;
    setQuickValue(tomanValue > 0 ? formatMoneyInput(String(tomanValue)) : "");
    setQuickFee(null);
    setQuickError("");
  }

  function handleQuickCalculate(): void {
    if (!Number.isFinite(evaluationValueToman) || evaluationValueToman <= 0) {
      setQuickFee(null);
      setQuickError("مبلغ ارزیابی را بزرگ‌تر از صفر وارد کنید.");
      return;
    }
    try {
      const result = calculateCommonFee({ baseMode: "ARTICLE_11", evaluationValueToman });
      setQuickFee(result.finalExpertFeeToman);
      setQuickError("");
      saveLastShareableCalculation({
        evaluationValueToman, expertCount: 1,
        calculatedFeeToman: result.finalExpertFeeToman,
        calculationTitle: "محاسبه سریع حق‌الزحمه کارشناسی",
        tariffReference: "ماده ۱۱ تعرفه ۱۴۰۵",
      });
    } catch (error) {
      setQuickFee(null);
      setQuickError(error instanceof Error ? error.message : "محاسبه انجام نشد.");
    }
  }

  const displayedQuickValue = quickValue
    ? formatMoneyInput(String(quickUnit === "RIAL" ? evaluationValueToman * 10 : evaluationValueToman))
    : "";

  const serviceGroups: Array<{ title: string; hint: string; items: ServiceItem[] }> = [
    {
      title: "محاسبات پایه", hint: "مواد عمومی و پرکاربرد تعرفه",
      items: [
        { title: "ارزیابی عمومی", meta: "ماده ۱۱", description: "ارزش‌گذاری عمومی اموال و دارایی‌ها", icon: <Calculator size={24} />, to: "/article-11", featured: true },
        { title: "اجاره‌بها و حق کسب", meta: "ماده ۱۳", description: "اجاره، سرقفلی و حقوق تجاری", icon: <Building2 size={24} />, to: "/article-13" },
        { title: "تصاویر و نقشه‌ها", meta: "ماده ۱۴", description: "تفسیر تصاویر هوایی و نقشه‌ها", icon: <Image size={24} />, to: "/article-14" },
      ],
    },
    {
      title: "رشته‌های تخصصی", hint: "محاسبه متناسب با ماهیت موضوع کارشناسی",
      items: [
        { title: "راه و ساختمان", meta: "گروه ۶", description: "ساختمان، راه، شهرسازی و معماری", icon: <Building2 size={24} />, to: "/road-building" },
        { title: "صنعت و فن", meta: "گروه ۷", description: "ماشین‌آلات، تأسیسات و صنایع", icon: <Factory size={24} />, to: "/industry-technology" },
        { title: "کشاورزی و منابع طبیعی", meta: "گروه ۹", description: "اراضی، محصولات و منابع طبیعی", icon: <Leaf size={24} />, to: "/agriculture-natural-resources" },
        { title: "مهندسی آب", meta: "مواد ۱۵ تا ۲۱", description: "آب، شبکه‌ها و تأسیسات آبی", icon: <Droplets size={24} />, to: "/water-engineering" },
        { title: "فلزات و معادن", meta: "ماده ۲۲", description: "مواد معدنی، ذخایر و عملیات معدنی", icon: <Mountain size={24} />, to: "/metals-and-mining" },
        { title: "اموال منقول", meta: "ماده ۲۳", description: "کالا، تجهیزات و اموال منقول", icon: <PackageOpen size={24} />, to: "/movable-property" },
        { title: "امور مالی", meta: "مواد ۲۵ تا ۲۹", description: "حسابداری، بانکی و امور مالی", icon: <Landmark size={24} />, to: "/financial-affairs" },
        { title: "وسائط نقلیه", meta: "مواد ۳۱ و ۳۲", description: "خودرو و سایر وسایل نقلیه", icon: <Car size={24} />, to: "/vehicles" },
      ],
    },
  ];

  return (
    <main className="ef-home" dir="rtl" data-testid="expertfee-home-page">
      <header className="ef-home-header">
        <div className="ef-home-header-inner">
          <div className="ef-home-brand">
            <span className="ef-home-brand-mark" aria-hidden="true"><FileBarChart2 size={27} /></span>
            <div><strong>ExpertFee</strong><span>محاسبه حق‌الزحمه کارشناسان رسمی</span></div>
          </div>
          <div className="ef-home-tariff"><ShieldCheck size={17} /><span>تعرفه فعال</span><strong>۱۴۰۵</strong></div>
        </div>
      </header>

      <div className="ef-home-content">
        <section className="ef-home-workspace" aria-labelledby="quick-calculation-title">
          <div className="ef-home-workspace-heading">
            <div><span>محاسبه سریع</span><h1 id="quick-calculation-title">دستمزد ارزیابی عمومی</h1></div>
            <Link to="/article-11" className="ef-home-text-action ef-keyboard-focus">محاسبه کامل ماده ۱۱ <ArrowLeft size={16} /></Link>
          </div>
          <div className="ef-home-quick-grid">
            <div className="ef-home-quick-input">
              <label htmlFor="quick-evaluation-value">مبلغ ارزیابی</label>
              <div className="ef-home-money-control">
                <input id="quick-evaluation-value" className="ef-keyboard-focus" inputMode="numeric"
                  name="quick-evaluation-value" autoComplete="off" spellCheck={false}
                  value={displayedQuickValue} onChange={(event) => updateQuickValue(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleQuickCalculate()}
                  placeholder="مثال: ۳,۴۰۰,۰۰۰,۰۰۰" />
                <select value={quickUnit} onChange={(event) => setQuickUnit(event.target.value as CurrencyUnit)}
                  aria-label="واحد مبلغ ارزیابی سریع"><option value="TOMAN">تومان</option><option value="RIAL">ریال</option></select>
              </div>
              {evaluationValueToman > 0 && <small className="ef-home-money-words">{oppositeCurrencyWords(evaluationValueToman, quickUnit)}</small>}
              {quickError && <div className="ef-home-error" role="alert">{quickError}</div>}
            </div>
            <button type="button" className="ef-home-calculate ef-keyboard-focus" onClick={handleQuickCalculate}>محاسبه دستمزد</button>
            <div className="ef-home-quick-result" data-has-result={quickFee !== null} aria-live="polite">
              <span>دستمزد یک کارشناس</span>
              <strong>{quickFee !== null ? `${formatToman(quickFee)} تومان` : "پس از ورود مبلغ نمایش داده می‌شود"}</strong>
              {quickFee !== null && onOpenShare && <button type="button" onClick={() => onOpenShare({
                evaluationValueToman, expertCount: 1, calculatedFeeToman: quickFee,
                calculationTitle: "محاسبه سریع حق‌الزحمه کارشناسی", tariffReference: "ماده ۱۱ تعرفه ۱۴۰۵",
              })}><Share2 size={15} /> اشتراک نتیجه</button>}
            </div>
          </div>
        </section>

        <section className="ef-home-tools" aria-label="ابزارهای برنامه">
          <ToolButton icon={<History size={21} />} title="سوابق محاسبات" hint="ذخیره و پیگیری پرونده‌ها" to="/records" />
          <ToolButton icon={<Share2 size={21} />} title="اشتراک‌گذاری" hint="ارسال نتیجه محاسبه" to="/share" />
          <ToolButton icon={<Settings2 size={21} />} title="تنظیمات" hint="مشخصات و ترجیحات" to="/settings" />
          <ToolButton icon={<Info size={21} />} title="درباره نرم‌افزار" hint="اطلاعات و راهنما" to="/about" />
        </section>

        {serviceGroups.map((group) => (
          <section className="ef-home-section" key={group.title}>
            <div className="ef-home-section-heading">
              <div><h2>{group.title}</h2><p>{group.hint}</p></div>
              <span>{group.items.length.toLocaleString("fa-IR")} خدمت</span>
            </div>
            <div className="ef-home-services">{group.items.map((item) => <ServiceCard key={item.title} item={item} />)}</div>
          </section>
        ))}

        <aside className="ef-home-notice">
          <ShieldCheck size={21} /><p><strong>مبنای محاسبات: تعرفه ۱۴۰۵</strong>
          <span>نتایج جنبه محاسباتی و اطلاع‌رسانی دارد و بررسی نهایی بر عهده کارشناس است.</span></p>
        </aside>
      </div>
    </main>
  );
}
