import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Database,
  Download,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import SectionCard from "../components/ui/SectionCard";
import CalculateButton from "../components/ui/CalculateButton";
import { ExpertCaseRepository } from "../database/ExpertCaseRepository";
import {
  calculateExpertCaseFinancials,
} from "../database/ExpertCaseFinancialRules";
import type {
  ExpertCaseFilter,
  ExpertCaseFinancialSummary,
  ExpertCaseRecord,
  ProcessingInstitution,
  ReferralSource,
} from "../database/ExpertCaseTypes";
import type { ExpertCaseDraft } from "../records/ExpertCaseDraft";
import { buildExpertCaseReport } from "../reports/ExpertCaseReportService";
import { downloadExpertCaseExcel } from "../reports/ExpertCaseExcelExporter";

interface Props {
  onBack: () => void;
  initialDraft?: ExpertCaseDraft | null;
  onDraftConsumed?: () => void;
}

const repository = new ExpertCaseRepository();

const EMPTY_SUMMARY: ExpertCaseFinancialSummary = {
  recordCount: 0,
  receivedCount: 0,
  pendingCount: 0,
  grossFeeToman: 0,
  institutionShareToman: 0,
  netReceivableToman: 0,
  receivedAmountToman: 0,
  pendingReceivableToman: 0,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 46,
  boxSizing: "border-box",
  border: "1px solid var(--ef-border, #cfe0f5)",
  borderRadius: 12,
  background: "#fff",
  padding: "10px 12px",
  fontFamily: "inherit",
  fontSize: 14,
  color: "var(--ef-text, #16345f)",
};

const readOnlyInputStyle: React.CSSProperties = {
  ...inputStyle,
  background: "#f3f7fc",
  color: "#0d47a1",
  fontWeight: 900,
  cursor: "default",
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 7,
  fontSize: 13,
  fontWeight: 800,
  color: "var(--ef-text-strong, #0b3475)",
};

function money(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

function toNumber(value: string): number {
  const normalized = value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[^\d]/g, "");
  return Number(normalized) || 0;
}

function formatInput(value: string): string {
  const number = toNumber(value);
  return number > 0 ? number.toLocaleString("en-US") : "";
}

function sourceLabel(value: ReferralSource): string {
  if (value === "JUDICIARY") return "دادگستری";
  if (value === "CENTER") return "مرکز کارشناسان قوه قضاییه";
  return "کانون کارشناسان رسمی";
}

function institutionLabel(value: ProcessingInstitution): string {
  return value === "CENTER"
    ? "مرکز کارشناسان قوه قضاییه"
    : "کانون کارشناسان رسمی";
}

function panelLabel(value?: string): string {
  if (value === "SINGLE_EXPERT") return "کارشناس منفرد";
  if (value === "SAME_FIELD") return "هیأت هم‌رشته";
  if (value === "DIFFERENT_FIELDS") return "هیأت با رشته‌های مختلف";
  return "—";
}

