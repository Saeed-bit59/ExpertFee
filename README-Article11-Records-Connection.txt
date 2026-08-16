Article 11 -> Expert Records Connection V1

UI change:
- Explicitly displays the exact final amount that will be transferred to Records.
- Preserves the existing onSaveCalculation(ExpertCaseDraft) contract.
- No Article 11 calculation formula was changed.
- No 5%/10% deduction was added here; that remains in the Records financial layer.

Replace the project's existing:
src/components/Article11CalculatorPanel.tsx

with the supplied file from this package.

Tests:
npx tsx tests/Article11RecordsConnection.test.ts
npx tsx tests/Article11FinalAmountRegression.test.ts
npx tsc --noEmit
