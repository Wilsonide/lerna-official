"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SchoolAdminSettingsPage() {
  const [loading, setLoading] = useState(false);

  // =========================
  // SCHOOL PROFILE STATE
  // =========================
  const [schoolName, setSchoolName] = useState("LERNA International School");
  const [email, setEmail] = useState("info@lerna.com");
  const [phone, setPhone] = useState("08000000000");
  const [address, setAddress] = useState("Main Campus");

  // =========================
  // SECURITY STATE
  // =========================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // =========================
  // SAVE PROFILE
  // =========================
  async function saveProfile() {
    try {
      setLoading(true);

      // TODO: replace with API call
      // await SchoolAdminService.updateSchoolSettings(...)

      await new Promise((r) => setTimeout(r, 800));

      toast.success("School profile updated successfully");
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // CHANGE PASSWORD
  // =========================
  async function changePassword() {
    try {
      setLoading(true);

      if (!currentPassword || !newPassword) {
        toast.error("Fill in all password fields");
        return;
      }

      // TODO: API call
      await new Promise((r) => setTimeout(r, 800));

      toast.success("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">School Settings</h1>
        <p className="text-muted-foreground">
          Manage your school profile and system preferences
        </p>
      </div>

      {/* =========================
          SCHOOL PROFILE
      ========================= */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>School Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="School Name"
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="School Email"
            />

            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />

            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button onClick={saveProfile} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* =========================
          BRANDING (OPTIONAL)
      ========================= */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Upload your school logo (used on certificates, invoices, and portal
            UI)
          </p>

          <Input type="file" />

          <Button variant="outline">Upload Logo</Button>
        </CardContent>
      </Card>

      {/* =========================
          SECURITY
      ========================= */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <div className="flex justify-end">
            <Button onClick={changePassword} disabled={loading}>
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* =========================
          SYSTEM INFO (OPTIONAL)
      ========================= */}
      <Card className="shadow-sm border-dashed">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>Plan: Basic</p>
          <p>Status: Active</p>
          <p>School Code: LERNA-XXXX</p>
        </CardContent>
      </Card>
    </div>
  );
}
