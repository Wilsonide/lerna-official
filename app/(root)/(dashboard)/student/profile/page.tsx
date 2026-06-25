"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { ProfileService } from "@/app/services/profile.service";

import { StudentProfileForm } from "@/components/profile/student-profile-form";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { useAuthStore } from "@/app/store/auth-store";

export default function StudentProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await ProfileService.getMyProfile();

        setData(response);
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.detail ||
            err?.message ||
            "Failed to load profile",
        );
      } finally {
        setLoading(false);
      }
    };

    if (!hydrated) return;

    loadProfile();
  }, [hydrated]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">
            Profile information not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <StudentProfileForm user={data.user} profile={data.profile} />
    </div>
  );
}
