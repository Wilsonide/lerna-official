/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/lib/api";

export const StudentService = {
  getAssignments: async (classId: string) => {
    const { data } = await api.get("/student/assignments", {
      params: {
        class_id: classId,
      },
    });

    return data;
  },

  submitAssignment: async (payload: any) => {
    const { data } = await api.post("/student/assignments/submit", payload);

    return data;
  },
};
