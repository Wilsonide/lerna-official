/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SchoolOnboardingForm() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40 flex justify-center p-6">
      <div className="w-full max-w-3xl space-y-6">
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            School Registration
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete your school profile to join the platform and get
            discovered.
          </p>
        </div>

        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Name of School" />
            <Input placeholder="Website (e.g. www.school.com)" />
            <Input placeholder="School Address" />
            <Input placeholder="State" />
          </CardContent>
        </Card>

        {/* CONTACT */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Contact Person Name" />
            <Input placeholder="Phone Number" />
            <Input placeholder="WhatsApp Number" />
            <Input type="email" placeholder="Email Address" />
          </CardContent>
        </Card>

        {/* SCHOOL DETAILS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">School Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe your school (history, vision, mission, achievements...)"
              className="min-h-[120px]"
            />

            <div>
              <label className="text-sm font-medium">School Logo</label>
              <Input type="file" className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* OPTIONS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">School Metrics</CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Average School Fees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Less than ₦40,001</SelectItem>
                <SelectItem value="mid1">₦40,001 - ₦80,000</SelectItem>
                <SelectItem value="mid2">₦80,001 - ₦120,000</SelectItem>
                <SelectItem value="high">Above ₦120,000</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="School Population" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-100">0 - 100</SelectItem>
                <SelectItem value="101-200">101 - 200</SelectItem>
                <SelectItem value="201-300">201 - 300</SelectItem>
                <SelectItem value="301-400">301 - 400</SelectItem>
                <SelectItem value="400+">Above 400</SelectItem>
              </SelectContent>
            </Select>

            <div className="md:col-span-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="How did you find us?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="nairaland">Nairaland</SelectItem>
                  <SelectItem value="referral">Friend / Family</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="physical">Physical Marketing</SelectItem>
                  <SelectItem value="afed">AFED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* TERMS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Terms & Conditions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Your school may be featured on our partner blog (
              <span className="font-medium">studyinnigeria.com</span>) for SEO
              visibility and exposure.
            </p>

            <p>
              Child-friendly sponsors may visit your school for educational
              activities, events, and brand engagements.
            </p>

            <p>
              Sponsors may support your school through donations, branding, or
              event sponsorship (e.g. inter-house sports, end-of-year parties).
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(v: any) => setAgreed(!!v)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none"
              >
                I agree to the terms and conditions
              </label>
            </div>
          </CardContent>
        </Card>

        {/* SUBMIT */}
        <Button
          disabled={!agreed}
          className="w-full h-11 text-sm font-semibold"
        >
          Submit Registration
        </Button>
      </div>
    </div>
  );
}
