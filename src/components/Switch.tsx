import { focus } from '../ui';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  tone?: 'berry' | 'pistachio';
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  tone = 'berry',
  className = '',
}: SwitchProps) {
  const activeTone = tone === 'pistachio' ? 'border-pistachio bg-pistachio' : 'border-berry bg-berry';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[22px] w-[38px] shrink-0 items-center rounded-full border transition-colors duration-200 after:absolute after:inset-x-0 after:inset-y-[-6px] after:content-[''] ${focus} ${
        checked ? activeTone : 'border-line-strong bg-line'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}
