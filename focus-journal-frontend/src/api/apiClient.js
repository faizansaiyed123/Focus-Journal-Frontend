import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:8000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add token automatically if using a token store
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or your auth store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
