'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  MessageCircle,
  ShieldCheck,
  Save,
  CheckCircle,
  Send,
  Building,
  Phone,
  Clock,
  Sparkles,
  BellRing,
  FileSignature,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export const SettingsView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // User-facing business preferences (Zero technical tokens)
  const [config, setConfig] = useState({
    agencyName: 'ViewFlow Premier Real Estate',
    agentEmail: '',
    agentPhone: '',
    emailSignature: 'Best regards,\nYour ViewFlow Property Concierge Team',
    enableEmailConfirmation: true,
    enableEmailReminder: true,
    enableWhatsAppReminder: true,
    reminderHoursBefore: 2,
    autoPromoteLeadOnBooking: true
  });

  // Test states
  const [testEmailAddress, setTestEmailAddress] = useState<string>('');
  const [testPhoneNumber, setTestPhoneNumber] = useState<string>('');
  const [testingEmail, setTestingEmail] = useState<boolean>(false);
  const [testingWhatsApp, setTestingWhatsApp] = useState<boolean>(false);
  const [emailTestResult, setEmailTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [whatsAppTestResult, setWhatsAppTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await api.getSettings();
        if (data && !data.error) {
          setConfig({
            agencyName: data.agencyName || 'ViewFlow Premier Real Estate',
            agentEmail: data.agentEmail || '',
            agentPhone: data.agentPhone || '',
            emailSignature: data.emailSignature || 'Best regards,\nYour ViewFlow Property Concierge Team',
            enableEmailConfirmation: data.enableEmailConfirmation !== false,
            enableEmailReminder: data.enableEmailReminder !== false,
            enableWhatsAppReminder: data.enableWhatsAppReminder !== false,
            reminderHoursBefore: data.reminderHoursBefore || 2,
            autoPromoteLeadOnBooking: data.autoPromoteLeadOnBooking !== false
          });
          setTestEmailAddress(data.agentEmail || '');
          setTestPhoneNumber(data.agentPhone || '');
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const [resettingDemo, setResettingDemo] = useState<boolean>(false);

  // Save Settings
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(config);
      setSaved(true);
      toast.success('Preferences saved successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Reset Demo Data
  const handleResetDemo = async () => {
    if (!confirm('Are you sure you want to reset demo data? This will restore clean sample properties, leads, tasks, and viewings.')) {
      return;
    }
    setResettingDemo(true);
    try {
      const res = await api.resetDemoData();
      if (res && !res.error) {
        toast.success('Demo data restored successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error(res?.error || 'Failed to reset demo data');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error resetting demo data');
    } finally {
      setResettingDemo(false);
    }
  };

  // Test Email
  const handleTestEmail = async () => {
    setTestingEmail(true);
    setEmailTestResult(null);
    try {
      const res = await api.testEmail(testEmailAddress || config.agentEmail);
      if (res.success) {
        setEmailTestResult({
          success: true,
          message: res.simulated
            ? '✓ Free email simulated! Add GMAIL_USER & GMAIL_APP_PASSWORD in .env for real delivery.'
            : '✓ Real email sent successfully to your inbox via Gmail SMTP!'
        });
      } else {
        setEmailTestResult({
          success: false,
          message: res.error || 'Failed to dispatch test email.'
        });
      }
    } catch (err: any) {
      setEmailTestResult({
        success: false,
        message: err.message || 'Error triggering test email.'
      });
    } finally {
      setTestingEmail(false);
    }
  };

  // Test WhatsApp
  const handleTestWhatsApp = async () => {
    setTestingWhatsApp(true);
    setWhatsAppTestResult(null);
    try {
      const res = await api.testWhatsApp(testPhoneNumber || config.agentPhone);
      if (res.success) {
        setWhatsAppTestResult({
          success: true,
          message: res.simulated
            ? '✓ WhatsApp alert simulated! Add WHATSAPP_API_KEY in .env for live messages.'
            : '✓ Real WhatsApp notification dispatched directly to mobile!'
        });
      } else {
        setWhatsAppTestResult({
          success: false,
          message: res.error || 'Failed to send WhatsApp message.'
        });
      }
    } catch (err: any) {
      setWhatsAppTestResult({
        success: false,
        message: err.message || 'Error triggering WhatsApp message.'
      });
    } finally {
      setTestingWhatsApp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 text-sm gap-2">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Agency Settings & Notifications</h2>
        <p className="text-slate-400 text-sm">
          Customize your agency brand, contact information, and automated client messaging preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Agency & Agent Branding */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Building className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">Agency & Agent Branding</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Agency Name</label>
              <input
                type="text"
                required
                value={config.agencyName}
                onChange={(e) => setConfig({ ...config, agencyName: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Agent Email Address</label>
              <input
                type="email"
                required
                value={config.agentEmail}
                onChange={(e) => setConfig({ ...config, agentEmail: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Agent Phone / WhatsApp</label>
              <input
                type="tel"
                value={config.agentPhone}
                onChange={(e) => setConfig({ ...config, agentPhone: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <FileSignature className="w-3.5 h-3.5 text-blue-400" />
              Email Signature (Appended to all client emails)
            </label>
            <textarea
              rows={2}
              value={config.emailSignature}
              onChange={(e) => setConfig({ ...config, emailSignature: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* 2. Automated Messaging Preferences (Simple Friendly Toggles) */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <BellRing className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-base text-white">Client Notification Rules</h3>
                <p className="text-xs text-slate-400">Automated free emails & WhatsApp alerts delivered seamlessly</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> 100% Free Notification Engine
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Toggle 1: Email Confirmation */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <div className="space-y-0.5 pr-4">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  Instant Booking Email Confirmation
                </div>
                <div className="text-xs text-slate-400">
                  Sends an automated confirmation email to buyers immediately when they book a slot from your link.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enableEmailConfirmation}
                onChange={(e) => setConfig({ ...config, enableEmailConfirmation: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </label>

            {/* Toggle 2: Email Reminder */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <div className="space-y-0.5 pr-4">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Automated Pre-Viewing Email Reminder
                </div>
                <div className="text-xs text-slate-400">
                  Sends an email reminder with directions and timing prior to the scheduled viewing.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enableEmailReminder}
                onChange={(e) => setConfig({ ...config, enableEmailReminder: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </label>

            {/* Toggle 3: WhatsApp Alert */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <div className="space-y-0.5 pr-4">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Automated WhatsApp Viewing Alerts
                </div>
                <div className="text-xs text-slate-400">
                  Dispatches instant mobile alerts directly to WhatsApp (high open-rate, no carrier SMS fees).
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enableWhatsAppReminder}
                onChange={(e) => setConfig({ ...config, enableWhatsAppReminder: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </label>

            {/* Toggle 4: Auto-promote Leads */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <div className="space-y-0.5 pr-4">
                <div className="text-sm font-semibold text-white">
                  Auto-Advance Pipeline Stage to "Viewing"
                </div>
                <div className="text-xs text-slate-400">
                  Moves prospective leads to the Viewing column in your pipeline as soon as an appointment is booked.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.autoPromoteLeadOnBooking}
                onChange={(e) => setConfig({ ...config, autoPromoteLeadOnBooking: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Dispatch Reminder Window
            </label>
            <select
              value={config.reminderHoursBefore}
              onChange={(e) => setConfig({ ...config, reminderHoursBefore: Number(e.target.value) })}
              className="w-full sm:w-72 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value={1}>1 hour before viewing</option>
              <option value={2}>2 hours before viewing (Recommended)</option>
              <option value={4}>4 hours before viewing</option>
              <option value={24}>24 hours before viewing</option>
            </select>
          </div>
        </div>

        {/* 3. Notification Test Center (No API keys required) */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Send className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Preview & Test Channel Delivery</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Test */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Test Free Email Notification
              </div>
              <input
                type="email"
                placeholder="Enter recipient email..."
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleTestEmail}
                disabled={testingEmail}
                className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {testingEmail ? (
                  <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Send Test Email
              </button>
              {emailTestResult && (
                <div className={`text-xs p-2 rounded-lg ${
                  emailTestResult.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}>
                  {emailTestResult.message}
                </div>
              )}
            </div>

            {/* WhatsApp Direct Connect Preview */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                Direct WhatsApp Client Connect
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When clients book via your link, an instant pre-filled WhatsApp button opens a 1-to-1 chat with appointment details. Zero third-party fees or API keys.
              </p>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
`🏡 *New Property Viewing Request*
━━━━━━━━━━━━━━━━━━━━
👤 *Client:* Sample Client
📱 *Phone:* +1 (555) 019-2834
📧 *Email:* client@example.com

📍 *Property:* Modern Waterfront Luxury Villa
📅 *Date:* Tomorrow
⏰ *Time:* 10:00 AM (45 mins)
📌 *Location:* Miami, FL
━━━━━━━━━━━━━━━━━━━━
_Booked via ${config.agencyName || 'ViewFlow Premier Real Estate'}_`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Preview Direct WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        {/* Save button & feedback */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              Preferences saved successfully!
            </div>
          ) : (
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Free Notification Engine active.
            </span>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Preferences
          </button>
        </div>
      </form>

      {/* Demo Reset Card (Phase 6 Polish) */}
      <div className="mt-8 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              Demo Data & Showcase Environment
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Testing or demonstrating the platform to clients? Reset your database back to fresh sample properties, realistic leads, appointments, and pipeline stages in one click.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDemo}
            disabled={resettingDemo}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50 whitespace-nowrap"
          >
            {resettingDemo ? (
              <div className="w-3.5 h-3.5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            {resettingDemo ? 'Resetting Demo...' : 'Reset Demo Data'}
          </button>
        </div>
      </div>
    </div>
  );
};
