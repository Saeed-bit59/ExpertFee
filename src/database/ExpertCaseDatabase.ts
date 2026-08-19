import type {
  ExpertCaseDatabaseSnapshot,
  ExpertCaseRecord,
  InstitutionSharePercent,
  PaymentStatus,
  ProcessingInstitution,
  ReferralSource,
} from "./ExpertCaseTypes";

export const EXPERT_CASE_DB_NAME = "expertfee-ai";
export const EXPERT_CASE_DB_VERSION = 1;
export const EXPERT_CASE_STORE_NAME = "expertCases";

export interface ExpertCaseDatabaseAdapter {
  getAll(): Promise<ExpertCaseRecord[]>;
  getById(id: string): Promise<ExpertCaseRecord | undefined>;
  put(record: ExpertCaseRecord): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
  replaceAll(records: ExpertCaseRecord[]): Promise<void>;
}

const clone = (record: ExpertCaseRecord): ExpertCaseRecord => ({ ...record });

export class IndexedDbExpertCaseDatabase
  implements ExpertCaseDatabaseAdapter
{
  private dbPromise?: Promise<IDBDatabase>;

  private open(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;
    if (typeof indexedDB === "undefined") {
      return Promise.reject(
        new Error("ذخیره‌سازی مرورگر در این محیط در دسترس نیست."),
      );
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(
        EXPERT_CASE_DB_NAME,
        EXPERT_CASE_DB_VERSION,
      );
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(EXPERT_CASE_STORE_NAME)) {
          const store = database.createObjectStore(EXPERT_CASE_STORE_NAME, {
            keyPath: "id",
          });
          [
            "createdAt",
            "receivedAt",
            "referralSource",
            "processingInstitution",
            "paymentStatus",
          ].forEach((name) => store.createIndex(name, name, { unique: false }));
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("باز کردن پایگاه داده انجام نشد."));
      request.onblocked = () =>
        reject(new Error("به‌روزرسانی پایگاه داده توسط یک پنجره دیگر مسدود شده است."));
    });
    return this.dbPromise;
  }

  private async store(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const database = await this.open();
    return database
      .transaction(EXPERT_CASE_STORE_NAME, mode)
      .objectStore(EXPERT_CASE_STORE_NAME);
  }

  async getAll(): Promise<ExpertCaseRecord[]> {
    const store = await this.store("readonly");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () =>
        resolve((request.result as ExpertCaseRecord[]).map(clone));
      request.onerror = () => reject(request.error);
    });
  }

  async getById(id: string): Promise<ExpertCaseRecord | undefined> {
    const store = await this.store("readonly");
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () =>
        resolve(request.result ? clone(request.result as ExpertCaseRecord) : undefined);
      request.onerror = () => reject(request.error);
    });
  }

  async put(record: ExpertCaseRecord): Promise<void> {
    const store = await this.store("readwrite");
    return new Promise((resolve, reject) => {
      const request = store.put(clone(record));
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(id: string): Promise<void> {
    const store = await this.store("readwrite");
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    const store = await this.store("readwrite");
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async replaceAll(records: ExpertCaseRecord[]): Promise<void> {
    const database = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        EXPERT_CASE_STORE_NAME,
        "readwrite",
      );
      const store = transaction.objectStore(EXPERT_CASE_STORE_NAME);
      store.clear();
      records.forEach((record) => store.put(clone(record)));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }
}

export class MemoryExpertCaseDatabase implements ExpertCaseDatabaseAdapter {
  private records = new Map<string, ExpertCaseRecord>();

  async getAll(): Promise<ExpertCaseRecord[]> {
    return [...this.records.values()].map(clone);
  }

  async getById(id: string): Promise<ExpertCaseRecord | undefined> {
    const record = this.records.get(id);
    return record ? clone(record) : undefined;
  }

  async put(record: ExpertCaseRecord): Promise<void> {
    this.records.set(record.id, clone(record));
  }

  async delete(id: string): Promise<void> {
    this.records.delete(id);
  }

  async clear(): Promise<void> {
    this.records.clear();
  }

  async replaceAll(records: ExpertCaseRecord[]): Promise<void> {
    const replacement = new Map<string, ExpertCaseRecord>();
    records.forEach((record) => replacement.set(record.id, clone(record)));
    this.records = replacement;
  }
}

const REFERRAL_SOURCES: readonly ReferralSource[] = [
  "JUDICIARY",
  "CENTER",
  "BAR_ASSOCIATION",
];
const PROCESSING_INSTITUTIONS: readonly ProcessingInstitution[] = [
  "CENTER",
  "BAR_ASSOCIATION",
];
const PAYMENT_STATUSES: readonly PaymentStatus[] = ["PENDING", "RECEIVED"];
const SHARE_PERCENTAGES: readonly InstitutionSharePercent[] = [5, 10];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim() !== "" &&
    Number.isFinite(Date.parse(value))
  );
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isSafeMoney(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 0
  );
}

