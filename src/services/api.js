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
    search: (query, limit = 5) => API.get(`/api/albums/search?query=${query}&limit=${limit}`),
    get: (mbid) => API.get(`/api/albums/${mbid}`),
    review: (mbid, rating, text) => API.post(`/api/albums/${mbid}/reviews`, { rating, text }),
    log: (mbid, data) => API.post(`/api/albums/${mbid}/log`, data),
    newReleases: (limit = 6) => API.get(`/api/albums/new-releases?limit=${limit}`),
};

export const users = {
    me: () => API.get('/api/users/me'),
    profile: (id) => API.get(`/api/users/${id}`),
    reviews: (id) => API.get(`/api/users/${id}/reviews`),
    log: (id) => API.get(`/api/users/${id}/log`),
    myLog: () => API.get('/api/users/me/log'),
    search: (query) => API.get(`/api/users/search?query=${query}`),
    follow: (userId) => API.post(`/api/users/${userId}/follow`),
    publicProfile: (userId) => API.get(`/api/users/${userId}`),
    publicLog: (userId) => API.get(`/api/users/${userId}/log`),
};

export default API;