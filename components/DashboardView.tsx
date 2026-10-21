'use client';

import React from 'react';
import { 
  Building2, 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  MapPin,
  Calendar
} from 'lucide-react';
import { DashboardMetrics } from '@/types';

interface DashboardViewProps {
  data: DashboardMetrics | null;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, onNavigateTab }) => {
  const metrics = data?.metrics || {
    totalProperties: 4,
    availableProperties: 2,
    soldProperties: 1,
    totalLeads: 4,
    totalViewings: 2,
    completedViewings: 0,
    conversionRate: 50,
  };

  const statCards = [
    {
      label: 'Active Properties',
      value: metrics.availableProperties,
      total: `${metrics.totalProperties} total`,
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      action: () => onNavigateTab('properties')
    },
    {
      label: 'Total Pipeline Leads',
      value: metrics.totalLeads,
      total: 'Active buyers & renters',
      icon: Users,
      color: 'from-violet-500 to-purple-500',
      action: () => onNavigateTab('pipeline')
    },
    {
      label: 'Scheduled Viewings',
      value: metrics.totalViewings,
      total: `${metrics.completedViewings} completed`,
      icon: CalendarCheck,
      color: 'from-emerald-500 to-teal-500',
      action: () => onNavigateTab('calendar')
    },
    {
      label: 'Lead Conversion Rate',
      value: `${metrics.conversionRate}%`,
      total: 'Enquiry to Offer / Sold',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-500',
      action: () => onNavigateTab('pipeline')
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/40 border border-blue-500/20 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Welcome back, Agent 👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            You have <span className="text-blue-400 font-semibold">{metrics.totalViewings} upcoming viewings</span> and <span className="text-amber-400 font-semibold">{data?.pendingTasks?.length || 3} tasks</span> requiring action today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('calendar')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Viewing
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              className="glass-card p-5 rounded-2xl cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white force-white stat-icon-badge shadow-md`}>
                  <Icon className="w-4 h-4 text-white force-white" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight mb-1 group-hover:text-blue-400 transition-colors">
                  {card.value}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{card.total}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Upcoming Viewings & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Viewings (2 Cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Upcoming Viewings</h3>
            </div>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Open Calendar →
            </button>
          </div>

          <div className="space-y-3.5">
            {(!data?.upcomingViewings || data.upcomingViewings.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No viewings scheduled for today. Book your next tour!
              </div>
            ) : (
              data.upcomingViewings.map((viewing) => (
                <div
                  key={viewing._id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                      {viewing.property?.title || 'Luxury Property'}
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {viewing.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {viewing.property?.address?.city || 'City Location'}
                      </span>
                      <span>•</span>
                      <span>Client: <strong className="text-slate-300">{viewing.lead?.name || 'Prospect'}</strong></span>
                    </div>
                  </div>
                  <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                    <div className="text-xs font-semibold text-blue-400">
                      {new Date(viewing.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(viewing.scheduledDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actionable Follow-up Tasks */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white">Action Reminders</h3>
              </div>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {(!data?.pendingTasks || data.pendingTasks.length === 0) ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  All tasks are up to date!
                </div>
              ) : (
                data.pendingTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-slate-200">
                        {task.title}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        task.priority === 'High' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className="text-blue-400 font-medium cursor-pointer hover:underline">
                        Done
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              💡 Automated email/SMS sent 2 hrs before viewing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
