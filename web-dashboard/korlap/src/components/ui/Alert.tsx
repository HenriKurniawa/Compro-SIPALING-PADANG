import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export const Alert = ({ tone, children, className }: { tone: 'error' | 'success'; children: ReactNode; className?: string }) => (
  <div
    role={tone === 'error' ? 'alert' : 'status'}
    className={cn(
      'rounded-xl px-2.5 py-3 text-sm leading-[17px] font-bold',
      tone === 'error' ? 'bg-danger-bg text-error-ink' : 'bg-success-bg text-success-fg',
      className,
    )}
  >
    {children}
  </div>
);
