# ExpertFee Settings Page V1

این بسته شامل:
- SettingsPage.tsx
- SettingsPageRegression.test.ts
- مدل و Repository تنظیمات برای اجرای مستقل بسته

مسیرهای مقصد:
src/pages/SettingsPage.tsx
tests/SettingsPageRegression.test.ts

و در صورت نیاز برای self-contained بودن:
src/settings/SettingsTypes.ts
src/settings/SettingsRepository.ts

تست:
npx tsx tests/SettingsPageRegression.test.ts
npx tsc --noEmit

این مرحله هنوز Navigation اصلی App.tsx را تغییر نمی‌دهد.
بعد از PASS شدن تست UI، مرحله بعد اتصال Settings به Navigation اصلی خواهد بود.

نکته:
اطلاعات تعرفه در Settings فقط metadata و read-only است؛ هیچ قانون تعرفه یا
محاسبه ۵٪/۱۰٪ در SettingsPage قرار نگرفته است.
