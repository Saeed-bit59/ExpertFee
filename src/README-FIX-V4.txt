ExpertFee About Navigation Fix V4

Reason for V4:
The previous regression test was too strict. It required the visible Persian
label "درباره نرم‌افزار" to be duplicated inside src/App.tsx. In the project's
architecture the footer can be a separate shared component, so this is not a
valid requirement.

V4:
- Keeps the real App navigation contract.
- Accepts the About label in App.tsx OR src/components/Footer.tsx.
- Keeps About out of the main Header.
- Preserves Expert Records contracts.
- Provides a complete shared Footer.tsx with the About button.
- Does NOT replace the project's App.tsx.

Correct project paths:
src/pages/AboutPage.tsx
src/components/Footer.tsx
tests/AboutNavigationRegression.test.ts

After copying:
npx tsx tests/AboutNavigationRegression.test.ts
npx tsc --noEmit

IMPORTANT:
If App.tsx currently uses an inline footer, do not import Footer.tsx a second
time until we deliberately refactor the footer. The test accepts either
architecture.
