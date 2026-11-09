'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Sun, Moon } from 'lucide-react';
import { DocsView } from '@/components/DocsView';
import { useTheme } from '@/context/ThemeContext';

export default function DocsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen selection:bg-blue-600 selection:text-white transition-colors duration-200 flex flex-col">
      {/* Top Header */}
      <header className="glass-panel sticky top-0 z-40 px-4 sm:px-6 py-3 sm:py-4 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl glass-card text-slate-400 hover:text-slate-100 transition-colors border shadow-sm flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
                  ViewFlow
                </h1>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Documentation & Guides</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl glass-card text-slate-400 hover:text-slate-100 transition-colors cursor-pointer border shadow-sm"
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <DocsView />
      </main>
    </div>
  );
}

