/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { Loader2 } from "lucide-react";

import { CreateSchoolPayload } from "@/app/services/admin.service";

interface Props {
  loading?: boolean;
  onSubmit: (payload: CreateSchoolPayload) => Promise<void>;
}

export default function SchoolForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<CreateSchoolPayload>({
    school_name: "",
    website: "",
    phone: "",
    whatsapp_number: "",
    state: "",
    address: "",
    description: "",

    admin_first_name: "",
    admin_last_name: "",
    admin_email: "",
    admin_password: "",
  });

  function update<K extends keyof CreateSchoolPayload>(
    key: K,
    value: CreateSchoolPayload[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await onSubmit(form);
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* ================= SCHOOL ================= */}

      <div className="space-y-5">
        <h3 className="text-lg font-semibold">School Information</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label>School Name *</Label>

            <Input
              value={form.school_name}
              onChange={(e) => update("school_name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Website</Label>

            <Input
              placeholder="https://school.com"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>

          <div>
            <Label>Phone *</Label>

            <Input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>WhatsApp Number</Label>

            <Input
              value={form.whatsapp_number}
              onChange={(e) => update("whatsapp_number", e.target.value)}
            />
          </div>

          <div>
            <Label>State *</Label>

            <Input
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Address *</Label>

            <Input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>

          <Textarea
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>
      </div>

      {/* ================= ADMIN ================= */}

      <div className="space-y-5 border-t pt-6">
        <h3 className="text-lg font-semibold">School Administrator</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label>First Name *</Label>

            <Input
              value={form.admin_first_name}
              onChange={(e) => update("admin_first_name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Last Name *</Label>

            <Input
              value={form.admin_last_name}
              onChange={(e) => update("admin_last_name", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Email *</Label>

            <Input
              type="email"
              value={form.admin_email}
              onChange={(e) => update("admin_email", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Password *</Label>

            <Input
              type="password"
              value={form.admin_password}
              onChange={(e) => update("admin_password", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create School
      </Button>
    </form>
  );
}
