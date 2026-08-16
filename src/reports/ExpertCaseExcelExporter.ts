import type {
  ExpertCaseRecord,
  ReferralSource,
} from "../database/ExpertCaseTypes";
import {
  buildExpertCaseReport,
} from "./ExpertCaseReportService";

export interface ExpertCaseExcelExportOptions {
  fileName?: string;
  reportTitle?: string;
  periodLabel?: string;
}

function xml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cell(
  value: string | number,
  type: "String" | "Number" = "String",
  styleId?: string,
): string {
  const style = styleId
    ? ` ss:StyleID="${styleId}"`
    : "";
  return `<Cell${style}><Data ss:Type="${type}">${xml(value)}</Data></Cell>`;
}

function row(cells: string[]): string {
  return `<Row>${cells.join("")}</Row>`;
}

function sourceLabel(value: ReferralSource): string {
  if (value === "JUDICIARY") return "دادگستری";
  if (value === "CENTER") return "مرکز کارشناسان قوه قضاییه";
  return "کانون کارشناسان رسمی";
}

function statusLabel(record: ExpertCaseRecord): string {
  return record.paymentStatus === "RECEIVED"
    ? "وصول‌شده"
    : "در انتظار وصول";
}

function institutionLabel(record: ExpertCaseRecord): string {
  return record.processingInstitution === "CENTER"
    ? "مرکز کارشناسان قوه قضاییه"
    : "کانون کارشناسان رسمی";
}

function summarySheet(
  records: ExpertCaseRecord[],
  title: string,
  periodLabel: string,
): string {
  const report = buildExpertCaseReport(records);
  const s = report.summary;

  const rows = [
    row([cell(title, "String", "Title")]),
    row([cell(`بازه گزارش: ${periodLabel}`, "String", "SubTitle")]),
    row([]),
    row([cell("شاخص", "String", "Header"), cell("مقدار", "String", "Header")]),
    row([cell("تعداد کل پرونده‌ها"), cell(s.recordCount, "Number", "Integer")]),
    row([cell("تعداد وصول‌شده"), cell(s.receivedCount, "Number", "Integer")]),
    row([cell("تعداد در انتظار وصول"), cell(s.pendingCount, "Number", "Integer")]),
    row([cell("جمع دستمزد ثبت‌شده"), cell(s.grossFeeToman, "Number", "Money")]),
    row([cell("جمع سهم مرکز / کانون"), cell(s.institutionShareToman, "Number", "Money")]),
    row([cell("جمع خالص قابل دریافت"), cell(s.netReceivableToman, "Number", "Money")]),
    row([cell("دریافتی واقعی"), cell(s.receivedAmountToman, "Number", "Money")]),
    row([cell("مطالبات وصول‌نشده"), cell(s.pendingReceivableToman, "Number", "Money")]),
    row([]),
    row([
      cell("مبدأ ارجاع", "String", "Header"),
      cell("تعداد", "String", "Header"),
      cell("دستمزد کل", "String", "Header"),
      cell("سهم نهاد", "String", "Header"),
      cell("خالص قابل دریافت", "String", "Header"),
      cell("وصول‌شده", "String", "Header"),
      cell("مطالبات", "String", "Header"),
    ]),
    ...report.byReferralSource.map((item) =>
      row([
        cell(sourceLabel(item.referralSource)),
        cell(item.recordCount, "Number", "Integer"),
        cell(item.grossFeeToman, "Number", "Money"),
        cell(item.institutionShareToman, "Number", "Money"),
        cell(item.netReceivableToman, "Number", "Money"),
        cell(item.receivedAmountToman, "Number", "Money"),
        cell(item.pendingReceivableToman, "Number", "Money"),
      ]),
    ),
  ];

  return worksheet("خلاصه مالی", rows);
}

