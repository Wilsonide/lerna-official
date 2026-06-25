import { api } from "@/lib/api";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  objectives?: string;
  file_url?: string;

  class_name: string;
  subject_name: string;

  session_name: string;
  term_name: string;

  is_published: boolean;
  created_at: string;
}

export interface LessonSearchResponse {
  lessons: Lesson[];
  total: number;
}

export interface AttendanceStudent {
  student_id: string;
  status: AttendanceStatus;
  note?: string | null;
}

export interface AttendanceCreate {
  class_id: string;
  attendance_date: string;
  students: AttendanceStudent[];
}

export interface AttendanceSubmissionResponse {
  sheet_id: string;

  created: boolean;

  total_students: number;

  present_count: number;

  absent_count: number;

  late_count: number;

  message: string;
}

export interface SubjectScoreInput {
  subject_id: string;
  ca_score: number;
  exam_score: number;
  teacher_comment?: string;
}

export interface StudentResultInput {
  student_id: string;
  scores: SubjectScoreInput[];
}

export interface ResultBatchCreate {
  class_id: string;
  session_id: string;
  term_id: string;
  students: StudentResultInput[];
}

export interface ResultSubmissionResponse {
  sheet_id: string;
  total_students: number;
  total_records: number;
}

export interface UpdateTeacherComment {
  teacher_comment: string;
}

export interface ClassResultResponse {
  sheet_id: string;

  class_id: string;
  class_name: string;

  session_id: string;
  session_name: string;

  term_id: string;
  term_name: string;

  is_approved: boolean;

  results: {
    student_id: string;
    student_name: string;

    subject_id: string;
    subject_name: string;

    ca_score: number;
    exam_score: number;
    total_score: number;

    grade: string;
    teacher_comment?: string;
  }[];

  positions: {
    student_id: string;
    student_name: string;

    total_score: number;
    average_score: number;
    position: number;
  }[];
}

class TeacherService {
  // ====================================
  // LESSONS
  // ====================================

  async searchLessons(params: {
    class_name: string;
    subject_name: string;
    session_name: string;
    term_name: string;
  }): Promise<LessonSearchResponse> {
    const { data } = await api.get("/teacher/lessons/search", {
      params,
    });

    return data;
  }

  // ====================================
  // ATTENDANCE
  // ====================================

  async submitAttendance(
    payload: AttendanceCreate,
  ): Promise<AttendanceSubmissionResponse> {
    const { data } = await api.post("/teacher/attendance", payload);

    return data;
  }

  async getClassAttendance(
    classId: string,
    sessionId: string,
    termId: string,
    attendanceDate: string,
  ) {
    const { data } = await api.get("/teacher/attendance/class", {
      params: {
        class_id: classId,
        session_id: sessionId,
        term_id: termId,
        attendance_date: attendanceDate,
      },
    });

    return data;
  }

  // ====================================
  // RESULTS
  // ====================================

  async submitResults(
    payload: ResultBatchCreate,
  ): Promise<ResultSubmissionResponse> {
    const { data } = await api.post("/teacher/results", payload);

    return data;
  }

  async updateResultComment(recordId: string, teacherComment: string) {
    const { data } = await api.patch(
      `/teacher/results/records/${recordId}/comment`,
      {
        teacher_comment: teacherComment,
      },
    );

    return data;
  }

  async getClassResults(
    classId: string,
    sessionId: string,
    termId: string,
  ): Promise<ClassResultResponse> {
    const { data } = await api.get("/teacher/results/class", {
      params: {
        class_id: classId,
        session_id: sessionId,
        term_id: termId,
      },
    });

    return data;
  }
  async getClasses() {
    const { data } = await api.get("/teacher/classes");

    return data;
  }
  async getStudents(classId: string) {
    const { data } = await api.get("/teacher/students", {
      params: {
        class_id: classId,
      },
    });

    return data;
  }
  async getSubjects(classId: string) {
    const { data } = await api.get("/teacher/subjects", {
      params: {
        class_id: classId,
      },
    });

    return data;
  }
  async getDashboard() {
    const { data } = await api.get("/teacher/dashboard");
    return data;
  }
}

export const teacherService = new TeacherService();
