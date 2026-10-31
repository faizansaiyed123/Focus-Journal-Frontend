import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: ({ user, token }) => {
        if (token && typeof window !== 'undefined') {
          window.localStorage.setItem('token', token);
        }
        set({
          user: user === undefined ? get().user : user,
          token: token || get().token,
        });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('token');
        }
        set({ user: null, token: null });
      },

      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);

export default useAuthStore;
