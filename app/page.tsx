'use client';

import React, { useState, useEffect } from 'react';
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
    <div className="flex min-h-screen font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 w-full min-w-0 overflow-y-auto">
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
