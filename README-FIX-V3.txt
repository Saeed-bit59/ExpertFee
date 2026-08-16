ExpertFee About Navigation Fix V3

The previous regression failure was:
ABOUT NAVIGATION REGRESSION FAILED: App contract missing: درباره نرم‌افزار

Cause:
The test correctly required the visible About label in App.tsx, while the
previous patch could leave the label only in a separate/generated component.

V3 fixes the contract:
- AboutPage remains at src/pages/AboutPage.tsx.
- App.tsx contains the visible footer label: درباره نرم‌افزار.
- About remains OUT of the main header.
- The About route remains currentPage === "ABOUT".
- Expert Records navigation is preserved.
- A timestamped backup of App.tsx is created before modification.

IMPORTANT:
Run the PowerShell script from the real project root:

E:\02-karshenas rasmi\طراحی نرم افزار دستمزد کارشناسی\chatgpt\ExpertFee-AI

Command:
powershell -ExecutionPolicy Bypass -File .\scripts\patch-about-navigation-v3.ps1

Then:
npx tsx tests/AboutNavigationRegression.test.ts
npx tsc --noEmit

Do not replace App.tsx manually with a file from this ZIP.
