/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CreateSchoolPayload {
  // ==========================
  // SCHOOL
  // ==========================

  school_name: string;
  website?: string;
  phone: string;
  whatsapp_number?: string;
  state: string;
  address: string;
  description?: string;

  // ==========================
  // SCHOOL ADMIN
  // ==========================

  admin_first_name: string;
  admin_last_name: string;
  admin_email: string;
  admin_password: string;
}

import { api } from "@/lib/api";

export const AdminService = {
  createSchool: async (payload: CreateSchoolPayload) => {
    const { data } = await api.post("/admin/schools", payload);

    return data;
  },

  // ==========================================
  // DASHBOARD
  // ==========================================

  disableSchool: async (schoolId: string) => {
    const { data } = await api.patch(`/admin/schools/${schoolId}/disable`);

    return data;
  },

  enableSchool: async (schoolId: string) => {
    const { data } = await api.patch(`/admin/schools/${schoolId}/enable`);

    return data;
  },

  getStats: async () => {
    const { data } = await api.get("/admin/stats");
    return data;
  },

  // ==========================================
  // ADMINS
  // ==========================================

  getAdmins: async () => {
    const { data } = await api.get("/admin/admins");
    return data;
  },

  createSchoolAdmin: async (payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    school_id: string;
  }) => {
    const { data } = await api.post("/admin/create-school-admin", payload);

    return data;
  },

  deleteAdmin: async (userId: string) => {
    const { data } = await api.delete(`/admin/admins/${userId}`);

    return data;
  },

  assignSchoolAdmin: async (userId: string, schoolId: string) => {
    const { data } = await api.post(
      `/admin/users/${userId}/assign-school-admin/${schoolId}`,
    );

    return data;
  },

  revokeSchoolAdmin: async (userId: string) => {
    const { data } = await api.post(
      `/admin/users/${userId}/revoke-school-admin`,
    );

    return data;
  },

  // ==========================================
  // USERS
  // ==========================================

  getUsers: async () => {
    const { data } = await api.get("/users");
    return data;
  },

  getUser: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },

  deleteUser: async (userId: string) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  // ==========================================
  // SCHOOLS
  // ==========================================

  getSchools: async () => {
    const { data } = await api.get("/admin/schools");
    return data;
  },

  /**
   * Backend route:
   * DELETE /admin/{school_id}
   */
  deleteSchool: async (schoolId: string) => {
    const { data } = await api.delete(`/admin/schools/${schoolId}`);

    return data;
  },

  // ==========================================
  // LESSONS
  // ==========================================

  createLesson: async (payload: any) => {
    const { data } = await api.post("/admin/lessons", payload);

    return data;
  },

  updateLesson: async (lessonId: string, payload: any) => {
    const { data } = await api.patch(`/admin/lessons/${lessonId}`, payload);

    return data;
  },

  getLessons: async () => {
    const { data } = await api.get("/admin/lessons");

    return data;
  },

  getLesson: async (lessonId: string) => {
    const { data } = await api.get(`/admin/lessons/${lessonId}`);

    return data;
  },

  searchLessons: async (params: {
    class_name: string;
    subject_name: string;
    session_name: string;
    term_name: string;
  }) => {
    const { data } = await api.get("/admin/lessons/search", {
      params,
    });

    return data;
  },
};
