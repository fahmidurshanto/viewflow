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
    return request(`/leads/${leadId}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage })
    });
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
    return request('/viewings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
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
    return request('/viewings/public-book', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  updateViewingStatus: async (id: string, status: string, feedback?: any) => {
    return request(`/viewings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, feedback })
    });
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

  // Reset Demo Data
  resetDemoData: async () => {
    return request('/analytics/reset-demo', {
      method: 'POST'
    });
  }
};
