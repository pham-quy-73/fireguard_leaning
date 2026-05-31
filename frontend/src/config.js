// Configure API base URL depending on environment
export const API_BASE_URL = 
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://fireguard-leaning.onrender.com';
