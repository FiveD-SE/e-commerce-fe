import { create } from 'zustand';
import type { IUser, IRefreshToken, IAccessToken } from '@/types';
import Cookies from 'js-cookie';

interface AuthState {
  accessToken: IAccessToken | null;
  refreshToken: IRefreshToken | null;
  user: IUser | null;
  setTokens: (accessToken: IAccessToken, refreshToken: IRefreshToken, user: IUser) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: Cookies.get('accessToken') ? JSON.parse(Cookies.get('accessToken') as string) as IAccessToken : null,
  refreshToken: Cookies.get('refreshToken') ? JSON.parse(Cookies.get('refreshToken') as string) as IRefreshToken : null,
  user: JSON.parse(Cookies.get('user') as string) as IUser,

  setTokens: (accessToken: IAccessToken, refreshToken: IRefreshToken, user: any) => {
    Cookies.set('accessToken', JSON.stringify(accessToken));
    Cookies.set('refreshToken', JSON.stringify(refreshToken));
    Cookies.set('user', JSON.stringify(user));
    set({ accessToken, refreshToken, user });
  },

  clearTokens: () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));