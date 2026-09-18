import type {
  ChangeEvent,
  InputHTMLAttributes
} from "react";
import { useState } from "react";

type CurrencyUnit = "TOMAN" | "RIAL";

export function normalizePersianDigits(
  value: string
): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";

  return value
    .replace(
      /[۰-۹]/g,
      (digit) =>
        String(persian.indexOf(digit))
    )
    .replace(
      /[٠-٩]/g,
      (digit) =>
        String(arabic.indexOf(digit))
    );
}

export function isSafeMoneyValue(value: string): boolean {
  const normalized = normalizePersianDigits(value)
    .replace(/[,\s٬،]/g, "")
    .trim();

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return false;
  }

  const numberValue = Number(normalized);
  return Number.isFinite(numberValue)
    && numberValue >= 0
    && numberValue <= Math.floor(Number.MAX_SAFE_INTEGER / 10);
}

export function parseMoneyValue(
  value: string
): number {
  const normalized =
    normalizePersianDigits(value)
      .replace(/[,\s٬،]/g, "")
      .trim();

  if (!normalized || !isSafeMoneyValue(normalized)) {
    return 0;
  }

  const numberValue =
    Number(normalized);

  return Number.isFinite(numberValue)
    ? numberValue
    : 0;
}

export function formatMoneyInput(
  value: string
): string {
  const normalized =
    normalizePersianDigits(value)
      .replace(/,/g, "");

  const [integerPart = "", ...decimalParts] = normalized.split(".");
  const digits = integerPart.replace(/[^\d]/g, "");
  const decimal = decimalParts.join("").replace(/[^\d]/g, "");

  if (!digits) return "";

  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimal
    ? `${grouped}.${decimal.slice(0, 1)}`
    : grouped;
}

function belowOneThousandToWords(value: number): string {
  const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
  const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
  const hundreds = ["", "یکصد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
  const parts: string[] = [];

  if (value >= 100) {
    parts.push(hundreds[Math.floor(value / 100)]);
    value %= 100;
  }
  if (value >= 20) {
    parts.push(tens[Math.floor(value / 10)]);
    value %= 10;
  }
  if (value > 0) parts.push(ones[value]);

  return parts.join(" و ");
}

export function numberToPersianWords(value: number): string {
  if (!Number.isFinite(value) || value < 0 || !Number.isSafeInteger(value)) {
    return "";
  }
  if (value === 0) return "صفر";

  const scales = ["", "هزار", "میلیون", "میلیارد", "تریلیون", "کوادریلیون"];
  const parts: string[] = [];
  let remaining = value;
  let scaleIndex = 0;

  while (remaining > 0) {
    const group = remaining % 1_000;
    if (group > 0) {
      parts.unshift(
        [belowOneThousandToWords(group), scales[scaleIndex]]
          .filter(Boolean)
          .join(" ")
      );
    }
    remaining = Math.floor(remaining / 1_000);
    scaleIndex += 1;
  }

  return parts.join(" و ");
}

export function oppositeCurrencyWords(
  valueToman: number,
  enteredUnit: CurrencyUnit
): string {
  if (enteredUnit === "TOMAN") {
    return `${numberToPersianWords(Math.round(valueToman * 10))} ریال`;
  }

  const rial = Math.round(valueToman * 10);
  const toman = Math.floor(rial / 10);
  const remainingRial = rial % 10;
  const parts = [`${numberToPersianWords(toman)} تومان`];
  if (remainingRial > 0) {
    parts.push(`${numberToPersianWords(remainingRial)} ریال`);
  }
  return parts.join(" و ");
}

export interface MoneyInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange"
  > {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  currencySelectable?: boolean;
  helperText?: string;
  error?: string;
}

export default function MoneyInput({
  label,
  value,
  onChange,
  unit = "تومان",
  currencySelectable = true,
  helperText,
  error,
  id,
  placeholder = "مثال: 2,500,000,000",
  ...props
}: MoneyInputProps) {
  const [selectedUnit, setSelectedUnit] = useState<CurrencyUnit>("TOMAN");
  const inputId =
    id ?? "ef-money-input";
  const valueToman = parseMoneyValue(value);
  const displayedValue = value
    ? formatMoneyInput(
        String(
          selectedUnit === "RIAL"
            ? valueToman * 10
            : valueToman
        )
      )
    : "";
  const oppositeWords = valueToman > 0
    ? oppositeCurrencyWords(valueToman, selectedUnit)
    : "";

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    const enteredValue = parseMoneyValue(event.target.value);
    const tomanValue = selectedUnit === "RIAL"
      ? enteredValue / 10
      : enteredValue;

    onChange(formatMoneyInput(String(tomanValue)));
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className="ef-field-label"
      >
        {label}
      </label>

      <div
        className="ef-money-control"
        data-error={Boolean(error)}
      >
        <input
          {...props}
          id={inputId}
          className="ef-money-input"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={displayedValue}
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />

        {currencySelectable ? (
          <select
            className="ef-money-unit"
            value={selectedUnit}
            onChange={(event) => setSelectedUnit(event.target.value as CurrencyUnit)}
            aria-label="واحد مبلغ"
          >
            <option value="TOMAN">تومان</option>
            <option value="RIAL">ریال</option>
          </select>
        ) : (
          <span className="ef-money-unit" aria-hidden="true">
            {unit}
          </span>
        )}
      </div>

      {oppositeWords && (
        <div className="ef-helper" style={{ textAlign: "center" }}>
          به حروف ({selectedUnit === "TOMAN" ? "ریال" : "تومان"}): {oppositeWords}
        </div>
      )}

      {error ? (
        <div
          role="alert"
          className="ef-helper"
          style={{
            color:
              "var(--ef-error)"
          }}
        >
          {error}
        </div>
      ) : (
        helperText && (
          <div className="ef-helper">
            {helperText}
          </div>
        )
      )}
    </div>
  );
}
