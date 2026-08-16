ExpertFee About Page V1

Files:
- src/pages/AboutPage.tsx
- tests/AboutPageRegression.test.ts
- public/tarife.md
- public/expertfee-logo.jpg

Current project version is 0.1.0, taken from package.json.

The tariff source is the existing combined tariff document used by the project.
It contains the 1398 base tariff and entries marked as amended/added on 20-08-1402.
The page does not invent or duplicate tariff formulas.

Navigation:
AboutPage expects:
interface Props { onBack: () => void; }

Next integration step:
1) Add "ABOUT" to AppPage.
2) Import AboutPage from "./pages/AboutPage".
3) Route currentPage === "ABOUT" to <AboutPage onBack={goHome} />.
4) Add a bottom/footer button to open ABOUT.
5) Do NOT add About to the header.

Tests:
npx tsx tests/AboutPageRegression.test.ts
npx tsc --noEmit
