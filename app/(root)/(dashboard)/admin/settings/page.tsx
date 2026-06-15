"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";

import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="p-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>

        <p className="text-muted-foreground">
          Configure platform-wide settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Maintenance Mode</Label>

              <p className="text-sm text-muted-foreground">
                Prevent user access during maintenance.
              </p>
            </div>

            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Allow School Registration</Label>

              <p className="text-sm text-muted-foreground">
                Allow new schools to be onboarded.
              </p>
            </div>

            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>

              <p className="text-sm text-muted-foreground">
                Send platform alerts and updates.
              </p>
            </div>

            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <div>
            <strong>Name:</strong> LERNA
          </div>

          <div>
            <strong>Version:</strong> 1.0.0
          </div>

          <div>
            <strong>Environment:</strong>
            Production
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
