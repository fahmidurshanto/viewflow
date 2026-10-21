'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Zap,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Receipt,
  FileCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { usePlanAccess } from '@/hooks/usePlanAccess';

export const PricingView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [updatingSubscription, setUpdatingSubscription] = useState<boolean>(false);

  const { isTrial, trialDaysLeft, isTrialExpired } = usePlanAccess();

  useEffect(() => {
    if (user?.subscriptionPlan) {
      setSelectedPlan(user.subscriptionPlan as any);
    }
    if (user?.subscriptionBillingCycle) {
      setBillingCycle(user.subscriptionBillingCycle as any);
    }
  }, [user]);

  const handleUpdatePlan = async (plan: 'Starter' | 'Growth' | 'Enterprise') => {
    setUpdatingSubscription(true);
    try {
      const res = await api.updateSubscription({ plan, billingCycle });
      if (res && res.success) {
        setSelectedPlan(plan);
        if (updateUser) {
          updateUser({ subscriptionPlan: plan, subscriptionBillingCycle: billingCycle });
        }
        toast.success(`Plan updated to ${plan} (${billingCycle})!`);
      } else {
        toast.error(res?.error || 'Failed to update plan');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating subscription');
    } finally {
      setUpdatingSubscription(false);
    }
  };

  const handleToggleCycle = async (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
    try {
      const res = await api.updateSubscription({ plan: selectedPlan, billingCycle: cycle });
      if (res && res.success) {
        if (updateUser) {
          updateUser({ subscriptionBillingCycle: cycle });
        }
        toast.success(`Switched to ${cycle} billing!`);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Billing & Subscription Plans</h2>
          <p className="text-slate-400 text-sm">
            Manage your agency subscription tier, billing frequency, and feature allowances.
          </p>
        </div>

        {/* Billing Cycle Switch */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => handleToggleCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => handleToggleCycle('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Annual Billing</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* Active Subscription Summary Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isTrial
          ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-slate-900/60 border-amber-500/30'
          : 'bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-slate-900/60 border-blue-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isTrial ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
          }`}>
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {isTrial ? `30-Day Free Trial (${selectedPlan} Tier)` : `Current Active Tier: ${selectedPlan}`}
              </span>
              {isTrial ? (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {isTrialExpired ? 'Trial Expired' : `${trialDaysLeft} Days Remaining`}
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isTrial
                ? 'Full access to all automation features. Select any tier below to lock in uninterrupted service.'
                : `Billed ${billingCycle} • Renews automatically on the 1st of every cycle`}
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>PCI-DSS Compliant Encryption</span>
        </div>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* 1. Starter Tier */}
        <div className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
          selectedPlan === 'Starter'
            ? 'bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-500/10'
            : 'glass-panel hover:border-slate-700'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</span>
              {selectedPlan === 'Starter' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">Current Plan</span>
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">
                  ${billingCycle === 'monthly' ? '29' : '23'}
                </span>
                <span className="text-xs text-slate-400 font-medium"> / month</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-[11px] text-emerald-400 font-medium mt-1">Billed $276 annually</div>
              )}
            </div>
            <p className="text-xs text-slate-400">Essential tools for independent brokers and solo agents.</p>
            
            <div className="pt-3 border-t border-slate-800">
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400 shrink-0" /> Up to 15 Active Properties</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400 shrink-0" /> Conflict-free Viewing Calendar</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400 shrink-0" /> Public Self-Booking Client Portal</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400 shrink-0" /> Standard Email Confirmations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-400 shrink-0" /> Cloud Media Uploads</li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            disabled={selectedPlan === 'Starter' || updatingSubscription}
            onClick={() => handleUpdatePlan('Starter')}
            className={`w-full mt-6 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedPlan === 'Starter'
                ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 text-white hover:border-blue-500 border border-slate-700'
            }`}
          >
            {selectedPlan === 'Starter' ? 'Current Active Plan' : 'Select Starter Plan'}
          </button>
        </div>

        {/* 2. Growth Tier (Most Popular) */}
        <div className={`p-6 rounded-2xl border-2 transition-all relative flex flex-col justify-between ${
          selectedPlan === 'Growth'
            ? 'bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-slate-900/80 border-blue-500 shadow-2xl shadow-blue-500/20 md:-translate-y-1'
            : 'border-blue-500/60 bg-slate-900/60 hover:border-blue-500'
        }`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold shadow-md shadow-blue-500/40 uppercase tracking-wider">
            Most Popular
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Growth Agency
              </span>
              {selectedPlan === 'Growth' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">Current Plan</span>
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">
                  ${billingCycle === 'monthly' ? '79' : '63'}
                </span>
                <span className="text-xs text-slate-400 font-medium"> / month</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-[11px] text-emerald-400 font-medium mt-1">Billed $756 annually (Save $192)</div>
              )}
            </div>
            <p className="text-xs text-slate-400">Complete pipeline power for high-performing real estate agencies.</p>

            <div className="pt-3 border-t border-slate-800">
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Unlimited</strong> Property Listings</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Drag & Drop Kanban Pipeline</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Automated <strong>WhatsApp & Email Alerts</strong></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Custom Dynamic Templates & Chips</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Post-Viewing Feedback & Offer Loop</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Real-time Notification Engine</li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            disabled={selectedPlan === 'Growth' || updatingSubscription}
            onClick={() => handleUpdatePlan('Growth')}
            className={`w-full mt-6 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedPlan === 'Growth'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 cursor-default'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 active:scale-95'
            }`}
          >
            {selectedPlan === 'Growth' ? 'Current Active Plan' : 'Upgrade to Growth'}
          </button>
        </div>

        {/* 3. Enterprise Tier */}
        <div className={`p-6 rounded-2xl border transition-all relative flex flex-col justify-between ${
          selectedPlan === 'Enterprise'
            ? 'bg-purple-600/10 border-purple-500 shadow-xl shadow-purple-500/10'
            : 'glass-panel hover:border-slate-700'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Enterprise</span>
              {selectedPlan === 'Enterprise' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500 text-white">Current Plan</span>
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">
                  ${billingCycle === 'monthly' ? '199' : '159'}
                </span>
                <span className="text-xs text-slate-400 font-medium"> / month</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-[11px] text-emerald-400 font-medium mt-1">Billed $1,908 annually (Save $480)</div>
              )}
            </div>
            <p className="text-xs text-slate-400">Large brokerages, multi-office franchises, and luxury agencies.</p>

            <div className="pt-3 border-t border-slate-800">
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Unlimited Team Agent Seats</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Custom Domain & Whitelabel Branding</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Executive CSV & PDF Exports</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Dedicated High-Volume Gmail SMTP</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> 24/7 Dedicated Support SLA</li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            disabled={selectedPlan === 'Enterprise' || updatingSubscription}
            onClick={() => handleUpdatePlan('Enterprise')}
            className={`w-full mt-6 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedPlan === 'Enterprise'
                ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 text-white hover:border-purple-500 border border-slate-700'
            }`}
          >
            {selectedPlan === 'Enterprise' ? 'Current Active Plan' : 'Select Enterprise Plan'}
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-sm text-white">Subscription & Billing FAQs</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
          <div>
            <div className="font-semibold text-slate-200 mb-1">Can I change plans at any time?</div>
            Yes! When you upgrade or switch billing cycles, your changes take effect immediately and remaining credit is prorated.
          </div>
          <div>
            <div className="font-semibold text-slate-200 mb-1">What payment methods are supported?</div>
            All major credit cards (Visa, MasterCard, American Express) are supported with automated invoicing.
          </div>
        </div>
      </div>
    </div>
  );
};