function detailRows(records: ExpertCaseRecord[]): string[] {
  const header = row([
    cell("ردیف", "String", "Header"),
    cell("تاریخ ثبت", "String", "Header"),
    cell("مبدأ ارجاع", "String", "Header"),
    cell("نهاد کارسازی", "String", "Header"),
    cell("شماره پرونده", "String", "Header"),
    cell("شماره ابلاغیه", "String", "Header"),
    cell("خواهان", "String", "Header"),
    cell("خوانده", "String", "Header"),
    cell("مرجع متقاضی", "String", "Header"),
    cell("نوع محاسبه", "String", "Header"),
    cell("ماده تعرفه", "String", "Header"),
    cell("موضوع", "String", "Header"),
    cell("دستمزد کل", "String", "Header"),
    cell("درصد کسور", "String", "Header"),
    cell("سهم مرکز / کانون", "String", "Header"),
    cell("خالص کارشناس", "String", "Header"),
    cell("وضعیت", "String", "Header"),
    cell("تاریخ وصول", "String", "Header"),
    cell("مبلغ دریافتی", "String", "Header"),
    cell("توضیحات", "String", "Header"),
  ]);

  const body = records.map((record, index) =>
    row([
      cell(index + 1, "Number", "Integer"),
      cell(record.createdAt),
      cell(sourceLabel(record.referralSource)),
      cell(institutionLabel(record)),
      cell(record.caseNumber ?? ""),
      cell(record.notificationNumber ?? ""),
      cell(record.plaintiff ?? ""),
      cell(record.defendant ?? ""),
      cell(record.requestingAuthority ?? ""),
      cell(record.calculationCategory),
      cell(record.tariffArticle ?? ""),
      cell(record.subject ?? ""),
      cell(record.grossFeeToman, "Number", "Money"),
      cell(record.institutionSharePercent, "Number", "Integer"),
      cell(record.institutionShareToman, "Number", "Money"),
      cell(record.netReceivableToman, "Number", "Money"),
      cell(statusLabel(record)),
      cell(record.receivedAt ?? ""),
      cell(record.receivedAmountToman, "Number", "Money"),
      cell(record.notes ?? ""),
    ]),
  );

  const totals = buildExpertCaseReport(records).summary;

  body.push(
    row([
      cell("جمع", "String", "Total"),
      ...Array.from({ length: 11 }, () => cell("")),
      cell(totals.grossFeeToman, "Number", "TotalMoney"),
      cell(""),
      cell(totals.institutionShareToman, "Number", "TotalMoney"),
      cell(totals.netReceivableToman, "Number", "TotalMoney"),
      cell(""),
      cell(""),
      cell(totals.receivedAmountToman, "Number", "TotalMoney"),
      cell(""),
    ]),
  );

  return [header, ...body];
}

function worksheet(name: string, rows: string[]): string {
  return `
    <Worksheet ss:Name="${xml(name)}">
      <Table>${rows.join("")}</Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <DisplayRightToLeft/>
        <FreezePanes/>
        <FrozenNoSplit/>
        <SplitHorizontal>1</SplitHorizontal>
        <TopRowBottomPane>1</TopRowBottomPane>
      </WorksheetOptions>
    </Worksheet>`;
}

export function createExpertCaseExcelXml(
  records: ExpertCaseRecord[],
  options: ExpertCaseExcelExportOptions = {},
): string {
  const title =
    options.reportTitle ?? "گزارش مالی سوابق کارشناسی";
  const periodLabel =
    options.periodLabel ?? "همه سوابق";

  const report = buildExpertCaseReport(records);

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook
 xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center" ss:ReadingOrder="RightToLeft"/>
   <Font ss:FontName="Vazirmatn"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:Bold="1" ss:Size="14"/>
   <Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/>
  </Style>
  <Style ss:ID="SubTitle">
   <Font ss:Bold="1"/>
   <Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:Bold="1"/>
   <Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/>
  </Style>
  <Style ss:ID="Money">
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="Integer">
   <NumberFormat ss:Format="0"/>
  </Style>
  <Style ss:ID="Total">
   <Font ss:Bold="1"/>
  </Style>
  <Style ss:ID="TotalMoney">
   <Font ss:Bold="1"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
 </Styles>
 ${summarySheet(records, title, periodLabel)}
 ${worksheet("جزئیات پرونده‌ها", detailRows(records))}
 ${worksheet("مطالبات وصول‌نشده", detailRows(report.pendingRecords))}
</Workbook>`;
}

export function downloadExpertCaseExcel(
  records: ExpertCaseRecord[],
  options: ExpertCaseExcelExportOptions = {},
): void {
  const content = createExpertCaseExcelXml(records, options);
  const blob = new Blob([content], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download =
    options.fileName ??
    `ExpertFee-Report-${new Date().toISOString().slice(0, 10)}.xls`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
