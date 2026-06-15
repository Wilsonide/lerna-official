"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolAdminService } from "@/app/services/school-admin.service";

type Stats = {
  students: number;
  teachers: number;
  classes: number;
};

export default function SchoolAdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    students: 0,
    teachers: 0,
    classes: 0,
  });

  useEffect(() => {
    async function load() {
      const data = await SchoolAdminService.getStats();
      setStats(data);
    }

    load();
  }, []);

  return (
    <div className="space-y-6 p-10">
      <div>
        <h1 className="text-3xl font-bold">School Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your school activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.students}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teachers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.teachers}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.classes}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