function isExpertCaseRecord(value: unknown): value is ExpertCaseRecord {
  if (!isRecord(value)) return false;
  const sharePercent = value.institutionSharePercent as InstitutionSharePercent;
  if (
    typeof value.id !== "string" ||
    value.id.trim() === "" ||
    !isIsoDate(value.createdAt) ||
    !isIsoDate(value.updatedAt) ||
    !REFERRAL_SOURCES.includes(value.referralSource as ReferralSource) ||
    !PROCESSING_INSTITUTIONS.includes(
      value.processingInstitution as ProcessingInstitution,
    ) ||
    !PAYMENT_STATUSES.includes(value.paymentStatus as PaymentStatus) ||
    !SHARE_PERCENTAGES.includes(
      value.institutionSharePercent as InstitutionSharePercent,
    ) ||
    typeof value.calculationCategory !== "string" ||
    value.calculationCategory.trim() === "" ||
    !isSafeMoney(value.grossFeeToman) ||
    !isSafeMoney(value.institutionShareToman) ||
    !isSafeMoney(value.netReceivableToman) ||
    !isSafeMoney(value.receivedAmountToman)
  ) {
    return false;
  }

  if (
    (value.tariffArticle !== undefined &&
      (typeof value.tariffArticle !== "number" ||
        !Number.isInteger(value.tariffArticle) ||
        value.tariffArticle <= 0)) ||
    ![
      value.caseNumber,
      value.plaintiff,
      value.defendant,
      value.notificationNumber,
      value.requestingAuthority,
      value.subject,
      value.receivedAt,
      value.notes,
    ].every(isOptionalString)
  ) {
    return false;
  }

  const expectedShare = Math.round(
    (value.grossFeeToman * sharePercent) / 100,
  );
  const financesAreConsistent =
    value.institutionShareToman === expectedShare &&
    value.netReceivableToman === value.grossFeeToman - expectedShare;
  const receiptIsConsistent =
    value.paymentStatus === "RECEIVED"
      ? isIsoDate(value.receivedAt) &&
        value.receivedAmountToman === value.netReceivableToman
      : value.receivedAt === undefined && value.receivedAmountToman === 0;
  const sourceIsConsistent =
    value.referralSource === "CENTER"
      ? value.processingInstitution === "CENTER" &&
        sharePercent === 10
      : value.referralSource === "BAR_ASSOCIATION"
        ? value.processingInstitution === "BAR_ASSOCIATION" &&
          sharePercent === 10
        : sharePercent === 5;

  return financesAreConsistent && receiptIsConsistent && sourceIsConsistent;
}

export function validateDatabaseSnapshot(
  value: unknown,
): ExpertCaseDatabaseSnapshot {
  if (!isRecord(value) || value.schemaVersion !== 1) {
    throw new Error("فایل پشتیبان معتبر نیست یا نسخه آن پشتیبانی نمی‌شود.");
  }
  if (!isIsoDate(value.exportedAt) || !Array.isArray(value.records)) {
    throw new Error("ساختار فایل پشتیبان معتبر نیست.");
  }
  if (!value.records.every(isExpertCaseRecord)) {
    throw new Error("فایل پشتیبان شامل سابقه نامعتبر یا ناسازگار است.");
  }
  const ids = value.records.map((record) => record.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("فایل پشتیبان شامل شناسه تکراری است.");
  }

  return {
    schemaVersion: 1,
    exportedAt: value.exportedAt,
    records: value.records.map(clone),
  };
}
