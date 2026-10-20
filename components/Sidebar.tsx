'use client';

import { 
  Building2, 
  CalendarDays, 
  Users2, 
  CheckSquare2, 
  BarChart3, 
  Compass, 
  Settings, 
  Sun,
  Moon,
  Sparkles,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme,
  onOpenAuth
}) => {
  const { user, logout } = useAuth();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'pipeline', label: 'Lead Pipeline', icon: Users2 },
    { id: 'calendar', label: 'Viewing Calendar', icon: CalendarDays },
    { id: 'tasks', label: 'Tasks & Follow-ups', icon: CheckSquare2 },
    { id: 'settings', label: 'Settings & Integrations', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 transition-colors">
      <div>
        {/* Brand */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              <Compass className="w-6 h-6" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
                ViewFlow
              </h1>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Real Estate CRM</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={isActive ? { color: '#ffffff', backgroundColor: '#2563eb' } : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'shadow-md shadow-blue-600/30 active-nav-tab'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon 
                  className="w-4 h-4 shrink-0" 
                  style={{ color: isActive ? '#ffffff' : undefined }}
                />
                <span 
                  className={isActive ? 'text-white font-bold' : ''}
                  style={{ color: isActive ? '#ffffff' : undefined }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pro Badge, Theme Toggle & User Footer */}
      <div className="p-4 space-y-3">
        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all text-xs font-semibold text-slate-300 cursor-pointer shadow-sm"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-600/20 text-blue-400 font-bold">
            Toggle
          </span>
        </button>

        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/70 to-blue-950/40 border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Vibe96 Ready Edition
          </div>
          <p className="text-[12px] text-slate-400 leading-snug">
            Automated calendar reminders & smart lead tracking.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800/70">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left overflow-hidden flex-1">
                  <div className="text-xs font-semibold text-slate-200 truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.agencyName || user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 px-1">
                <button
                  onClick={onOpenAuth}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Switch</span>
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    window.location.reload();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/20 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-1 space-y-2">
              <div className="text-[11px] text-slate-400 text-center">
                Operating in Demo Mode
              </div>
              <button
                onClick={onOpenAuth}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Agent Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
