const API_BASE = import.meta.env.VITE_API_URL || 'https://uzeuro-api.shaxzod.workers.dev';

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
}

// Stats
export const getStats = () => request('/api/stats');

// Membership Applications
export const submitMembershipApplication = (data: Record<string, unknown>) =>
  request('/api/membership-apply', { method: 'POST', body: JSON.stringify(data) });
export const getApplications = (status?: string) =>
  request(`/api/applications${status ? `?status=${status}` : ''}`);
export const updateApplication = (id: number, status: string) =>
  request(`/api/applications/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const deleteApplication = (id: number) =>
  request(`/api/applications/${id}`, { method: 'DELETE' });

// Webinar Registrations
export const registerForWebinar = (data: Record<string, unknown>) =>
  request('/api/webinar-register', { method: 'POST', body: JSON.stringify(data) });
export const getRegistrations = (webinarId?: number) =>
  request(`/api/registrations${webinarId ? `?webinar_id=${webinarId}` : ''}`);
export const updateRegistration = (id: number, status: string) =>
  request(`/api/registrations/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const deleteRegistration = (id: number) =>
  request(`/api/registrations/${id}`, { method: 'DELETE' });

// Contact Messages
export const submitContact = (data: Record<string, unknown>) =>
  request('/api/contact', { method: 'POST', body: JSON.stringify(data) });
export const getMessages = (status?: string) =>
  request(`/api/messages${status ? `?status=${status}` : ''}`);
export const updateMessage = (id: number, status: string) =>
  request(`/api/messages/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
export const deleteMessage = (id: number) =>
  request(`/api/messages/${id}`, { method: 'DELETE' });

// Generic CRUD
function crudApi(base: string) {
  return {
    getAll: (status?: string, params?: Record<string, string>) => {
      const p = new URLSearchParams();
      if (status) p.set('status', status);
      if (params) Object.entries(params).forEach(([k, v]) => { if (v) p.set(k, v); });
      const qs = p.toString();
      return request(`${base}${qs ? `?${qs}` : ''}`);
    },
    getById: (id: number) => request(`${base}/${id}`),
    create: (data: Record<string, unknown>) => request(base, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Record<string, unknown>) => request(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => request(`${base}/${id}`, { method: 'DELETE' }),
  };
}

export const eventsApi = crudApi('/api/events');
export const registerForEvent = (data: { eventId: number; name: string; email: string; phone?: string; citizenship?: string; telegram?: string }) =>
  request('/api/event-register', { method: 'POST', body: JSON.stringify(data) });
export const webinarsApi = crudApi('/api/webinars');
export const publicationsApi = crudApi('/api/publications');
export const newsApi = crudApi('/api/news');

// File upload
export const uploadFile = async (file: File): Promise<{ url: string; fileName: string }> => {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return request('/api/upload-file', {
    method: 'POST',
    body: JSON.stringify({ data: base64, fileName: file.name, mimeType: file.type }),
  });
};

// Download counter
export const incrementDownload = (id: number) =>
  request(`/api/publications/${id}/download`, { method: 'POST' });

// Settings
export const getSettings = () => request('/api/settings');
export const updateSettings = (data: Record<string, string>) =>
  request('/api/settings', { method: 'PUT', body: JSON.stringify(data) });
