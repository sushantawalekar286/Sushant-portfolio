import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { accessToken, ...userData } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      set({ 
        error: errMsg, 
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      localStorage.removeItem('accessToken');
      return { success: false, message: errMsg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null 
      });
    }
  },

  checkAuth: async () => {
    if (!localStorage.getItem('accessToken')) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }
    
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/auth/profile');
      set({ 
        user: response.data.data, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Check auth profile failed:', error);
      localStorage.removeItem('accessToken');
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  updateProfileState: (updatedData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedData } : null
    }));
  }
}));

// Setup listener for auto-logout from interceptor failures
if (typeof window !== 'undefined') {
  window.addEventListener('auth-logout', () => {
    localStorage.removeItem('accessToken');
    useAuthStore.setState({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false,
      error: 'Session expired. Please log in again.'
    });
  });
}
