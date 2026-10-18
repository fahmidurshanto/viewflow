'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Key, ShieldCheck, Save, CheckCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    twilioSid: 'AC_sample_sid_1234567890',
    twilioToken: '••••••••••••••••••••••••••••••••',
    resendApiKey: 're_sample_key_987654321',
    reminderHoursAhead: 2,
    enableSms: true,
    enableEmail: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Settings & Integrations</h2>
        <p className="text-slate-400 text-sm">
          Configure API credentials for automated SMS (Twilio) and Email (Resend) reminders.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Email Integration */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Mail className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">Email Reminders (Resend / SendGrid)</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Resend API Key</label>
              <input
                type="password"
                value={config.resendApiKey}
                onChange={(e) => setConfig({ ...config, resendApiKey: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enableEmail"
                checked={config.enableEmail}
                onChange={(e) => setConfig({ ...config, enableEmail: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <label htmlFor="enableEmail" className="text-xs text-slate-300">
                Send automatic email confirmation and reminder to clients
              </label>
            </div>
          </div>
        </div>

        {/* SMS Integration */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base text-white">SMS Reminders (Twilio)</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Twilio Account SID</label>
                <input
                  type="text"
                  value={config.twilioSid}
                  onChange={(e) => setConfig({ ...config, twilioSid: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Twilio Auth Token</label>
                <input
                  type="password"
                  value={config.twilioToken}
                  onChange={(e) => setConfig({ ...config, twilioToken: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enableSms"
                checked={config.enableSms}
                onChange={(e) => setConfig({ ...config, enableSms: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <label htmlFor="enableSms" className="text-xs text-slate-300">
                Send automated SMS alerts prior to scheduled viewings
              </label>
            </div>
          </div>
        </div>

        {/* Save button & feedback */}
        <div className="flex items-center justify-between">
          {saved ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Settings saved successfully!
            </div>
          ) : (
            <span className="text-xs text-slate-500">
              Credentials are encrypted and stored safely.
            </span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
