"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

import { toast } from "sonner";

import { Search, FileText, ExternalLink } from "lucide-react";

import { teacherService } from "@/app/services/teacher.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Lesson } from "@/app/services/teacher.service";

export default function TeacherLessonsPage() {
  const [loading, setLoading] = useState(false);

  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [termName, setTermName] = useState("");

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const searchLessons = async () => {
    try {
      setLoading(true);

      const response = await teacherService.searchLessons({
        class_name: className,
        subject_name: subjectName,
        session_name: sessionName,
        term_name: termName,
      });

      setLessons(response.lessons || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Lessons</h1>

        <p className="text-muted-foreground">Search and manage lesson plans</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Search</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Input
              placeholder="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />

            <Input
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />

            <Input
              placeholder="Session"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />

            <Input
              placeholder="Term"
              value={termName}
              onChange={(e) => setTermName(e.target.value)}
            />
          </div>

          <Button className="mt-4" onClick={searchLessons} disabled={loading}>
            <Search className="mr-2 h-4 w-4" />

            {loading ? "Searching..." : "Search Lessons"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Results</CardTitle>
        </CardHeader>

        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No lessons found
            </div>
          ) : (
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="rounded-lg border p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />

                        <h3 className="font-semibold">{lesson.title}</h3>
                      </div>

                      <p className="mt-1 text-sm font-medium">{lesson.topic}</p>

                      <div className="text-muted-foreground mt-3 space-y-1 text-sm">
                        <p>Class: {lesson.class_name}</p>

                        <p>Subject: {lesson.subject_name}</p>

                        <p>Session: {lesson.session_name}</p>

                        <p>Term: {lesson.term_name}</p>

                        <p>Published: {lesson.is_published ? "Yes" : "No"}</p>
                      </div>

                      {lesson.objectives && (
                        <div className="mt-3">
                          <p className="text-sm font-medium">Objectives</p>

                          <p className="text-muted-foreground text-sm">
                            {lesson.objectives}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {lesson.file_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={lesson.file_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="text-muted-foreground mt-4 text-xs">
                    Created: {new Date(lesson.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
