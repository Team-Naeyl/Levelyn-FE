import axios from 'axios';

const API_BASE_URL = 'https://levelyn-api.p-e.kr';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
