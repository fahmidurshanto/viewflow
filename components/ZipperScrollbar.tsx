'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ZipperScrollbarProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export const ZipperScrollbar: React.FC<ZipperScrollbarProps> = ({ containerRef, className = '' }) => {
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 1
  const [thumbRatio, setThumbRatio] = useState(0.25); // thumb width ratio
  const [isScrollable, setIsScrollable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Sync state with container scroll
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 4) {
      setIsScrollable(false);
      setScrollProgress(0);
      return;
    }
    setIsScrollable(true);
    const ratio = Math.max(0.12, Math.min(0.5, el.clientWidth / el.scrollWidth));
    setThumbRatio(ratio);

    const progress = Math.min(1, Math.max(0, el.scrollLeft / maxScroll));
    setScrollProgress(progress);
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    handleScroll();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    const ro = new ResizeObserver(() => handleScroll());
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      ro.disconnect();
    };
  }, [containerRef, handleScroll]);

  const updateScrollFromPointer = (clientX: number) => {
    const track = trackRef.current;
    const el = containerRef.current;
    if (!track || !el) return;

    const rect = track.getBoundingClientRect();
    const trackWidth = rect.width;
    const thumbWidth = trackWidth * thumbRatio;
    const travelDistance = trackWidth - thumbWidth;

    if (travelDistance <= 0) return;

    // Center thumb on pointer position
    const clickX = clientX - rect.left - thumbWidth / 2;
    const percentage = Math.min(1, Math.max(0, clickX / travelDistance));

    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = percentage * maxScroll;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateScrollFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateScrollFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // safe fallback
    }
  };

  const scrollByDelta = (direction: -1 | 1) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  if (!isScrollable) return null;

  return (
    <div className={`w-full select-none pt-2 pb-1 px-1 transition-all ${className}`}>
      <div className="flex items-center gap-2">
        {/* Left Quick Step Button */}
        <button
          type="button"
          onClick={() => scrollByDelta(-1)}
          disabled={scrollProgress <= 0.01}
          aria-label="Scroll left"
          className="shrink-0 w-6 h-6 rounded-lg bg-slate-200/60 hover:bg-slate-300/80 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center transition-all border border-slate-300/50 dark:border-slate-700/50 shadow-xs backdrop-blur-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Minimalist Modern Slider Track */}
        <div 
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="group relative flex-1 h-6 flex items-center cursor-pointer"
        >
          {/* Subtle Track Bar (Transparent/Adaptive, No Solid Black) */}
          <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-300/50 dark:bg-slate-700/40 border border-slate-300/40 dark:border-slate-700/40 overflow-hidden">
            {/* Active Highlight Fill up to current position */}
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-75"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Ergonomic Smooth Pill Thumb (No heavy illustrations) */}
          <div 
            className="absolute z-10 transition-all duration-75 pointer-events-none"
            style={{ 
              left: `calc(${scrollProgress * 100}% - ${scrollProgress * thumbRatio * 100}%)`,
              width: `${thumbRatio * 100}%`
            }}
          >
            <div 
              className={`h-3 min-w-[48px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 border border-blue-400 shadow-sm shadow-blue-500/20 flex items-center justify-center transition-all ${
                isDragging 
                  ? 'h-3.5 scale-y-110 shadow-md shadow-blue-500/40 ring-2 ring-blue-400/40' 
                  : 'group-hover:h-3.5 group-hover:brightness-110'
              }`}
            >
              {/* Subtle Pill Center Grip Lines */}
              <div className="flex gap-1 items-center opacity-70">
                <span className="w-0.5 h-1.5 rounded-full bg-white/90" />
                <span className="w-0.5 h-1.5 rounded-full bg-white/90" />
                <span className="w-0.5 h-1.5 rounded-full bg-white/90" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Quick Step Button */}
        <button
          type="button"
          onClick={() => scrollByDelta(1)}
          disabled={scrollProgress >= 0.99}
          aria-label="Scroll right"
          className="shrink-0 w-6 h-6 rounded-lg bg-slate-200/60 hover:bg-slate-300/80 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center transition-all border border-slate-300/50 dark:border-slate-700/50 shadow-xs backdrop-blur-xs"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
