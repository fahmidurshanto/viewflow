'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  ChevronLeft,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Property } from '@/types';

const DEFAULT_BUSINESS_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM'
];

function PublicBookingContent() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.propertyId as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [selectedDuration, setSelectedDuration] = useState<number>(45);
  const [slots, setSlots] = useState<Array<{ time: string; available: boolean }>>(() =>
    DEFAULT_BUSINESS_SLOTS.map((t) => ({ time: t, available: true }))
  );
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');

  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingSubmitting, setBookingSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Fetch Property Details
  useEffect(() => {
    if (!propertyId) return;
    const fetchProp = async () => {
      setLoading(true);
      try {
        const data = await api.getProperty(propertyId);
        if (data && !data.error) {
          setProperty(data);
        } else {
          setError('Property not found or link has expired.');
        }
      } catch (err: any) {
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProp();
  }, [propertyId]);

  // Fetch Slot Availability for Selected Date
  useEffect(() => {
    if (!propertyId || !selectedDate) return;
    const fetchAvailability = async () => {
      setLoadingSlots(true);
      try {
        const res = await api.getViewingAvailability(propertyId, selectedDate);
        if (res.slots && Array.isArray(res.slots) && res.slots.length > 0) {
          setSlots(res.slots);
          const currentValid = res.slots.find((s: any) => s.time === selectedSlot && s.available);
          if (!currentValid) {
            const firstAvailable = res.slots.find((s: any) => s.available);
            if (firstAvailable) {
              setSelectedSlot(firstAvailable.time);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchAvailability();
  }, [propertyId, selectedDate]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSubmitting(true);

    try {
      // Parse 12h time to 24h
      const [time, period] = selectedSlot.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      const dateObj = new Date(selectedDate);
      dateObj.setHours(hours, minutes, 0, 0);

      const res = await api.publicBookViewing({
        propertyId,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        scheduledDate: dateObj.toISOString(),
        durationMinutes: selectedDuration,
        notes: clientNotes
      });

      if (res.error) {
        setBookingError(res.message || res.error);
        toast.error(res.message || res.error);
      } else {
        setBookingSuccess(true);
        toast.success('Viewing appointment confirmed! Check your email.');
      }
    } catch (err: any) {
      const msg = err.message || 'Booking submission failed. Please try again.';
      setBookingError(msg);
      toast.error(msg);
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Loading property viewing calendar...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-white">Property Unavailable</h2>
          <p className="text-xs text-slate-400 mt-1">{error || 'This listing might have been removed.'}</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header Branding */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent truncate block">
                ViewFlow
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium truncate">Viewing Reservation Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-emerald-400 bg-emerald-500/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-emerald-500/20 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
            <span className="hidden sm:inline">Verified Private Listing</span>
            <span className="sm:hidden">Verified</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3.5 sm:px-4 py-4 sm:py-8 w-full flex-1">
        {bookingSuccess ? (
          <div className="max-w-xl mx-auto bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Viewing Booked Successfully!</h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Thank you, <span className="font-semibold text-white">{clientName}</span>. Your private viewing appointment for{' '}
              <span className="font-semibold text-white">{property.title}</span> has been scheduled and confirmed in our calendar.
            </p>

            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 text-left space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">Date:</span>
                <span className="font-semibold text-white">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">Time:</span>
                <span className="font-semibold text-white">{selectedSlot} ({selectedDuration} mins)</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-white">{property.address?.street}, {property.address?.city}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">Confirmation Sent To:</span>
                <span className="font-semibold text-blue-400">{clientEmail}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Our agent will contact you shortly prior to the viewing. An automated email confirmation has been sent to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/${(property as any)?.user?.phone?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(
`Hello! I just booked a viewing for *${property.title}* via your ViewFlow portal.

📅 *Date:* ${selectedDate}
⏰ *Time:* ${selectedSlot} (${selectedDuration} mins)
📍 *Address:* ${property.address?.street || ''}, ${property.address?.city || ''}

👤 *My Details:*
• Name: ${clientName}
• Phone: ${clientPhone || 'N/A'}
• Email: ${clientEmail}
${clientNotes ? `• Notes: "${clientNotes}"\n` : ''}
Could you please confirm the appointment? Looking forward to meeting you!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Agent on WhatsApp
              </a>

              <button
                onClick={() => {
                  setBookingSuccess(false);
                  setClientName('');
                  setClientEmail('');
                  setClientPhone('');
                  setClientNotes('');
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Book Another Viewing
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Property Preview Card */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl lg:sticky lg:top-20">
              <div className="relative h-48 sm:h-56 w-full bg-slate-800">
                <img
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/90 text-white shadow-md">
                    {property.status}
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-600/90 text-white shadow-md">
                    For {property.type}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xl sm:text-2xl font-black text-white">
                      ${property.price?.toLocaleString()}
                      {property.type === 'Rent' && <span className="text-xs font-normal text-slate-400">/mo</span>}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {property.propertyType}
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">{property.title}</h1>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {property.address?.street}, {property.address?.city}, {property.address?.state || 'USA'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-3 border-y border-slate-800 text-[11px] sm:text-xs text-slate-300 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:gap-1.5">
                    <Bed className="w-4 h-4 text-slate-500 shrink-0 mb-0.5 sm:mb-0" />
                    <span>{property.specs?.bedrooms || 0} Beds</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center sm:gap-1.5">
                    <Bath className="w-4 h-4 text-slate-500 shrink-0 mb-0.5 sm:mb-0" />
                    <span>{property.specs?.bathrooms || 0} Baths</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center sm:gap-1.5">
                    <Maximize2 className="w-4 h-4 text-slate-500 shrink-0 mb-0.5 sm:mb-0" />
                    <span>{property.specs?.areaSqFt || 0} sqft</span>
                  </div>
                </div>

                {property.description && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {property.description}
                  </p>
                )}

                {/* Additional Photos Mini Preview */}
                {property.images && property.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pt-1 pb-2 scrollbar-none">
                    {property.images.map((img, i) => (
                      <div key={i} className="w-14 sm:w-16 h-10 sm:h-12 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Booking Form */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl backdrop-blur-md">
              <div className="border-b border-slate-800 pb-4 mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-400 shrink-0" />
                  Select Date & Time Slot
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choose an available slot. Double-booking protection ensures your chosen time is guaranteed.
                </p>
              </div>

              {bookingError && (
                <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-rose-200">Booking Notice</div>
                    <div>{bookingError}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitBooking} className="space-y-6">
                {/* 1. Date & Duration Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                      Viewing Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      Duration
                    </label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(Number(e.target.value))}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={45}>45 Minutes (Recommended)</option>
                      <option value={60}>60 Minutes</option>
                      <option value={90}>90 Minutes</option>
                    </select>
                  </div>
                </div>

                {/* 2. Slot Selection Grid */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Available Time Slots for {selectedDate}
                  </label>
                  {loadingSlots ? (
                    <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span>Checking slot availability...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5">
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setSelectedSlot(s.time)}
                          className={`py-2 px-2 rounded-xl text-xs font-medium transition-all text-center border ${
                            !s.available
                              ? 'bg-slate-900/40 text-slate-600 border-slate-800/60 line-through cursor-not-allowed'
                              : selectedSlot === s.time
                              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 font-semibold'
                              : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800'
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Client Personal Information */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Contact Information
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number (SMS Alert)</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Additional Notes (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Special requests, questions about the property, or arrival details..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={bookingSubmitting || !selectedSlot}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {bookingSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Reserving Appointment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Viewing ({selectedSlot})</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Powered by ViewFlow CRM & Viewing Calendar • Direct Agent Reservation System
      </footer>
    </div>
  );
}

export default function PublicBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Loading property viewing calendar...</p>
        </div>
      }
    >
      <PublicBookingContent />
    </Suspense>
  );
}
