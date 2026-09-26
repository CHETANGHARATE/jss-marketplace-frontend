'use client';

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Optional leading icon: pass false to hide, true for default Lock, or a custom ReactNode */
  icon?: React.ReactNode | boolean;
  /** Extra container className */
  containerClassName?: string;
  /** Size of icons in pixels (default: 16) */
  iconSize?: number;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      icon = true,
      containerClassName = '',
      className = '',
      iconSize = 16,
      disabled,
      placeholder = '••••••••',
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setShowPassword((prev) => !prev);
    };

    const hasLeadingIcon = icon !== false;

    return (
      <div className={`relative flex items-center w-full ${containerClassName}`}>
        {hasLeadingIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-custom font-bold">
            {typeof icon === 'boolean' ? <Lock size={iconSize} /> : icon}
          </div>
        )}

        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full bg-background-secondary text-foreground text-sm font-bold py-3.5 rounded-2xl border border-border-custom/80 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-custom/50 ${
            hasLeadingIcon ? 'pl-10' : 'pl-4'
          } pr-11 ${className}`}
          {...rest}
        />

        <button
          type="button"
          tabIndex={0}
          onClick={toggleVisibility}
          onMouseDown={(e) => e.preventDefault()}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-custom hover:text-foreground focus:outline-none focus:text-foreground rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <EyeOff size={iconSize} className="shrink-0" />
          ) : (
            <Eye size={iconSize} className="shrink-0" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
