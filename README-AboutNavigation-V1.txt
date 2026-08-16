ExpertFee About Navigation V1

Replace:
- src/App.tsx
- src/components/Footer.tsx
- src/pages/AboutPage.tsx
- tests/AboutNavigationRegression.test.ts

Important:
- This App.tsx is based on the current uploaded App(7).tsx / About update.
- About is NOT placed in the Header.
- About is available from the bottom footer.
- Existing Article and Expert Records navigation contracts are preserved.
- App currently has an inline footer; therefore it remains the active footer.
  Footer.tsx is also updated as a reusable component for future use.

Run:
npx tsx tests/AboutNavigationRegression.test.ts
npx tsc --noEmit
