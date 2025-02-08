const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  get: (endpoint: string) => 
    fetch(`${API_URL}${endpoint}`),
  
  post: (endpoint: string, data: any) =>
    fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
};