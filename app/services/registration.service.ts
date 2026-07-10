import { api } from "@/lib/api";

export interface StudentRegistration {
  first_name: string;
  last_name: string;
  email: string;

  gender: string;
  date_of_birth: string;
  admission_date: string;
  class_id: string;
}

export interface TeacherRegistration {
  first_name: string;
  last_name: string;
  email: string;
  qualification: string;
  specialization: string;
  hire_date: string;
  class_id: string;
}

export interface ParentRegistration {
  first_name: string;
  last_name: string;
  email: string;
  occupation: string;
  phone: string;
}

export const RegistrationService = {
  // =====================================================
  // SINGLE REGISTRATION
  // =====================================================

  registerStudent: async (payload: StudentRegistration) => {
    const { data } = await api.post("/admin/registration/student", payload);

    return data;
  },

  registerTeacher: async (payload: TeacherRegistration) => {
    const { data } = await api.post("/admin/registration/teacher", payload);

    return data;
  },

  registerParent: async (payload: ParentRegistration) => {
    const { data } = await api.post("/admin/registration/parent", payload);

    return data;
  },

  // =====================================================
  // BATCH REGISTRATION
  // =====================================================

  registerStudentsBatch: async (payload: StudentRegistration[]) => {
    const { data } = await api.post(
      "/admin/registration/students/batch",
      payload,
    );

    return data;
  },

  registerTeachersBatch: async (payload: TeacherRegistration[]) => {
    const { data } = await api.post(
      "/admin/registration/teachers/batch",
      payload,
    );

    return data;
  },

  registerParentsBatch: async (payload: ParentRegistration[]) => {
    const { data } = await api.post(
      "/admin/registration/parents/batch",
      payload,
    );

    return data;
  },

  // =====================================================
  // IMPORT STUDENTS EXCEL
  // =====================================================

  importStudents: async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
      "/admin/registration/students/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      },
    );

    return response.data;
  },

  // =====================================================
  // IMPORT TEACHERS EXCEL
  // =====================================================

  importTeachers: async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
      "/admin/registration/teachers/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      },
    );

    return response.data;
  },

  // =====================================================
  // DOWNLOAD STUDENT TEMPLATE
  // =====================================================

  downloadStudentTemplate: async () => {
    const response = await api.get("/admin/registration/templates/student", {
      responseType: "blob",
    });

    return response.data;
  },

  // =====================================================
  // DOWNLOAD TEACHER TEMPLATE
  // =====================================================

  downloadTeacherTemplate: async () => {
    const response = await api.get("/admin/registration/templates/teacher", {
      responseType: "blob",
    });

    return response.data;
  },
};