export default function ExpertRecordsPage({
  onBack,
  initialDraft = null,
  onDraftConsumed,
}: Props) {
  const [referralSource, setReferralSource] =
    useState<ReferralSource>("JUDICIARY");
  const [processingInstitution, setProcessingInstitution] =
    useState<ProcessingInstitution>("CENTER");

  const [grossFee, setGrossFee] = useState("");
  const [calculationCategory, setCalculationCategory] = useState("");
  const [tariffArticle, setTariffArticle] = useState("");
  const [subject, setSubject] = useState("");
  const [activeDraft, setActiveDraft] =
    useState<ExpertCaseDraft | null>(null);

  const [caseNumber, setCaseNumber] = useState("");
  const [plaintiff, setPlaintiff] = useState("");
  const [defendant, setDefendant] = useState("");
  const [notificationNumber, setNotificationNumber] = useState("");
  const [requestingAuthority, setRequestingAuthority] = useState("");
  const [notes, setNotes] = useState("");

  const [records, setRecords] = useState<ExpertCaseRecord[]>([]);
  const [summary, setSummary] =
    useState<ExpertCaseFinancialSummary>(EMPTY_SUMMARY);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"" | "PENDING" | "RECEIVED">("");
  const [sourceFilter, setSourceFilter] =
    useState<"" | ReferralSource>("");
  const [dateMode, setDateMode] =
    useState<"CREATED" | "RECEIVED">("CREATED");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialDraft) return;

    setActiveDraft(initialDraft);
    setCalculationCategory(initialDraft.calculationCategory);
    setTariffArticle(
      initialDraft.tariffArticle !== undefined
        ? String(initialDraft.tariffArticle)
        : "",
    );
    setGrossFee(
      Math.round(initialDraft.grossFeeToman).toLocaleString("en-US"),
    );
    setSubject(initialDraft.subject ?? "");
    setMessage(
      "نتیجه نهایی محاسبه به فرم ثبت سابقه منتقل شد. اطلاعات پرونده را تکمیل و ذخیره کنید.",
    );
    setError("");
    onDraftConsumed?.();
  }, [initialDraft, onDraftConsumed]);

  const grossFeeToman = useMemo(() => toNumber(grossFee), [grossFee]);
  const grossFeeIsSafe = Number.isSafeInteger(grossFeeToman);

  const financials = useMemo(
    () => calculateExpertCaseFinancials(referralSource, grossFeeIsSafe ? grossFeeToman : 0),
    [referralSource, grossFeeIsSafe, grossFeeToman],
  );

  const activeReport = useMemo(
    () => buildExpertCaseReport(records),
    [records],
  );

  const reportPeriodLabel = useMemo(() => {
    if (!dateFrom && !dateTo) return "همه سوابق";
    const basis =
      dateMode === "CREATED" ? "تاریخ ثبت" : "تاریخ وصول";
    return `${basis}: ${dateFrom || "ابتدا"} تا ${dateTo || "انتهای بازه"}`;
  }, [dateMode, dateFrom, dateTo]);

  function handleExcelExport(): void {
    downloadExpertCaseExcel(records, {
      reportTitle: "گزارش مالی سوابق کارشناسی",
      periodLabel: reportPeriodLabel,
    });
  }

  const loadRecords = useCallback(async () => {
    const filter: ExpertCaseFilter = {};
    if (search.trim()) filter.search = search.trim();
    if (statusFilter) filter.paymentStatus = statusFilter;
    if (sourceFilter) filter.referralSource = sourceFilter;

    const fromIso = dateFrom
      ? new Date(`${dateFrom}T00:00:00`).toISOString()
      : undefined;
    const toIso = dateTo
      ? new Date(`${dateTo}T23:59:59.999`).toISOString()
      : undefined;

    if (dateMode === "CREATED") {
      if (fromIso) filter.createdFrom = fromIso;
      if (toIso) filter.createdTo = toIso;
    } else {
      if (fromIso) filter.receivedFrom = fromIso;
      if (toIso) filter.receivedTo = toIso;
    }

    const [list, totals] = await Promise.all([
      repository.list(filter),
      repository.summary(filter),
    ]);

    setRecords(list);
    setSummary(totals);
  }, [search, sourceFilter, statusFilter, dateMode, dateFrom, dateTo]);

  useEffect(() => {
    loadRecords().catch((e) => {
      setError(e instanceof Error ? e.message : "خواندن سوابق انجام نشد.");
    });
  }, [loadRecords]);

  function resetForm(): void {
    setGrossFee("");
    setCalculationCategory("");
    setTariffArticle("");
    setSubject("");
    setActiveDraft(null);
    setCaseNumber("");
    setPlaintiff("");
    setDefendant("");
    setNotificationNumber("");
    setRequestingAuthority("");
    setNotes("");
  }

  async function handleSave(): Promise<void> {
    setError("");
    setMessage("");

    if (!grossFeeIsSafe) {
      setError("مبلغ دستمزد از محدوده امن محاسبه خارج است.");
      return;
    }

    if (grossFeeToman <= 0) {
      setError("مبلغ دستمزد کارشناسی باید بزرگ‌تر از صفر باشد.");
      return;
    }

    if (!calculationCategory.trim()) {
      setError("عنوان یا نوع محاسبه را وارد کنید.");
      return;
    }

    setBusy(true);
    try {
      const draftDetails = activeDraft
        ? [
            activeDraft.evaluationValueToman
              ? `ارزش مورد کارشناسی: ${money(activeDraft.evaluationValueToman)} تومان`
              : "",
            activeDraft.expertCount
              ? `تعداد کارشناسان: ${activeDraft.expertCount}`
              : "",
            activeDraft.panelFieldMode
              ? `ترکیب کارشناسی: ${panelLabel(activeDraft.panelFieldMode)}`
              : "",
            activeDraft.missionFeeToman
              ? `فوق‌العاده مأموریت: ${money(activeDraft.missionFeeToman)} تومان`
              : "",
          ].filter(Boolean).join(" | ")
        : "";

      await repository.create({
        referralSource,
        processingInstitution:
          referralSource === "JUDICIARY"
            ? processingInstitution
            : undefined,
        caseNumber:
          referralSource === "JUDICIARY" ? caseNumber : undefined,
        plaintiff:
          referralSource === "JUDICIARY" ? plaintiff : undefined,
        defendant:
          referralSource === "JUDICIARY" ? defendant : undefined,
        notificationNumber:
          referralSource !== "JUDICIARY"
            ? notificationNumber
            : undefined,
        requestingAuthority:
          referralSource !== "JUDICIARY"
            ? requestingAuthority
            : undefined,
        calculationCategory,
        tariffArticle: tariffArticle
          ? Number(tariffArticle)
          : undefined,
        subject,
        grossFeeToman,
        notes: [draftDetails, notes.trim()]
          .filter(Boolean)
          .join("\n"),
      });

      resetForm();
      setMessage("سابقه کارشناسی با موفقیت ذخیره شد.");
      await loadRecords();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ذخیره سابقه انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReceived(record: ExpertCaseRecord): Promise<void> {
    const receivedAt = window.prompt(
      "تاریخ وصول را وارد کنید. برای ثبت زمان فعلی، کادر را خالی بگذارید.",
      "",
    );

    if (receivedAt === null) return;

    setBusy(true);
    setError("");
    try {
      await repository.markReceived(
        record.id,
        receivedAt.trim() || new Date().toISOString(),
      );
      setMessage(
        `وصول کامل ${money(record.netReceivableToman)} تومان ثبت شد.`,
      );
      await loadRecords();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ثبت وصول انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePending(record: ExpertCaseRecord): Promise<void> {
    setBusy(true);
    setError("");
    try {
      await repository.markPending(record.id);
      setMessage("رکورد به وضعیت در انتظار وصول بازگردانده شد.");
      await loadRecords();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تغییر وضعیت انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(record: ExpertCaseRecord): Promise<void> {
    if (!window.confirm("این سابقه حذف شود؟")) return;

    setBusy(true);
    setError("");
    try {
      await repository.delete(record.id);
      setMessage("سابقه حذف شد.");
      await loadRecords();
    } catch (e) {
      setError(e instanceof Error ? e.message : "حذف سابقه انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function handleClearAll(): Promise<void> {
    if (
      !window.confirm(
        "همه سوابق ذخیره‌شده در این مرورگر حذف شوند؟ این عمل قابل بازگشت نیست.",
      )
    ) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");
    try {
      await repository.clear();
      setMessage("همه سوابق ذخیره‌شده در این مرورگر حذف شدند.");
      await loadRecords();
    } catch (e) {
      setError(e instanceof Error ? e.message : "حذف همه سوابق انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      className="ef-utility-page ef-records-page"
      dir="rtl"
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "24px 18px 48px",
        fontFamily: "inherit",
        color: "var(--ef-text, #16345f)",
      }}
    >
      <button
        className="ef-back-button ef-utility-back-button"
        type="button"
        onClick={onBack}
        style={{
          border: "1px solid var(--ef-border, #cfe0f5)",
          borderRadius: 10,
          background: "#fff",
          padding: "9px 16px",
          cursor: "pointer",
          fontFamily: "inherit",
          color: "var(--ef-primary-dark, #0d47a1)",
          fontWeight: 800,
          marginBottom: 18,
        }}
      >
        ← بازگشت به صفحه اصلی
      </button>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: "var(--ef-primary-dark, #0d47a1)" }}>
          ذخیره و سوابق کارشناسی
        </h1>
        <p style={{ margin: "7px 0 0", color: "#64748b" }}>
          ثبت پرونده، کنترل مطالبات و مدیریت دریافتی‌های کارشناسی
        </p>
      </div>

      <div className="records-privacy" role="note">
        <ShieldCheck size={20} aria-hidden="true" />
        <div>
          <strong>حریم خصوصی سوابق</strong>
          <span>
            اطلاعات پرونده‌ها فقط در همین مرورگر ذخیره می‌شوند. در دستگاه مشترک، پس از پایان کار سوابق حساس را حذف کنید و از داده‌های مرورگر نسخه پشتیبان امن نگه دارید.
          </span>
        </div>
      </div>

      <div className="ef-form-shell">
        <SectionCard>
          <div className="ef-stack">
            <div className="ef-section-title" style={{ textAlign: "center" }}>
              ثبت سابقه کارشناسی
            </div>

            {activeDraft && (
              <div className="records-imported">
                <strong>نتیجه محاسبه ماده ۱۱ دریافت شد</strong>
                <span>
                  مبلغ کل محاسبه‌شده عیناً به عنوان دستمزد قابل ثبت منتقل شده است.
                </span>
              </div>
            )}

            <div className="records-grid records-grid-3">
              <label style={labelStyle}>
                مبدأ ارجاع
                <select
                  value={referralSource}
                  onChange={(e) =>
                    setReferralSource(e.target.value as ReferralSource)
                  }
                  style={inputStyle}
                >
                  <option value="JUDICIARY">دادگستری</option>
                  <option value="CENTER">مرکز کارشناسان قوه قضاییه</option>
                  <option value="BAR_ASSOCIATION">
                    کانون کارشناسان رسمی
                  </option>
                </select>
              </label>

              <label style={labelStyle}>
                نوع / عنوان محاسبه
                <input
                  value={calculationCategory}
                  onChange={(e) => setCalculationCategory(e.target.value)}
                  placeholder="مثلاً ارزیابی عمومی"
                  readOnly={Boolean(activeDraft)}
                  style={activeDraft ? readOnlyInputStyle : inputStyle}
                />
              </label>

              <label style={labelStyle}>
                ماده تعرفه
                <input
                  inputMode="numeric"
                  value={tariffArticle}
                  onChange={(e) =>
                    setTariffArticle(e.target.value.replace(/[^\d]/g, ""))
                  }
                  placeholder="مثلاً 11"
                  readOnly={Boolean(activeDraft)}
                  style={{
                    ...(activeDraft ? readOnlyInputStyle : inputStyle),
                    textAlign: "center",
                  }}
                />
              </label>
            </div>

            <div className="records-grid records-grid-2">
              <label style={labelStyle}>
                دستمزد نهایی محاسبه‌شده (تومان)
                <input
                  inputMode="numeric"
                  value={grossFee}
                  onChange={(e) => setGrossFee(formatInput(e.target.value))}
                  placeholder="20,000,000"
                  aria-invalid={!grossFeeIsSafe}
                  aria-describedby={!grossFeeIsSafe ? "records-gross-fee-error" : undefined}
                  readOnly={Boolean(activeDraft)}
                  style={{
                    ...(activeDraft ? readOnlyInputStyle : inputStyle),
                    textAlign: "center",
                    fontSize: 17,
                    fontWeight: 900,
                  }}
                />
                {!grossFeeIsSafe && <span id="records-gross-fee-error" className="records-inline-error">مبلغ واردشده بیش از محدوده امن محاسبه است.</span>}
              </label>

              <label style={labelStyle}>
                موضوع کارشناسی
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="اختیاری"
                  style={inputStyle}
                />
              </label>
            </div>

            {activeDraft && (
              <div className="records-calculation-details">
                <RecordValue
                  label="ارزش مورد کارشناسی"
                  value={
                    activeDraft.evaluationValueToman
                      ? `${money(activeDraft.evaluationValueToman)} تومان`
                      : "—"
                  }
                />
                <RecordValue
                  label="تعداد کارشناسان"
                  value={
                    activeDraft.expertCount
                      ? `${activeDraft.expertCount} نفر`
                      : "—"
                  }
                />
                <RecordValue
                  label="ترکیب کارشناسی"
                  value={panelLabel(activeDraft.panelFieldMode)}
                />
                <RecordValue
                  label="فوق‌العاده مأموریت"
                  value={`${money(activeDraft.missionFeeToman ?? 0)} تومان`}
                />
              </div>
            )}

            {referralSource === "JUDICIARY" ? (
              <>
                <div className="records-grid records-grid-2">
                  <label style={labelStyle}>
                    نهاد کارسازی
                    <select
                      value={processingInstitution}
                      onChange={(e) =>
                        setProcessingInstitution(
                          e.target.value as ProcessingInstitution,
                        )
                      }
                      style={inputStyle}
                    >
                      <option value="CENTER">
                        مرکز کارشناسان قوه قضاییه
                      </option>
                      <option value="BAR_ASSOCIATION">
                        کانون کارشناسان رسمی
                      </option>
                    </select>
                  </label>

                  <label style={labelStyle}>
                    شماره پرونده
                    <input
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                      placeholder="اختیاری"
                      style={inputStyle}
                    />
                  </label>
                </div>

                <div className="records-grid records-grid-2">
                  <label style={labelStyle}>
                    خواهان
                    <input
                      value={plaintiff}
                      onChange={(e) => setPlaintiff(e.target.value)}
                      placeholder="اختیاری"
                      style={inputStyle}
                    />
                  </label>
                  <label style={labelStyle}>
                    خوانده
                    <input
                      value={defendant}
                      onChange={(e) => setDefendant(e.target.value)}
                      placeholder="اختیاری"
                      style={inputStyle}
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="records-grid records-grid-2">
                <label style={labelStyle}>
                  شماره ابلاغیه
                  <input
                    value={notificationNumber}
                    onChange={(e) => setNotificationNumber(e.target.value)}
                    placeholder="اختیاری"
                    style={inputStyle}
                  />
                </label>
                <label style={labelStyle}>
                  مرجع متقاضی امر کارشناسی
                  <input
                    value={requestingAuthority}
                    onChange={(e) => setRequestingAuthority(e.target.value)}
                    placeholder="اختیاری"
                    style={inputStyle}
                  />
                </label>
              </div>
            )}

            <label style={labelStyle}>
              توضیحات
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="اختیاری"
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </label>

            <div className="records-financial-grid">
              <div>
                <span>دستمزد کارشناسی</span>
                <strong>{money(financials.grossFeeToman)} تومان</strong>
              </div>
              <div>
                <span>
                  سهم {referralSource === "JUDICIARY"
                    ? institutionLabel(processingInstitution)
                    : sourceLabel(referralSource)}
                  {" "}({financials.institutionSharePercent}٪)
                </span>
                <strong>{money(financials.institutionShareToman)} تومان</strong>
              </div>
              <div className="records-net">
                <span>خالص قابل پرداخت به کارشناس</span>
                <strong>{money(financials.netReceivableToman)} تومان</strong>
              </div>
            </div>

            {error && <div className="records-error" role="alert">{error}</div>}
            {message && <div className="records-success" role="status">{message}</div>}

            <CalculateButton
              disabled={busy || grossFeeToman <= 0 || !grossFeeIsSafe}
              onClick={handleSave}
            >
              {busy ? "در حال ثبت…" : "ذخیره سابقه کارشناسی"}
            </CalculateButton>
          </div>
        </SectionCard>
      </div>

      <section style={{ marginTop: 28 }}>
        <SectionCard>
          <div className="ef-stack">
            <div className="records-report-heading">
              <div>
                <div className="ef-section-title">گزارش مالی سوابق کارشناسی</div>
                <div className="records-report-subtitle">شاخص‌های مالی، تفکیک مراجع و فایل Excel بر اساس فیلترهای انتخاب‌شده در این بخش هستند.</div>
              </div>
              <div className="records-report-basis"><span>مبنای گزارش فعال</span><strong>{reportPeriodLabel}</strong></div>
            </div>
            <div className="records-filter-panel">
              <div className="records-filter-grid records-filter-grid-report">
                <label style={labelStyle}>جست‌وجو<div style={{position:"relative"}}><Search size={18} style={{position:"absolute",right:12,top:14,color:"#64748b"}}/><input name="records-search" spellCheck={false} value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="پرونده، ابلاغیه، طرفین، موضوع…" style={{...inputStyle,paddingRight:38}}/></div></label>
                <label style={labelStyle}>وضعیت وصول<select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as ""|"PENDING"|"RECEIVED")} style={inputStyle}><option value="">همه وضعیت‌ها</option><option value="PENDING">در انتظار وصول</option><option value="RECEIVED">وصول‌شده</option></select></label>
                <label style={labelStyle}>مبدأ ارجاع<select value={sourceFilter} onChange={(e)=>setSourceFilter(e.target.value as ""|ReferralSource)} style={inputStyle}><option value="">همه مراجع</option><option value="JUDICIARY">دادگستری</option><option value="CENTER">مرکز</option><option value="BAR_ASSOCIATION">کانون</option></select></label>
                <label style={labelStyle}>مبنای تاریخ<select value={dateMode} onChange={(e)=>setDateMode(e.target.value as "CREATED"|"RECEIVED")} style={inputStyle}><option value="CREATED">تاریخ ثبت سابقه</option><option value="RECEIVED">تاریخ وصول</option></select></label>
                <label style={labelStyle}>از تاریخ<input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} style={inputStyle}/></label>
                <label style={labelStyle}>تا تاریخ<input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} style={inputStyle}/></label>
              </div>
              <div className="records-filter-actions">
                <button type="button" onClick={()=>loadRecords()} disabled={busy} className="records-refresh"><RefreshCw size={18}/> بروزرسانی گزارش</button>
                <button type="button" onClick={handleExcelExport} disabled={busy||records.length===0} className="records-refresh records-export"><Download size={18}/> خروجی Excel همین گزارش</button>
              </div>
            </div>
            <div className="records-report-note"><strong>مبنای فعلی گزارش:</strong> {reportPeriodLabel}؛ {sourceFilter ? `مبدأ ${sourceLabel(sourceFilter)}` : "همه مراجع ارجاع"}؛ {statusFilter === "RECEIVED" ? "فقط پرونده‌های وصول‌شده" : statusFilter === "PENDING" ? "فقط مطالبات در انتظار وصول" : "همه وضعیت‌های وصول"}. مبلغ وصول‌شده واقعی فقط از پرونده‌های دارای وضعیت «وصول‌شده» محاسبه می‌شود.</div>
            <div className="records-summary-caption"><strong>شاخص‌های مالی گزارش انتخاب‌شده</strong><span>مبالغ زیر فقط مربوط به سوابق منطبق با فیلترهای بالا هستند.</span></div>
            <div className="records-summary-grid">
              <SummaryCard title="کل دستمزد ثبت‌شده" value={summary.grossFeeToman} icon={<Database size={22}/>} />
              <SummaryCard title="سهم مرکز / کانون" value={summary.institutionShareToman} icon={<Database size={22}/>} />
              <SummaryCard title="خالص قابل دریافت" value={summary.netReceivableToman} icon={<Database size={22}/>} />
              <SummaryCard title="مبلغ وصول‌شده واقعی" value={summary.receivedAmountToman} icon={<CheckCircle2 size={22}/>} />
              <SummaryCard title="مطالبات وصول‌نشده" value={summary.pendingReceivableToman} icon={<Clock3 size={22}/>} />
              <div className="records-summary-card"><div className="records-summary-icon"><Database size={22}/></div><div className="records-summary-title">تعداد پرونده‌های گزارش</div><div className="records-summary-value">{summary.recordCount.toLocaleString("fa-IR")}</div></div>
            </div>
            <div className="records-breakdown-caption">تفکیک همین گزارش بر اساس مبدأ ارجاع</div>
            <div className="records-report-breakdown">{activeReport.byReferralSource.map((item)=><div key={item.referralSource}><strong>{sourceLabel(item.referralSource)}</strong><span>{item.recordCount.toLocaleString("fa-IR")} پرونده</span><span>وصول‌شده: {money(item.receivedAmountToman)} تومان</span><span>وصول‌نشده: {money(item.pendingReceivableToman)} تومان</span></div>)}</div>
          </div>
        </SectionCard>
      </section>
      <section style={{marginTop:22}}>
        <SectionCard><div className="ef-stack">
          <div className="records-history-heading"><div><div className="ef-section-title">سوابق پرونده‌های گزارش جاری</div><div className="records-report-subtitle">این فهرست دقیقاً همان سوابقی است که در شاخص‌های مالی بالا و خروجی Excel لحاظ شده‌اند.</div></div><div className="records-history-tools"><div className="records-history-count"><span>تعداد رکورد</span><strong>{records.length.toLocaleString("fa-IR")}</strong></div><button type="button" onClick={handleClearAll} disabled={busy || summary.recordCount === 0} className="records-action danger"><Trash2 size={17}/> حذف همه سوابق</button></div></div>
          {records.length===0 ? <div className="records-empty">هنوز سابقه‌ای مطابق فیلتر انتخاب‌شده وجود ندارد.</div> : <div className="records-list">{records.map((record)=><article key={record.id} className="records-item">
            <div className="records-item-head"><div><strong>{record.calculationCategory}</strong><div className="records-muted">{sourceLabel(record.referralSource)}{record.tariffArticle ? ` • ماده ${record.tariffArticle}` : ""}</div></div><span className={record.paymentStatus==="RECEIVED"?"records-status received":"records-status pending"}>{record.paymentStatus==="RECEIVED"?"وصول‌شده":"در انتظار وصول"}</span></div>
            <div className="records-item-grid"><RecordValue label="دستمزد ثبت‌شده" value={`${money(record.grossFeeToman)} تومان`}/><RecordValue label={`سهم نهاد (${record.institutionSharePercent}٪)`} value={`${money(record.institutionShareToman)} تومان`}/><RecordValue label="خالص قابل دریافت" value={`${money(record.netReceivableToman)} تومان`}/><RecordValue label="مبلغ وصول‌شده" value={`${money(record.receivedAmountToman)} تومان`}/></div>
            {(record.caseNumber||record.notificationNumber||record.requestingAuthority||record.subject)&&<div className="records-detail">{record.caseNumber&&<span>پرونده: {record.caseNumber}</span>}{record.notificationNumber&&<span>ابلاغیه: {record.notificationNumber}</span>}{record.requestingAuthority&&<span>مرجع: {record.requestingAuthority}</span>}{record.subject&&<span>موضوع: {record.subject}</span>}</div>}
            <div className="records-actions">{record.paymentStatus==="PENDING"?<button type="button" onClick={()=>handleReceived(record)} disabled={busy} className="records-action primary"><CheckCircle2 size={17}/> اعلام وصول کامل</button>:<button type="button" onClick={()=>handlePending(record)} disabled={busy} className="records-action"><Clock3 size={17}/> بازگشت به انتظار وصول</button>}<button type="button" onClick={()=>handleDelete(record)} disabled={busy} className="records-action danger"><Trash2 size={17}/> حذف</button></div>
            {record.receivedAt&&<div className="records-muted">تاریخ وصول: {record.receivedAt}</div>}
          </article>)}</div>}
        </div></SectionCard>
      </section>
      <style>{`
        .records-report-heading,.records-history-heading{display:flex;align-items:center;justify-content:space-between;gap:16px}.records-report-subtitle{margin-top:5px;color:#64748b;font-size:12px;line-height:1.8}.records-report-basis{min-width:220px;display:grid;gap:3px;padding:10px 14px;border:1px solid #b9d6fb;border-radius:13px;background:#eef6ff;text-align:center}.records-report-basis span{color:#64748b;font-size:11px}.records-report-basis strong{color:#0d47a1;font-size:13px}.records-filter-panel{padding:14px;border:1px solid var(--ef-border,#cfe0f5);border-radius:16px;background:#f8fbff}.records-filter-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:12px}.records-summary-caption{display:grid;gap:2px;text-align:center;margin-top:4px}.records-summary-caption strong{color:#0d47a1;font-size:15px}.records-summary-caption span{color:#64748b;font-size:12px}.records-breakdown-caption{margin-top:4px;text-align:center;color:#475569;font-size:12px;font-weight:800}.records-history-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.records-history-count{min-width:110px;padding:8px 12px;border-radius:12px;background:#eef6ff;text-align:center}.records-history-count span{display:block;color:#64748b;font-size:11px}.records-history-count strong{display:block;color:#0d47a1;font-size:18px}

        .records-privacy { display: flex; align-items: flex-start; gap: 10px; margin: -4px 0 18px; padding: 12px 14px; border: 1px solid #b9d6fb; border-radius: 14px; background: #eef6ff; color: #0d47a1; }
        .records-privacy > div { display: grid; gap: 3px; min-width: 0; }
        .records-privacy span { color: #476789; font-size: 12px; line-height: 1.9; }

        .records-grid { display: grid; gap: 14px; }
        .records-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .records-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .records-imported {
          display: grid;
          gap: 4px;
          padding: 12px 14px;
          border: 1px solid #b9d6fb;
          border-radius: 13px;
          background: #eef6ff;
          color: #0d47a1;
          text-align: center;
        }
        .records-imported span { font-size: 12px; color: #476789; }
        .records-calculation-details {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }
        .records-financial-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          border: 1px solid var(--ef-border, #cfe0f5);
          border-radius: 16px;
          background: #f8fbff;
          padding: 12px;
        }
        .records-financial-grid > div {
          display: grid; gap: 5px; text-align: center; padding: 10px;
        }
        .records-financial-grid span { color: #64748b; font-size: 12px; }
        .records-financial-grid strong { color: #0d47a1; font-size: 17px; }
        .records-net { background: #eaf3ff; border-radius: 12px; }
        .records-summary-grid {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px;
        }
        .records-report-breakdown {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 12px;
        }
        .records-report-breakdown > div {
          display: grid;
          gap: 4px;
          padding: 12px;
          border: 1px solid var(--ef-border, #cfe0f5);
          border-radius: 13px;
          background: #fff;
          text-align: center;
          font-size: 12px;
          color: #64748b;
        }
        .records-report-breakdown strong { color: #0d47a1; font-size: 13px; }
        .records-report-note {
          padding: 10px 12px;
          border-radius: 12px;
          background: #f8fbff;
          color: #64748b;
          text-align: center;
          font-size: 12px;
        }
        .records-export {
          background: #1565c0;
          color: #fff;
          border-color: #1565c0;
        }
        .records-summary-card {
          border: 1px solid var(--ef-border, #cfe0f5);
          border-radius: 16px; background: #fff; padding: 16px; text-align: center;
          box-shadow: 0 6px 18px rgba(13, 71, 161, .06);
        }
        .records-summary-icon {
          width: 42px; height: 42px; margin: 0 auto 8px; border-radius: 50%;
          display: grid; place-items: center; background: #eaf3ff; color: #1565c0;
        }
        .records-summary-title { font-size: 12px; color: #64748b; }
        .records-summary-value { margin-top: 4px; font-size: 19px; font-weight: 900; color: #0d47a1; }
        .records-filter-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end;
        }
        .records-filter-grid-report {
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr auto auto;
        }
        .records-refresh, .records-action {
          border: 1px solid var(--ef-border, #cfe0f5); border-radius: 10px; background: #fff;
          min-height: 46px; padding: 8px 13px; cursor: pointer; font-family: inherit;
          color: #0d47a1; font-weight: 800; display: inline-flex; align-items: center;
          justify-content: center; gap: 7px;
        }
        .records-action.primary { background: #1565c0; color: #fff; border-color: #1565c0; }
        .records-action.danger { color: #b91c1c; }
        .records-list { display: grid; gap: 12px; }
        .records-item {
          border: 1px solid var(--ef-border, #cfe0f5); border-radius: 15px;
          padding: 15px; background: #fff;
        }
        .records-item-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .records-item-head strong { color: #0d47a1; font-size: 16px; }
        .records-status {
          border-radius: 999px; padding: 5px 10px; font-size: 11px; font-weight: 900; white-space: nowrap;
        }
        .records-status.received { background: #ecfdf3; color: #166534; }
        .records-status.pending { background: #fff7ed; color: #9a3412; }
        .records-item-grid {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 13px;
        }
        .records-value { background: #f8fbff; border-radius: 10px; padding: 9px; text-align: center; }
        .records-value span { display: block; font-size: 11px; color: #64748b; }
        .records-value strong { display: block; margin-top: 3px; font-size: 13px; color: #16345f; }
        .records-detail { display: flex; flex-wrap: wrap; gap: 7px 14px; margin-top: 11px; font-size: 12px; color: #475569; }
        .records-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 13px; }
        .records-muted { margin-top: 4px; color: #64748b; font-size: 12px; }
        .records-empty { padding: 28px 14px; text-align: center; color: #64748b; background: #f8fbff; border-radius: 14px; }
        .records-error, .records-success {
          border-radius: 12px; padding: 10px 12px; text-align: center; font-size: 13px; font-weight: 800;
        }
        .records-error { background: #fef2f2; color: #b91c1c; }
        .records-success { background: #ecfdf3; color: #166534; }
        .records-inline-error { color: #b91c1c; font-size: 12px; font-weight: 700; }
        @media (max-width: 760px) { .records-report-heading,.records-history-heading{align-items:stretch;flex-direction:column}.records-history-tools{align-items:stretch;flex-direction:column}.records-report-basis,.records-history-count{min-width:0}
          .records-grid-3, .records-summary-grid, .records-filter-grid,
          .records-calculation-details, .records-report-breakdown {
            grid-template-columns: 1fr;
          }
          .records-item-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .records-grid-2, .records-financial-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="records-summary-card">
      <div className="records-summary-icon">{icon}</div>
      <div className="records-summary-title">{title}</div>
      <div className="records-summary-value">{money(value)} تومان</div>
    </div>
  );
}

function RecordValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="records-value">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
