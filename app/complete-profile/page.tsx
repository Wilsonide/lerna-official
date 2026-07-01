"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/app/store/auth-store";
import { ProfileService } from "@/app/services/profile.service";
import { StudentService } from "@/app/services/student.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import AuthLayout from "@/components/auth/auth-layout";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ClassItem = {
  id: string;
  name: string;
  level?: string;
};

const ALLOWED_ROLES = [
  {
    label: "Student",
    value: "STUDENT",
  },
  {
    label: "Teacher",
    value: "TEACHER",
  },
  {
    label: "Parent",
    value: "PARENT",
  },
];

export default function CompleteProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const router = useRouter();

  const [form, setForm] = useState<any>({
    role: "STUDENT",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [selectedRole, setSelectedRole] = useState<
    "STUDENT" | "TEACHER" | "PARENT"
  >("STUDENT");

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  const update = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!user) return;

    if (selectedRole !== "STUDENT" && selectedRole !== "TEACHER") {
      return;
    }

    (async () => {
      try {
        setLoadingClasses(true);

        const res = await StudentService.getClasses();

        setClasses(res?.classes || res || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingClasses(false);
      }
    })();
  }, [selectedRole, user]);

  if (!user) {
    router.push("/login");
    return null;
  }

  async function submit() {
    try {
      setError("");
      if (!form.first_name?.trim()) {
        setError("First name is required");
        return;
      }

      if (!form.last_name?.trim()) {
        setError("Last name is required");
        return;
      }

      // =========================
      // STUDENT VALIDATION
      // =========================
      if (selectedRole === "STUDENT") {
        if (!form.date_of_birth) {
          setError("Date of birth is required");
          return;
        }

        if (!form.gender) {
          setError("Gender is required");
          return;
        }

        if (!form.class_id) {
          setError("Please select a class");
          return;
        }
      }

      // =========================
      // TEACHER VALIDATION
      // =========================
      if (selectedRole === "TEACHER") {
        if (!form.class_id) {
          setError("Please select a class");
          return;
        }

        if (!form.qualification?.trim()) {
          setError("Qualification is required");
          return;
        }

        if (!form.specialization?.trim()) {
          setError("Specialization is required");
          return;
        }
      }

      // =========================
      // PARENT VALIDATION
      // =========================
      if (selectedRole === "PARENT") {
        if (!form.occupation?.trim()) {
          setError("Occupation is required");
          return;
        }
      }

      setLoading(true);

      const response = await ProfileService.createProfile({
        ...form,
        role: selectedRole,
      });

      // update auth store immediately
      if (user) {
        setUser({
          ...user,
          first_name: form.first_name,
          last_name: form.last_name,
          role: selectedRole,
          profile_completed: true,
        });
      }

      // if backend returns updated user, prefer it
      if (response?.user) {
        setUser(response.user);
      }

      router.replace(`/${selectedRole.toLowerCase()}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to create profile",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Complete Your Profile
          </h1>

          <p className="text-muted-foreground text-base">
            Finish setting up your account to access your dashboard.
          </p>
        </div>

        {/* Account Summary */}

        <div className="rounded-2xl border bg-muted/40 p-5">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Signed in as
            </p>

            <p className="font-semibold text-lg">
              {user.first_name || "New User"} {user.last_name || ""}
            </p>

            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Progress */}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Profile Setup</span>

            <span className="text-muted-foreground">Step 1 of 1</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full rounded-full bg-brand-blue" />
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Profile Type */}

        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Select Profile Type</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose the account you want to complete. School administrators are
              created by the system.
            </p>
          </div>

          <Select
            value={selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value as "STUDENT" | "TEACHER" | "PARENT");

              setForm((prev: any) => ({
                first_name: prev.first_name,
                last_name: prev.last_name,
                role: value,
              }));

              setError("");
            }}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {ALLOWED_ROLES.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Personal Information */}

        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Tell us a little about yourself.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>First Name</Label>

              <Input
                className="h-12 rounded-xl"
                placeholder="John"
                value={form.first_name || ""}
                onChange={(e) => update("first_name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>

              <Input
                className="h-12 rounded-xl"
                placeholder="Doe"
                value={form.last_name || ""}
                onChange={(e) => update("last_name", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* STUDENT */}
        {/* STUDENT */}

        {selectedRole === "STUDENT" && (
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Academic Information</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Provide your student information to complete your academic
                profile.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Date of Birth */}

              <div className="space-y-2">
                <Label>Date of Birth</Label>

                <Input
                  type="date"
                  className="h-12 rounded-xl"
                  onChange={(e) => update("date_of_birth", e.target.value)}
                />
              </div>

              {/* Admission Date */}

              <div className="space-y-2">
                <Label>Admission Date</Label>

                <Input
                  type="date"
                  className="h-12 rounded-xl"
                  onChange={(e) => update("admission_date", e.target.value)}
                />
              </div>

              {/* Gender */}

              <div className="space-y-2">
                <Label>Gender</Label>

                <Select onValueChange={(value) => update("gender", value)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>

                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Class */}

              <div className="space-y-2">
                <Label>Class</Label>

                <Select
                  disabled={loadingClasses}
                  onValueChange={(value) => update("class_id", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue
                      placeholder={
                        loadingClasses ? "Loading classes..." : "Select class"
                      }
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

            <div className="mt-6 rounded-xl border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                Your class selection will be submitted for school verification.
                Additional academic information can be updated later from your
                student dashboard.
              </p>
            </div>
          </div>
        )}

        {/* TEACHER */}

        {selectedRole === "TEACHER" && (
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Professional Information
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Tell us about your teaching experience and assignment.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Assigned Class */}

              <div className="space-y-2">
                <Label>Assigned Class</Label>

                <Select
                  disabled={loadingClasses}
                  onValueChange={(value) => update("class_id", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue
                      placeholder={
                        loadingClasses ? "Loading classes..." : "Select class"
                      }
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

              {/* Hire Date */}

              <div className="space-y-2">
                <Label>Hire Date</Label>

                <Input
                  type="date"
                  className="h-12 rounded-xl"
                  onChange={(e) => update("hire_date", e.target.value)}
                />
              </div>

              {/* Qualification */}

              <div className="space-y-2">
                <Label>Qualification</Label>

                <Input
                  className="h-12 rounded-xl"
                  placeholder="B.Sc Education"
                  onChange={(e) => update("qualification", e.target.value)}
                />
              </div>

              {/* Specialization */}

              <div className="space-y-2">
                <Label>Specialization</Label>

                <Input
                  className="h-12 rounded-xl"
                  placeholder="Mathematics"
                  onChange={(e) => update("specialization", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                Your information will be reviewed by your school before teaching
                assignments become active. You can edit these details later from
                your profile.
              </p>
            </div>
          </div>
        )}
        {/* PARENT */}

        {selectedRole === "PARENT" && (
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Parent Information</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Help us identify you and keep communication with the school
                easy.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Occupation</Label>

                <Input
                  className="h-12 rounded-xl"
                  placeholder="Business Owner"
                  onChange={(e) => update("occupation", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>

                <Input
                  className="h-12 rounded-xl"
                  placeholder="+234..."
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">
                Your phone number will be used by your child&apos;s school for
                important announcements and emergency communication.
              </p>
            </div>
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit */}

        <div className="space-y-4">
          <Button
            type="button"
            onClick={submit}
            disabled={loading}
            className="h-12 w-full rounded-xl bg-brand-blue text-base hover:bg-brand-blue/90"
          >
            {loading ? "Saving Profile..." : "Complete Profile"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            By continuing, you confirm that the information provided is
            accurate. You can update your profile later from your account
            settings.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
