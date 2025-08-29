import axios, { AxiosInstance } from 'axios';
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export const AuthApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ApiInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const addAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        Cookies.remove('token', { path: '/' });
        window.location.href = '/auth/login';
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(ApiInstance);