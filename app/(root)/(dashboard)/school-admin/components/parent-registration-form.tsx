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
    username: "",
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

      onSuccess(res.credentials.username, res.credentials.password);

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        occupation: "",
        phone: "",
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Parent</CardTitle>

        <CardDescription>
          Create a parent account. A temporary password will be generated
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
            <Label>Username</Label>

            <Input
              value={form.username}
              placeholder="jane"
              onChange={(e) => update("username", e.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              Login username:
              <span className="font-medium">
                {" "}
                schoolslug_
                {form.username || "username"}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Occupation</Label>

            <Input
              value={form.occupation}
              placeholder="Business Owner"
              onChange={(e) => update("occupation", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>

            <Input
              value={form.phone}
              placeholder="+234..."
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full" disabled={loading} onClick={submit}>
          {loading ? "Creating Parent..." : "Register Parent"}
        </Button>
      </CardContent>
    </Card>
  );
}
