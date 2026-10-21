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
  CheckCircle2,
  MessageCircle,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
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

  // Post-Viewing Feedback State
  const [feedbackViewing, setFeedbackViewing] = useState<Viewing | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComments, setFeedbackComments] = useState<string>('');
  const [feedbackOfferInterest, setFeedbackOfferInterest] = useState<boolean>(false);
  const [feedbackAutoAdvance, setFeedbackAutoAdvance] = useState<boolean>(true);
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);

  // Form State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?._id || '');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?._id || '');
  const [dateStr, setDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [timeStr, setTimeStr] = useState<string>('11:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [occupiedSlots, setOccupiedSlots] = useState<Array<{ start: string; end: string; timeString: string; durationMinutes: number }>>([]);
  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);

  // Check occupied slots when selected property or date changes
  React.useEffect(() => {
    if (!selectedPropertyId || !dateStr) {
      setOccupiedSlots([]);
      return;
    }
    let isCancelled = false;
    const fetchOccupied = async () => {
      setCheckingAvailability(true);
      try {
        const res = await api.getViewingAvailability(selectedPropertyId, dateStr);
        if (!isCancelled && res.occupiedSlots) {
          setOccupiedSlots(res.occupiedSlots);
        }
      } catch (err) {
        console.error('Failed to load slots availability', err);
      } finally {
        if (!isCancelled) setCheckingAvailability(false);
      }
    };
    fetchOccupied();
    return () => {
      isCancelled = true;
    };
  }, [selectedPropertyId, dateStr]);

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
        toast.error(res.message || res.error || 'Scheduling conflict detected');
        return;
      }

      setShowBookModal(false);
      toast.success('Viewing scheduled successfully!');
      onRefresh();
    } catch (err: any) {
      setConflictError(err.message || 'Failed to book viewing');
      toast.error(err.message || 'Failed to book viewing');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.updateViewingStatus(id, status);
      toast.success(`Viewing status updated to ${status}`);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update viewing status');
    }
  };

  const handleOpenFeedback = (viewing: Viewing) => {
    setFeedbackViewing(viewing);
    setFeedbackRating(viewing.feedback?.rating || 5);
    setFeedbackComments(viewing.feedback?.comments || '');
    setFeedbackOfferInterest(viewing.feedback?.interestedInOffer || false);
    setFeedbackAutoAdvance(true);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackViewing) return;
    try {
      setSubmittingFeedback(true);
      await api.updateViewingStatus(
        feedbackViewing._id,
        'Completed',
        {
          rating: feedbackRating,
          comments: feedbackComments.trim(),
          interestedInOffer: feedbackOfferInterest
        },
        feedbackOfferInterest && feedbackAutoAdvance
      );
      toast.success('Viewing marked as completed & feedback logged!');
      setFeedbackViewing(null);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
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
                const addr = v.property?.address;
                const formattedLocation = typeof addr === 'string'
                  ? addr
                  : addr
                    ? [addr.street, addr.city, addr.state, addr.zipCode].filter(Boolean).join(', ')
                    : 'Address provided upon request';

                return (
                  <div
                    key={v._id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Date Badge */}
                      <div className="p-2 px-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-center shrink-0 min-w-[62px]">
                        <div className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">
                          {date.toLocaleDateString([], { month: 'short' })}
                        </div>
                        <div className="text-lg font-black text-black dark:text-white leading-none my-0.5">
                          {date.getDate()}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {date.getFullYear()}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                          {v.property?.title || 'Property Tour'}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${v.status === 'Completed'
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
                            {v.lead?.name || 'Prospect'}
                          </span>
                          {v.lead?.phone && (
                            <span className="text-slate-400">
                              {v.lead.phone}
                            </span>
                          )}
                          {v.lead?.email && (
                            <span className="flex items-center gap-1 text-indigo-400">
                              <Mail className="w-3 h-3 text-indigo-400/80" />
                              {v.lead.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({v.durationMinutes} min)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick status, Email & WhatsApp actions */}
                    <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                      {v.lead?.email && (
                        <a
                          href={`mailto:${v.lead.email}?subject=${encodeURIComponent(
                            `Viewing Appointment: ${v.property?.title || 'Property Tour'} - ViewFlow`
                          )}&body=${encodeURIComponent(
                            `Hi ${v.lead.name || 'there'},

This is regarding your scheduled viewing for "${v.property?.title || 'the property'}" on ${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.

Location: ${formattedLocation}

Please let me know if you need any directions, need to reschedule, or have questions prior to our visit!

Best regards,
Your Real Estate Agent`
                          )}`}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          title={`Send pre-filled email to ${v.lead.email}`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </a>
                      )}

                      {v.lead?.phone && (
                        <a
                          href={`https://wa.me/${v.lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${v.lead.name}! This is regarding your viewing appointment for "${v.property?.title || 'the property'}" scheduled for ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.

Location: ${formattedLocation}

Please let me know if you need any directions or have questions prior to our visit!`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Message customer directly on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      {v.feedback?.rating && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{v.feedback.rating}/5</span>
                          {v.feedback.interestedInOffer && (
                            <span className="ml-1 text-[10px] text-emerald-400 font-bold uppercase">
                              • Offer Intended
                            </span>
                          )}
                        </div>
                      )}

                      {v.status === 'Scheduled' && (
                        <>
                          <button
                            onClick={() => handleOpenFeedback(v)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Mark Done
                          </button>
                          <button
                            onClick={() => handleStatusChange(v._id, 'Cancelled')}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {v.status === 'Completed' && !v.feedback?.rating && (
                        <button
                          onClick={() => handleOpenFeedback(v)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          Add Feedback
                        </button>
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

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Duration</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes (Standard)</option>
                  <option value={60}>60 Minutes</option>
                  <option value={90}>90 Minutes (Deep Tour)</option>
                </select>
              </div>

              {/* Real-time Occupied Slots Indicator */}
              <div className="rounded-xl bg-slate-800/50 border border-slate-700/60 p-3 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                  <span>Existing Bookings on {dateStr || 'Selected Date'}:</span>
                  {checkingAvailability && (
                    <span className="text-blue-400 text-[10px] animate-pulse">Checking slots...</span>
                  )}
                </div>
                {occupiedSlots.length === 0 ? (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All day open for this property
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {occupiedSlots.map((slot, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium"
                      >
                        Booked: {slot.timeString} ({slot.durationMinutes}m)
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
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

      {/* Post-Viewing Feedback Collection Modal */}
      {feedbackViewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700/80 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Viewing Feedback</h3>
                  <p className="text-xs text-slate-400">Log tour impressions & client offer intention</p>
                </div>
              </div>
              <button
                onClick={() => setFeedbackViewing(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-4">
              {/* Viewing Brief Summary */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-300 font-semibold truncate">
                  Property: <span className="text-white">{feedbackViewing.property?.title}</span>
                </div>
                <div className="text-slate-400">
                  Client: <span className="text-blue-400 font-medium">{feedbackViewing.lead?.name}</span> ({feedbackViewing.lead?.email})
                </div>
              </div>

              {/* 1-5 Star Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Client Interest Rating (1 to 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        feedbackRating >= star
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 scale-105'
                          : 'bg-slate-800/60 border-slate-700 text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${feedbackRating >= star ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-300 ml-2">
                    {feedbackRating === 5 ? '🤩 Loved it!' :
                     feedbackRating === 4 ? '😊 Very Interested' :
                     feedbackRating === 3 ? '😐 Neutral / Thinking' :
                     feedbackRating === 2 ? '😕 Hesitant' : '❌ Not Interested'}
                  </span>
                </div>
              </div>

              {/* Comments / Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tour Notes & Impressions
                </label>
                <textarea
                  rows={3}
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  placeholder="e.g. Liked the open kitchen layout, concerned about parking space..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Offer Intention Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">Client intends to make an offer?</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={feedbackOfferInterest}
                    onChange={(e) => setFeedbackOfferInterest(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                </label>

                {feedbackOfferInterest && (
                  <div className="pt-2 border-t border-slate-800/60">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-blue-400">
                      <input
                        type="checkbox"
                        checked={feedbackAutoAdvance}
                        onChange={(e) => setFeedbackAutoAdvance(e.target.checked)}
                        className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
                      />
                      <span>Auto-advance lead to <strong>"Offer"</strong> stage in Pipeline</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setFeedbackViewing(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingFeedback ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Save & Complete Viewing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
