'use client';

import React from 'react';
import {
  User,
  Building2,
  CreditCard,
  FileCheck,
  CheckCircle2,
  Check,
} from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps = 5, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Basic Information', icon: User },
    { number: 2, title: 'Business Details', icon: Building2 },
    { number: 3, title: 'Bank Details', icon: CreditCard },
    { number: 4, title: 'Documents', icon: FileCheck },
    { number: 5, title: 'Verification', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full py-4 px-2 sm:px-6">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-border-custom/80 z-0 hidden md:block" />

        {steps.map((s) => {
          const isCompleted = currentStep > s.number;
          const isCurrent = currentStep === s.number;
          const Icon = s.icon;

          return (
            <div
              key={s.number}
              onClick={() => {
                if (isCompleted && onStepClick) {
                  onStepClick(s.number);
                }
              }}
              className={`relative z-10 flex flex-col items-center group ${
                isCompleted ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Step Circle matching Reference Image 2 */}
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                    : isCurrent
                    ? 'bg-primary text-white ring-4 ring-primary/20 scale-105'
                    : 'bg-background-secondary text-muted-custom border border-border-custom'
                }`}
              >
                {isCompleted ? (
                  <Check size={20} className="stroke-[3]" />
                ) : (
                  <span>{s.number}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`mt-2 text-[11px] sm:text-xs font-bold text-center transition-colors whitespace-nowrap ${
                  isCurrent
                    ? 'text-primary font-black'
                    : isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                    : 'text-muted-custom'
                }`}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
