import { api } from "./api";
import { useAuthStore } from "@/app/store/auth-store";

let refreshing = false;

export function setupAuthInterceptor() {
  // request attach token
  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // response handling
  api.interceptors.response.use(
    (res) => res,

    async (error) => {
      const original = error.config;

      // ❌ prevent infinite loop on refresh endpoint
      if (original.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        if (!refreshing) {
          refreshing = true;

          try {
            const res = await api.post("/auth/refresh");

            useAuthStore.getState().setAccessToken(res.data.access_token);
          } catch {
            useAuthStore.getState().logout();
            window.location.href = "/login";
            return Promise.reject(error);
          } finally {
            refreshing = false;
          }
        }

        const token = useAuthStore.getState().accessToken;
        original.headers.Authorization = `Bearer ${token}`;

        return api(original);
      }

      return Promise.reject(error);
    },
  );
}
