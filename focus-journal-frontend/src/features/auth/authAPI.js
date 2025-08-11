// src/features/auth/authAPI.js
import api from '../../services/api';

export const loginAPI = async (credentials) => {
  const response = await api.post('/auth/login', credentials, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};


export const registerAPI = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};
