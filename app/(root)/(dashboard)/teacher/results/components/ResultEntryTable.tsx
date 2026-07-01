"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScoresState, Student, Subject } from "../types";

interface Props {
  students: Student[];
  subjects: Subject[];
  scores: ScoresState;
  setScores: React.Dispatch<React.SetStateAction<ScoresState>>;
}

function grade(total: number) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

function badgeColor(g: string) {
  switch (g) {
    case "A":
      return "bg-green-100 text-green-700";
    case "B":
      return "bg-emerald-100 text-emerald-700";
    case "C":
      return "bg-blue-100 text-blue-700";
    case "D":
      return "bg-yellow-100 text-yellow-700";
    case "E":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function ResultEntryTable({
  students,
  subjects,
  scores,
  setScores,
}: Props) {
  function update(
    studentId: string,
    subjectId: string,
    field: "ca_score" | "exam_score" | "teacher_comment",
    value: string,
  ) {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] ?? {}),
        [subjectId]: {
          ...(prev[studentId]?.[subjectId] ?? {
            ca_score: 0,
            exam_score: 0,
            teacher_comment: "",
          }),
          [field]:
            field === "teacher_comment" ? value : Math.max(0, Number(value)),
        },
      },
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Student Results</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-auto rounded-lg border">
          <table className="min-w-full border-collapse">
            <thead className="bg-muted">
              <tr>
                <th className="sticky left-0 bg-muted p-4 text-left">
                  Student
                </th>

                {subjects.map((subject) => (
                  <th
                    key={subject.id}
                    className="min-w-[310px] border-l p-4 text-left"
                  >
                    {subject.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="sticky left-0 bg-background p-4 font-medium whitespace-nowrap">
                    {student.first_name} {student.last_name}
                  </td>

                  {subjects.map((subject) => {
                    const row = scores[student.id]?.[subject.id] ?? {
                      ca_score: 0,
                      exam_score: 0,
                      teacher_comment: "",
                    };

                    const total = row.ca_score + row.exam_score;

                    const g = grade(total);

                    return (
                      <td key={subject.id} className="border-l p-4 align-top">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="mb-1 block text-xs text-muted-foreground">
                                Continuous Assessment
                              </label>

                              <Input
                                type="number"
                                min={0}
                                max={40}
                                value={row.ca_score}
                                onChange={(e) =>
                                  update(
                                    student.id,
                                    subject.id,
                                    "ca_score",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label className="mb-1 block text-xs text-muted-foreground">
                                Examination
                              </label>

                              <Input
                                type="number"
                                min={0}
                                max={60}
                                value={row.exam_score}
                                onChange={(e) =>
                                  update(
                                    student.id,
                                    subject.id,
                                    "exam_score",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Total
                              </p>

                              <p className="text-lg font-bold">{total}</p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeColor(
                                g,
                              )}`}
                            >
                              {g}
                            </span>
                          </div>

                          <Input
                            placeholder="Teacher's Comment"
                            value={row.teacher_comment}
                            onChange={(e) =>
                              update(
                                student.id,
                                subject.id,
                                "teacher_comment",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
