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
  ChevronRight,
  MessageCircle,
  Sun,
  Moon,
  Sparkles,
  Share2,
  Copy,
  Info,
  CalendarCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Property } from '@/types';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

const DEFAULT_BUSINESS_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM'
];

function PublicBookingContent() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.propertyId as string;
  const { theme, toggleTheme } = useTheme();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery state
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

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

    if (!selectedSlot) {
      setBookingError('Please choose a viewing time slot.');
      return;
    }

    if (!clientName.trim() || !clientEmail.trim()) {
      setBookingError('Name and email are required to confirm your booking.');
      return;
    }

    setBookingSubmitting(true);
    try {
      const payload = {
        propertyId,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        clientPhone: clientPhone.trim(),
        date: selectedDate,
        time: selectedSlot,
        duration: selectedDuration,
        notes: clientNotes.trim()
      };

      const res = await api.bookViewingPublic(payload);

      if (res && res._id) {
        setBookingSuccess(true);
        toast.success('Your viewing appointment has been confirmed!');
      } else {
        const errorMsg = res?.message || 'Failed to submit booking reservation.';
        setBookingError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const msg = err.message || 'Network error while booking. Please try again.';
      setBookingError(msg);
      toast.error(msg);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const copyListingLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Listing link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-bounce mb-4">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div className="w-7 h-7 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading viewing calendar & verified listing...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex flex-col items-center justify-center p-4 text-center">
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 mb-6 max-w-md shadow-xl backdrop-blur-md">
          <AlertCircle className="w-10 h-10 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Property Unavailable</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {error || 'This listing might have been removed, rented, or the reservation link has expired.'}
          </p>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Go back home
        </button>
      </div>
    );
  }

  const imagesList = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex flex-col justify-between selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Header Branding & Theme Switcher */}
      <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3">
          
          {/* Logo & Portal Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 bg-clip-text text-transparent">
                  ViewFlow
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-3 h-3" /> Direct Booking
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block font-medium truncate">
                Private Viewing Reservation Portal
              </span>
            </div>
          </div>

          {/* Right Action Icons: Share + Verified Badge + Light/Dark Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Share / Copy Link Button */}
            <button
              onClick={copyListingLink}
              title="Copy Listing Link"
              aria-label="Copy listing link"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/70 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Share2 className="w-4 h-4 text-blue-500" />
              <span className="hidden md:inline">Share</span>
            </button>

            {/* Verified Badge */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline font-semibold">Verified Agent</span>
              <span className="sm:hidden font-semibold">Verified</span>
            </div>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light/Dark Theme"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/70 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span className="hidden md:inline font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden md:inline font-medium">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full flex-1">
        {bookingSuccess ? (
          /* Success Confirmation Banner */
          <div className="max-w-xl mx-auto bg-white/90 dark:bg-slate-900/80 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-5 text-emerald-500 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Appointment Guaranteed
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3 mb-2">
              Viewing Booked Successfully!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              Thank you, <span className="font-semibold text-slate-900 dark:text-white">{clientName}</span>. Your private viewing appointment for{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">{property.title}</span> has been confirmed in our live agent calendar.
            </p>

            {/* Summary Ticket */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 text-left space-y-2.5 mb-6 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-blue-500" /> Date:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> Time:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedSlot} ({selectedDuration} mins)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> Location:
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-right truncate max-w-[220px]">
                  {property.address?.street}, {property.address?.city}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" /> Notification Sent:
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 truncate max-w-[200px]">{clientEmail}</span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-6">
              Our agent has received your request and will meet you at the property. You can also directly ping the agent on WhatsApp for instant directions.
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
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-300 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
              >
                Book Another Viewing
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Presentation: Property Details & Booking Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Enhanced Property Showcase (5 Cols) */}
            <div className="lg:col-span-5 bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl lg:sticky lg:top-20 backdrop-blur-md transition-all">
              
              {/* Main Photo with Badges & Gallery Nav */}
              <div className="relative h-56 sm:h-64 w-full bg-slate-100 dark:bg-slate-800 group overflow-hidden">
                <img
                  src={imagesList[activePhotoIdx]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Floating Badges */}
                <div className="absolute top-3.5 left-3.5 flex gap-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-lg backdrop-blur-md">
                    {property.status}
                  </span>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-600 text-white shadow-lg backdrop-blur-md">
                    For {property.type}
                  </span>
                </div>

                {/* Photo Counter */}
                {imagesList.length > 1 && (
                  <div className="absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/70 text-white backdrop-blur-md">
                    {activePhotoIdx + 1} / {imagesList.length} Photos
                  </div>
                )}
              </div>

              {/* Photo Thumbnails Gallery Strip */}
              {imagesList.length > 1 && (
                <div className="px-4 pt-3 flex gap-2 overflow-x-auto scrollbar-none pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activePhotoIdx === idx 
                          ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105' 
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Details & Specs */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      ${property.price?.toLocaleString()}
                      {property.type === 'Rent' && <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/mo</span>}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {property.propertyType}
                    </span>
                  </div>
                  
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {property.title}
                  </h1>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{property.address?.street}, {property.address?.city}, {property.address?.state || 'USA'}</span>
                  </p>
                </div>

                {/* Key Specs Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 text-center">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <Bed className="w-4 h-4 text-blue-500 mb-1" />
                    <span className="font-bold text-slate-900 dark:text-white">{property.specs?.bedrooms || 0}</span>
                    <span className="text-[10px] text-slate-500">Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <Bath className="w-4 h-4 text-indigo-500 mb-1" />
                    <span className="font-bold text-slate-900 dark:text-white">{property.specs?.bathrooms || 0}</span>
                    <span className="text-[10px] text-slate-500">Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <Maximize2 className="w-4 h-4 text-emerald-500 mb-1" />
                    <span className="font-bold text-slate-900 dark:text-white">{property.specs?.areaSqFt || 0}</span>
                    <span className="text-[10px] text-slate-500">Square Ft</span>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">About Property</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Trust Guarantee Box */}
                <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/15 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
                  <CalendarCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <span className="font-bold block text-blue-900 dark:text-blue-200">Instant Double-Booking Protection</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      Selecting your slot locks it immediately in the host calendar to ensure zero overlaps.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Interactive Booking Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl backdrop-blur-md transition-all">
              
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    Schedule Your Private Tour
                  </h2>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Step 1 of 2
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pick your preferred date and slot. Our direct agent reservation system confirms in real time.
                </p>
              </div>

              {bookingError && (
                <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-600 dark:text-rose-300 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-700 dark:text-rose-200">Reservation Notice</div>
                    <div>{bookingError}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitBooking} className="space-y-6">
                
                {/* 1. Date & Duration Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                      Select Viewing Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      Session Duration
                    </label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    >
                      <option value={30}>30 Minutes (Quick Walkthrough)</option>
                      <option value={45}>45 Minutes (Recommended)</option>
                      <option value={60}>60 Minutes (Detailed Tour)</option>
                      <option value={90}>90 Minutes (Deep Inspection)</option>
                    </select>
                  </div>
                </div>

                {/* 2. Slot Selection Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Available Time Slots on {selectedDate}
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {slots.filter(s => s.available).length} slots available
                    </span>
                  </div>

                  {loadingSlots ? (
                    <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Checking real-time calendar availability...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {slots.map((s) => {
                        const isSelected = selectedSlot === s.time;
                        return (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!s.available}
                            onClick={() => setSelectedSlot(s.time)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-center border relative overflow-hidden cursor-pointer ${
                              !s.available
                                ? 'bg-slate-100 dark:bg-slate-800/30 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 line-through cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 scale-102 ring-2 ring-blue-500/20'
                                : 'bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-500/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {s.time}
                            {isSelected && (
                              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Client Personal Information */}
                <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Your Contact & Arrival Info
                    </h3>
                    <span className="text-[10px] text-slate-500">Step 2 of 2</span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alexander Vance"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Email Address (For Calendar Invite) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="alexander@example.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Phone Number (SMS Directions)
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+1 (555) 019-2834"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Notes or Special Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Parking inquiries, questions regarding building amenities, or meeting specifics..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Submit Confirmation Button */}
                <button
                  type="submit"
                  disabled={bookingSubmitting || !selectedSlot}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  {bookingSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Reserving Appointment in Calendar...</span>
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
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Powered by <strong>ViewFlow CRM</strong> • Direct Agent Reservation Calendar</span>
          <span className="text-[11px] text-slate-400">Guaranteed Protection • SSL Secured Booking</span>
        </div>
      </footer>
    </div>
  );
}

export default function PublicBookingPage() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
