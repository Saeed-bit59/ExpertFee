ExpertFee Settings V1 — FIXED

این نسخه فقط خطاهای TypeScript مربوط به implicit any را اصلاح کرده است.

اصلاحات:
- load<T>(key: string)
- save(key: string, value: unknown)
- توابع load/save در Memory Storage نیز دارای type صریح هستند.

مسیرها:
src\settings\SettingsTypes.ts
src\settings\SettingsRepository.ts
tests\SettingsRegression.test.ts

تست:
npx tsx tests/SettingsRegression.test.ts

سپس:
npx tsc --noEmit

هیچ تغییری در Database پرونده‌ها، Repository پرونده‌ها یا منطق مالی انجام نشده است.
