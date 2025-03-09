import type { IUser, CreateUserInput } from '@/types';
import axiosInstance from './api';

export const getUser = async (userId: string) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const createUser = async (user: CreateUserInput): Promise<IUser> => {
  const response = await axiosInstance.post('/users', user);
  return response.data;
};