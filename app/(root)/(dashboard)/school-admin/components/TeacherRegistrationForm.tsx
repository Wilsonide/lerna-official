"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { toast } from "sonner";

import { RegistrationService } from "@/app/services/registration.service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  onSuccess: (username: string, password: string) => void;
};

export default function ParentRegistrationForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    occupation: "",
    phone: "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function submit() {
    try {
      setLoading(true);

      const res = await RegistrationService.registerParent(form);

      toast.success("Parent registered successfully.");

      onSuccess(res.username, res.password);

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        occupation: "",
        phone: "",
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Parent registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Parent</CardTitle>

        <CardDescription>
          Parent login credentials are generated automatically by the system.
          After registration, the username and temporary password will be
          displayed and stored for the school administrator.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>First Name</Label>

            <Input
              placeholder="Jane"
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Last Name</Label>

            <Input
              placeholder="Doe"
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>

            <Input
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>

            <Input
              placeholder="+2348012345678"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Occupation</Label>

            <Input
              placeholder="Business Owner"
              value={form.occupation}
              onChange={(e) => update("occupation", e.target.value)}
            />
          </div>

          <div className="md:col-span-2 rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-medium">Login Credentials</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Username and password are generated automatically by the system.
              They will be shown immediately after registration and remain
              available to the school administrator from the Parents page.
            </p>
          </div>
        </div>

        <Button className="w-full" disabled={loading} onClick={submit}>
          {loading ? "Registering Parent..." : "Register Parent"}
        </Button>
      </CardContent>
    </Card>
  );
}
