"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Plus, Calendar, CheckCircle } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AcademicSession {
  id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<AcademicSession[]>([]);

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadSessions = async () => {
    try {
      const response = await SchoolAdminService.getSessions();

      setSessions(Array.isArray(response?.sessions) ? response.sessions : []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadSessions());
  }, []);

  const createSession = async () => {
    if (!name || !startDate || !endDate) {
      toast.error("All fields are required");

      return;
    }

    try {
      await SchoolAdminService.createSession({
        name,
        start_date: startDate,
        end_date: endDate,
      });

      toast.success("Academic session created");

      setName("");
      setStartDate("");
      setEndDate("");

      await loadSessions();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create session");
    }
  };

  const activateSession = async (sessionId: string) => {
    try {
      await SchoolAdminService.activateSession(sessionId);

      toast.success("Session activated successfully");

      await loadSessions();
    } catch (error) {
      console.error(error);

      toast.error("Failed to activate session");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Sessions</h1>

          <p className="text-muted-foreground">
            Manage school academic sessions
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Session
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Academic Session</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Name</label>

                <Input
                  placeholder="e.g. 2025/2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>

                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>

                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={createSession}>
                Create Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-10 text-center">
            Loading sessions...
          </CardContent>
        </Card>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            No sessions found
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{session.name}</CardTitle>

                    <p className="text-muted-foreground mt-1 text-sm">
                      Academic Session
                    </p>
                  </div>

                  {session.is_active ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Start Date</span>

                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="h-4 w-4" />

                        <span>
                          {session.start_date
                            ? new Date(session.start_date).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">End Date</span>

                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="h-4 w-4" />

                        <span>
                          {session.end_date
                            ? new Date(session.end_date).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {!session.is_active && (
                  <Button
                    className="w-full"
                    onClick={() => activateSession(session.id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate Session
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
