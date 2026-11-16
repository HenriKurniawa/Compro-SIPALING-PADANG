import { useId, useState, type InputHTMLAttributes } from 'react';
import { EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Icon } from './Icon';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  invalid?: boolean;
  /** Tampilkan tombol lihat/sembunyikan password */
  revealable?: boolean;
  inputClassName?: string;
}

export const TextField = ({
  label,
  invalid,
  revealable,
  type = 'text',
  className,
  inputClassName,
  ...props
}: TextFieldProps) => {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const inputType = revealable ? (revealed ? 'text' : 'password') : type;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-bold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          aria-invalid={invalid || undefined}
          className={cn(
            'w-full rounded-xl border bg-white px-[14px] text-ink outline-none placeholder:text-placeholder focus:border-orange',
            invalid ? 'border-danger' : 'border-line',
            revealable && 'pr-12',
            inputClassName,
          )}
          {...props}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Sembunyikan password' : 'Lihat password'}
            className="absolute top-1/2 right-3 flex size-[30px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg hover:bg-cream"
          >
            {revealed ? <EyeOff size={22} strokeWidth={1.83} color="#7A4A3E" /> : <Icon name="eye" />}
          </button>
        )}
      </div>
    </div>
  );
};
