# ExpertFee — Settings UI + V1 Regression

## مرحله 1 — تست عملی UI تنظیمات

در ریشه پروژه اجرا کنید:

npx tsx tests/SettingsPageUI.test.ts

خروجی مورد انتظار:

SETTINGS UI PRACTICAL TEST: ALL TESTS PASSED

این تست قراردادهای UI را بررسی می‌کند:
- صفحه تنظیمات
- دکمه بازگشت
- بارگذاری از Repository
- فیلدهای اطلاعات کارشناس
- واحد پول
- زبان اعداد
- تعداد اعشار
- تنظیمات سوابق
- اطلاعات تعرفه
- ذخیره و بازگردانی
- پیام موفقیت/خطا
- عدم ورود منطق محاسبات مالی به SettingsPage

## مرحله 2 — TypeScript

npx tsc --noEmit

## مرحله 3 — Regression کامل V1 + Settings

npx tsx tests/ExpertFeeV1SettingsRegression.test.ts

خروجی مورد انتظار:

EXPERTFEE V1 + SETTINGS REGRESSION: ALL TESTS PASSED

این Regression علاوه بر Settings، حفظ مسیرهای موجود:
- About
- Expert Records
- Article 11
- سایر route های اصلی App
را نیز کنترل می‌کند.

## تست نهایی پیشنهادی

ترتیب اجرا:

1. npx tsx tests/SettingsPageUI.test.ts
2. npx tsc --noEmit
3. npx tsx tests/ExpertFeeV1SettingsRegression.test.ts
4. اجرای دستی برنامه
5. ورود از Footer به «تنظیمات»
6. تغییر یک مقدار
7. «ذخیره تنظیمات»
8. Refresh برنامه و بررسی ماندگاری مقدار
9. «بازگردانی پیش‌فرض» و تأیید Dialog
10. بازگشت به صفحه اصلی
11. ورود مجدد به «درباره نرم‌افزار» و «ذخیره و سوابق» برای کنترل Regression

نکته:
این بسته هیچ منطق محاسبه تعرفه، Database یا Repository سوابق کارشناسی را تغییر نمی‌دهد.
