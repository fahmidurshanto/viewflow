'use client';

import React, { useState } from 'react';
import {
  Building2,
  CalendarDays,
  Users2,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Sun,
  Moon,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { useTheme } from '@/context/ThemeContext';

interface LandingViewProps {
  onLoginSuccess: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onLoginSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Top Navbar matching CRM Theme */}
      <header className="glass-panel sticky top-0 z-40 px-4 sm:px-6 py-3 sm:py-4 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 brand-icon">
              <Compass
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                color="#ffffff"
                stroke="#ffffff"
                style={{ color: '#ffffff', stroke: '#ffffff' }}
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent truncate">
                ViewFlow
              </h1>
              <p className="text-[10px] sm:text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate">Real Estate CRM & Calendar</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl glass-card text-slate-400 hover:text-slate-100 transition-colors cursor-pointer border shadow-sm"
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
              style={{ color: '#ffffff' }}
            >
              <span style={{ color: '#ffffff' }}>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-[11px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Built Specifically for Real Estate Agencies</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Stop losing buyer leads &{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
              never miss a property tour
            </span>
          </h1>

          <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto opacity-80">
            Say goodbye to messy spreadsheets. ViewFlow brings your properties, Kanban lead pipeline, conflict-free viewing calendar, and auto reminders into one unified workspace.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ color: '#ffffff' }}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span style={{ color: '#ffffff' }}>Start 30-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 text-white" style={{ color: '#ffffff' }} />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No credit card required • Instant access to Growth tier features
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium opacity-80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-Tenant Data Isolation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500" /> Double-Booking Collision Guard
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-500" /> SMS & Email Automated Alerts
            </span>
          </div>
        </div>

        {/* Dynamic Feature Grid matching CRM glass cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Smart Viewing Calendar</h3>
            <p className="text-xs leading-relaxed opacity-75">
              Real-time slot collision detection blocks double bookings. Automated reminders keep buyers informed.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Visual Lead Pipeline</h3>
            <p className="text-xs leading-relaxed opacity-75">
              Drag-and-drop Kanban board moves inquiries smoothly from initial contact to completed offer.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Multi-Tenant Agency Security</h3>
            <p className="text-xs leading-relaxed opacity-75">
              Every agency’s listings and prospective buyers remain completely isolated and secured behind HttpOnly cookies.
            </p>
          </div>
        </div>

        {/* Public SaaS Pricing Table Section */}
        <div className="mt-24 space-y-10" id="pricing">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Transparent & Predictable Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Invest in higher viewing conversions
            </h2>
            <p className="text-sm opacity-75">
              Choose the right plan for your agency. Every plan includes a 14-day free trial with zero setup fees.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="pt-4 flex items-center justify-center">
              <div className="flex items-center p-1 rounded-2xl bg-slate-800/60 border border-slate-700/80 shadow-inner">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    SAVE 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* 1. Starter Tier */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6 relative border hover:border-slate-600 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg">Solo Agent</h3>
                  <p className="text-xs opacity-75">Essential tools for independent brokers and single agents.</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">${billingCycle === 'monthly' ? '29' : '23'}</span>
                    <span className="text-xs font-semibold opacity-60">/ month</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-[11px] text-emerald-500 font-semibold mt-1">Billed $276 annually (Save $72)</div>
                  )}
                </div>
                <div className="pt-2 border-t border-slate-700/40">
                  <ul className="space-y-2.5 text-xs">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Up to 15 Active Properties</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Conflict-Free Viewing Calendar</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Automated Email Confirmations</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Self-Booking Client Portal Link</li>
                    <li className="flex items-center gap-2 opacity-50"><CheckCircle2 className="w-4 h-4 shrink-0" /> Instant WhatsApp Alerts</li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wide border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Start 14-Day Free Trial
              </button>
            </div>

            {/* 2. Growth Tier (Highlighted / Most Popular) */}
            <div className="p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6 relative bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-slate-900/60 border-2 border-blue-500 shadow-2xl shadow-blue-500/20 md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold shadow-md shadow-blue-500/40 uppercase tracking-wider">
                Most Popular
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-blue-400">Growth Agency</h3>
                  <p className="text-xs opacity-75">Full pipeline power for active, expanding real estate teams.</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${billingCycle === 'monthly' ? '79' : '63'}</span>
                    <span className="text-xs font-semibold opacity-60">/ month</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">Billed $756 annually (Save $192)</div>
                  )}
                </div>
                <div className="pt-2 border-t border-slate-700/40">
                  <ul className="space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> <strong>Unlimited</strong> Property Listings</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Interactive Drag & Drop Kanban Pipeline</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Automated <strong>WhatsApp & Email Alerts</strong></li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Customizable Dynamic Message Templates</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Post-Viewing Feedback & Offer Loop</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Full Cloudinary Image CDN Pipeline</li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
              >
                Start Free Trial & Upgrade
              </button>
            </div>

            {/* 3. Enterprise Tier */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6 relative border hover:border-slate-600 transition-all">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-purple-400">Enterprise</h3>
                  <p className="text-xs opacity-75">Large brokerages, multi-office franchises, and luxury agencies.</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">${billingCycle === 'monthly' ? '199' : '159'}</span>
                    <span className="text-xs font-semibold opacity-60">/ month</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-[11px] text-emerald-500 font-semibold mt-1">Billed $1,908 annually (Save $480)</div>
                  )}
                </div>
                <div className="pt-2 border-t border-slate-700/40">
                  <ul className="space-y-2.5 text-xs">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Unlimited Team Agent Seats</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Custom Domain & Whitelabel Branding</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Executive CSV & PDF Exports</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> High-volume Gmail SMTP Dispatch</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Dedicated Account Manager & 24/7 SLA</li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wide border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Contact Brokerage Sales
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer matching CRM aesthetics */}
      <footer className="glass-panel py-6 px-6 text-center text-xs border-t opacity-70">
        ViewFlow SaaS Real Estate CRM &copy; {new Date().getFullYear()} — Designed for High-Performing Agencies.
      </footer>

      {/* Sign In & Agency Registration Modal */}
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          onLoginSuccess();
        }}
      />
    </div>
  );
};
