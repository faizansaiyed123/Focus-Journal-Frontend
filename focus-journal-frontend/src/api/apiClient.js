import axios from 'axios';

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'https://focus-journal-backend.onrender.com'
).replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  const directToken = window.localStorage.getItem('token');
  if (directToken) return directToken;

  try {
    const persisted = JSON.parse(
      window.localStorage.getItem('auth-storage') || 'null',
    );
    return persisted && persisted.state ? persisted.state.token : null;
  } catch {
    return null;
  }
}

function isPublicAuthRequest(url = '') {
  return /^\/auth\/(login|register|exchange)(\/|$)/.test(url);
}

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (
    token &&
    !config.headers.Authorization &&
    !isPublicAuthRequest(config.url || '')
  ) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response && error.response.status;
    const url = error.config && error.config.url ? error.config.url : '';

    if (
      status === 401 &&
      !isPublicAuthRequest(url) &&
      typeof window !== 'undefined' &&
      !['/login', '/register', '/auth/callback'].includes(
        window.location.pathname,
      )
    ) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('auth-storage');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
