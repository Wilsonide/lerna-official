/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { RegistrationService } from "@/app/services/registration.service";
import { StudentService } from "@/app/services/student.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  onSuccess: (credentials: { username: string; password: string }) => void;
};

type ClassItem = {
  id: string;
  name: string;
  level?: string;
};

export default function TeacherRegistrationForm({ onSuccess }: Props) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    qualification: "",
    specialization: "",
    hire_date: "",
    class_name: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await StudentService.getClasses();

        setClasses(res.classes || res || []);
      } catch {
        toast.error("Unable to load classes.");
      } finally {
        setLoadingClasses(false);
      }
    }

    load();
  }, []);

  function update(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function submit() {
    try {
      setLoading(true);

      const res = await RegistrationService.registerTeacher(form);

      toast.success("Teacher registered successfully.");

      onSuccess(res.credentials);

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        qualification: "",
        specialization: "",
        hire_date: "",
        class_name: "",
      });

      setSelectedClassId("");
    } catch (err: any) {
      console.log(err?.response?.data);
      toast.error(err?.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Teacher</CardTitle>

        <CardDescription>
          Create a new teacher account. Login credentials will be generated
          automatically.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>First Name</Label>

            <Input
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Last Name</Label>

            <Input
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Qualification</Label>

            <Input
              value={form.qualification}
              onChange={(e) => update("qualification", e.target.value)}
              placeholder="B.Sc Education"
            />
          </div>

          <div className="space-y-2">
            <Label>Specialization</Label>

            <Input
              value={form.specialization}
              onChange={(e) => update("specialization", e.target.value)}
              placeholder="Mathematics"
            />
          </div>

          <div className="space-y-2">
            <Label>Hire Date</Label>

            <Input
              type="date"
              value={form.hire_date}
              onChange={(e) => update("hire_date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Assigned Class</Label>

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
        </div>

        <Button className="w-full" disabled={loading} onClick={submit}>
          {loading ? "Creating Teacher..." : "Register Teacher"}
        </Button>
      </CardContent>
    </Card>
  );
}
