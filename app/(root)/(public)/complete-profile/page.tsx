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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-4xl shadow-xl border">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold">
            Complete Your Profile
          </CardTitle>

          <div>
            <p className="font-medium text-lg">{user.email}</p>

            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-full bg-primary" />
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Profile Setup • Step 1 of 1
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* ROLE */}
          <div className="space-y-3">
            <Label>Profile Type</Label>

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
              <SelectTrigger>
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

            <p className="text-sm text-muted-foreground">
              Choose the profile type you want to use on the platform. School
              administrators cannot be created from this page.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">
                    Personal Information
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Update your basic account information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label>First Name</Label>

                    <Input
                      placeholder="John"
                      value={form.first_name || ""}
                      onChange={(e) => update("first_name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Last Name</Label>

                    <Input
                      placeholder="Doe"
                      value={form.last_name || ""}
                      onChange={(e) => update("last_name", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* STUDENT */}
          {selectedRole === "STUDENT" && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Academic Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Tell us about your academic details
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>

                      <Input
                        type="date"
                        onChange={(e) =>
                          update("date_of_birth", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Admission Date</Label>

                      <Input
                        type="date"
                        onChange={(e) =>
                          update("admission_date", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Gender</Label>

                      <Select
                        onValueChange={(value) => update("gender", value)}
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
                        disabled={loadingClasses}
                        onValueChange={(value) => update("class_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingClasses
                                ? "Loading classes..."
                                : "Select class"
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
                </div>
              </CardContent>
            </Card>
          )}

          {/* TEACHER */}
          {selectedRole === "TEACHER" && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Professional Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Provide your professional details
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Assigned Class</Label>

                      <Select
                        disabled={loadingClasses}
                        onValueChange={(value) => update("class_id", value)}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingClasses
                                ? "Loading classes..."
                                : "Select class"
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

                    <div className="space-y-2">
                      <Label>Hire Date</Label>

                      <Input
                        type="date"
                        onChange={(e) => update("hire_date", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Qualification</Label>

                      <Input
                        placeholder="B.Sc Education"
                        onChange={(e) =>
                          update("qualification", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Specialization</Label>

                      <Input
                        placeholder="Mathematics"
                        onChange={(e) =>
                          update("specialization", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* PARENT */}
          {selectedRole === "PARENT" && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Parent Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Help us know more about you
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Occupation</Label>

                      <Input
                        placeholder="Business Owner"
                        onChange={(e) => update("occupation", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>

                      <Input
                        placeholder="+234..."
                        onChange={(e) => update("phone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="button"
              size="lg"
              className="w-full h-12"
              disabled={loading}
              onClick={submit}
            >
              {loading ? "Saving Profile..." : "Save & Continue"}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-3">
              You can update these details later from your profile settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
