"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { RegistrationService } from "@/app/services/registration.service";
import { StudentService } from "@/app/services/student.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  onSuccess: (username: string, password: string) => void;
};

type ClassItem = {
  id: string;
  name: string;
  level?: string;
};

export default function StudentRegistrationForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [classes, setClasses] = useState<ClassItem[]>([]);

  const [loadingClasses, setLoadingClasses] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    date_of_birth: "",
    admission_date: "",
    class_name: "",
  });

  function update(key: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  useEffect(() => {
    (async () => {
      try {
        setLoadingClasses(true);

        const res = await StudentService.getClasses();

        setClasses(res.classes || res || []);
      } catch {
        toast.error("Unable to load classes.");
      } finally {
        setLoadingClasses(false);
      }
    })();
  }, []);

  async function submit() {
    try {
      setLoading(true);

      const res = await RegistrationService.registerStudent(form);

      toast.success("Student registered successfully.");

      onSuccess(res.credentials.username, res.credentials.password);

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        date_of_birth: "",
        admission_date: "",
        class_name: "",
      });
      setSelectedClassId("");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Student</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>First Name</Label>

            <Input
              value={form.first_name}
              placeholder="John"
              onChange={(e) => update("first_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Last Name</Label>

            <Input
              value={form.last_name}
              placeholder="Doe"
              onChange={(e) => update("last_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              value={form.email}
              placeholder="john@gmail.com"
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-medium">
              Login credentials are generated automatically.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Username and temporary password will be created by the system
              after registration.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>

            <Select
              value={form.gender}
              onValueChange={(v) => update("gender", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="male">Male</SelectItem>

                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Class</Label>

            <Select
              value={selectedClassId}
              onValueChange={(value) => {
                setSelectedClassId(value);

                const selected = classes.find((c) => c.id === value);

                update("class_name", selected?.name ?? "");
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={loadingClasses ? "Loading..." : "Select class"}
                />
              </SelectTrigger>

              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                    {cls.level ? ` (${cls.level})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date of Birth</Label>

            <Input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => update("date_of_birth", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Admission Date</Label>

            <Input
              type="date"
              value={form.admission_date}
              onChange={(e) => update("admission_date", e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full" disabled={loading} onClick={submit}>
          {loading ? "Registering..." : "Register Student"}
        </Button>
      </CardContent>
    </Card>
  );
}
