import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for token rotation on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          useAuthStore.getState().logoutAction();
          return Promise.reject(error);
        }

        console.log('[API Interceptor] Rotating tokens...');
        const res = await axios.post('/api/auth/refresh', { refreshToken });
        
        if (res.data?.success) {
          const { accessToken, refreshToken: newRefreshToken, user } = res.data;
          useAuthStore.getState().setSession(accessToken, newRefreshToken, user);
          
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('[API Interceptor] Token rotation failed, logging out.');
        useAuthStore.getState().logoutAction();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
