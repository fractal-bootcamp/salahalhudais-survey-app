const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('API_URL:', API_URL); // Debug log

export const api = {
  get: (endpoint: string) => {
    const url = `${API_URL}${endpoint}`;
    console.log('Making GET request to:', url); // Debug log
    return fetch(url);
  },
  
  post: (endpoint: string, data: any) => {
    const url = `${API_URL}${endpoint}`;
    console.log('Making POST request to:', url); // Debug log
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  },
};