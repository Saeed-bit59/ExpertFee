import type {
  ChangeEvent,
  InputHTMLAttributes
} from "react";

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

export function parseMoneyValue(
  value: string
): number {
  const normalized =
    normalizePersianDigits(value)
      .replace(/[,\s٬،]/g, "")
      .trim();

  if (
    !normalized ||
    !/^\d+$/.test(normalized)
  ) {
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
  const digits =
    normalizePersianDigits(value)
      .replace(/[^\d]/g, "");

  return digits
    ? Number(digits).toLocaleString(
        "en-US"
      )
    : "";
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
  helperText?: string;
  error?: string;
}

export default function MoneyInput({
  label,
  value,
  onChange,
  unit = "تومان",
  helperText,
  error,
  id,
  placeholder = "مثال: 2,500,000,000",
  ...props
}: MoneyInputProps) {
  const inputId =
    id ?? "ef-money-input";

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    onChange(
      formatMoneyInput(
        event.target.value
      )
    );
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
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />

        <span
          className="ef-money-unit"
          aria-hidden="true"
        >
          {unit}
        </span>
      </div>

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