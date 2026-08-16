export type CurrencyUnit = "TOMAN" | "RIAL";
export type NumberLocale = "FA" | "EN";

export interface ExpertFeeSettings {
  schemaVersion: 1;
  expertName: string;
  expertCode: string;
  province: string;
  professionalCenter: string;
  email: string;
  phone: string;
  currencyUnit: CurrencyUnit;
  numberLocale: NumberLocale;
  decimalPlaces: number;
  defaultReportPeriod: "ALL" | "THIS_YEAR" | "THIS_MONTH";
  defaultShowReceivedOnly: boolean;
  defaultShowPendingOnly: boolean;
  tariffSourceTitle: string;
  tariffVersion: string;
  tariffDescription: string;
  updatedAt: string;
}

export const DEFAULT_EXPERT_FEE_SETTINGS: ExpertFeeSettings = {
  schemaVersion: 1,
  expertName: "",
  expertCode: "",
  province: "بوشهر",
  professionalCenter: "مرکز کارشناسان رسمی دادگستری استان بوشهر",
  email: "saeedradmanesh@gmail.com",
  phone: "09177321284",
  currencyUnit: "TOMAN",
  numberLocale: "FA",
  decimalPlaces: 0,
  defaultReportPeriod: "ALL",
  defaultShowReceivedOnly: false,
  defaultShowPendingOnly: false,
  tariffSourceTitle: "تعرفه حق‌الزحمه کارشناسان رسمی دادگستری",
  tariffVersion: "مصوبه پایه + اصلاحیه سال ۱۴۰۲",
  tariffDescription:
    "مرجع محاسبات مطابق داده تعرفه موجود در نرم‌افزار است؛ این بخش صرفاً برای شناسایی نسخه مورد استفاده است.",
  updatedAt: "",
};

export type ExpertFeeSettingsPatch = Partial<
  Omit<ExpertFeeSettings, "schemaVersion" | "updatedAt">
>;
