import axios from 'axios';
import {environment} from "../lib/environment";

// Create an axios instance with default config
const apiClient = axios.create({
    baseURL: environment.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(environment.SESSION_STORAGE);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem(environment.SESSION_STORAGE);
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
