import axios from 'axios';

// Set the base URL for your API
const BASE_URL = 'http://localhost:5000';

// Create an Axios instance with default settings
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding additional headers (e.g., Authorization token)
api.interceptors.request.use(
    (config) => {
        // Example: Add Authorization token if needed
        const token = localStorage.getItem('authToken'); // Replace with your token logic
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling responses or errors globally
api.interceptors.response.use(
    (response) => {
        return response.data; // Only return the data part of the response
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            console.error('API Error:', error.response.data.message || error.response.statusText);
        } else {
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
