import type { ReactNode } from "react";

export interface FeeResultRow {
  label: string;
  value: string;
}

export interface FeeResultCardProps {
  feeToman: number;
  title?: string;
  subtitle?: string;
  rows?: FeeResultRow[];
  footer?: ReactNode;
}

function formatToman(
  value: number
): string {
  return Math.round(value)
    .toLocaleString("fa-IR");
}

export default function FeeResultCard({
  feeToman,
  title = "دستمزد کارشناسی",
  subtitle,
  rows = [],
  footer
}: FeeResultCardProps) {
  return (
    <section
      className="ef-result-card"
      aria-live="polite"
    >
      <div className="ef-result-title">
        {title}
      </div>

      <strong className="ef-result-value">
        {formatToman(feeToman)} تومان
      </strong>

      {subtitle && (
        <div className="ef-helper">
          {subtitle}
        </div>
      )}

      {rows.length > 0 && (
        <div className="ef-result-rows">
          {rows.map((row) => (
            <div
              key={`${row.label}-${row.value}`}
              className="ef-result-row"
            >
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>
      )}

      {footer && (
        <div style={{ marginTop: 14 }}>
          {footer}
        </div>
      )}
    </section>
  );
}