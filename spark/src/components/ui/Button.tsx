'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-100 active:scale-95',
          {
            'bg-[#C6F135] text-[#0D0D0D] hover:bg-[#A8CF20]': variant === 'primary' && !disabled,
            'border border-[#C6F135] text-[#C6F135] bg-transparent hover:bg-[#C6F13510]': variant === 'secondary' && !disabled,
            'bg-[#242424] text-white hover:bg-[#2E2E2E]': variant === 'ghost' && !disabled,
            'bg-[#2E2E2E] text-[#5A5A5A] cursor-not-allowed': disabled,
            'text-sm px-4 py-2.5': size === 'sm',
            'text-base px-6 py-3.5': size === 'md',
            'text-lg px-8 py-4': size === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
