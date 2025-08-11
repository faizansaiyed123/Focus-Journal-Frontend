import apiClient from '../../api/apiClient';
const BASE_URL = `${import.meta.env.VITE_API_URL}/checkin/journal`;


export const generalAiInsights = async (token) => {
  const res = await apiClient.get(`${BASE_URL}/insights`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data
}

export const searchJournals = async (token, keyword) => {
  const res = await apiClient.get(`/checkin/journal/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { keyword },
  });
  return res.data.data;
};


export const fetchJournalCalendar = async (token) => {
  const res = await apiClient.get(`${BASE_URL}/calendar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};





export const fetchJournalTags = async (token) => {
  const res = await apiClient.get(`${BASE_URL}/tags`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};
