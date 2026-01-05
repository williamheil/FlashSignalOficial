import { InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-trading-blue transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              'w-full bg-background-secondary border border-border-primary rounded-lg py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:border-trading-blue focus:ring-1 focus:ring-trading-blue/50 disabled:opacity-50',
              icon ? 'pl-10' : 'px-3',
              error ? 'border-trading-red focus:border-trading-red focus:ring-trading-red/50' : '',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-trading-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
