const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  // Auth
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  // Journal entries
  getEntries: async () => {
    const response = await fetch(`${API_BASE_URL}/entries`);
    return response.json();
  },

  createEntry: async (entry) => {
    const response = await fetch(`${API_BASE_URL}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    return response.json();
  },

  // AI analysis
  getAnalysis: async (entryId) => {
    const response = await fetch(`${API_BASE_URL}/analysis/${entryId}`);
    return response.json();
  }
};