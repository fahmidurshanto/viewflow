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
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Top Navbar matching CRM Theme */}
      <header className="glass-panel sticky top-0 z-40 px-6 py-4 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 brand-icon">
              <Compass
                className="w-6 h-6 text-white"
                color="#ffffff"
                stroke="#ffffff"
                style={{ color: '#ffffff', stroke: '#ffffff' }}
              />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
                ViewFlow
              </h1>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Real Estate CRM & Viewing Calendar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-slate-100 transition-colors cursor-pointer border shadow-sm"
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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              style={{ color: '#ffffff' }}
            >
              <span style={{ color: '#ffffff' }}>Agent Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built Specifically for Independent Real Estate Agents & Letting Agencies</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
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
              <Lock className="w-4 h-4 text-white" style={{ color: '#ffffff' }} />
              <span style={{ color: '#ffffff' }}>Access Private Workspace</span>
              <ArrowRight className="w-4 h-4 text-white" style={{ color: '#ffffff' }} />
            </button>
          </div>

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
