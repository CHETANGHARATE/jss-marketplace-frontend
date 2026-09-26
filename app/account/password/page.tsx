'use client';

import React, { useState } from 'react';
import { useChangePasswordMutation } from '../../../hooks/useProfile';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AccountSidebar } from '../../../components/AccountSidebar';
import { KeyRound, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { PasswordInput } from '../../../components/ui/PasswordInput';

export default function PasswordSecurityPage() {
  const changePasswordMutation = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const [successNotice, setSuccessNotice] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(formData.new_password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.new_password !== formData.new_password_confirmation) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    changePasswordMutation.mutate(formData, {
      onSuccess: () => {
        setSuccessNotice(true);
        setFormData({ current_password: '', new_password: '', new_password_confirmation: '' });
        setTimeout(() => setSuccessNotice(false), 3000);
      },
      onError: (err: any) => {
        setErrorMessage(err.message || 'Failed to update password. Please check your current password.');
      },
    });
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Account Dashboard', href: '/account' }, { label: 'Security & Password' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-primary" />
              <span>Password & Security</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Ensure your account stays secure by using a strong password.
            </p>
          </div>

          {successNotice && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password updated successfully!</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-500 text-xs font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold max-w-xl">
            <div className="space-y-1.5">
              <label className="text-foreground/70">Current Password</label>
              <PasswordInput
                required
                autoComplete="current-password"
                value={formData.current_password}
                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                className="bg-muted/30 border-border/40 rounded-xl px-3.5 py-2.5"
                icon={false}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground/70">New Password</label>
              <PasswordInput
                required
                minLength={8}
                autoComplete="new-password"
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                className="bg-muted/30 border-border/40 rounded-xl px-3.5 py-2.5"
                icon={false}
              />

              {formData.new_password && (
                <div className="space-y-1 pt-1">
                  <div className="flex h-1.5 gap-1.5 rounded-full overflow-hidden bg-muted/40">
                    <div className={`h-full flex-1 transition-all ${strengthScore >= 1 ? 'bg-rose-500' : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 transition-all ${strengthScore >= 2 ? 'bg-amber-500' : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 transition-all ${strengthScore >= 3 ? 'bg-emerald-400' : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 transition-all ${strengthScore >= 4 ? 'bg-emerald-600' : 'bg-transparent'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-foreground/50 block">
                    Password Strength:{' '}
                    {strengthScore <= 1 ? 'Weak' : strengthScore <= 3 ? 'Medium' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground/70">Confirm New Password</label>
              <PasswordInput
                required
                minLength={8}
                autoComplete="new-password"
                value={formData.new_password_confirmation}
                onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                className="bg-muted/30 border-border/40 rounded-xl px-3.5 py-2.5"
                icon={false}
              />
            </div>

            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="py-3 px-6 bg-primary text-primary-foreground text-xs font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              {changePasswordMutation.isPending ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
