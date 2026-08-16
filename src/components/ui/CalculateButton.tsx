import type {
  ButtonHTMLAttributes,
  ReactNode
} from "react";

export interface CalculateButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  loading?: boolean;
}

export default function CalculateButton({
  children = "محاسبه دستمزد",
  loading = false,
  disabled,
  className,
  ...props
}: CalculateButtonProps) {
  const isDisabled =
    Boolean(disabled) || loading;

  return (
    <button
      {...props}
      type="button"
      disabled={isDisabled}
      className={[
        "ef-calculate-button",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading
        ? "در حال محاسبه..."
        : children}
    </button>
  );
}