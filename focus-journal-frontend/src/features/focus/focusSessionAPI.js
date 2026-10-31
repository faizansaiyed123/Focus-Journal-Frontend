import apiClient from '../../api/apiClient';

const BASE_URL = '/focus-sessions';

export async function listFocusSessions(limit = 10, offset = 0) {
  const response = await apiClient.get(BASE_URL + '/', {
    params: { limit, offset },
  });
  return response.data;
}

export async function startFocusSession(payload) {
  const response = await apiClient.post(BASE_URL + '/', payload);
  return response.data;
}

export async function transitionFocusSession(sessionId, action) {
  const response = await apiClient.post(
    BASE_URL + '/' + sessionId + '/' + action,
  );
  return response.data;
}

export async function fetchFocusSessionSummary(startDate, endDate) {
  const response = await apiClient.get(BASE_URL + '/summary', {
    params: {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    },
  });
  return response.data;
}
