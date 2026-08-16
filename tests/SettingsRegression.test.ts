import {
  DEFAULT_EXPERT_FEE_SETTINGS,
  type ExpertFeeSettings,
} from "../src/settings/SettingsTypes";

import {
  SETTINGS_STORAGE_KEY,
  SettingsRepository,
  type SettingsStorage,
} from "../src/settings/SettingsRepository";

function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(
      `SETTINGS REGRESSION TEST FAILED: ${message}`,
    );
  }
}

function memoryStorage(): SettingsStorage {
  const data = new Map<string, unknown>();

  return {
    save(key: string, value: unknown): void {
      data.set(key, structuredClone(value));
    },

    load<T>(key: string): T | null {
      const value = data.get(key);

      return value === undefined
        ? null
        : (structuredClone(value) as T);
    },
  };
}

const repository = new SettingsRepository(
  memoryStorage(),
);

const initial = repository.get();

assert(
  initial.schemaVersion === 1,
  "schemaVersion must be 1",
);

assert(
  initial.currencyUnit === "TOMAN",
  "default currency must be TOMAN",
);

assert(
  initial.numberLocale === "FA",
  "default number locale must be FA",
);

assert(
  initial.professionalCenter.includes("بوشهر"),
  "professional center missing",
);

const updated = repository.update({
  expertName: "سعید رادمنش",
  expertCode: "TEST-001",
  decimalPlaces: 2,
  phone: "09170000000",
});

assert(
  updated.expertName === "سعید رادمنش",
  "expertName update failed",
);

assert(
  updated.expertCode === "TEST-001",
  "expertCode update failed",
);

assert(
  updated.decimalPlaces === 2,
  "decimalPlaces update failed",
);

assert(
  updated.updatedAt.length > 0,
  "updatedAt was not generated",
);

const loaded = repository.get();

assert(
  loaded.expertName === "سعید رادمنش",
  "persistence failed",
);

assert(
  loaded.phone === "09170000000",
  "phone persistence failed",
);

assert(
  repository.getStorageKey() === SETTINGS_STORAGE_KEY,
  "settings storage key mismatch",
);

assert(
  loaded.tariffSourceTitle ===
    DEFAULT_EXPERT_FEE_SETTINGS.tariffSourceTitle,
  "tariff source metadata contract missing",
);

assert(
  loaded.tariffVersion ===
    DEFAULT_EXPERT_FEE_SETTINGS.tariffVersion,
  "tariff version metadata contract missing",
);

const reset = repository.reset();

assert(
  reset.expertName === "",
  "reset expertName failed",
);

assert(
  reset.expertCode === "",
  "reset expertCode failed",
);

assert(
  reset.currencyUnit === "TOMAN",
  "reset currency failed",
);

const model: ExpertFeeSettings = {
  ...DEFAULT_EXPERT_FEE_SETTINGS,
  expertName: "Regression",
};

assert(
  model.schemaVersion === 1,
  "model contract failed",
);

console.log(
  "SETTINGS REGRESSION: ALL TESTS PASSED",
);
