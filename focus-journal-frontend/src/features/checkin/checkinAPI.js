import apiClient from '../../api/apiClient';

const BASE = `${import.meta.env.VITE_API_URL}/checkin`;

// Fetch all check-ins
export const fetchCheckins = async (token) => {
  try {
    const res = await apiClient.get(`${BASE}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // Return the data directly
  } catch (error) {
    throw new Error('Failed to fetch check-ins: ' + error.message);
  }
};

// Fetch today's check-in
export const fetchToday = async (token) => {
  try {
    const res = await apiClient.get(`/checkin/checkin/today`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch today\'s check-in: ' + error.message);
  }
};

// Fetch check-in stats
export const fetchCheckinStats = async (token) => {
  try {
    const res = await apiClient.get(`/checkin/checkin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (error) {
    throw new Error('Failed to fetch check-in stats: ' + error.message);
  }
};

// Create a new check-in
export const createCheckin = async (entry, token) => {
  try {
    const res = await apiClient.post(`${BASE}/`, entry, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to create check-in: ' + error.message);
  }
};

// Fetch streak data
export const fetchStreak = async (token) => {
  try {
    const res = await apiClient.get(`${BASE}/streak`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch streak data: ' + error.message);
  }
};

// Fetch a check-in by ID
export const fetchCheckinById = async (id, token) => {
  try {
    const res = await apiClient.get(`/checkin/by-id/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch check-in with ID ${id}: ` + error.message);
  }
};

// Update a check-in
export const updateCheckin = async (id, payload, token) => {
  try {
    const res = await apiClient.put(`${BASE}/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to update check-in with ID ${id}: ` + error.message);
  }
};

// Delete a check-in
export const deleteCheckin = async (id, token) => {
  try {
    const res = await apiClient.delete(`${BASE}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    throw new Error(`Failed to delete check-in with ID ${id}: ` + error.message);
  }
};

// Fetch check-in history
export const fetchCheckinHistory = async (token) => {
  try {
    const res = await apiClient.get(`${BASE}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    throw new Error('Failed to fetch check-in history: ' + error.message);
  }
};

// Fetch check-ins between two dates
export const fetchCheckinsBetweenDates = async (token ,startDate, endDate) => {
  try {
    const params = new URLSearchParams();
    if (startDate) {
      params.append('start_date', startDate);
    }
    if (endDate) {
      params.append('end_date', endDate);
    }

    const url = `${BASE}/checkins?${params.toString()}`;
    const res = await apiClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    throw new Error('Failed to fetch check-ins between dates: ' + error.message);
  }
};
