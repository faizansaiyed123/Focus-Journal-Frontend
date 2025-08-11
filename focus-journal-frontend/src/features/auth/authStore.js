import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(persist((set, get) => ({
      user: null,
      token: null,

      login: ({ user, token }) => {
        set({ user, token });
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('auth-storage'); 
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ token: state.token, user: state.user }), // only persist token & user
    }
  )
);

export default useAuthStore;
