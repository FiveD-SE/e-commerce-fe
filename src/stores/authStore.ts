import { create } from 'zustand';
import Cookies from 'js-cookie';
import { login, getUser } from '@/apis';

interface AuthState {
  isAuthenticated: boolean;
  role: string;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;  
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!Cookies.get('accessToken'),
  role: '',

  login: async ({ email, password }) => {
    try {
       const response = await login(email, password);
      const user = await getUser(response.data.user.id);

       Cookies.set('accessToken', response.data.accessToken, { expires: 7 });

       set({
        isAuthenticated: true,
        role: user.role,
      });
    } catch (error: any) {
      set({
        isAuthenticated: false,
        role: '',
      });
      throw error.response?.data || error.message;  
    } 
  },

  logout: async () => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found');

      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');

      set({
        isAuthenticated: false,
        role: '',
      });
    } catch (error: any) {
       set({
        isAuthenticated: false,
        role: '',
      });
      throw error.message; 
    }
  },

  checkAuth: () => {
    const accessToken = Cookies.get('accessToken');
    set((state) => ({
      isAuthenticated: !!accessToken,
      role: accessToken ? state.role : '',  
    }));
  },
}));  