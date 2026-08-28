import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach stored token to every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ---- Auth ----
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: { id: number; email: string; name: string } }>('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ---- Brokers ----
export const brokersApi = {
  getAll: () => api.get('/brokers'),
  getById: (id: number) => api.get(`/brokers/${id}`),
  create: (data: object) => api.post('/brokers', data),
  update: (id: number, data: object) => api.put(`/brokers/${id}`, data),
  delete: (id: number) => api.delete(`/brokers/${id}`),
};

// ---- Forms ----
export const formsApi = {
  get: () => api.get('/forms'),
  create: (data: { name: string; slug: string }) => api.post('/forms', data),
};

// ---- Distributions ----
export const distributionsApi = {
  get: () => api.get('/distributions'),
  getById: (id: number) => api.get(`/distributions/${id}`),
  create: (data: object) => api.post('/distributions', data),
  updateBroker: (distributionId: number, brokerId: number, data: object) =>
    api.put(`/distributions/${distributionId}/brokers/${brokerId}`, data),
  addBroker: (distributionId: number, data: object) =>
    api.post(`/distributions/${distributionId}/brokers`, data),
  removeBroker: (distributionId: number, brokerId: number) =>
    api.delete(`/distributions/${distributionId}/brokers/${brokerId}`),
};

// ---- Leads ----
export const leadsApi = {
  getAll: (status?: string) => api.get('/leads', { params: status ? { status } : undefined }),
  getById: (id: number) => api.get(`/leads/${id}`),
  getStats: () => api.get('/leads/stats'),
  assign: (leadId: number, brokerId: number) => api.post(`/leads/${leadId}/assign`, { brokerId }),
};

// ---- Public ----
export const publicApi = {
  getForm: (slug: string) =>
    axios.get(`${API_BASE}/api/public/forms/${slug}`),
  submitLead: (slug: string, data: { name: string; email: string; phone: string }) =>
    axios.post(`${API_BASE}/api/public/forms/${slug}/submit`, data),
};

export default api;
