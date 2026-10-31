import apiClient from '../../api/apiClient';

const BASE_URL = '/checkin';

export const fetchCheckins = async () => {
  const response = await apiClient.get(BASE_URL + '/');
  return Array.isArray(response.data) ? response.data : [];
};

export const fetchToday = async () => {
  const response = await apiClient.get(BASE_URL + '/today');
  return response.data;
};

export const fetchCheckinStats = async () => {
  const response = await apiClient.get(BASE_URL + '/stats');
  return response.data && response.data.data
    ? response.data.data
    : response.data;
};

export const createCheckin = async (entry) => {
  const response = await apiClient.post(BASE_URL + '/', entry);
  return response.data;
};

export const fetchStreak = async () => {
  const response = await apiClient.get(BASE_URL + '/streak');
  return response.data;
};

export const fetchCheckinById = async (id) => {
  const response = await apiClient.get(BASE_URL + '/by-id/' + id);
  return response.data;
};

export const updateCheckin = async (id, payload) => {
  const response = await apiClient.put(BASE_URL + '/' + id, payload);
  return response.data;
};

export const deleteCheckin = async (id) => {
  const response = await apiClient.delete(BASE_URL + '/' + id);
  return response.data;
};

export const fetchCheckinHistory = async (range = 7) => {
  const response = await apiClient.get(BASE_URL + '/history', {
    params: { range },
  });
  return response.data && response.data.data ? response.data.data : [];
};

export const fetchCheckinsBetweenDates = async (_token, startDate, endDate) => {
  const response = await apiClient.get(BASE_URL + '/checkins', {
    params: {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    },
  });
  return response.data && response.data.data ? response.data.data : [];
};
