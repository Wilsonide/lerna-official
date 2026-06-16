"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { SchoolService } from "@/app/services/school.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterSchoolPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [school_name, setSchoolName] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp_number, setWhatsapp] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [admin_first_name, setFirstName] = useState("");
  const [admin_last_name, setLastName] = useState("");
  const [admin_email, setEmail] = useState("");
  const [admin_password, setPassword] = useState("");

  async function submit() {
    try {
      setLoading(true);

      const res = await SchoolService.onboardSchool({
        school_name,
        website,
        phone,
        whatsapp_number,
        state,
        address,
        description,
        admin_first_name,
        admin_last_name,
        admin_email,
        admin_password,
      });

      toast.success("School created successfully");

      router.push(`/school-admin`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create school");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-11 text-sm bg-white/70 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-blue-200/30 rounded-full blur-3xl top-[-80px] left-[-80px]" />
        <div className="absolute w-96 h-96 bg-indigo-200/25 rounded-full blur-3xl bottom-[-120px] right-[-120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Build Your Smart School Operating System
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Centralize students, teachers, parents, attendance, exams and
              communication into one modern digital workspace.
            </p>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p>✔ Launch your school dashboard in minutes</p>
            <p>✔ Auto-generated admin workspace</p>
            <p>✔ Role-based access control built-in</p>
            <p>✔ Scalable for any school size</p>
          </div>

          {/* ✅ UPGRADED PROFESSIONAL SVG (REPLACED) */}
          <div className="pt-6 opacity-95">
            <svg
              width="380"
              height="260"
              viewBox="0 0 380 260"
              fill="none"
              className="drop-shadow-xl"
            >
              {/* Background panel */}
              <rect
                x="20"
                y="20"
                width="340"
                height="220"
                rx="18"
                fill="#EEF2FF"
              />

              {/* Sidebar */}
              <rect
                x="40"
                y="40"
                width="60"
                height="180"
                rx="12"
                fill="#C7D2FE"
              />
              <circle cx="70" cy="70" r="10" fill="#6366F1" />
              <circle cx="70" cy="100" r="6" fill="#818CF8" />
              <circle cx="70" cy="125" r="6" fill="#818CF8" />
              <circle cx="70" cy="150" r="6" fill="#818CF8" />

              {/* Main card */}
              <rect
                x="120"
                y="40"
                width="220"
                height="80"
                rx="12"
                fill="#FFFFFF"
              />
              <rect
                x="140"
                y="60"
                width="120"
                height="10"
                rx="5"
                fill="#CBD5E1"
              />
              <rect
                x="140"
                y="80"
                width="160"
                height="10"
                rx="5"
                fill="#E2E8F0"
              />

              {/* Analytics cards */}
              <rect
                x="120"
                y="140"
                width="100"
                height="60"
                rx="12"
                fill="#FFFFFF"
              />
              <rect
                x="240"
                y="140"
                width="100"
                height="60"
                rx="12"
                fill="#FFFFFF"
              />

              {/* Chart lines */}
              <polyline
                points="130,180 150,165 170,170 190,150"
                stroke="#6366F1"
                strokeWidth="2"
                fill="none"
              />

              <polyline
                points="250,180 270,160 290,175 310,150"
                stroke="#22C55E"
                strokeWidth="2"
                fill="none"
              />

              {/* Floating accent dots */}
              <circle cx="330" cy="60" r="4" fill="#6366F1" />
              <circle cx="315" cy="85" r="3" fill="#22C55E" />
              <circle cx="340" cy="95" r="2.5" fill="#F59E0B" />
            </svg>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="relative">
          <Card className="shadow-xl border border-slate-200/60 bg-white/70 backdrop-blur-2xl rounded-2xl">
            <CardContent className="p-8 space-y-6">
              {/* HEADER */}
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Create School Workspace
                </h2>
                <p className="text-sm text-slate-500">
                  Set up your institution in under 2 minutes
                </p>
              </div>

              {/* SCHOOL BASIC */}
              <div className="space-y-3">
                <Label>School Name</Label>
                <Input
                  className={inputClass}
                  value={school_name}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Label>Phone</Label>
                  <Input
                    className={inputClass}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>WhatsApp</Label>
                  <Input
                    className={inputClass}
                    value={whatsapp_number}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Label>State</Label>
                  <Input
                    className={inputClass}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Website</Label>
                  <Input
                    className={inputClass}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Address</Label>
                <Input
                  className={inputClass}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>School Description</Label>
                <Textarea
                  className="min-h-[90px] text-sm bg-white/70 border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* ADMIN */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <p className="text-sm font-medium text-slate-700">
                  Administrator Account
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    className={inputClass}
                    placeholder="First Name"
                    value={admin_first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                  />

                  <Input
                    className={inputClass}
                    placeholder="Last Name"
                    value={admin_last_name}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <Input
                  className={inputClass}
                  placeholder="Email"
                  value={admin_email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* PASSWORD */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={admin_password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <Button
                onClick={submit}
                disabled={loading}
                className="w-full h-11 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 transition"
              >
                {loading ? "Creating School..." : "Launch School Workspace"}
              </Button>

              <p className="text-xs text-center text-slate-500">
                By continuing you agree to onboarding terms and school policies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
