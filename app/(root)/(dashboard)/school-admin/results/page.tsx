"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import Link from "next/link";

import { toast } from "sonner";

import { CheckCircle, XCircle, Send, Download, Eye } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

interface SchoolClass {
  id: string;
  name: string;
}

interface AcademicSession {
  id: string;
  name: string;
}

interface Term {
  id: string;
  name: string;
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(false);

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);

  const [classId, setClassId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [termId, setTermId] = useState("");

  const [results, setResults] = useState<any[]>([]);

  const [rejectNote, setRejectNote] = useState("");

  const loadFilters = async () => {
    try {
      const [classesRes, sessionsRes, termsRes] = await Promise.all([
        SchoolAdminService.getClasses(),
        SchoolAdminService.getSessions(),
        SchoolAdminService.getTerms(),
      ]);

      setClasses(
        Array.isArray(classesRes?.classes)
          ? classesRes.classes
          : Array.isArray(classesRes)
            ? classesRes
            : [],
      );

      setSessions(
        Array.isArray(sessionsRes?.sessions) ? sessionsRes.sessions : [],
      );

      setTerms(Array.isArray(termsRes?.terms) ? termsRes.terms : []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load filters");
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadFilters());
  }, []);

  const loadResults = async () => {
    if (!classId || !sessionId || !termId) {
      toast.error("Select class, session and term");

      return;
    }

    try {
      setLoading(true);

      const data = await SchoolAdminService.getClassResults(
        classId,
        sessionId,
        termId,
      );

      setResults(
        Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data)
            ? data
            : [],
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const approveBatch = async (batchId: string) => {
    try {
      await SchoolAdminService.approveResult(batchId);

      toast.success("Results approved");

      await loadResults();
    } catch (error) {
      console.error(error);

      toast.error("Failed to approve");
    }
  };

  const publishBatch = async (batchId: string) => {
    try {
      await SchoolAdminService.publishResult(batchId);

      toast.success("Results published");

      await loadResults();
    } catch (error) {
      console.error(error);

      toast.error("Failed to publish");
    }
  };

  const rejectBatch = async (batchId: string) => {
    if (!rejectNote.trim()) {
      toast.error("Provide rejection note");

      return;
    }

    try {
      await SchoolAdminService.rejectResult(batchId, {
        note: rejectNote,
      });

      toast.success("Results rejected");

      setRejectNote("");

      await loadResults();
    } catch (error) {
      console.error(error);

      toast.error("Failed to reject");
    }
  };

  const exportResults = async () => {
    if (!classId || !sessionId || !termId) {
      return;
    }

    try {
      const blob = await SchoolAdminService.exportResults(
        classId,
        sessionId,
        termId,
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "results-export.xlsx";

      link.click();

      toast.success("Export started");
    } catch (error) {
      console.error(error);

      toast.error("Failed to export");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Results Management</h1>

        <p className="text-muted-foreground">
          Approve, reject and publish class results
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-4">
          <Select value={sessionId} onValueChange={setSessionId}>
            <SelectTrigger>
              <SelectValue placeholder="Session" />
            </SelectTrigger>

            <SelectContent>
              {sessions.map((session) => (
                <SelectItem key={session.id} value={session.id}>
                  {session.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={termId} onValueChange={setTermId}>
            <SelectTrigger>
              <SelectValue placeholder="Term" />
            </SelectTrigger>

            <SelectContent>
              {terms.map((term) => (
                <SelectItem key={term.id} value={term.id}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Class" />
            </SelectTrigger>

            <SelectContent>
              {classes.map((schoolClass) => (
                <SelectItem key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={loadResults}>Load Results</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Result Batches</CardTitle>

          <Button variant="outline" onClick={exportResults}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading...</div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">No results found</div>
          ) : (
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left">Student</th>

                    <th className="p-3 text-left">Subjects</th>

                    <th className="p-3 text-left">Average</th>

                    <th className="p-3 text-left">Position</th>

                    <th className="p-3 text-left">Status</th>

                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((row: any) => (
                    <tr key={row.batch_id} className="border-t">
                      <td className="p-3">{row.student_name}</td>

                      <td className="p-3">{row.subject_count}</td>

                      <td className="p-3">{row.average}</td>

                      <td className="p-3">{row.position}</td>

                      <td className="p-3">{row.status}</td>

                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => approveBatch(row.batch_id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => publishBatch(row.batch_id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => rejectBatch(row.batch_id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>

                          <Link href={`/school-admin/results/${row.batch_id}`}>
                            <Button size="icon" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6">
            <Input
              placeholder="Rejection note..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
