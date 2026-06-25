"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { teacherService } from "@/app/services/teacher.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

interface SchoolClass {
  id: string;
  name: string;
}

interface Student {
  id: string;
  first_name?: string;
  last_name?: string;
}

interface Subject {
  id: string;
  name: string;
}

export default function TeacherResultsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");

  const [scores, setScores] = useState<
    Record<
      string,
      Record<
        string,
        {
          ca_score: number;
          exam_score: number;
          teacher_comment: string;
        }
      >
    >
  >({});

  const [resultView, setResultView] = useState<any>(null);

  const loadClasses = async () => {
    try {
      const response = await teacherService.getClasses();

      setClasses(response?.classes ?? response?.data ?? response ?? []);
    } catch {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const loadClassData = async (classId: string) => {
    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        teacherService.getStudents(classId),
        teacherService.getSubjects(classId),
      ]);

      setStudents(studentsRes?.students ?? studentsRes ?? []);

      setSubjects(subjectsRes?.subjects ?? subjectsRes ?? []);
    } catch {
      toast.error("Failed to load class data");
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => loadClasses());
  }, []);

  useEffect(() => {
    if (selectedClass) {
      Promise.resolve().then(() => loadClassData(selectedClass));
    }
  }, [selectedClass]);

  const updateScore = (
    studentId: string,
    subjectId: string,
    field: string,
    value: string,
  ) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subjectId]: {
          ...(prev[studentId]?.[subjectId] || {
            ca_score: 0,
            exam_score: 0,
            teacher_comment: "",
          }),
          [field]: field === "teacher_comment" ? value : Number(value),
        },
      },
    }));
  };

  const submitResults = async () => {
    if (!selectedClass) {
      toast.error("Select class");
      return;
    }

    if (!sessionId || !termId) {
      toast.error("Session ID and Term ID are required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        class_id: selectedClass,
        session_id: sessionId,
        term_id: termId,
        students: students.map((student) => ({
          student_id: student.id,

          scores: subjects.map((subject) => ({
            subject_id: subject.id,

            ca_score: scores?.[student.id]?.[subject.id]?.ca_score ?? 0,

            exam_score: scores?.[student.id]?.[subject.id]?.exam_score ?? 0,

            teacher_comment:
              scores?.[student.id]?.[subject.id]?.teacher_comment ?? "",
          })),
        })),
      };

      await teacherService.submitResults(payload);

      toast.success("Results submitted successfully");
    } catch (error) {
      console.error(error);

      toast.error("Failed to submit results");
    } finally {
      setSubmitting(false);
    }
  };

  const loadResults = async () => {
    if (!selectedClass || !sessionId || !termId) return;

    try {
      const data = await teacherService.getClassResults(
        selectedClass,
        sessionId,
        termId,
      );

      setResultView(data);
    } catch {
      toast.error("Failed to load results");
    }
  };

  const positions = useMemo(() => resultView?.positions ?? [], [resultView]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Results Management</h1>

        <p className="text-muted-foreground">
          Enter and manage student results
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Result Setup</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-md border p-2"
            >
              <option value="">Select Class</option>

              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>

            <Input
              placeholder="Session ID"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
            />

            <Input
              placeholder="Term ID"
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
            />

            <Button variant="outline" onClick={loadResults}>
              View Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {students.length > 0 && subjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Result Entry</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Student</th>

                    {subjects.map((subject) => (
                      <th
                        key={subject.id}
                        className="min-w-[250px] p-3 text-left"
                      >
                        {subject.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-t align-top">
                      <td className="p-3 font-medium">
                        {`${student.first_name ?? ""} ${student.last_name ?? ""}`}
                      </td>

                      {subjects.map((subject) => (
                        <td key={subject.id} className="space-y-2 p-3">
                          <Input
                            type="number"
                            placeholder="CA"
                            value={
                              scores?.[student.id]?.[subject.id]?.ca_score ?? ""
                            }
                            onChange={(e) =>
                              updateScore(
                                student.id,
                                subject.id,
                                "ca_score",
                                e.target.value,
                              )
                            }
                          />

                          <Input
                            type="number"
                            placeholder="Exam"
                            value={
                              scores?.[student.id]?.[subject.id]?.exam_score ??
                              ""
                            }
                            onChange={(e) =>
                              updateScore(
                                student.id,
                                subject.id,
                                "exam_score",
                                e.target.value,
                              )
                            }
                          />

                          <Input
                            placeholder="Comment"
                            value={
                              scores?.[student.id]?.[subject.id]
                                ?.teacher_comment ?? ""
                            }
                            onChange={(e) =>
                              updateScore(
                                student.id,
                                subject.id,
                                "teacher_comment",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              className="mt-6"
              disabled={submitting}
              onClick={submitResults}
            >
              {submitting ? "Submitting..." : "Submit Results"}
            </Button>
          </CardContent>
        </Card>
      )}

      {resultView && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Submitted Results</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="overflow-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Student</th>

                      <th className="p-3 text-left">Subject</th>

                      <th className="p-3 text-left">CA</th>

                      <th className="p-3 text-left">Exam</th>

                      <th className="p-3 text-left">Total</th>

                      <th className="p-3 text-left">Grade</th>
                    </tr>
                  </thead>

                  <tbody>
                    {resultView.results?.map((result: any) => (
                      <tr
                        key={`${result.student_id}-${result.subject_id}`}
                        className="border-t"
                      >
                        <td className="p-3">{result.student_name}</td>

                        <td className="p-3">{result.subject_name}</td>

                        <td className="p-3">{result.ca_score}</td>

                        <td className="p-3">{result.exam_score}</td>

                        <td className="p-3">{result.total_score}</td>

                        <td className="p-3">{result.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Positions</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="overflow-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Position</th>

                      <th className="p-3 text-left">Student</th>

                      <th className="p-3 text-left">Total Score</th>

                      <th className="p-3 text-left">Average</th>
                    </tr>
                  </thead>

                  <tbody>
                    {positions.map((item: any) => (
                      <tr key={item.student_id} className="border-t">
                        <td className="p-3 font-bold">#{item.position}</td>

                        <td className="p-3">{item.student_name}</td>

                        <td className="p-3">{item.total_score}</td>

                        <td className="p-3">{item.average_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
