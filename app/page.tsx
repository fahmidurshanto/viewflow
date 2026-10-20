'use client';

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  Compass, 
  BarChart3, 
  Building2, 
  Users2, 
  CalendarDays, 
  CheckSquare2, 
  Settings 
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardView } from '@/components/DashboardView';
import { PropertiesView } from '@/components/PropertiesView';
import { PipelineView } from '@/components/PipelineView';
import { CalendarView } from '@/components/CalendarView';
import { TasksView } from '@/components/TasksView';
import { SettingsView } from '@/components/SettingsView';
import { AuthModal } from '@/components/AuthModal';
import { LandingView } from '@/components/LandingView';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Property, Lead, Viewing, Task, DashboardMetrics } from '@/types';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const { user, loading: authLoading } = useAuth();

  // App Global State
  const [analytics, setAnalytics] = useState<DashboardMetrics | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, propertiesData, leadsData, viewingsData, tasksData] = await Promise.allSettled([
        api.getAnalytics(),
        api.getProperties(),
        api.getLeads(),
        api.getViewings(),
        api.getTasks()
      ]);

      if (analyticsData.status === 'fulfilled' && !analyticsData.value.error) {
        setAnalytics(analyticsData.value);
      }
      if (propertiesData.status === 'fulfilled' && Array.isArray(propertiesData.value)) {
        setProperties(propertiesData.value);
      }
      if (leadsData.status === 'fulfilled' && Array.isArray(leadsData.value)) {
        setLeads(leadsData.value);
      }
      if (viewingsData.status === 'fulfilled' && Array.isArray(viewingsData.value)) {
        setViewings(viewingsData.value);
      }
      if (tasksData.status === 'fulfilled' && Array.isArray(tasksData.value)) {
        setTasks(tasksData.value);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Loading Session Gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Strictly protected: show Landing/Sign In page if unauthenticated
  if (!user) {
    return <LandingView onLoginSuccess={() => fetchData()} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Mobile Top Header (Visible only on small screens) */}
      <header className="md:hidden glass-panel sticky top-0 z-40 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="p-2 -ml-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block capitalize leading-none">
                {activeTab === 'dashboard' ? 'Overview' : activeTab}
              </span>
              <span className="text-[10px] text-blue-400 font-medium">ViewFlow CRM</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>
          {user && (
            <div 
              onClick={() => setActiveTab('settings')}
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-[10px] text-white cursor-pointer shadow-sm"
              title={user.name}
            >
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {/* Navigation Sidebar (Desktop sticky & Mobile off-canvas drawer) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAuth={() => setShowAuthModal(true)}
        isOpenMobile={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 w-full min-w-0 overflow-y-auto">
        {loading && !analytics && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        )}

        {(!loading || analytics) && (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView data={analytics} onNavigateTab={setActiveTab} />
            )}

            {activeTab === 'properties' && (
              <PropertiesView
                properties={properties}
                onRefresh={fetchData}
                api={api}
              />
            )}

            {activeTab === 'pipeline' && (
              <PipelineView
                leads={leads}
                onRefresh={fetchData}
                api={api}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarView
                viewings={viewings}
                properties={properties}
                leads={leads}
                onRefresh={fetchData}
                api={api}
              />
            )}

            {activeTab === 'tasks' && (
              <TasksView
                tasks={tasks}
                onRefresh={fetchData}
                api={api}
              />
            )}

            {activeTab === 'settings' && <SettingsView />}
          </>
        )}
      </main>

      {/* Mobile Bottom Quick-Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-1 flex items-center justify-around shadow-2xl backdrop-blur-xl">
        {[
          { id: 'dashboard', label: 'Home', icon: BarChart3 },
          { id: 'properties', label: 'Properties', icon: Building2 },
          { id: 'pipeline', label: 'Pipeline', icon: Users2 },
          { id: 'calendar', label: 'Calendar', icon: CalendarDays },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare2 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-blue-500 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sign In & Agency Registration Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => fetchData()}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
