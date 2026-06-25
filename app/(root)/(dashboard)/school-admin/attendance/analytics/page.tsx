"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { BarChart3, TrendingUp, Trophy, AlertTriangle } from "lucide-react";

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

export default function AttendanceAnalyticsPage() {
  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);

  const [terms, setTerms] = useState<any[]>([]);

  const [sessionId, setSessionId] = useState("");

  const [termId, setTermId] = useState("");

  const [analytics, setAnalytics] = useState<any>(null);

  const loadFilters = async () => {
    try {
      const [sessionsRes, termsRes] = await Promise.all([
        SchoolAdminService.getSessions(),
        SchoolAdminService.getTerms(),
      ]);

      const sessionsData = sessionsRes?.sessions || [];

      const termsData = termsRes?.terms || [];

      setSessions(sessionsData);
      setTerms(termsData);

      if (sessionsData.length > 0) {
        setSessionId(sessionsData[0].id);
      }

      if (termsData.length > 0) {
        setTermId(termsData[0].id);
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to load filters");
    }
  };

  const loadAnalytics = async () => {
    if (!sessionId || !termId) return;

    try {
      setLoading(true);

      const response = await SchoolAdminService.getAttendanceAnalytics(
        sessionId,
        termId,
      );

      setAnalytics(response);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadFilters());
  }, []);

  useEffect(() => {
    if (sessionId && termId) {
      void Promise.resolve().then(() => loadAnalytics());
    }
  }, [sessionId, termId]);

  const classComparison =
    analytics?.class_comparison || analytics?.classes || [];

  const bestClass = analytics?.best_class;

  const worstClass = analytics?.worst_class;

  const attendanceRate =
    analytics?.attendance_percentage || analytics?.overall_percentage || 0;

  const trend = analytics?.attendance_trend || [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Attendance Analytics</h1>

        <p className="text-muted-foreground">
          Attendance trends and performance across classes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-3">
          <Select value={sessionId} onValueChange={setSessionId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Session" />
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
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>

            <SelectContent>
              {terms.map((term) => (
                <SelectItem key={term.id} value={term.id}>
                  {term.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={loadAnalytics}>Refresh</Button>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            Loading analytics...
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Attendance Rate
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">{attendanceRate}%</h2>
                </div>

                <TrendingUp className="h-8 w-8 text-green-600" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Best Class</p>

                  <h2 className="mt-2 text-xl font-bold">
                    {bestClass?.name || "-"}
                  </h2>
                </div>

                <Trophy className="h-8 w-8 text-yellow-500" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-muted-foreground text-sm">Lowest Class</p>

                  <h2 className="mt-2 text-xl font-bold">
                    {worstClass?.name || "-"}
                  </h2>
                </div>

                <AlertTriangle className="h-8 w-8 text-red-500" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Class Comparison</CardTitle>
            </CardHeader>

            <CardContent>
              {classComparison.length === 0 ? (
                <div className="text-muted-foreground py-10 text-center">
                  No analytics available
                </div>
              ) : (
                <div className="overflow-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left">Class</th>

                        <th className="p-3 text-left">Present</th>

                        <th className="p-3 text-left">Absent</th>

                        <th className="p-3 text-left">Late</th>

                        <th className="p-3 text-left">Attendance %</th>
                      </tr>
                    </thead>

                    <tbody>
                      {classComparison.map((item: any) => (
                        <tr key={item.class_id} className="border-t">
                          <td className="p-3">{item.class_name}</td>

                          <td className="p-3">{item.present}</td>

                          <td className="p-3">{item.absent}</td>

                          <td className="p-3">{item.late}</td>

                          <td className="p-3 font-medium">
                            {item.attendance_percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Trend</CardTitle>
            </CardHeader>

            <CardContent>
              {trend.length === 0 ? (
                <div className="text-muted-foreground py-10 text-center">
                  No trend data
                </div>
              ) : (
                <div className="space-y-3">
                  {trend.map((item: any, index: number) => (
                    <div
                      key={item.date || index}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{item.date}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />

                        <span className="font-semibold">
                          {item.attendance_percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
