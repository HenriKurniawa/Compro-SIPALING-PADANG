import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'orange' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-[#4A1515] hover:bg-[#6B1D16] text-white shadow-sm',
    orange: 'bg-[#F47716] hover:bg-[#D96009] text-white shadow-sm',
    secondary: 'bg-[#FFF5EC] hover:bg-[#FFE8D6] text-[#F47716] border border-[#EADBCE]',
    danger: 'bg-white hover:bg-red-50 text-red-600 border border-red-300',
    ghost: 'bg-transparent hover:bg-black/5 text-[#331A15]',
    outline: 'bg-white hover:bg-[#F8F9FA] text-[#331A15] border border-[#EADBCE]',
  };

  return (
    <button
      className={twMerge(clsx(baseClasses, sizeClasses[size], variantClasses[variant], className))}
      {...props}
    >
      {children}
    </button>
  );
};
