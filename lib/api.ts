const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  // Analytics
  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/analytics`);
    return res.json();
  },

  // Properties
  getProperties: async (params?: { status?: string; type?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${API_BASE}/properties?${query}`);
    return res.json();
  },
  createProperty: async (data: any) => {
    const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Leads
  getLeads: async (params?: { stage?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${API_BASE}/leads?${query}`);
    return res.json();
  },
  updateLeadStage: async (leadId: string, stage: string) => {
    const res = await fetch(`${API_BASE}/leads/${leadId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
    return res.json();
  },
  getLeadDetails: async (leadId: string) => {
    const res = await fetch(`${API_BASE}/leads/${leadId}`);
    return res.json();
  },
  addLeadActivity: async (leadId: string, data: { type: string; note: string; author?: string }) => {
    const res = await fetch(`${API_BASE}/leads/${leadId}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  createLead: async (data: any) => {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Viewings
  getViewings: async (params?: { status?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${API_BASE}/viewings?${query}`);
    return res.json();
  },
  createViewing: async (data: { property: string; lead: string; scheduledDate: string; durationMinutes?: number }) => {
    const res = await fetch(`${API_BASE}/viewings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateViewingStatus: async (id: string, status: string, feedback?: any) => {
    const res = await fetch(`${API_BASE}/viewings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, feedback }),
    });
    return res.json();
  },

  // Tasks
  getTasks: async (params?: { status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${API_BASE}/tasks?${query}`);
    return res.json();
  },
  updateTask: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  createTask: async (data: any) => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
