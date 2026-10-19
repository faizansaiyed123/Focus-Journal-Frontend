import api from '../../services/api';

export async function loginAPI(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function registerAPI(data) {
  const response = await api.post('/auth/register', data);
  return response.data;
}

export async function exchangeOAuthCode(code) {
  const response = await api.post('/auth/exchange', { code });
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data;
}
