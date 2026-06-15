/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export const InviteService = {
  createInvite: async (data: any) => {
    const { data: res } = await api.post("/invites", data);
    return res;
  },
};
