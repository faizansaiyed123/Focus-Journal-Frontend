import apiClient from '../../api/apiClient';

const BASE_URL = '/checkin/journal';

export const generalAiInsights = async () => {
  const response = await apiClient.get(BASE_URL + '/insights');
  return response.data && response.data.data ? response.data.data : response.data;
};

export const searchJournals = async (_token, keyword) => {
  const response = await apiClient.get(BASE_URL + '/search', { params: { keyword } });
  return response.data && response.data.data ? response.data.data : [];
};

export const fetchJournalCalendar = async () => {
  const response = await apiClient.get(BASE_URL + '/calendar');
  return response.data && response.data.data ? response.data.data : [];
};

export const fetchJournalTags = async () => {
  const response = await apiClient.get(BASE_URL + '/tags');
  const data = response.data && response.data.data ? response.data.data : [];
  return Array.isArray(data) ? data : data.top_tags || [];
};
