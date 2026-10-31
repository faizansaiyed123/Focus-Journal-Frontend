import apiClient from '../../api/apiClient';

const BASE_URL = '/journal';

export const fetchJournalById = async (entry) => {
  const response = await apiClient.get(BASE_URL + '/' + entry);
  return response.data;
};

export const fetchAllJournals = async () => {
  const response = await apiClient.get(BASE_URL + '/');
  return Array.isArray(response.data) ? response.data : [];
};

export const createJournal = async (entry) => {
  const response = await apiClient.post(BASE_URL + '/', entry);
  return response.data;
};

export const deleteJournal = async (id) => {
  const response = await apiClient.delete(BASE_URL + '/' + id);
  return response.data;
};

export const updateJournal = async (id, updatedData) => {
  const response = await apiClient.put(BASE_URL + '/' + id, updatedData);
  return response.data;
};

export const getStats = async () => {
  const response = await apiClient.get(BASE_URL + '/stats');
  return response.data;
};

export const fetchJournalStats = async () => {
  const response = await apiClient.get(BASE_URL + '/stats');
  return response.data && response.data.data
    ? response.data.data
    : response.data;
};

export const getSentiment = async () => {
  const response = await apiClient.get(BASE_URL + '/sentiment-analysis');
  return response.data;
};

export const fetchSentimentAnalysis = async () => {
  const response = await apiClient.get(BASE_URL + '/sentiment-analysis');
  const payload = response.data;
  return Array.isArray(payload) ? payload : (payload && payload.data) || [];
};

export const fetchWeeklySummary = async () => {
  const response = await apiClient.get(BASE_URL + '/summary/weekly');
  return response.data && response.data.data
    ? response.data.data
    : response.data;
};
