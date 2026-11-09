'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Compass,
  Building2,
  Users2,
  CalendarDays,
  CheckSquare2,
  CreditCard,
  Settings,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Search,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Share2
} from 'lucide-react';

interface DocsViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const DocsView: React.FC<DocsViewProps> = ({ onNavigateTab }) => {
  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sections = [
    { id: 'getting-started', label: 'Quick Start Flow', icon: Zap },
    { id: 'properties', label: 'Properties & Quotas', icon: Building2 },
    { id: 'pipeline', label: 'Lead Kanban Pipeline', icon: Users2 },
    { id: 'calendar', label: 'Viewing Calendar & Guard', icon: CalendarDays },
    { id: 'tasks', label: 'Tasks & Reminders', icon: CheckSquare2 },
    { id: 'billing', label: 'Plans & Stripe Billing', icon: CreditCard },
    { id: 'integrations', label: 'Email & WhatsApp Setup', icon: Settings },
    { id: 'faqs', label: 'Frequently Asked Questions', icon: HelpCircle }
  ];

  const filteredSections = sections.filter((s) =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/20 backdrop-blur-md relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Guide & Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How ViewFlow Works
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Master the core workflows of ViewFlow Real Estate CRM. Learn how to manage properties, streamline buyer leads through the Kanban board, and prevent double-booking tours with collision detection.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-6 max-w-md relative z-10">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides, features, workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Navigator + Documentation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 glass-card p-2 sm:p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1 sticky top-6 shadow-sm">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Guide Sections
          </div>
          {filteredSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{sec.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-white' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* SECTION 1: QUICK START FLOW */}
          {activeSection === 'getting-started' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>4-Step Quick Start Workflow</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  From listing your first home to closing a deal with signed agreements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add Property Listing</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Upload photos, set pricing, and choose status (Sale or Rent). Cloudinary automatically optimizes high-res photography.
                  </p>
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('properties')}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Go to Properties</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Share Self-Booking Portal</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Copy the public booking link for any property. Prospective buyers can select viewing slots on their phone or desktop.
                  </p>
                  <div className="text-[11px] font-mono bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 text-slate-500">
                    /property/[property-id]
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Track Kanban Progression</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Booked buyers automatically appear under "Viewing Arranged". Drag cards to "Offer Submitted" and "Closed" as deals progress.
                  </p>
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('pipeline')}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>Open Lead Pipeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Automated Client Reminders</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    The background scheduler automatically dispatches email and WhatsApp reminders 2 hours prior to tours to eliminate no-shows.
                  </p>
                  {onNavigateTab && (
                    <button
                      onClick={() => onNavigateTab('calendar')}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>View Calendar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: PROPERTIES & QUOTAS */}
          {activeSection === 'properties' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-500" />
                  <span>Property Listings & Tier Limits</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  How property listings, quotas, and exports work in ViewFlow.
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800/50 border border-blue-200/80 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>Listing Allowance by Subscription Tier</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                    <li><strong>Starter Plan:</strong> Up to 15 active property listings. The quota progress banner at the top shows real-time capacity.</li>
                    <li><strong>Growth Agency Plan:</strong> Unlimited active property listings.</li>
                    <li><strong>Enterprise Plan:</strong> Unlimited listings + Whitelabel branding.</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <h5 className="font-bold text-xs uppercase text-slate-400">Reports & Exporting</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      Download full property inventory spreadsheets via <strong>Export CSV</strong> or generate print-friendly client brochures via <strong>Print PDF</strong>.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <h5 className="font-bold text-xs uppercase text-slate-400">Public Booking URL</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      Click the external link icon on any property card to open the client self-booking page, or copy the link directly into your WhatsApp / Email messages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: LEAD KANBAN PIPELINE */}
          {activeSection === 'pipeline' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-indigo-500" />
                  <span>Lead Pipeline & Kanban Stages</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage inquiries and deals with drag-and-drop ease.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { stage: '1. New Leads', desc: 'Inquiries submitted through client booking forms or manually added by agents.' },
                  { stage: '2. Contacted', desc: 'Agent has reached out via phone, WhatsApp, or email to qualify buyer interest.' },
                  { stage: '3. Viewing Arranged', desc: 'A tour date and time slot has been set on the calendar.' },
                  { stage: '4. Offer Submitted', desc: 'The buyer has made a formal price proposal on the property.' },
                  { stage: '5. Deal Won / Closed', desc: 'Contracts signed and deposit collected.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{item.stage}: </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: CALENDAR & COLLISION GUARD */}
          {activeSection === 'calendar' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  <span>Viewing Calendar & Collision Detection</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  How ViewFlow blocks conflicting tour appointments.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  Real estate tours often suffer from overlapping bookings. ViewFlow contains a smart <strong>Collision Guard</strong> engine:
                </p>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>How Collision Detection Works:</span>
                  </div>
                  <p>
                    When an agent or client books a tour for Property A from 2:00 PM to 2:45 PM, the calendar engine automatically locks that slot. Any other client attempting to book Property A during that window will be blocked with an alternate time suggestion.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: TASKS & REMINDERS */}
          {activeSection === 'tasks' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare2 className="w-5 h-5 text-emerald-500" />
                  <span>Tasks, Priorities & Due Dates</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Stay on top of paperwork, title deeds, and client follow-ups.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  The Tasks system links directly to leads and property listings. You can organize tasks by:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-medium">
                    🔴 High Priority (Immediate action today)
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
                    🟡 Medium Priority (Follow-ups & docs)
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium">
                    🔵 Low Priority (General reminders)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: PLANS & STRIPE BILLING */}
          {activeSection === 'billing' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                  <span>Plans, Billing & Stripe Portal</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Subscription management with automated card billing and invoicing.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Instant Stripe Checkout</h4>
                  <p>
                    Select any package (Starter, Growth, or Enterprise) on the Plans page. You are redirected to Stripe's secure checkout page supporting Credit Cards, Google Pay, and Apple Pay.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Customer Billing Portal</h4>
                  <p>
                    Active subscribers can click <strong>"Manage Invoices & Cards"</strong> to open their Stripe customer portal. Here you can download official PDF receipts, change credit cards, or cancel subscriptions anytime.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: EMAIL & WHATSAPP SETUP */}
          {activeSection === 'integrations' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-400" />
                  <span>Email & WhatsApp Notifications Setup</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Free communication channels for tour confirmations and reminders.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800/50 border border-blue-200/80 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Gmail SMTP (100% Free)</h4>
                  <p>
                    No paid third-party email providers (like SendGrid or Mailgun) required! Configure a standard Google 16-character App Password in Settings to enable automated confirmation emails.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/50 border border-emerald-200/80 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">WhatsApp Direct Alerts (CallMeBot)</h4>
                  <p>
                    Connect your WhatsApp number to receive real-time notifications on your smartphone the moment a client books a viewing tour.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: FAQS */}
          {activeSection === 'faqs' && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  <span>Frequently Asked Questions</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Quick answers to common questions about ViewFlow.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Can prospective clients book tours without creating an account?
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Yes! The public property booking page (`/property/:id`) allows any prospective buyer to select an available time and submit contact info without needing a login.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    What happens when my 30-day free trial expires?
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Your existing property and lead data remains completely safe. However, adding new properties or booking new tours will require selecting an active subscription tier.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    How do I switch between Light and Dark themes?
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Click the "Light / Dark" toggle at the bottom of the left sidebar navigation menu anytime to switch themes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

