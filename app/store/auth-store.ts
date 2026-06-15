import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  role: string;
  school_id: string;
  profile_completed: boolean;
  first_name?: string;
  last_name?: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;

  // auth initialization states
  isLoading: boolean;
  hydrated: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;

  startLoading: () => void;
  finishLoading: () => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,

  isLoading: true,
  hydrated: false,

  setUser: (user) =>
    set({
      user,
    }),

  setAccessToken: (token) =>
    set({
      accessToken: token,
    }),

  startLoading: () =>
    set({
      isLoading: true,
    }),

  finishLoading: () =>
    set({
      isLoading: false,
      hydrated: true,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isLoading: false,
      hydrated: true,
    }),
}));
