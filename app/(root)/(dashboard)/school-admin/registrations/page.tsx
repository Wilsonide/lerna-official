"use client";

import RegistrationTabs from "../components/registration-tabs";

export default function SchoolAdminSettingsPage() {
  return (
    <div className="space-y-8 p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Registration</h1>

        <p className="mt-2 text-muted-foreground">
          Register students, teachers and parents individually or import them in
          bulk using Excel templates.
        </p>
      </div>

      <RegistrationTabs />
    </div>
  );
}
