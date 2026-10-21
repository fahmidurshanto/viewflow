const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Standard fetch wrapper that automatically sends credentials (HttpOnly cookies)
 * and optional Bearer token fallback.
 */
const request = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include', // Sends & receives HttpOnly cookies automatically
    headers
  });

  return res.json();
};

export const api = {
  // Auth
  register: async (data: any) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  login: async (data: any) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  logout: async () => {
    return request('/auth/logout', {
      method: 'POST'
    });
  },
  getCurrentUser: async () => {
    return request('/auth/me');
  },
  updateSubscription: async (data: { plan: string; billingCycle: string }) => {
    return request('/auth/subscription', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Media Upload
  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    return res.json();
  },

  // Analytics
  getAnalytics: async () => {
    return request('/analytics');
  },

  // Properties
  getProperties: async (params?: { status?: string; type?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/properties?${query}`);
  },
  getProperty: async (id: string) => {
    return request(`/properties/${id}`);
  },
  createProperty: async (data: any) => {
    return request('/properties', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateProperty: async (id: string, data: any) => {
    return request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  deleteProperty: async (id: string) => {
    return request(`/properties/${id}`, {
      method: 'DELETE'
    });
  },

  // Leads
  getLeads: async (params?: { stage?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/leads?${query}`);
  },
  updateLeadStage: async (leadId: string, stage: string) => {
    const res = await request(`/leads/${leadId}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage })
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('viewflow:activity-updated'));
    }
    return res;
  },
  getLeadDetails: async (leadId: string) => {
    return request(`/leads/${leadId}`);
  },
  addLeadActivity: async (leadId: string, data: { type: string; note: string; author?: string }) => {
    return request(`/leads/${leadId}/activity`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  createLead: async (data: any) => {
    return request('/leads', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Viewings
  getViewings: async (params?: { status?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/viewings?${query}`);
  },
  getViewingAvailability: async (propertyId: string, date: string) => {
    return request(`/viewings/availability?propertyId=${encodeURIComponent(propertyId)}&date=${encodeURIComponent(date)}`);
  },
  createViewing: async (data: { property: string; lead: string; scheduledDate: string; durationMinutes?: number }) => {
    const res = await request('/viewings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('viewflow:activity-updated'));
    }
    return res;
  },
  publicBookViewing: async (data: {
    propertyId: string;
    name: string;
    email: string;
    phone?: string;
    scheduledDate: string;
    durationMinutes?: number;
    notes?: string;
  }) => {
    const res = await request('/viewings/public-book', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('viewflow:activity-updated'));
    }
    return res;
  },
  bookViewingPublic: async (data: {
    propertyId: string;
    clientName?: string;
    name?: string;
    clientEmail?: string;
    email?: string;
    clientPhone?: string;
    phone?: string;
    date?: string;
    time?: string;
    scheduledDate?: string;
    duration?: number;
    durationMinutes?: number;
    notes?: string;
  }) => {
    let scheduledDate = data.scheduledDate;
    if (!scheduledDate && data.date && data.time) {
      const [time, period] = data.time.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      const d = new Date(`${data.date}T00:00:00.000Z`);
      d.setUTCHours(hours, minutes, 0, 0);
      scheduledDate = d.toISOString();
    }

    const res = await request('/viewings/public-book', {
      method: 'POST',
      body: JSON.stringify({
        propertyId: data.propertyId,
        name: data.clientName || data.name,
        email: data.clientEmail || data.email,
        phone: data.clientPhone || data.phone || '',
        scheduledDate,
        durationMinutes: data.duration || data.durationMinutes || 45,
        notes: data.notes || ''
      })
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('viewflow:activity-updated'));
    }
    return res;
  },
  updateViewingStatus: async (id: string, status: string, feedback?: any, autoAdvanceLead?: boolean) => {
    const res = await request(`/viewings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, feedback, autoAdvanceLead })
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('viewflow:activity-updated'));
    }
    return res;
  },

  // Tasks
  getTasks: async (params?: { status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/tasks?${query}`);
  },
  updateTask: async (id: string, data: any) => {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  createTask: async (data: any) => {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Settings & Integrations
  getSettings: async () => {
    return request('/settings');
  },
  updateSettings: async (data: any) => {
    return request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  testEmail: async (toEmail?: string) => {
    return request('/settings/test-email', {
      method: 'POST',
      body: JSON.stringify({ toEmail })
    });
  },
  testWhatsApp: async (toPhone?: string) => {
    return request('/settings/test-whatsapp', {
      method: 'POST',
      body: JSON.stringify({ toPhone })
    });
  },

  // Activities & Notifications
  getActivities: async (params?: { limit?: number; unreadOnly?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/activities?${query}`);
  },
  markActivitiesRead: async (activityIds?: string[]) => {
    return request('/activities/mark-read', {
      method: 'PUT',
      body: JSON.stringify({ activityIds })
    });
  },
  createActivity: async (data: {
    lead?: string;
    property?: string;
    viewing?: string;
    type?: string;
    title?: string;
    note: string;
  }) => {
    return request('/activities', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Reset Demo Data
  resetDemoData: async () => {
    return request('/analytics/reset-demo', {
      method: 'POST'
    });
  }
};
