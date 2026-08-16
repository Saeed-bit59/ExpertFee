export interface ExpertCountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  title?: string;
}

export default function ExpertCountSelector({
  value,
  onChange,
  min = 1,
  max = 20,
  title = "تعداد کارشناسان"
}: ExpertCountSelectorProps) {
  const normalizedValue =
    Math.min(
      max,
      Math.max(
        min,
        Math.round(value)
      )
    );

  function setValue(
    nextValue: number
  ): void {
    onChange(
      Math.min(
        max,
        Math.max(min, nextValue)
      )
    );
  }

  return (
    <div>
      <div className="ef-control-title">
        {title}
      </div>

      <div className="ef-counter">
        <button
          type="button"
          aria-label="کاهش تعداد کارشناسان"
          disabled={
            normalizedValue <= min
          }
          onClick={() =>
            setValue(
              normalizedValue - 1
            )
          }
        >
          −
        </button>

        <strong
          className="ef-counter-value"
          aria-live="polite"
        >
          {normalizedValue.toLocaleString(
            "fa-IR"
          )}
        </strong>

        <button
          type="button"
          aria-label="افزایش تعداد کارشناسان"
          disabled={
            normalizedValue >= max
          }
          onClick={() =>
            setValue(
              normalizedValue + 1
            )
          }
        >
          +
        </button>
      </div>
    </div>
  );
}