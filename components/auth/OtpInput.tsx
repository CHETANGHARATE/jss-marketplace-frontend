'use client';

import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  disabled?: boolean;
  onComplete?: (otp: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  onComplete,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input box on mount
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const valueArray = value.split('').slice(0, length);
  while (valueArray.length < length) {
    valueArray.push('');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; // Only allow digits

    const newOtp = [...valueArray];
    // Take the last character entered
    newOtp[index] = val.slice(-1);
    const combined = newOtp.join('');
    onChange(combined);

    // Auto-advance to next input box
    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    if (combined.length === length && !combined.includes('') && onComplete) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!valueArray[index] && index > 0 && inputRefs.current[index - 1]) {
        // If current box is empty, move focus to previous box
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, length);

    if (digitsOnly.length > 0) {
      onChange(digitsOnly);
      // Focus appropriate box
      const targetIndex = Math.min(digitsOnly.length, length - 1);
      inputRefs.current[targetIndex]?.focus();

      if (digitsOnly.length === length && onComplete) {
        onComplete(digitsOnly);
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 my-4">
      {valueArray.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-2xl border transition-all duration-200 focus:outline-none ${
            digit
              ? 'border-primary bg-primary/5 text-primary shadow-xs ring-2 ring-primary/20'
              : 'border-border-custom/80 bg-background-secondary text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
        />
      ))}
    </div>
  );
};
