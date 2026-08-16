# ExpertFee Settings Navigation V1

این بسته اتصال SettingsPage به App.tsx را انجام می‌دهد.

تغییرات:
- import SettingsPage
- افزودن "SETTINGS" به AppPage
- افزودن openSettings()
- افزودن مسیر render برای SettingsPage
- افزودن دکمه «تنظیمات» در Footer
- حفظ Navigation «درباره نرم‌افزار» و «ذخیره و سوابق»

فایل‌ها:
src/App.tsx
tests/SettingsNavigationRegression.test.ts

SettingsPage.tsx باید از مرحله قبلی در:
src/pages/SettingsPage.tsx
وجود داشته باشد.

تست:
npx tsx tests/SettingsNavigationRegression.test.ts

سپس:
npx tsc --noEmit

نکته:
این تغییر هیچ Database یا منطق محاسبات مالی را تغییر نمی‌دهد.
