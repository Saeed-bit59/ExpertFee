import type {
  ExpertCaseFinancialSummary,
  ExpertCaseRecord,
  ReferralSource,
} from "../database/ExpertCaseTypes";

export interface ExpertCaseReportBreakdown {
  referralSource: ReferralSource;
  recordCount: number;
  grossFeeToman: number;
  institutionShareToman: number;
  netReceivableToman: number;
  receivedAmountToman: number;
  pendingReceivableToman: number;
}

export interface ExpertCaseReport {
  summary: ExpertCaseFinancialSummary;
  byReferralSource: ExpertCaseReportBreakdown[];
  pendingRecords: ExpertCaseRecord[];
}

const emptySummary = (): ExpertCaseFinancialSummary => ({
  recordCount: 0,
  receivedCount: 0,
  pendingCount: 0,
  grossFeeToman: 0,
  institutionShareToman: 0,
  netReceivableToman: 0,
  receivedAmountToman: 0,
  pendingReceivableToman: 0,
});

export function buildExpertCaseReport(
  records: ExpertCaseRecord[],
): ExpertCaseReport {
  const summary = emptySummary();

  const sourceMap = new Map<
    ReferralSource,
    ExpertCaseReportBreakdown
  >();

  for (const record of records) {
    summary.recordCount += 1;
    summary.grossFeeToman += record.grossFeeToman;
    summary.institutionShareToman += record.institutionShareToman;
    summary.netReceivableToman += record.netReceivableToman;
    summary.receivedAmountToman += record.receivedAmountToman;

    if (record.paymentStatus === "RECEIVED") {
      summary.receivedCount += 1;
    } else {
      summary.pendingCount += 1;
      summary.pendingReceivableToman += record.netReceivableToman;
    }

    const current =
      sourceMap.get(record.referralSource) ?? {
        referralSource: record.referralSource,
        recordCount: 0,
        grossFeeToman: 0,
        institutionShareToman: 0,
        netReceivableToman: 0,
        receivedAmountToman: 0,
        pendingReceivableToman: 0,
      };

    current.recordCount += 1;
    current.grossFeeToman += record.grossFeeToman;
    current.institutionShareToman += record.institutionShareToman;
    current.netReceivableToman += record.netReceivableToman;
    current.receivedAmountToman += record.receivedAmountToman;

    if (record.paymentStatus === "PENDING") {
      current.pendingReceivableToman += record.netReceivableToman;
    }

    sourceMap.set(record.referralSource, current);
  }

  return {
    summary,
    byReferralSource: Array.from(sourceMap.values()),
    pendingRecords: records.filter(
      (record) => record.paymentStatus === "PENDING",
    ),
  };
}
