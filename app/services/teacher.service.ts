/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";

export interface UpdateResultRecordPayload {
  ca_score: number;
  exam_score: number;
  teacher_comment?: string;
}

export interface EditableResultResponse {
  batch_id: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";
  editable: boolean;

  students: {
    subjects: any;
    student_id: string;
    student_name: string;

    records: {
      record_id: string;
      subject_id: string;
      subject_name: string;
      ca_score: number;
      exam_score: number;
      total_score: number;
      teacher_comment?: string;
    }[];
  }[];
}

export interface ResubmitBatchResponse {
  batch_id: string;
  status: string;
  message: string;
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export interface ResultBatch {
  id: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";
  created_at: string;
  updated_at: string;
}
export interface ResultStatusResponse {
  exists: boolean;
  editable?: boolean;
  status?: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";
  batch_id?: string;
}
export interface EditableSubjectScore {
  subject_id: string;
  ca_score: number;
  exam_score: number;
  teacher_comment?: string;
}

export interface EditableStudentResult {
  student_id: string;
  scores: EditableSubjectScore[];
}

export interface EditableBatchResponse {
  batch_id: string;
  class_id: string;
  session_id: string;
  term_id: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";
  students: EditableStudentResult[];
}

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

  students: StudentResultInput[];
}

export interface ResultSubmissionResponse {
  created: boolean;
  batch_id: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";
  message: string;
}
export interface SubjectResult {
  record_id: string;

  subject_id: string;
  subject_name: string;

  ca_score: number;
  exam_score: number;
  total_score: number;

  grade: string;
  remark: string;

  teacher_comment?: string;
}
export interface StudentResult {
  student_id: string;
  student_name: string;

  total_score: number;
  average_score: number;

  position: number;

  passed_subjects: number;
  failed_subjects: number;

  subjects: SubjectResult[];
}

export interface UpdateTeacherComment {
  teacher_comment: string;
}

export interface ClassResultResponse {
  batch_id: string;

  class_id: string;

  session_id: string;

  term_id: string;

  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PUBLISHED";

  editable: boolean;

  students: StudentResult[];
}
export interface UpdateResultRecordPayload {
  ca_score: number;
  exam_score: number;
  teacher_comment?: string;
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

  async getActiveAcademic() {
    const { data } = await api.get("/academic/active");
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

  async getClassAttendance(classId: string, attendanceDate: string) {
    const { data } = await api.get("/teacher/attendance/class", {
      params: {
        class_id: classId,
        attendance_date: attendanceDate,
      },
    });

    return data;
  }

  // ====================================
  // RESULTS
  // ====================================

  async saveDraft(
    payload: ResultBatchCreate,
  ): Promise<ResultSubmissionResponse> {
    const { data } = await api.post("/teacher/results/draft", payload);

    return data;
  }

  async submitResults(
    payload: ResultBatchCreate,
  ): Promise<ResultSubmissionResponse> {
    const { data } = await api.post("/teacher/results/submit", payload);

    return data;
  }

  async updateBatch(
    batchId: string,
    payload: ResultBatchCreate,
  ): Promise<ResultSubmissionResponse> {
    const { data } = await api.put(`/teacher/results/${batchId}`, payload);

    return data;
  }

  async getBatch(batchId: string): Promise<EditableBatchResponse> {
    const { data } = await api.get(`/teacher/results/${batchId}`);

    return data;
  }

  async viewBatch(batchId: string): Promise<ClassResultResponse> {
    const { data } = await api.get(`/teacher/results/${batchId}/view`);

    return data;
  }

  async getClassBatches(classId: string): Promise<ResultBatch[]> {
    const { data } = await api.get(`/teacher/results/class/${classId}/batches`);

    return data;
  }

  async getClassResults(params: {
    classId: string;
    sessionId?: string;
    termId?: string;
  }): Promise<ClassResultResponse> {
    const { data } = await api.get("/teacher/results/class", {
      params: {
        class_id: params.classId,
        session_id: params.sessionId,
        term_id: params.termId,
      },
    });

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

  async getResultStatus(params: {
    classId: string;
  }): Promise<ResultStatusResponse> {
    const { data } = await api.get("/teacher/results/status", {
      params: {
        class_id: params.classId,
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

  // =========================
  // RESULT EDITING
  // =========================

  getEditableResults = async (
    classId: string,
  ): Promise<EditableResultResponse> => {
    const { data } = await api.get(`/teacher/results/${classId}/editable`);

    return data;
  };

  updateResultRecord = async (
    recordId: string,
    payload: UpdateResultRecordPayload,
  ): Promise<{ message: string }> => {
    const { data } = await api.patch(
      `/teacher/results/records/${recordId}`,
      payload,
    );

    return data;
  };

  resubmitResults = async (batchId: string): Promise<ResubmitBatchResponse> => {
    const { data } = await api.post(`/teacher/results/${batchId}/resubmit`);

    return data;
  };
}

export const teacherService = new TeacherService();
