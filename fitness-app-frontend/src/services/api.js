import axios from "axios";

const getBaseUrl = () => {
    const raw =
        import.meta.env.VITE_API_BASE_URL ||
        "https://fitness-microserivce-5.onrender.com/api";

    let clean = raw.trim().replace(/\/+$/, "");

    if (clean.endsWith("/users")) {
        clean = clean.substring(0, clean.length - 6).replace(/\/+$/, "");
    }

    if (!clean.endsWith("/api")) {
        clean = `${clean}/api`;
    }

    return clean;
};

const API_URL = getBaseUrl();

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});

// Auth & User APIs
export const login = (credentials) => api.post("/users/login", credentials);
export const register = (userData) => api.post("/users/register", userData);
export const getUserProfile = (userId) => api.get(`/users/${userId}`);

// Activity APIs
export const getActivities = () => api.get("/activities");
export const getActivity = (id) => api.get(`/activities/${id}`);
export const addActivity = (activity) => api.post("/activities", activity);
export const updateActivity = (id, activity) =>
    api.put(`/activities/${id}`, activity);
export const deleteActivity = (id) => api.delete(`/activities/${id}`);

// AI Recommendations APIs
export const getActivityDetail = (id) =>
    api.get(`/recommendations/activity/${id}`);

export const getUserRecommendations = (userId) =>
    api.get(`/recommendations/user/${userId}`);