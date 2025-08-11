import apiClient from '../../api/apiClient';
const BASE_URL = `${import.meta.env.VITE_API_URL}/journal`;

export const fetchJournalById = async (entry, token) => {
  const res = await apiClient.get(`${BASE_URL}/${entry}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchAllJournals = async (token) => {
  const res = await apiClient.get(`${BASE_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Changed from GET to POST for creating a journal
export const createJournal = async (entry, token) => {
  const res = await apiClient.post(`${BASE_URL}/`, entry, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

// Changed from GET to DELETE for deleting a journal
export const deleteJournal = async (id, token) => {
  const res = await apiClient.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Changed from GET to PUT for updating a journal
export const updateJournal = async (id, updatedData, token) => {
  const res = await apiClient.put(`${BASE_URL}/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const getStats = async (token) => {
  const res = await apiClient.get(`${BASE_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getSentiment = async (token) => {
  const res = await apiClient.get(`${BASE_URL}/sentiment-analysis`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchWeeklySummary = async (token) => {
  const res = await apiClient.get(`${BASE_URL}/journal/summary/weekly`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchJournalStats = async (token) => {
  const res = await apiClient.get(`${BASE_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const fetchSentimentAnalysis = async (token) => {
  const res = await apiClient.get(`${BASE_URL}/journal/sentiment-analysis`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};


