ExpertFee About Navigation Fix V2

This package fixes the previous failure:
ABOUT NAVIGATION REGRESSION FAILED: AboutPage must use ExpertFee branding

IMPORTANT:
The previous package could be placed in the wrong project path. This V2 package
does NOT provide a fabricated replacement App.tsx. It provides:
1) The complete correct AboutPage.tsx
2) The corrected regression test
3) A PowerShell patch script that modifies the REAL src/App.tsx in the project
   root and creates an automatic timestamped backup first.

Project root:
E:\02-karshenas rasmi\طراحی نرم افزار دستمزد کارشناسی\chatgpt\ExpertFee-AI

Correct paths:
src\pages\AboutPage.tsx
tests\AboutNavigationRegression.test.ts
scripts\patch-about-navigation.ps1

Run from project root:
powershell -ExecutionPolicy Bypass -File .\scripts\patch-about-navigation.ps1

Then:
npx tsx tests/AboutNavigationRegression.test.ts
npx tsc --noEmit

The AboutPage branding is explicitly:
const APP_NAME = "ExpertFee";

No "ExpertFee-AI" string is allowed in AboutPage.
