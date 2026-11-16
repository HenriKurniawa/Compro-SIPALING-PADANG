import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  className,
  children,
}) => {
  return (
    <div
      className={twMerge(
        'bg-white rounded-2xl border border-[#EADBCE] shadow-sm p-6',
        className
      )}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-5">
          <div>
            {title && <h3 className="text-lg font-extrabold text-[#4A1515]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#7A534B] mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
