export type MissionLocation =
  | "IN_PROVINCE"
  | "OUT_PROVINCE";

export interface MissionSelectorProps {
  enabled: boolean;
  onEnabledChange: (
    value: boolean
  ) => void;
  location: MissionLocation;
  onLocationChange: (
    value: MissionLocation
  ) => void;
  days: number;
  onDaysChange: (
    value: number
  ) => void;
  title?: string;
}

export default function MissionSelector({
  enabled,
  onEnabledChange,
  location,
  onLocationChange,
  days,
  onDaysChange,
  title = "مأموریت"
}: MissionSelectorProps) {
  return (
    <div>
      <div className="ef-control-title">
        {title}
      </div>

      <div className="ef-mission-box">
        <div className="ef-choice-grid">
          <label
            className="ef-choice"
            data-active={!enabled}
          >
            <input
              type="radio"
              name="ef-mission-enabled"
              checked={!enabled}
              onChange={() =>
                onEnabledChange(false)
              }
            />
            <span>بدون مأموریت</span>
          </label>

          <label
            className="ef-choice"
            data-active={enabled}
          >
            <input
              type="radio"
              name="ef-mission-enabled"
              checked={enabled}
              onChange={() =>
                onEnabledChange(true)
              }
            />
            <span>با مأموریت</span>
          </label>
        </div>

        {enabled && (
          <div className="ef-mission-details">
            <div className="ef-choice-grid">
              <label
                className="ef-choice"
                data-active={
                  location ===
                  "IN_PROVINCE"
                }
              >
                <input
                  type="radio"
                  name="ef-mission-location"
                  checked={
                    location ===
                    "IN_PROVINCE"
                  }
                  onChange={() =>
                    onLocationChange(
                      "IN_PROVINCE"
                    )
                  }
                />
                <span>داخل استان</span>
              </label>

              <label
                className="ef-choice"
                data-active={
                  location ===
                  "OUT_PROVINCE"
                }
              >
                <input
                  type="radio"
                  name="ef-mission-location"
                  checked={
                    location ===
                    "OUT_PROVINCE"
                  }
                  onChange={() =>
                    onLocationChange(
                      "OUT_PROVINCE"
                    )
                  }
                />
                <span>خارج استان</span>
              </label>
            </div>

            <label className="ef-days-row">
              <span>
                تعداد روز مأموریت
              </span>

              <input
                className="ef-days-input"
                type="number"
                min={1}
                step={1}
                value={Math.max(1, days)}
                onChange={(event) =>
                  onDaysChange(
                    Math.max(
                      1,
                      Math.floor(
                        Number(
                          event.target
                            .value
                        ) || 1
                      )
                    )
                  )
                }
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}