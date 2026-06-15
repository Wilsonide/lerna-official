"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminService } from "@/app/services/admin.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type School = {
  id: string;
  name: string;
};

interface Props {
  onSuccess?: () => void; // 👈 important
}

export default function CreateSchoolAdminModal({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    school_id: "",
  });

  useEffect(() => {
    async function loadSchools() {
      try {
        const data = await AdminService.getSchools();
        setSchools(data.schools ?? data);
      } catch {
        toast.error("Failed to load schools");
      }
    }

    loadSchools();
  }, []);

  function resetForm() {
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      school_id: "",
    });
  }

  async function submit() {
    try {
      setLoading(true);

      await AdminService.createSchoolAdmin(form);

      toast.success("School admin created");

      setOpen(false);
      resetForm();

      // ✅ IMPORTANT: refresh parent table instead of reload
      onSuccess?.();
    } catch {
      toast.error("Failed to create admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create School Admin</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create School Administrator</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />

          <Input
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />

          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            className="w-full border rounded-md p-3"
            value={form.school_id}
            onChange={(e) => setForm({ ...form, school_id: e.target.value })}
          >
            <option value="">Select School</option>

            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>

          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Admin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
