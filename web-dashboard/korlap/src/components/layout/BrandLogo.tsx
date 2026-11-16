import logo from '../../assets/logo.png';
import { cn } from '../../lib/utils';

/** Logo SIPALING dengan bingkai krem 2px (44px di header, 60px di halaman login) */
export const BrandLogo = ({ size, className }: { size: 44 | 60; className?: string }) => (
  <img
    src={logo}
    alt="SIPALING Padang Keliling"
    width={size}
    height={size}
    className={cn(
      'block shrink-0 object-cover outline-2 -outline-offset-1 outline-sand',
      size === 44 ? 'size-11 rounded-[11px]' : 'size-[60px] rounded-[15px]',
      className,
    )}
  />
);
