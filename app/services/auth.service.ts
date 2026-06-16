import { api } from "@/lib/api";

export const AuthService = {
  login: async (username: string, password: string) => {
    const { data } = await api.post("/auth/login", {
      username,
      password,
    });

    return data;
  },

  register: async (email: string, password: string, username: string) => {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      username,
    });

    return data;
  },

  refresh: async () => {
    const { data } = await api.post("/auth/refresh");

    return data;
  },
  forgotPassword: async (email: string) => {
    const { data } = await api.post("/auth/forgot-password", { email });

    return data;
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await api.post("/auth/reset-password", {
      token,
      password,
    });

    return data;
  },

  me: async (token: string) => {
    const { data } = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },
};
