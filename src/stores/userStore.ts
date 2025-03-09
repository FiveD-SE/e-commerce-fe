import { create } from 'zustand';
import type { IUser } from '@/types';
import Cookies from 'js-cookie';

interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) as IUser : null,

  setUser: (user: IUser) => {
    Cookies.set('user', JSON.stringify(user));
    set({ user });
  },

  clearUser: () => {
    Cookies.remove('user');
    set({ user: null });
  },
}));