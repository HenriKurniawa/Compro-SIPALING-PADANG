import React from 'react';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'orange'
  | 'maroon';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className,
}) => {
  const variantClasses: Record<BadgeVariant, string> = {
    success: 'bg-[#E3F2DC] text-[#1E5C16] border border-[#C6E6B8]',
    warning: 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]',
    danger: 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]',
    info: 'bg-[#E0F2FE] text-[#075985] border border-[#BAE6FD]',
    neutral: 'bg-[#ECE3DF] text-[#6B5550] border border-[#D4BEAA]',
    orange: 'bg-[#FFF5EC] text-[#F47716] border border-[#F8D7C4]',
    maroon: 'bg-[#4A1515] text-white border border-[#6B1D16]',
  };

  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none select-none',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

// Helper for status badge from string
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'Selesai':
    case 'Aktif':
      return <Badge variant="success">✓ {status}</Badge>;
    case 'Berjalan':
    case 'Keliling':
      return <Badge variant="orange">● {status}</Badge>;
    case 'Menunggu':
      return <Badge variant="warning">⏳ {status}</Badge>;
    case 'Ditolak':
    case 'Nonaktif':
      return <Badge variant="danger">✕ {status}</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

// Menu Pill Component (Identik dengan foto MENU YANG DITERIMA user)
interface MenuPillProps {
  name: string;
  qty: number | string;
  className?: string;
}

export const MenuPill: React.FC<MenuPillProps> = ({ name, qty, className }) => {
  return (
    <div
      className={twMerge(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFBF5] border border-[#EADBCE] text-[#331A15] shadow-xs text-xs font-semibold select-none',
        className
      )}
    >
      <span>{name}</span>
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-[#6B1D16] text-white font-bold text-[11px] leading-tight">
        {qty}
      </span>
    </div>
  );
};
