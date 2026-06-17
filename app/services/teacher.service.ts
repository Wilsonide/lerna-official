/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export const TeacherService = {
  createAssignment: async (payload: any) => {
    const { data } = await api.post("/teacher/assignments", payload);

    return data;
  },

  getAssignments: async (classId: string) => {
    const { data } = await api.get("/teacher/assignments", {
      params: {
        class_id: classId,
      },
    });

    return data;
  },
};
