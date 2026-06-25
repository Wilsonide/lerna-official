/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export const StudentService = {
  // =====================================
  // CLASSES (for dropdown / profile setup)
  // =====================================
  getClasses: async () => {
    const { data } = await api.get("/student/classes");
    return data;
  },

  // =====================================
  // RESULTS
  // =====================================
  getResults: async (sessionId: string, termId: string) => {
    const { data } = await api.get("/student/results", {
      params: {
        session_id: sessionId,
        term_id: termId,
      },
    });

    return data;
  },

  // =====================================
  // DOWNLOAD REPORT CARD (PDF STREAM)
  // =====================================
  downloadReportCard: async (sessionId: string, termId: string) => {
    const response = await api.get("/student/results/download", {
      params: {
        session_id: sessionId,
        term_id: termId,
      },
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "report_card.pdf");
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // =====================================
  // ATTENDANCE (DETAIL)
  // =====================================
  getAttendance: async (sessionId: string, termId: string) => {
    const { data } = await api.get("/student/attendance", {
      params: {
        session_id: sessionId,
        term_id: termId,
      },
    });

    return data;
  },

  // =====================================
  // ATTENDANCE SUMMARY
  // =====================================
  getAttendanceSummary: async (sessionId: string, termId: string) => {
    const { data } = await api.get("/student/attendance/summary", {
      params: {
        session_id: sessionId,
        term_id: termId,
      },
    });

    return data;
  },
  getDashboard: async () => {
    const { data } = await api.get("/student/dashboard");
    return data;
  },
};
