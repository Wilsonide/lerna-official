/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export const SchoolAdminService = {
  // =========================
  // DASHBOARD
  // =========================
  getStats: async () => {
    const { data } = await api.get("/school-admin/stats");
    return data;
  },

  // =========================
  // USERS
  // =========================
  getStudents: async (classId: string) => {
    const { data } = await api.get(`/school-admin/${classId}/students`);
    return data;
  },

  getSchoolStudents: async () => {
    const { data } = await api.get(`/school-admin/students`);
    return data;
  },

  getTeachers: async (classId: string) => {
    const { data } = await api.get(`/school-admin/${classId}/teachers`);
    return data;
  },

  getSchoolTeachers: async () => {
    const { data } = await api.get(`/school-admin/teachers`);
    return data;
  },

  // =========================
  // CLASSES
  // =========================
  getClasses: async () => {
    const { data } = await api.get("/school-admin/classes");
    return data;
  },

  getClassDashboard: async (classId: string) => {
    const { data } = await api.get(`/school-admin/classes/${classId}`);

    return data;
  },

  createClass: async (payload: { name: string; level?: string }) => {
    const { data } = await api.post("/school-admin/classes", payload);
    return data;
  },

  deleteClass: async (id: string) => {
    const { data } = await api.delete(`/school-admin/classes/${id}`);
    return data;
  },

  // =========================
  // CLASS ASSIGNMENTS
  // =========================

  assignStudentToClass: async (classId: string, studentId: string) => {
    const { data } = await api.post(
      `/school-admin/classes/${classId}/assign-student/${studentId}`,
    );
    return data;
  },

  assignTeacherToClass: async (classId: string, teacherId: string) => {
    const { data } = await api.post(
      `/school-admin/classes/${classId}/assign-teacher/${teacherId}`,
    );
    return data;
  },

  removeStudentFromClass: async (classId: string, studentId: string) => {
    const { data } = await api.delete(
      `/school-admin/classes/${classId}/students/${studentId}`,
    );
    return data;
  },

  removeTeacherFromClass: async (classId: string, teacherId: string) => {
    const { data } = await api.delete(
      `/school-admin/classes/${classId}/teachers/${teacherId}`,
    );
    return data;
  },

  // =========================
  // CLASS MEMBERS
  // =========================

  getClassStudents: async (classId: string) => {
    const { data } = await api.get(`/school-admin/classes/${classId}/students`);
    return data;
  },

  getClassTeachers: async (classId: string) => {
    const { data } = await api.get(`/school-admin/classes/${classId}/teachers`);
    return data;
  },

  // =====================
  // SUBJECTS
  // =====================
  getSubjects: async () => {
    const { data } = await api.get("/school-admin/subjects");
    return data;
  },

  createSubject: async (payload: { name: string }) => {
    const { data } = await api.post("/school-admin/subjects", payload);
    return data;
  },

  // =====================
  // TIMETABLE
  // =====================

  getClassTimetable: async (
    classId: string,
    sessionId?: string,
    termId?: string,
  ) => {
    const { data } = await api.get(
      `/school-admin/classes/${classId}/timetable`,
      {
        params: { session_id: sessionId, term_id: termId },
      },
    );

    return data;
  },

  createTimetable: async (payload: any) => {
    const { data } = await api.post("/school-admin/timetable", payload);

    return data;
  },

  deleteTimetable: async (id: string) => {
    const { data } = await api.delete(`/school-admin/timetable/${id}`);

    return data;
  },

  assignSubjectToClass: async (classId: string, subjectId: string) => {
    const { data } = await api.post(
      `/school-admin/classes/${classId}/subjects/${subjectId}`,
    );

    return data;
  },

  removeSubjectFromClass: async (classId: string, subjectId: string) => {
    const { data } = await api.delete(
      `/school-admin/classes/${classId}/subjects/${subjectId}`,
    );

    return data;
  },

  getClassSubjects: async (classId: string) => {
    const { data } = await api.get(`/school-admin/classes/${classId}/subjects`);

    return data;
  },

  // =========================
  //   SESSION/TERMS
  // =========================
  getSessions: async () => {
    const { data } = await api.get("/school-admin/sessions");
    return data;
  },

  createSession: async (payload: {
    name: string;
    start_date: string;
    end_date: string;
  }) => {
    const { data } = await api.post("/school-admin/sessions", payload);

    return data;
  },

  getTerms: async () => {
    const { data } = await api.get("/school-admin/terms");
    return data;
  },

  createTerm: async (payload: {
    session_id: string;
    name: string;
    start_date: string;
    end_date: string;
  }) => {
    const { data } = await api.post("/school-admin/terms", payload);

    return data;
  },

  createLesson: async (payload: any) => {
    const { data } = await api.post("/school-admin/lessons", payload);

    return data;
  },

  getClassLessons: async (classId: string) => {
    const { data } = await api.get(`/school-admin/classes/${classId}/lessons`);

    return data;
  },
};
