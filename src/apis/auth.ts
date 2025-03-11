import axiosInstance from './api';

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

export const refreshToken = async () => {
  const response = await axiosInstance.post('/auth/refresh-tokens');
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/register', { email, password });
  return response.data;
}