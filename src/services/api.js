import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const auth = {
    login: (email, password) => API.post('/api/auth/login', { email, password }),
    register: (username, email, password) => API.post('/api/auth/register', { username, email, password }),
};

export const albums = {
    search: (query, limit = 10) => API.get(`/api/albums/search?query=${query}&limit=${limit}`),
    get: (mbid) => API.get(`/api/albums/${mbid}`),
    review: (mbid, rating, text) => API.post(`/api/albums/${mbid}/reviews`, { rating, text }),
    log: (mbid, data) => API.post(`/api/albums/${mbid}/log`, data),
};

export const users = {
    me: () => API.get('/api/users/me'),
    profile: (id) => API.get(`/api/users/${id}`),
    reviews: (id) => API.get(`/api/users/${id}/reviews`),
    log: (id) => API.get(`/api/users/${id}/log`),
};

export default API;