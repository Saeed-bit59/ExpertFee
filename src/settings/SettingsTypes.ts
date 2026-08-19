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
  province: "",
  professionalCenter: "",
  email: "",
  phone: "",
  currencyUnit: "TOMAN",
  numberLocale: "FA",
  decimalPlaces: 0,
  defaultReportPeriod: "ALL",
  defaultShowReceivedOnly: false,
  defaultShowPendingOnly: false,
  tariffSourceTitle: "تعرفه حق‌الزحمه کارشناسان رسمی دادگستری",
  tariffVersion: "تعرفه مصوب سال ۱۴۰۵",
  tariffDescription:
    "قابلیت‌های پیاده‌سازی‌شده نرم‌افزار براساس تنظیمات تعرفه ۱۴۰۵ محاسبه می‌شوند.",
  updatedAt: "",
};

export type ExpertFeeSettingsPatch = Partial<
  Omit<ExpertFeeSettings, "schemaVersion" | "updatedAt">
>;
