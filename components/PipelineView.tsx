'use client';

import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Phone, 
  Mail, 
  DollarSign, 
  Building, 
  History,
  X,
  Search,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  MapPin,
  ExternalLink,
  Send,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead } from '@/types';
import { ZipperScrollbar } from './ZipperScrollbar';

interface PipelineViewProps {
  leads: Lead[];
  onRefresh: () => void;
  api: any;
}

const STAGES = [
  { 
    id: 'Enquiry', 
    label: 'New Enquiries', 
    accent: '#64748b',
    glowColor: 'rgba(100, 116, 139, 0.2)',
    badgeBg: 'bg-slate-500/10 text-slate-300 border-slate-500/20' 
  },
  { 
    id: 'Contacted', 
    label: 'Contacted', 
    accent: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.2)',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/20' 
  },
  { 
    id: 'Viewing', 
    label: 'Viewing Scheduled', 
    accent: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.2)',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20' 
  },
  { 
    id: 'Offer', 
    label: 'Offer Made', 
    accent: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.2)',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20' 
  },
  { 
    id: 'Closed', 
    label: 'Closed Deal 🎉', 
    accent: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
  },
];

export const PipelineView: React.FC<PipelineViewProps> = ({ leads, onRefresh, api }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadActivities, setLeadActivities] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('Call');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [activeDropStage, setActiveDropStage] = useState<string | null>(null);
  const [optimisticLeads, setOptimisticLeads] = useState<Lead[]>(leads);
  const boardScrollRef = useRef<HTMLDivElement | null>(null);

  // Sync optimistic leads when leads prop updates
  React.useEffect(() => {
    setOptimisticLeads(leads);
  }, [leads]);

  // Form State
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    budget: 500000,
    preferredLocation: '',
    notes: '',
    stage: 'Enquiry',
    source: 'Website'
  });

  // Pipeline Metrics
  const totalPipelineValue = optimisticLeads.reduce((acc, lead) => acc + (lead.budget || 0), 0);
  const filteredLeads = optimisticLeads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.phone.includes(searchQuery)
  );

  const handleStageMove = async (leadId: string, newStage: string) => {
    const previous = [...optimisticLeads];
    // Optimistic UI update
    setOptimisticLeads(prev =>
      prev.map(l => (l._id === leadId ? { ...l, stage: newStage as any } : l))
    );

    try {
      await api.updateLeadStage(leadId, newStage);
      toast.success(`Deal moved to "${newStage}" stage`);
      onRefresh();
    } catch (err: any) {
      // Revert on error
      setOptimisticLeads(previous);
      console.error(err);
      toast.error(err.message || 'Failed to update lead stage');
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setActiveDropStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropStage !== stageId) {
      setActiveDropStage(stageId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    // Only unset if leaving column container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (activeDropStage === stageId) {
      setActiveDropStage(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    setActiveDropStage(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      const targetLead = optimisticLeads.find(l => l._id === leadId);
      if (targetLead && targetLead.stage !== targetStage) {
        await handleStageMove(leadId, targetStage);
      }
    }
    setDraggedLeadId(null);
  };

  const handleOpenLead = async (lead: Lead) => {
    setSelectedLead(lead);
    try {
      const data = await api.getLeadDetails(lead._id);
      setLeadActivities(data.activities || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;
    try {
      await api.addLeadActivity(selectedLead._id, {
        type: noteType,
        note: newNote,
        author: 'Lead Agent'
      });
      setNewNote('');
      toast.success('Activity note logged!');
      const data = await api.getLeadDetails(selectedLead._id);
      setLeadActivities(data.activities || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to add activity note');
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createLead(newLeadForm);
      setShowAddLeadModal(false);
      setNewLeadForm({
        name: '',
        email: '',
        phone: '',
        budget: 500000,
        preferredLocation: '',
        notes: '',
        stage: 'Enquiry',
        source: 'Website'
      });
      toast.success('New lead created successfully!');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to create lead');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900/80 via-blue-950/30 to-indigo-950/40 border border-slate-800/80 backdrop-blur-xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Lead Pipeline</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Drag & Drop Ready
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">
            Interactive Kanban board. Drag deals between columns or click any prospect for full interaction logs.
          </p>
        </div>

        {/* Action Bar & Quick Value Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Pipeline Value</div>
              <div className="text-sm font-extrabold text-emerald-400">
                ${totalPipelineValue.toLocaleString()}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddLeadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Prospect
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-300">{filteredLeads.length}</span> active prospects
        </div>
      </div>

      {/* Enhanced Drag & Drop Kanban Board */}
      <div 
        ref={boardScrollRef}
        className="w-full overflow-x-auto pb-4 pt-1 scrollbar-none pipeline-container"
      >
        <div className="flex items-start gap-4 min-w-max">
        {STAGES.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.stage === col.id);
          const colValue = colLeads.reduce((sum, lead) => sum + (lead.budget || 0), 0);
          const isDropTarget = activeDropStage === col.id && draggedLeadId !== null;

          return (
            <div
              key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={(e) => handleDragLeave(e, col.id)}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`glass-panel p-4 rounded-2xl flex flex-col w-[290px] shrink-0 border transition-all duration-200 ${
                    isDropTarget
                      ? 'border-blue-500 shadow-xl shadow-blue-500/20 bg-blue-950/20 ring-2 ring-blue-500/40 scale-[1.01]'
                      : 'border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: col.accent, boxShadow: `0 0 8px ${col.glowColor}` }}
                      />
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                        {col.label}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 font-bold text-slate-300">
                      {colLeads.length}
                    </span>
                  </div>

                  {/* Sub-header: Column Total Value */}
                  <div className="text-[11px] text-slate-500 mb-3 px-1 flex justify-between items-center">
                    <span>Total Potential:</span>
                    <span className="font-semibold text-slate-300">${colValue.toLocaleString()}</span>
                  </div>

                  {/* Column Drop Zone / Cards List */}
                  <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-[180px]">
                    {colLeads.length === 0 ? (
                      <div className={`h-32 rounded-xl border border-dashed flex flex-col items-center justify-center gap-1.5 text-xs transition-colors ${
                        isDropTarget 
                          ? 'border-blue-400 bg-blue-500/10 text-blue-300 font-semibold animate-pulse' 
                          : 'border-slate-800/80 text-slate-500'
                      }`}>
                        <span>{isDropTarget ? 'Release to drop here' : 'Drop deals here'}</span>
                      </div>
                    ) : (
                      colLeads.map((lead) => {
                        const isBeingDragged = draggedLeadId === lead._id;
                        return (
                          <div
                            key={lead._id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead._id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleOpenLead(lead)}
                            className={`group p-4 rounded-xl bg-slate-900/80 border transition-all duration-200 cursor-grab active:cursor-grabbing space-y-3 relative overflow-hidden select-none ${
                              isBeingDragged
                                ? 'opacity-40 border-dashed border-blue-400 scale-95 shadow-none'
                                : 'border-slate-800/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10'
                            }`}
                          >
                            {/* Left accent bar */}
                            <div 
                              className="absolute left-0 top-0 bottom-0 w-1 opacity-80 group-hover:w-1.5 transition-all"
                              style={{ backgroundColor: col.accent }}
                            />

                            {/* Top row: Name & Source */}
                            <div className="flex items-start justify-between gap-2 pl-1">
                              <span className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                                {lead.name}
                              </span>
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 shrink-0">
                                {lead.source || 'Website'}
                              </span>
                            </div>

                            {/* Middle: Budget & Property */}
                            <div className="space-y-1.5 pl-1 text-xs">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="font-medium text-slate-200">
                                  ${lead.budget ? lead.budget.toLocaleString() : 'Undisclosed'}
                                </span>
                              </div>

                              {lead.interestedProperty && (
                                <div className="flex items-center gap-1.5 text-[11px] text-blue-400 line-clamp-1">
                                  <Building className="w-3 h-3 shrink-0 text-blue-400/80" />
                                  <span>{lead.interestedProperty.title}</span>
                                </div>
                              )}
                            </div>

                            {/* Footer: Quick Stage Select & Contact preview */}
                            <div 
                              className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs pl-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-[10px] text-slate-500">Stage:</span>
                              <select
                                value={lead.stage}
                                onChange={(e) => handleStageMove(lead._id, e.target.value)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 border border-slate-700 focus:outline-none cursor-pointer"
                              >
                                {STAGES.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
        })}
        </div>
      </div>

      {/* Interactive Zipper Scrollbar Controller */}
      <ZipperScrollbar containerRef={boardScrollRef} className="mt-1" />

      {/* Lead Details & History Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{selectedLead.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {selectedLead.source}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Lead ID: #{selectedLead._id.slice(-6)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Info Card */}
              <div className="py-4 space-y-2.5 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Budget: ${selectedLead.budget?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>

              {/* Interaction History Timeline */}
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-400" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">Interaction History</h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {leadActivities.length} Records
                  </span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {leadActivities.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-900/60 border border-slate-800">
                      No notes recorded yet. Log the first call or email below.
                    </div>
                  ) : (
                    leadActivities.map((act) => (
                      <div 
                        key={act._id} 
                        className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-semibold px-2 py-0.5 rounded ${
                            act.type === 'Call'
                              ? 'bg-blue-500/10 text-blue-400'
                              : act.type === 'Email'
                              ? 'bg-purple-500/10 text-purple-400'
                              : act.type === 'Stage Changed'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-slate-700/60 text-slate-300'
                          }`}>
                            {act.type}
                          </span>
                          <span className="text-slate-500">
                            {new Date(act.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{act.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Log Note / Activity Input */}
            <form onSubmit={handleAddNote} className="pt-4 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                {['Call', 'Email', 'Viewing Note', 'General'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNoteType(t)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      noteType === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Log details for ${noteType}...`}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Add New Prospect</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Michael Scott"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Budget ($)</label>
                  <input
                    type="number"
                    value={newLeadForm.budget}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, budget: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Source</label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Website">Website</option>
                    <option value="Portal">Portal</option>
                    <option value="Referral">Referral</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Direct Call">Direct Call</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
