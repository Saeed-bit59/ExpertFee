# ExpertFee Home Bottom Actions — Practical V1

Test:
npx tsx tests/HomeBottomActionsPractical.test.ts

Then:
npx tsc --noEmit

Checks:
- Share / About / Settings final actions
- No duplicate action in Header
- Share API + Clipboard fallback
- Share text: evaluation amount, expert count, calculated fee, ExpertFee
- No ExpertFee-AI branding
- Real About / Settings callbacks
- Existing Save & Records preserved
- Article 11 quick calculation preserved
- No financial rules added to HomePage

This is a static practical-contract test. Actual Web Share targets
(WhatsApp, Telegram, email, Bale, Eitaa, Rubika) must be verified manually
on the target browser/device because availability depends on the OS/browser.
