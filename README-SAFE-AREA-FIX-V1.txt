# ExpertFee — Safe Area / Bottom Bar Fix V1

مشکل: در پایین صفحه، دکمه‌ها و ابزارها با نوار ناوبری گوشی (کلیدهای بازگشت/خانه/برنامه‌ها یا نوار ژست) تداخل داشتند.

علت:
- اپ اندروید یک WebView تمام‌صفحه است که سایت راه‌دور را باز می‌کند.
- با targetSdk 35+ روی اندروید ۱۵ و بالاتر، حالت edge-to-edge اجباری است؛ یعنی محتوای اپ
  زیر نوار وضعیت و زیر نوار ناوبری کشیده می‌شود.
- نسخه قبلی فقط `WebSettings` را تنظیم می‌کرد و هیچ padding ناوری نداشت و در WebView هم
  مقادیر `env(safe-area-inset-*)` تا M144 صفر بود؛ نتیجه: دکمه‌های پایین صفحه زیر کلیدهای گوشی می‌رفتند.

راه‌حل اعمال‌شده:

1) اندروید (فایل نهایی و قطعی برای همه دستگاه‌ها)
   - android/app/src/main/java/ir/expertfee/app/MainActivity.java
     * حذف `root.setFitsSystemWindows(true)` (در edge-to-edge اجباری قابل اعتماد نیست)
     * افزودن `applyBottomSafeArea(root)` که با `OnApplyWindowInsetsListener` مقدار
       `systemBars() | displayCutout()` را می‌خواند و به اندازه `insets.bottom` به ریشه layout
       padding پایین می‌دهد. WebView دیگر زیر نوار ناوبری قرار نمی‌گیرد.
     * رنگ پس‌زمینه ریشه = #F6F9FD تا نوار زیر دکمه‌های سیستم با تم صفحه یکسان باشد.
   - android/app/src/main/AndroidManifest.xml
     * `android:windowSoftInputMode="adjustResize"` تا کیبورد روی فیلدهای پایین صفحه نیفتد.

2) وب (fallback برای نسخه‌های قدیمی APK که روی گوشی نصب است)
   - index.html: `viewport-fit=cover`
   - src/styles/globals.css: استفاده از `env(safe-area-inset-bottom)` در
     `.ef-app-footer`، `.ef-home-content`، `.ef-page` و `.ef-article11-result-bar`
   - چون در APK جدید WebView دیگر با نوار ناوبری هم‌پوشانی ندارد، این مقدار صفر می‌شود و
     فاصله دوباره (double padding) ایجاد نمی‌شود.

نکته انتشار:
- تغییرات وب روی Cloudflare Worker قابل انتشار است و بدون نصب APK جدید روی گوشی‌هایی که
  WebView آنها به‌روز (M144+) است، اثر می‌کند.
- برای رفع قطعی روی همه گوشی‌ها، APK باید دوباره ساخته و منتشر شود.
- در این تغییر، `versionCode` از ۱ به ۲ و `versionName` از "1.0.0" به "1.0.1" افزایش یافت
  (android/app/build.gradle.kts) و تگ ریلیز به `android-store-v1.0.1` به‌روزرسانی شد.
