"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

import { ProfileService } from "@/app/services/profile.service";

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

interface Props {
  user: any;
  profile: any;
}

export function TeacherProfileForm({ user, profile }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    qualification: profile?.qualification ?? "",
    specialization: profile?.specialization ?? "",
  });

  const update = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function save() {
    try {
      setLoading(true);

      await ProfileService.updateProfile(form);

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-4xl shadow-sm">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-3xl font-bold">Teacher Profile</CardTitle>

          <CardDescription>
            Manage your personal and professional information
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">Personal Information</h3>

                <p className="text-sm text-muted-foreground">
                  Update your basic profile information
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">
                  Professional Information
                </h3>

                <p className="text-sm text-muted-foreground">
                  Your teaching and qualification details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Employee ID</Label>

                  <Input value={profile?.employee_id ?? ""} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Qualification</Label>

                  <Input
                    placeholder="B.Sc Education"
                    value={form.qualification}
                    onChange={(e) => update("qualification", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Specialization</Label>

                  <Input
                    placeholder="Mathematics"
                    value={form.specialization}
                    onChange={(e) => update("specialization", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t pt-6">
              <Button size="lg" onClick={save} disabled={loading}>
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
