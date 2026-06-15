/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export const ProfileService = {
  createProfile: async (data: any) => {
    const { data: res } = await api.post("/profile/create", data);
    return res;
  },

  updateProfile: async (data: any) => {
    const { data: res } = await api.patch("/profile/me", data);
    return res;
  },

  getMyProfile: async () => {
    const { data } = await api.get("/profile/me");
    return data;
  },
};
