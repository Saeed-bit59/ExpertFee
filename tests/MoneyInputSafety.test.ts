import {
  formatMoneyInput,
  isSafeMoneyValue,
  normalizePersianDigits,
  parseMoneyValue,
} from "../src/components/ui/MoneyInput";

function assert(condition: boolean, name: string): void {
  if (!condition) throw new Error(`FAILED: ${name}`);
  console.log(`PASS: ${name}`);
}

assert(normalizePersianDigits("۱۲۳٤") === "1234", "Persian and Arabic digits normalize");
assert(formatMoneyInput("۱۲۳۴۵۶۷") === "1,234,567", "Thousands separator is preserved");
assert(parseMoneyValue("۱,۲۵۰,۰۰۰") === 1_250_000, "Persian grouped input parses");
assert(parseMoneyValue("") === 0, "Empty input is rejected");
assert(parseMoneyValue("12x") === 0, "Invalid characters are rejected");
assert(
  isSafeMoneyValue(String(Math.floor(Number.MAX_SAFE_INTEGER / 10))),
  "Largest safe toman value is accepted",
);
assert(
  !isSafeMoneyValue("9007199254740993"),
  "Unsafe integer is rejected before Number conversion",
);
assert(
  parseMoneyValue("9007199254740993") === 0,
  "Unsafe integer never reaches calculation engines",
);

console.log("Money input safety tests completed.");
