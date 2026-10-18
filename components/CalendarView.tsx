'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  User, 
  MapPin, 
  AlertTriangle, 
  Check, 
  X, 
  Star,
  CheckCircle2
} from 'lucide-react';
import { Viewing, Property, Lead } from '@/types';

interface CalendarViewProps {
  viewings: Viewing[];
  properties: Property[];
  leads: Lead[];
  onRefresh: () => void;
  api: any;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  viewings,
  properties,
  leads,
  onRefresh,
  api
}) => {
  const [showBookModal, setShowBookModal] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  // Form State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?._id || '');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?._id || '');
  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('11:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);

  const handleBookViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);

    const scheduledDate = new Date(`${dateStr}T${timeStr}:00`);

    try {
      const res = await api.createViewing({
        property: selectedPropertyId,
        lead: selectedLeadId,
        scheduledDate: scheduledDate.toISOString(),
        durationMinutes: Number(durationMinutes)
      });

      if (res.error) {
        setConflictError(res.message || res.error);
        return;
      }

      setShowBookModal(false);
      onRefresh();
    } catch (err: any) {
      setConflictError(err.message || 'Failed to book viewing');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.updateViewingStatus(id, status);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Viewing Calendar</h2>
          <p className="text-slate-400 text-sm">
            Schedule property tours and prevent double bookings automatically.
          </p>
        </div>
        <button
          onClick={() => {
            setConflictError(null);
            setShowBookModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Viewing
        </button>
      </div>

      {/* Viewing List Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Scheduled Appointments */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
              Scheduled Viewings
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {viewings.length} Total Appointments
            </span>
          </div>

          <div className="space-y-3.5">
            {viewings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No viewings currently scheduled. Click "Schedule Viewing" to book one!
              </div>
            ) : (
              viewings.map((v) => {
                const date = new Date(v.scheduledDate);
                const isPast = date < new Date();
                return (
                  <div
                    key={v._id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Date Badge */}
                      <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-center shrink-0 min-w-[58px]">
                        <div className="text-[10px] font-bold uppercase text-blue-400">
                          {date.toLocaleDateString([], { month: 'short' })}
                        </div>
                        <div className="text-lg font-black text-white leading-tight">
                          {date.getDate()}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                          {v.property?.title || 'Property Tour'}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            v.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : v.status === 'Cancelled'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {v.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1 text-slate-300">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            {v.lead?.name || 'Prospect'} ({v.lead?.phone || 'No Phone'})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({v.durationMinutes} min)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick status actions */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      {v.status === 'Scheduled' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(v._id, 'Completed')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Mark Done
                          </button>
                          <button
                            onClick={() => handleStatusChange(v._id, 'Cancelled')}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-semibold transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Smart Booking Tips & Calendar Info */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-lg text-white mb-2">Automated Features</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              ViewFlow includes an active collision detection engine that blocks duplicate bookings for the same property.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-white">Double-Booking Guard</div>
                  <div className="text-slate-400 mt-0.5">
                    Warns and blocks any viewing overlapping within 45 minutes of existing appointments.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-white">Auto Lead Promotion</div>
                  <div className="text-slate-400 mt-0.5">
                    Scheduling a viewing automatically advances the lead stage in the Kanban pipeline.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-semibold text-white">SMS / Email Reminders</div>
                  <div className="text-slate-400 mt-0.5">
                    Background cron checks viewings every 10 minutes to notify buyers before visits.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 text-xs text-slate-300">
            <span className="font-semibold text-blue-400">Pro Tip:</span> Always log viewing feedback after the client tour to keep deal momentum high.
          </div>
        </div>
      </div>

      {/* Book Viewing Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Book Property Viewing</h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {conflictError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{conflictError}</span>
              </div>
            )}

            <form onSubmit={handleBookViewing} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Property</label>
                <select
                  required
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Property --</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} (${p.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Select Client (Lead)</label>
                <select
                  required
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Choose Lead --</option>
                  {leads.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.name} ({l.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-sm text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
