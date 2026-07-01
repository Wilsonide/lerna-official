"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { StudentService } from "@/app/services/student.service";
import { AcademicService } from "@/app/services/academic.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

type SubjectResult = {
  subject_name: string;
  ca_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
  remark?: string;
  teacher_comment?: string;
};

type ResultResponse = {
  student_name: string;
  class_name: string;
  session_name: string;
  term_name: string;

  total_score: number;
  average_score: number;
  position: number | null;

  passed_subjects: number;
  failed_subjects: number;

  subjects: SubjectResult[];
};

export default function StudentResultsPage() {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [data, setData] = useState<ResultResponse | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [termId, setTermId] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);

      const active = await AcademicService.getActive();

      if (!active?.session?.id || !active?.term?.id) {
        setData(null);
        setSessionId(null);
        setTermId(null);
        return;
      }

      setSessionId(active.session.id);
      setTermId(active.term.id);

      const results = await StudentService.getResults(
        active.session.id,
        active.term.id,
      );

      setData(results ?? null);
    } catch (error) {
      console.error("Failed to load results:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function downloadReportCard() {
    if (!sessionId || !termId) return;

    try {
      setDownloading(true);
      await StudentService.downloadReportCard(sessionId, termId);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => load());
  }, []);

  if (loading) {
    return <div className="p-6">Loading results...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {data?.student_name || "Results"}
          </h1>
          <p className="text-muted-foreground">
            {data?.class_name} • {data?.session_name} • {data?.term_name}
          </p>
        </div>

        <Button
          onClick={downloadReportCard}
          disabled={downloading || !sessionId || !termId}
        >
          <Download className="mr-2 h-4 w-4" />
          {downloading ? "Downloading..." : "Download Report Card"}
        </Button>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Average</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data?.average_score ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data?.total_score ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {data?.position ?? "-"}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Passed</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            {data?.passed_subjects ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-red-600">
            {data?.failed_subjects ?? 0}
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Breakdown</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>CA</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.subjects?.length ? (
                data.subjects.map((subject, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {subject.subject_name}
                    </TableCell>

                    <TableCell>{subject.ca_score}</TableCell>
                    <TableCell>{subject.exam_score}</TableCell>

                    <TableCell className="font-semibold">
                      {subject.total_score}
                    </TableCell>

                    <TableCell>
                      <Badge>{subject.grade}</Badge>
                    </TableCell>

                    <TableCell>
                      {subject.remark || subject.teacher_comment || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No subject results available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
