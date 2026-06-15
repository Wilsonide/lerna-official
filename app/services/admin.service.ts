/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/lib/api";

export const AdminService = {
  // ==========================================
  // DASHBOARD STATS
  // ==========================================
  getStats: async () => {
    const { data } = await api.get("/admin/stats");

    return data;
  },

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

  // ==========================================
  // ASSIGN SCHOOL ADMIN
  // ==========================================
  assignSchoolAdmin: async (userId: string, schoolId: string) => {
    const { data } = await api.post(
      `/admin/users/${userId}/assign-school-admin/${schoolId}`,
    );

    return data;
  },

  // ==========================================
  // REVOKE SCHOOL ADMIN
  // ==========================================

  revokeSchoolAdmin: async (userId: string) => {
    const { data } = await api.post(
      `/admin/users/${userId}/revoke-school-admin`,
    );

    return data;
  },

  // ==========================================
  // GET ALL USERS
  // ==========================================
  getUsers: async () => {
    const { data } = await api.get("/users");

    return data;
  },

  // ==========================================
  // GET SINGLE USER
  // ==========================================
  getUser: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}`);

    return data;
  },

  // ==========================================
  // DELETE USER
  // ==========================================
  deleteUser: async (userId: string) => {
    const { data } = await api.delete(`/users/${userId}`);

    return data;
  },
  // ==========================================
  // SCHOOL MANAGEMENT (delegating to SchoolService for now)
  // ==========================================

  // ==========================================
  // GET ALL SCHOOLS
  // ==========================================
  getSchools: async () => {
    const { data } = await api.get("/schools");
    return data;
  },

  // ==========================================
  // CREATE SCHOOL
  // ==========================================

  createSchool: async (payload: any) => {
    const { data } = await api.post("/schools", payload);
    return data;
  },

  // ==========================================
  // DELETE SCHOOL
  // ==========================================

  deleteSchool: async (schoolId: string) => {
    const { data } = await api.delete(`/schools/${schoolId}`);
    return data;
  },
};
