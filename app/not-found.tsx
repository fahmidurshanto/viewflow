'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, Home, Sun, Moon } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function NotFoundContent() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Dynamic Background Glows based on theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Theme Toggle Button at top right */}
      {mounted && (
        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle Theme"
          className="absolute top-6 right-6 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition-all cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </button>
      )}

      {/* Main 404 Card */}
      <div className="relative max-w-md w-full glass-card rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center border border-slate-200/80 dark:border-slate-800/80">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-inner">
          <Compass className="w-8 h-8 animate-[spin_10s_linear_infinite]" />
        </div>

        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tighter block mb-2">
          404
        </span>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
          Page or Property Not Found
        </h1>

        <p className="text-sm leading-relaxed mb-6 text-slate-600 dark:text-slate-400">
          The requested page or booking link could not be found, may have expired, or was removed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <ThemeProvider>
      <NotFoundContent />
    </ThemeProvider>
  );
}
