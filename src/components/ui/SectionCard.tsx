import type { ReactNode } from "react";

export interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  compact?: boolean;
}

export default function SectionCard({
  title,
  description,
  children,
  compact = false
}: SectionCardProps) {
  return (
    <section
      className={[
        "ef-section-card",
        compact
          ? "ef-section-card--compact"
          : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title && (
        <h2 className="ef-section-title">
          {title}
        </h2>
      )}

      {description && (
        <div className="ef-section-description">
          {description}
        </div>
      )}

      {children}
    </section>
  );
}