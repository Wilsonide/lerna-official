"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  loading?: boolean;
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  }) => Promise<void>;
};

export default function SchoolForm({
  initialValues,
  loading,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    name: initialValues?.name || "",
    email: initialValues?.email || "",
    phone: initialValues?.phone || "",
    address: initialValues?.address || "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  async function handleSubmit() {
    if (!form.name || !form.email || !form.phone) return;

    await onSubmit(form);
  }

  return (
    <div className="space-y-5">
      {/* NAME */}
      <div className="space-y-2">
        <label className="text-sm font-medium">School Name</label>
        <Input
          placeholder="e.g. Lerna International School"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {/* EMAIL */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Official Email</label>
        <Input
          placeholder="school@example.com"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>

      {/* PHONE */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <Input
          placeholder="+234 800 000 0000"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>

      {/* ADDRESS */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Address</label>
        <Textarea
          placeholder="Full school address..."
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      {/* SUBMIT */}
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Processing..." : "Save School"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        All fields are required for proper onboarding.
      </p>
    </div>
  );
}
