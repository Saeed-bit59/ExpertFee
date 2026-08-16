# ExpertFee — Final Bottom Actions V1

Layout decision implemented:

Header:
- ExpertFee branding only
- NO Settings button
- NO About button
- NO showComingSoon for these actions

Bottom area:
- «ذخیره و سوابق» به‌عنوان قابلیت موجود، در یک ردیف مستقل
- سه دکمه جدید دقیقاً در یک ردیف: «اشتراک‌گذاری» + «درباره نرم‌افزار» + «تنظیمات»

About:
- یکی از همان سه دکمه جدید است و در کنار اشتراک‌گذاری و تنظیمات قرار می‌گیرد
- به About navigation واقعی متصل است
- در Header وجود ندارد

Share:
- از نتیجه محاسبه سریع استفاده می‌کند
- Web Share API در صورت پشتیبانی
- در غیر این صورت Clipboard fallback
- شامل مبلغ مورد ارزیابی، تعداد کارشناسان و دستمزد
- Branding: ExpertFee
- بدون "-AI"

فایل‌ها:
src/pages/HomePage.tsx
tests/HomeBottomActionsRegression.test.ts

تست:
npx tsx tests/HomeBottomActionsRegression.test.ts
npx tsc --noEmit

نکته:
این بسته فقط HomePage و تست آن را تغییر می‌دهد و منطق Database/تعرفه را دستکاری نمی‌کند.
