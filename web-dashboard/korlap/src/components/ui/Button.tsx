import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Variant = 'orange' | 'maroon' | 'outline' | 'danger' | 'danger-outline' | 'neutral-outline';

const VARIANT: Record<Variant, string> = {
  orange: 'bg-orange text-maroon-950 hover:brightness-105',
  maroon: 'bg-maroon-700 text-cream hover:bg-maroon-800',
  outline: 'border border-maroon-700 bg-white text-maroon-700 hover:bg-cream',
  danger: 'bg-danger text-white hover:brightness-110',
  'danger-outline': 'border border-danger bg-white text-danger hover:bg-danger-bg',
  'neutral-outline': 'border border-line bg-white text-maroon-700 hover:bg-cream',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = ({ variant = 'orange', className, type = 'button', ...props }: ButtonProps) => (
  <button
    type={type}
    className={cn(
      'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-bold disabled:cursor-not-allowed disabled:opacity-60',
      VARIANT[variant],
      className,
    )}
    {...props}
  />
);
