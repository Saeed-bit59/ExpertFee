import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  backLabel?: string;
  onBack?: () => void;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  backLabel = "بازگشت",
  onBack,
  actions
}: PageHeaderProps) {
  return (
    <header className="ef-page-header">
      {(onBack || actions) && (
        <div
          style={{
            minHeight: 42,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 12,
            marginBottom: 12
          }}
        >
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
            >
              ← {backLabel}
            </button>
          ) : (
            <span />
          )}

          {actions}
        </div>
      )}

      {eyebrow && (
        <div className="ef-page-eyebrow">
          {eyebrow}
        </div>
      )}

      <h1 className="ef-page-title">
        {title}
      </h1>

      {subtitle && (
        <div className="ef-page-subtitle">
          {subtitle}
        </div>
      )}
    </header>
  );
}