import { cn } from '../../lib/utils';
import type { RiderStatus } from '../../types';

export const StatusBadge = ({ status }: { status: RiderStatus }) => (
  <span
    className={cn(
      'inline-flex h-5 items-center rounded-full px-2.5 text-[11px] font-bold',
      status === 'active' ? 'bg-success-bg text-success-fg' : 'bg-idle-bg text-idle-fg',
    )}
  >
    {status === 'active' ? 'Aktif' : 'Tidak aktif'}
  </span>
);
