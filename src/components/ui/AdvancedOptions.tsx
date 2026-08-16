import type { ReactNode } from "react";

export interface AdvancedOptionsProps {
  children: ReactNode;
  title?: string;
  defaultOpen?: boolean;
}

export default function AdvancedOptions({
  children,
  title = "تنظیمات پیشرفته",
  defaultOpen = false
}: AdvancedOptionsProps) {
  return (
    <details
      className="ef-advanced"
      open={defaultOpen}
    >
      <summary className="ef-advanced-summary">
        {title}
      </summary>

      <div className="ef-advanced-body">
        {children}
      </div>
    </details>
  );
}