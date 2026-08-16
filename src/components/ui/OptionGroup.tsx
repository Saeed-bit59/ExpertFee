import type { ReactNode } from "react";

export interface OptionGroupOption<
  T extends string
> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface OptionGroupProps<
  T extends string
> {
  title?: string;
  value: T;
  options: readonly OptionGroupOption<T>[];
  onChange: (value: T) => void;
  name: string;
  columns?: 1 | 2 | 3;
}

export default function OptionGroup<
  T extends string
>({
  title,
  value,
  options,
  onChange,
  name,
  columns = 2
}: OptionGroupProps<T>) {
  return (
    <div>
      {title && (
        <div className="ef-control-title">
          {title}
        </div>
      )}

      <div
        className="ef-choice-grid"
        style={{
          gridTemplateColumns:
            `repeat(${columns}, minmax(0, 1fr))`
        }}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="ef-choice"
            data-active={
              value === option.value
            }
            style={{
              opacity:
                option.disabled
                  ? 0.55
                  : 1,
              cursor:
                option.disabled
                  ? "not-allowed"
                  : "pointer"
            }}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={
                value === option.value
              }
              disabled={
                option.disabled
              }
              onChange={() =>
                onChange(option.value)
              }
            />

            <span>
              {option.label}

              {option.description && (
                <small
                  style={{
                    display: "block",
                    color:
                      "var(--ef-text-muted)",
                    fontWeight: 400
                  }}
                >
                  {option.description}
                </small>
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}