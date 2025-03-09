import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../constants/endpoints';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let refreshTokenPromise: Promise<
  AxiosResponse<{
    accessToken: string;
    refreshToken: string;
  }>
> | null = null;

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshTokenPromise) {
        const refreshToken = Cookies.get('refreshToken');

        refreshTokenPromise = axiosInstance
          .post('/auth/refresh-tokens', { refreshToken })
          .then((response) => {
            const newAccessToken = response.data.access.token;
            const newRefreshToken = response.data.refresh.token;

            Cookies.set('accessToken', newAccessToken);
            Cookies.set('refreshToken', newRefreshToken);

            axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };

            return axiosInstance(originalRequest);
          })
          .catch((error) => {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');

            toast.error('Your session has expired. Please log in again.');

            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);

            return Promise.reject(error);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      return refreshTokenPromise.then(() => axiosInstance(originalRequest));
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;