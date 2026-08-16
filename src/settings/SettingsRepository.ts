import {
  DEFAULT_EXPERT_FEE_SETTINGS,
  type ExpertFeeSettings,
  type ExpertFeeSettingsPatch,
} from "./SettingsTypes";

export const SETTINGS_STORAGE_KEY = "expertfee.settings.v1";

export interface SettingsStorage {
  save(key: string, value: unknown): void;
  load<T>(key: string): T | null;
}

const browserStorage: SettingsStorage = {
  save(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
  load<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
};

function defaults(): ExpertFeeSettings {
  return { ...DEFAULT_EXPERT_FEE_SETTINGS };
}

function normalize(
  value: Partial<ExpertFeeSettings> | null | undefined,
): ExpertFeeSettings {
  return {
    ...defaults(),
    ...(value ?? {}),
    schemaVersion: 1,
    updatedAt:
      typeof value?.updatedAt === "string" ? value.updatedAt : "",
  };
}

export class SettingsRepository {
  constructor(
    private readonly storage: SettingsStorage = browserStorage,
  ) {}

  get(): ExpertFeeSettings {
    return normalize(
      this.storage.load<ExpertFeeSettings>(SETTINGS_STORAGE_KEY),
    );
  }

  save(settings: ExpertFeeSettings): ExpertFeeSettings {
    const saved: ExpertFeeSettings = {
      ...normalize(settings),
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
