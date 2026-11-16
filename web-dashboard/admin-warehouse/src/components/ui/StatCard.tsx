import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'orange' | 'maroon';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-white border-[#EADBCE] text-[#331A15]',
    orange: 'bg-gradient-to-br from-[#FFF5EC] to-white border-[#F8D7C4] text-[#331A15]',
    maroon: 'bg-[#4A1515] border-[#6B1D16] text-white',
  };

  const isDark = variant === 'maroon';

  return (
    <div
      className={twMerge(
        'rounded-2xl border p-5 shadow-sm flex flex-col justify-between relative overflow-hidden',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className={clsx('text-xs font-bold uppercase tracking-wider', isDark ? 'text-white/80' : 'text-[#7A534B]')}>
          {title}
        </span>
        {icon && (
          <div
            className={clsx(
              'w-9 h-9 rounded-xl flex items-center justify-center text-base',
              isDark ? 'bg-white/10 text-[#F47716]' : 'bg-[#FFF5EC] text-[#F47716]'
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-extrabold tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span
                className={clsx(
                  'text-xs font-bold px-1.5 py-0.5 rounded',
                  trend.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                )}
              >
                {trend.value}
              </span>
            )}
            {subtitle && (
              <span className={clsx('text-xs', isDark ? 'text-white/70' : 'text-[#7A534B]')}>
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
