import { avatarTone, cn, formatClock, riderUpdateShort, whatsappLink } from '../../lib/utils';
import type { Rider } from '../../types';
import { Avatar, Button, Icon } from '../ui';

interface RiderDetailCardProps {
  rider: Rider;
  now: number;
  onClose: () => void;
  onCenter: () => void;
  className?: string;
}

export const RiderDetailCard = ({ rider, now, onClose, onCenter, className }: RiderDetailCardProps) => {
  const active = rider.status === 'active';

  const statusTitle = active ? 'Aktif · sedang bekerja' : 'Tidak aktif';
  const statusDesc = active
    ? rider.shiftStartedAt && `Mulai bekerja pukul ${formatClock(rider.shiftStartedAt)}`
    : rider.shiftEndedAt
      ? `Berhenti bekerja pukul ${formatClock(rider.shiftEndedAt)}`
      : 'Belum mulai bekerja hari ini';

  const details: Array<[string, string]> = [
    ['No. HP', rider.phone],
    ['Lokasi terakhir', rider.lastLocationLabel ?? 'Belum tersedia'],
    ['Update lokasi', riderUpdateShort(rider, now)],
    ['Gudang', rider.warehouse],
  ];

  return (
    <section
      aria-label={`Detail rider ${rider.name}`}
      className={cn('w-[340px] rounded-[20px] bg-white shadow-[0_8px_24px_rgba(61,17,13,0.18)]', className)}
    >
      <div className="flex items-center gap-2.5 border-b border-sand px-[18px] py-[18px]">
        <Avatar name={rider.name} size={52} fontSize={18} tone={avatarTone(rider.status)} />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[19px] font-bold text-maroon-900">{rider.name}</h2>
          <p className="text-[13px] text-muted">Gerobak {rider.cartId}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail rider"
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-sand hover:brightness-95"
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="px-[18px] pt-4 pb-[18px]">
        <div
          className={cn(
            'flex gap-3 rounded-[14px] px-3.5 py-3',
            active ? 'bg-success-bg text-success-fg' : 'bg-idle-bg text-idle-fg',
          )}
        >
          <span className={cn('mt-1 size-3 shrink-0 rounded-full', active ? 'bg-success-dot' : 'bg-idle-dot')} />
          <div>
            <p className="text-[15px] font-bold">{statusTitle}</p>
            <p className="text-[13px]">{statusDesc}</p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-[130px_1fr] gap-y-[7px] text-sm">
          {details.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted">{label}</dt>
              <dd className="truncate font-bold text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-[18px] grid grid-cols-2 gap-2">
          <a
            href={whatsappLink(rider.phone)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-[43px] items-center justify-center gap-2 rounded-xl bg-orange text-sm font-bold text-maroon-950 hover:brightness-105"
          >
            <Icon name="chat" />
            Hubungi
          </a>
          <Button
            variant="outline"
            className="h-[43px] text-sm"
            onClick={onCenter}
            disabled={!rider.position}
            title={rider.position ? undefined : 'Lokasi rider belum tersedia'}
          >
            Pusatkan Peta
          </Button>
        </div>
      </div>
    </section>
  );
};
