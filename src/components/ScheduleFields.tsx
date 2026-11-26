import type { FulfilmentType } from '../types/pos';
import { TIME_SLOTS, todayIsoDate } from '../utils/orders';
import { Segmented } from './Segmented';
import { fieldLabel, inputSmall } from '../ui';

interface ScheduleFieldsProps {
  type: FulfilmentType;
  date: string;
  time: string;
  address: string;
  onType: (t: FulfilmentType) => void;
  onDate: (d: string) => void;
  onTime: (t: string) => void;
  onAddress: (a: string) => void;
  compact?: boolean;
}

export function ScheduleFields({
  type,
  date,
  time,
  address,
  onType,
  onDate,
  onTime,
  onAddress,
  compact = false,
}: ScheduleFieldsProps) {
  return (
    <div className="space-y-2">
      <Segmented
        className="w-full"
        ariaLabel="Pickup or delivery"
        options={[
          { value: 'pickup' as const, label: 'Pickup' },
          { value: 'delivery' as const, label: 'Delivery' },
        ]}
        value={type}
        onChange={onType}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor={`ful-date-${compact ? 'b' : 'c'}`} className={fieldLabel}>
            Needed on
          </label>
          <input
            id={`ful-date-${compact ? 'b' : 'c'}`}
            type="date"
            min={todayIsoDate()}
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className={`${inputSmall} tabular-nums`}
          />
        </div>
        <div>
          <label htmlFor={`ful-time-${compact ? 'b' : 'c'}`} className={fieldLabel}>
            Time slot
          </label>
          <select
            id={`ful-time-${compact ? 'b' : 'c'}`}
            value={time}
            onChange={(e) => onTime(e.target.value)}
            className={inputSmall}
          >
            <option value="">Choose…</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {type === 'delivery' && (
        <div>
          <label htmlFor={`ful-addr-${compact ? 'b' : 'c'}`} className={fieldLabel}>
            Delivery address
          </label>
          <textarea
            id={`ful-addr-${compact ? 'b' : 'c'}`}
            value={address}
            onChange={(e) => onAddress(e.target.value)}
            rows={2}
            placeholder="House / street / landmark, town"
            className={`${inputSmall} h-auto py-1.5`}
          />
          <p className="mt-1 text-[9.5px] text-muted">
            Delivery also needs the customer name and a 10-digit phone above.
          </p>
        </div>
      )}
    </div>
  );
}
