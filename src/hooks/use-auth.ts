import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { IUser } from '@/types/objects';
import { useEffect, useState } from 'react';

interface AuthStore {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: IUser, token: string) => void;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,
      _hasHydrated: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
      login: (user, token) => {
        Cookies.set('token', token, { path: '/', expires: 30 });
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        });
      },
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
        Cookies.remove('token', { path: '/' });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.setLoading(false);
      },
    }
  )
);

export const useAuth = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    setUser,
    setToken,
    setLoading,
    login,
    logout,
    _hasHydrated,
  } = useAuthStore();

  useEffect(() => {
    setIsHydrated(_hasHydrated);
  }, [_hasHydrated]);

  // Sync token from cookies on hydration
  useEffect(() => {
    if (isHydrated && !token) {
      const cookieToken = Cookies.get('token');
      if (cookieToken) {
        setToken(cookieToken);
      }
    }
  }, [isHydrated, token, setToken]);

  return {
    user,
    token,
    isLoading: !isHydrated || isLoading,
    isAuthenticated: isHydrated && isAuthenticated,
    setUser,
    setToken,
    setLoading,
    login,
    logout,
    isLoggedIn: isHydrated && !!token,
    isHydrated,
  };
};