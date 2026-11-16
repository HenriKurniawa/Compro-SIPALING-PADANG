import { cn, initials } from '../../lib/utils';
import type { RiderStatus } from '../../types';

export type AvatarTone = 'active' | 'inactive' | 'orange';

const TONE: Record<AvatarTone, string> = {
  active: 'bg-maroon-700 text-cream',
  inactive: 'bg-idle-avatar text-idle-fg',
  orange: 'bg-orange text-maroon-950',
};

interface AvatarProps {
  name: string;
  size: number;
  fontSize: number;
  tone: AvatarTone;
  /** Titik status kecil di kanan bawah (daftar rider) */
  status?: RiderStatus;
  className?: string;
}

export const Avatar = ({ name, size, fontSize, tone, status, className }: AvatarProps) => (
  <span
    className={cn('relative inline-flex shrink-0 items-center justify-center rounded-full font-bold', TONE[tone], className)}
    style={{ width: size, height: size, fontSize }}
  >
    {initials(name)}
    {status && (
      <span
        className={cn(
          'absolute -right-0.5 -bottom-0.5 size-4 rounded-full border-2 border-white',
          status === 'active' ? 'bg-success-dot' : 'bg-idle-dot',
        )}
      />
    )}
  </span>
);
