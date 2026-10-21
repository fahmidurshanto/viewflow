'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CalendarCheck,
  UserPlus,
  ArrowRightCircle,
  CheckCheck,
  MessageSquare,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ActivityLog } from '@/types';
import { api } from '@/lib/api';

interface NotificationBellProps {
  onNavigateTab: (tab: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.getActivities({ limit: 15 });
      if (res && Array.isArray(res.activities)) {
        setActivities(res.activities);
        // Calculate unread count reliably: prefer server unreadCount, fallback to counting activities with isRead !== true
        const localUnread = res.activities.filter((a: any) => a.isRead !== true).length;
        setUnreadCount(typeof res.unreadCount === 'number' ? res.unreadCount : localUnread);
      }
    } catch (err) {
      console.error('Failed to load activities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    
    // Listen for instant local activity updates (e.g. stage changed, viewing booked, etc.)
    const handleActivityUpdate = () => {
      fetchActivities();
    };
    window.addEventListener('viewflow:activity-updated', handleActivityUpdate);

    // Poll every 30 seconds for live background updates
    const interval = setInterval(fetchActivities, 30000);
    return () => {
      window.removeEventListener('viewflow:activity-updated', handleActivityUpdate);
      clearInterval(interval);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await api.markActivitiesRead();
      setUnreadCount(0);
      setActivities(prev => prev.map(a => ({ ...a, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const handleItemClick = async (act: ActivityLog) => {
    // If not read yet, mark it read on server and update local state
    if (!act.isRead) {
      try {
        api.markActivitiesRead([act._id]);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setActivities(prev =>
          prev.map(item => (item._id === act._id ? { ...item, isRead: true } : item))
        );
      } catch (err) {
        console.error('Failed to mark single notification as read', err);
      }
    }

    setIsOpen(false);
    if (act.type.includes('Viewing')) onNavigateTab('calendar');
    else if (act.type.includes('Stage')) onNavigateTab('pipeline');
    else onNavigateTab('dashboard');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Viewing Booked':
        return <CalendarCheck className="w-4 h-4 text-emerald-400" />;
      case 'Stage Changed':
        return <ArrowRightCircle className="w-4 h-4 text-blue-400" />;
      case 'Viewing Completed':
        return <CheckCheck className="w-4 h-4 text-teal-400" />;
      case 'Reminder Sent':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <UserPlus className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="relative p-2 rounded-xl text-slate-400 dark:text-slate-300 hover:text-white hover:bg-slate-800/80 dark:hover:bg-slate-800/80 transition-all cursor-pointer focus:outline-none notification-bell-btn group"
        title="View Notifications"
      >
        <Bell className="w-5 h-5 text-slate-500 dark:text-slate-300 group-hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[18px] px-1 items-center justify-center rounded-full text-[10px] font-black text-white bg-blue-600 animate-pulse ring-2 ring-slate-900 shadow-lg shadow-blue-500/50">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel shadow-2xl border border-slate-700/80 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 px-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Notifications</span>
              {unreadCount > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-400 font-bold border border-blue-500/30">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                  All read
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMarkAllRead();
                }}
                className="text-xs font-semibold text-blue-400 hover:text-white transition-colors cursor-pointer py-0.5 px-2 rounded-lg hover:bg-slate-800/60"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Activity List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
            {loading && activities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading notifications...</div>
            ) : activities.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Sparkles className="w-6 h-6 text-slate-500" />
                <span>All caught up! No recent activity.</span>
              </div>
            ) : (
              activities.map((act) => (
                <div
                  key={act._id}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleItemClick(act);
                  }}
                  className={`p-3.5 px-4 hover:bg-slate-800/40 transition-colors cursor-pointer flex gap-3 items-start relative group/item ${
                    !act.isRead ? 'bg-blue-600/10' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0 mt-0.5">
                    {getActivityIcon(act.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        {!act.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 animate-ping" />
                        )}
                        <p className={`text-xs truncate ${!act.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                          {act.title || act.type}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-[11px] line-clamp-2 leading-relaxed ${!act.isRead ? 'text-slate-200' : 'text-slate-400'}`}>
                      {act.note}
                    </p>
                    {act.lead && (
                      <span className="inline-block mt-1 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-medium">
                        Lead: {act.lead.name}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-900/60 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onNavigateTab('pipeline');
                // Auto scroll to pipeline kanban
                const board = document.querySelector('.pipeline-container');
                if (board) board.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-blue-400 hover:text-white flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <span>View Full Pipeline Activity</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
