import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from './api';

export interface User {
  user_id: string;
  mobile_number: string;
  name: string;
  email?: string;
  role: 'farmer' | 'hub_operator' | 'buyer' | 'admin' | 'shg_leader' | 'aggregator';
  village_id?: string;
  village_name?: string;
  shg_id?: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  language_preference: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (mobile_number: string, password?: string) => Promise<any>;
  loginWithOTP: (mobile_number: string, otp: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  verifyOTP: (mobile_number: string, otp: string) => Promise<any>;
  logout: () => void;
  updateProfile: (data: any) => Promise<any>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (mobile_number: string, password?: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login({ mobile_number, password });
          
          if (response.data.success) {
            if (response.data.otpSent) {
              // OTP sent - this is the expected flow for mock server
              set({ isLoading: false });
              return { success: true, otpSent: true };
            } else if (response.data.data && response.data.data.token) {
              // Direct login with password (if supported)
              const { user, token } = response.data.data;
              set({ user, token, isAuthenticated: true, isLoading: false });
              localStorage.setItem('auth_token', token);
              return { success: true, user, token };
            }
          }
          
          set({ isLoading: false });
          return { success: false, message: response.data.message || 'Login failed' };
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'Login failed' 
          };
        }
      },

      loginWithOTP: async (mobile_number: string, otp: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.loginWithOTP({ mobile_number, otp });
          
          if (response.data.success) {
            const { user, token } = response.data.data;
            set({ user, token, isAuthenticated: true, isLoading: false });
            localStorage.setItem('auth_token', token);
            return { success: true, user, token };
          }
          
          set({ isLoading: false });
          return { success: false, message: response.data.message };
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'OTP verification failed' 
          };
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(userData);
          set({ isLoading: false });
          
          if (response.data.success) {
            return { success: true, message: response.data.message };
          }
          
          return { success: false, message: response.data.message };
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'Registration failed' 
          };
        }
      },

      verifyOTP: async (mobile_number: string, otp: string) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.verifyOTP({ mobile_number, otp });
          
          if (response.data.success) {
            const { user, token } = response.data.data;
            set({ user, token, isAuthenticated: true, isLoading: false });
            localStorage.setItem('auth_token', token);
            return { success: true, user, token };
          }
          
          set({ isLoading: false });
          return { success: false, message: response.data.message };
        } catch (error: any) {
          set({ isLoading: false });
          return { 
            success: false, 
            message: error.response?.data?.message || 'OTP verification failed' 
          };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        // Call logout API
        authAPI.logout().catch(console.error);
      },

      updateProfile: async (data: any) => {
        try {
          const response = await authAPI.updateProfile(data);
          
          if (response.data.success) {
            const updatedUser = response.data.data;
            set({ user: updatedUser });
            return { success: true, user: updatedUser };
          }
          
          return { success: false, message: response.data.message };
        } catch (error: any) {
          return { 
            success: false, 
            message: error.response?.data?.message || 'Profile update failed' 
          };
        }
      },

      setUser: (user: User) => set({ user, isAuthenticated: true }),
      setToken: (token: string) => {
        set({ token });
        localStorage.setItem('auth_token', token);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Auth hook for components
export const useAuth = () => {
  const authState = useAuthStore();
  return authState;
};

// Role-based access control
export const hasRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, ['admin']);
};

export const isFarmer = (user: User | null): boolean => {
  return hasRole(user, ['farmer']);
};

export const isBuyer = (user: User | null): boolean => {
  return hasRole(user, ['buyer', 'aggregator']);
};

export const isHubOperator = (user: User | null): boolean => {
  return hasRole(user, ['hub_operator']);
};

export const isSHGLeader = (user: User | null): boolean => {
  return hasRole(user, ['shg_leader']);
};