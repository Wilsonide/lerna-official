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

type ResultRecord = {
  subject_name: string;
  ca_score: number;
  exam_score: number;
  total_score: number;
  grade: string;
  teacher_comment?: string;
};

type ResultResponse = {
  student_name: string;

  class_name: string;

  session_name: string;

  term_name: string;

  average_score: number;

  position: number | null;

  results: ResultRecord[];
};

export default function StudentResultsPage() {
  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);

  const [data, setData] = useState<ResultResponse | null>(null);

  const [sessionId, setSessionId] = useState<string>("");

  const [termId, setTermId] = useState<string>("");

  async function load() {
    try {
      setLoading(true);

      const active = await AcademicService.getActive();

      if (!active?.session || !active?.term) {
        return;
      }

      setSessionId(active.session.id);
      setTermId(active.term.id);

      const results = await StudentService.getResults(
        active.session.id,
        active.term.id,
      );

      setData(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function downloadReportCard() {
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
    const fetchResults = async () => {
      await load();
    };

    void fetchResults();
  }, []);

  if (loading) {
    return <div className="p-6">Loading results...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Results</h1>

          <p className="text-muted-foreground">View academic performance</p>
        </div>

        <Button onClick={downloadReportCard} disabled={downloading}>
          <Download className="mr-2 h-4 w-4" />

          {downloading ? "Downloading..." : "Download Report Card"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{data?.average_score ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">{data?.position || "-"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">
              {data?.results?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Results</CardTitle>
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

                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.results?.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.subject_name}</TableCell>

                  <TableCell>{result.ca_score}</TableCell>

                  <TableCell>{result.exam_score}</TableCell>

                  <TableCell>{result.total_score}</TableCell>

                  <TableCell>
                    <Badge>{result.grade}</Badge>
                  </TableCell>

                  <TableCell>{result.teacher_comment || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
