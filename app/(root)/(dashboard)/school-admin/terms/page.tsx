"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

import { toast } from "sonner";

import { Plus, CheckCircle, CalendarDays } from "lucide-react";

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

interface Session {
  id: string;
  name: string;
}

interface Term {
  id: string;
  name: string;
  session_id?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export default function TermsPage() {
  const [loading, setLoading] = useState(true);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);

  const [sessionId, setSessionId] = useState("");
  const [name, setName] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = async () => {
    try {
      const [sessionRes, termRes] = await Promise.all([
        SchoolAdminService.getSessions(),
        SchoolAdminService.getTerms(),
      ]);

      setSessions(
        Array.isArray(sessionRes?.sessions) ? sessionRes.sessions : [],
      );

      setTerms(Array.isArray(termRes?.terms) ? termRes.terms : []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load terms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadData());
  }, []);

  const createTerm = async () => {
    if (!sessionId || !name || !startDate || !endDate) {
      toast.error("All fields are required");

      return;
    }

    try {
      await SchoolAdminService.createTerm({
        session_id: sessionId,
        name,
        start_date: startDate,
        end_date: endDate,
      });

      toast.success("Term created");

      setSessionId("");
      setName("");
      setStartDate("");
      setEndDate("");

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create term");
    }
  };

  const activateTerm = async (termId: string) => {
    try {
      await SchoolAdminService.activateTerm(termId);

      toast.success("Term activated");

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to activate term");
    }
  };

  const groupedTerms = useMemo(() => {
    return sessions.map((session) => ({
      session,
      terms: terms.filter((term) => term.session_id === session.id),
    }));
  }, [sessions, terms]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Terms</h1>

          <p className="text-muted-foreground">
            Manage school terms under sessions
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Term
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Academic Term</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Academic Session</label>

                <select
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="border-input bg-background w-full rounded-md border px-3 py-2"
                >
                  <option value="">Select Session</option>

                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Term Name</label>

                <Input
                  placeholder="e.g. First Term"
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

              <Button className="w-full" onClick={createTerm}>
                Create Term
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-10 text-center">
            Loading terms...
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {groupedTerms.map((group) => (
            <Card key={group.session.id}>
              <CardHeader>
                <CardTitle>{group.session.name}</CardTitle>
              </CardHeader>

              <CardContent>
                {group.terms.length === 0 ? (
                  <div className="text-muted-foreground py-6 text-center">
                    No terms created
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {group.terms.map((term) => (
                      <Card key={term.id}>
                        <CardContent className="space-y-4 p-5">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{term.name}</h3>

                            {term.is_active && (
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                                Active
                              </span>
                            )}
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />

                              <span>
                                {term.start_date
                                  ? new Date(
                                      term.start_date,
                                    ).toLocaleDateString()
                                  : "-"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4" />

                              <span>
                                {term.end_date
                                  ? new Date(term.end_date).toLocaleDateString()
                                  : "-"}
                              </span>
                            </div>
                          </div>

                          {!term.is_active && (
                            <Button
                              className="w-full"
                              onClick={() => activateTerm(term.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate Term
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
