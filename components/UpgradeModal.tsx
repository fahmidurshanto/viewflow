'use client';

import React from 'react';
import { Sparkles, Lock, ArrowRight, X, Check } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
  title?: string;
  featureTitle?: string;
  description?: string;
  featureDescription?: string;
  requiredPlan?: 'Growth' | 'Enterprise';
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeClick,
  title,
  featureTitle = 'Premium Feature Locked',
  description,
  featureDescription = 'Upgrade your plan to unlock full automation, unlimited properties, and premium capabilities.',
  requiredPlan = 'Growth',
}) => {
  const displayTitle = title || featureTitle;
  const displayDescription = description || featureDescription;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 ring-8 ring-amber-500/5">
          <Lock className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Requires {requiredPlan} Plan
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {displayTitle}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {displayDescription}
        </p>

        {/* Benefits list */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-800 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Included in {requiredPlan}:
          </p>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Unlimited active property listings</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Automated WhatsApp & Email viewing alerts</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>One-click PDF & CSV dossier exports</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Custom email reminder templates</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              onClose();
              if (onUpgradeClick) onUpgradeClick();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-primary-500/25 hover:shadow-primary-500/35 transition"
          >
            <span>Upgrade to {requiredPlan}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
