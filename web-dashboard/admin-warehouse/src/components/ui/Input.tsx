import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightAction, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold text-[#4A1515] uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#7A534B] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full px-4 py-2.5 rounded-xl border bg-white text-[#331A15] text-sm font-medium placeholder-[#A89288] outline-none transition-none',
                leftIcon && 'pl-10',
                rightAction && 'pr-10',
                error
                  ? 'border-red-400 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/20'
                  : 'border-[#EADBCE] focus:border-[#F47716] focus:ring-1 focus:ring-[#F47716]'
              ),
              className
            )}
            {...props}
          />
          {rightAction && (
            <div className="absolute right-3.5 flex items-center">
              {rightAction}
            </div>
          )}
        </div>
        {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
        {!error && helperText && <span className="text-xs text-[#7A534B]">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
