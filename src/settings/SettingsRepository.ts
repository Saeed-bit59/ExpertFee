import {
  DEFAULT_EXPERT_FEE_SETTINGS,
  type ExpertFeeSettings,
  type ExpertFeeSettingsPatch,
} from "./SettingsTypes";

export const SETTINGS_STORAGE_KEY = "expertfee.settings.v1";

export interface SettingsStorage {
  save(key: string, value: unknown): void;
  load(key: string): unknown;
}

const browserStorage: SettingsStorage = {
  save(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
  load(key: string): unknown {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  },
};

function defaults(): ExpertFeeSettings {
  return { ...DEFAULT_EXPERT_FEE_SETTINGS };
}

const REPORT_PERIODS = ["ALL", "THIS_YEAR", "THIS_MONTH"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeExpertFeeSettings(value: unknown): ExpertFeeSettings {
  const source = isRecord(value) ? value : {};
  const base = defaults();
  const decimalPlaces =
    typeof source.decimalPlaces === "number" &&
    Number.isInteger(source.decimalPlaces) &&
    source.decimalPlaces >= 0 &&
    source.decimalPlaces <= 3
      ? source.decimalPlaces
      : base.decimalPlaces;
  const defaultReportPeriod = REPORT_PERIODS.includes(
    source.defaultReportPeriod as (typeof REPORT_PERIODS)[number],
  )
    ? (source.defaultReportPeriod as ExpertFeeSettings["defaultReportPeriod"])
    : base.defaultReportPeriod;

  return {
    ...base,
    schemaVersion: 1,
    expertName: stringValue(source.expertName, base.expertName),
    expertCode: stringValue(source.expertCode, base.expertCode),
    province: stringValue(source.province, base.province),
    professionalCenter: stringValue(
      source.professionalCenter,
      base.professionalCenter,
    ),
    email: stringValue(source.email, base.email),
    phone: stringValue(source.phone, base.phone),
    currencyUnit:
      source.currencyUnit === "RIAL" || source.currencyUnit === "TOMAN"
        ? source.currencyUnit
        : base.currencyUnit,
    numberLocale:
      source.numberLocale === "EN" || source.numberLocale === "FA"
        ? source.numberLocale
        : base.numberLocale,
    decimalPlaces,
    defaultReportPeriod,
    defaultShowReceivedOnly: booleanValue(
      source.defaultShowReceivedOnly,
      base.defaultShowReceivedOnly,
    ),
    defaultShowPendingOnly: booleanValue(
      source.defaultShowPendingOnly,
      base.defaultShowPendingOnly,
    ),
    tariffSourceTitle: stringValue(
      source.tariffSourceTitle,
      base.tariffSourceTitle,
    ),
    tariffVersion: stringValue(source.tariffVersion, base.tariffVersion),
    tariffDescription: stringValue(
      source.tariffDescription,
      base.tariffDescription,
    ),
    updatedAt: stringValue(source.updatedAt, ""),
  };
}

export class SettingsRepository {
  constructor(
    private readonly storage: SettingsStorage = browserStorage,
  ) {}

  get(): ExpertFeeSettings {
    return normalizeExpertFeeSettings(this.storage.load(SETTINGS_STORAGE_KEY));
  }

  save(settings: ExpertFeeSettings): ExpertFeeSettings {
    const saved: ExpertFeeSettings = {
      ...normalizeExpertFeeSettings(settings),
      updatedAt: new Date().toISOString(),
    };
    this.storage.save(SETTINGS_STORAGE_KEY, saved);
    return saved;
  }

  update(patch: ExpertFeeSettingsPatch): ExpertFeeSettings {
    return this.save({ ...this.get(), ...patch });
  }

  reset(): ExpertFeeSettings {
    return this.save(defaults());
  }

  getStorageKey(): string {
    return SETTINGS_STORAGE_KEY;
  }
}

export const settingsRepository = new SettingsRepository();
