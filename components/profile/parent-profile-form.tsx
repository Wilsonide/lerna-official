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

export function ParentProfileForm({ user, profile }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    occupation: profile?.occupation ?? "",
    phone: profile?.phone ?? "",
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
        <CardHeader className="border-b pb-6 text-center">
          <CardTitle className="text-3xl font-bold">Parent Profile</CardTitle>

          <CardDescription>
            Manage your personal and contact information
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">Personal Information</h3>

                <p className="text-sm text-muted-foreground">
                  Update your account details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  <Label>Email Address</Label>

                  <Input value={user?.email ?? ""} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>

                  <Input value="Parent" disabled />
                </div>
              </div>
            </div>

            {/* Parent Information */}
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold">Parent Information</h3>

                <p className="text-sm text-muted-foreground">
                  Information used for communication and identification
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Occupation</Label>

                  <Input
                    placeholder="Business Owner"
                    value={form.occupation}
                    onChange={(e) => update("occupation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>

                  <Input
                    placeholder="+234..."
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t pt-6">
              <Button size="lg" disabled={loading} onClick={save}>
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
