import chatIcon from '../../assets/icons/chat.svg';
import chevronLeftIcon from '../../assets/icons/chevron-left.svg';
import closeIcon from '../../assets/icons/close.svg';
import eyeIcon from '../../assets/icons/eye.svg';
import logoutIcon from '../../assets/icons/logout.svg';
import searchIcon from '../../assets/icons/search.svg';
import truckIcon from '../../assets/icons/truck.svg';
import { cn } from '../../lib/utils';

/** Ikon asli dari Figma. Ukuran SVG dipertahankan, `box` adalah kotak ikon sesuai desain. */
const ICONS = {
  chat: { src: chatIcon, box: 18 },
  chevronLeft: { src: chevronLeftIcon, box: 18 },
  close: { src: closeIcon, box: 16 },
  eye: { src: eyeIcon, box: 22 },
  logout: { src: logoutIcon, box: 20 },
  search: { src: searchIcon, box: 18 },
  truck: { src: truckIcon, box: 16 },
} as const;

export type IconName = keyof typeof ICONS;

export const Icon = ({ name, className }: { name: IconName; className?: string }) => {
  const { src, box } = ICONS[name];
  return (
    <span
      aria-hidden
      className={cn('inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: box, height: box }}
    >
      <img src={src} alt="" className="block max-w-none" />
    </span>
  );
};
