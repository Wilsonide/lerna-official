/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProfileService } from "@/app/services/profile.service";
import { useAuthStore } from "@/app/store/auth-store";

export default function CompleteProfilePage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const [form, setForm] = useState<any>({});

  if (!user) {
    router.push("/login");
    return null;
  }

  async function submit() {
    try {
      await ProfileService.createProfile(form);

      router.push(`/${user?.role.toLowerCase()}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create profile");
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-20 space-y-6">
      <h1 className="text-2xl font-bold">Complete Your Profile</h1>

      {/* ================= STUDENT ================= */}
      {user.role === "STUDENT" && (
        <div className="space-y-4">
          <input
            placeholder="Admission Number"
            className="border p-3 w-full"
            onChange={(e) =>
              setForm({ ...form, admission_number: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-3 w-full"
            onChange={(e) =>
              setForm({ ...form, admission_date: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-3 w-full"
            onChange={(e) =>
              setForm({ ...form, date_of_birth: e.target.value })
            }
          />

          <select
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <input
            placeholder="Class ID"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, class_id: e.target.value })}
          />
        </div>
      )}

      {/* ================= TEACHER ================= */}
      {user.role === "TEACHER" && (
        <div className="space-y-4">
          <input
            placeholder="Employee ID"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          />

          <input
            type="date"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
          />

          <input
            placeholder="Qualification"
            className="border p-3 w-full"
            onChange={(e) =>
              setForm({ ...form, qualification: e.target.value })
            }
          />

          <input
            placeholder="Specialization"
            className="border p-3 w-full"
            onChange={(e) =>
              setForm({ ...form, specialization: e.target.value })
            }
          />
        </div>
      )}

      {/* ================= PARENT ================= */}
      {user.role === "PARENT" && (
        <div className="space-y-4">
          <input
            placeholder="Occupation"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
          />
        </div>
      )}

      {/* ================= SUBMIT ================= */}
      <button
        onClick={submit}
        className="bg-brand-blue text-white w-full p-3 rounded-md"
      >
        Save Profile
      </button>
    </div>
  );
}
