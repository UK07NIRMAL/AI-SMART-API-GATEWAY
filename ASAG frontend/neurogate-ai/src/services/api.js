/**
 * services/api.js
 *
 * Centralised API service layer for NeuroGate AI.
 * All communication with the FastAPI backend goes through this file.
 *
 * Base URL is read from the VITE_API_BASE_URL env variable (see .env.example).
 * Axios instance automatically attaches the JWT token stored in localStorage.
 */

import axios from "axios";

// ─── Axios Instance ────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_VERSION = "";

const api = axios.create({
  baseURL: `${BASE_URL}${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 s
});

// ─── Request Interceptor — attach Bearer token ──────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ng_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor — handle 401 globally ────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem("ng_access_token");
      localStorage.removeItem("ng_user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

// ─── Auth ───────────────────────────────────────────────────────────────────

export const authService = {
  /**
   * POST /auth/login
   * @param {{ email: string, password: string }} credentials
   * @returns {{ access_token: string, token_type: string, user: object }}
   */
  login: (credentials) => api.post("/auth/login", credentials),

  /**
   * POST /auth/register
   * @param {{ email: string, password: string, name: string }} data
   */
  register: (data) => api.post("/auth/signup", data),

  /**
   * POST /auth/logout  (invalidates token on server)
   */
  logout: () => api.post("/auth/logout"),

  /**
   * POST /auth/refresh  (get a new access token)
   */
  refresh: () => api.post("/auth/refresh"),

  /**
   * POST /auth/github   (OAuth callback — exchange code for token)
   */
  githubOAuth: (code) => api.post("/auth/github", { code }),

  /**
   * POST /auth/google
   */
  googleOAuth: (token) => api.post("/auth/google", { token }),
};

// ─── Dashboard / Analytics ──────────────────────────────────────────────────

export const dashboardService = {
  /**
   * GET /dashboard/stats
   * Returns: { total_requests, success_rate, avg_latency_ms, active_keys_count }
   */
  getStats: () => api.get("/dashboard/stats"),

  /**
   * GET /dashboard/recent-operations
   * Returns: [{ event, model, timestamp_ms, latency_ms }]
   */
  getRecentOperations: () => api.get("/dashboard/recent-operations"),
};

// ─── API Key Management ─────────────────────────────────────────────────────

export const apiKeyService = {
  /**
   * GET /keys
   * Returns: [{ id, name, key_prefix, environment, created_at, last_used_at, is_active }]
   */
  listKeys: () => api.get("/keys"),

  /**
   * POST /keys
   * @param {{ name: string, environment: 'production'|'sandbox', scopes: string[] }} data
   */
  createKey: (data) => api.post("/keys", data),

  /**
   * POST /keys/:id/rotate
   */
  rotateKey: (id) => api.post(`/keys/${id}/rotate`),

  /**
   * DELETE /keys/:id
   */
  deleteKey: (id) => api.delete(`/keys/${id}`),

  /**
   * PATCH /keys/:id
   */
  updateKey: (id, data) => api.patch(`/keys/${id}`, data),
};

// ─── Activity Logs ───────────────────────────────────────────────────────────

export const logsService = {
  /**
   * GET /logs
   * @param {{ page, limit, method, status, search }} params
   * Returns: { items: [...], total, page, limit }
   */
  getLogs: (params = {}) => api.get("/logs", { params }),

  /**
   * GET /logs/:id
   */
  getLogDetail: (id) => api.get(`/logs/${id}`),

  /**
   * GET /logs/export  (returns CSV blob)
   */
  exportLogs: (params = {}) =>
    api.get("/logs/export", { params, responseType: "blob" }),
};

// ─── API Playground ──────────────────────────────────────────────────────────

export const playgroundService = {
  /**
   * POST /playground/execute
   * Proxies an arbitrary API request through the backend for CORS safety.
   * @param {{ method, url, headers, body }} request
   */
  execute: (request) => api.post("/playground/execute", request),

  /**
   * GET /playground/history
   * Returns last N requests made in the playground.
   */
  getHistory: () => api.get("/playground/history"),
};

// ─── Admin Panel ─────────────────────────────────────────────────────────────

export const adminService = {
  /**
   * GET /admin/users
   */
  listUsers: (params = {}) => api.get("/admin/users", { params }),

  /**
   * GET /admin/users/:id
   */
  getUser: (id) => api.get(`/admin/users/${id}`),

  /**
   * PATCH /admin/users/:id
   */
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),

  /**
   * DELETE /admin/users/:id
   */
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  /**
   * GET /admin/system/health
   */
  getSystemHealth: () => api.get("/admin/system/health"),

  /**
   * GET /admin/models
   */
  listModels: () => api.get("/admin/models"),

  /**
   * PATCH /admin/models/:id
   */
  updateModel: (id, data) => api.patch(`/admin/models/${id}`, data),
};

// ─── Support ─────────────────────────────────────────────────────────────────

export const supportService = {
  /**
   * GET /support/tickets
   */
  listTickets: () => api.get("/support/tickets"),

  /**
   * POST /support/tickets
   * @param {{ subject: string, category: string, priority: string, description: string }} data
   */
  createTicket: (data) => api.post("/support/tickets", data),

  /**
   * GET /support/tickets/:id
   */
  getTicket: (id) => api.get(`/support/tickets/${id}`),

  /**
   * POST /support/tickets/:id/messages
   */
  sendMessage: (id, message) =>
    api.post(`/support/tickets/${id}/messages`, { message }),
};

export default api;
