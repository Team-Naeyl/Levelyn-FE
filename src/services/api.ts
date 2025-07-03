import axios from 'axios';

export const API_BASE_URL = 'https://levelyn-api.p-e.kr';

const api = axios.create({
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwIiwicGxheWVySWQiOiIxMCIsIndhbGxldElkIjoiMTAiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MWUrMjR9.XhGV6WoM47ugSx46378w450Es5PumklljpRVorqXOL8',
  },
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
