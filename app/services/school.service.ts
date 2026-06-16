// app/services/school.service.ts

import { api } from "@/lib/api";

export class SchoolService {
  static async onboardSchool(payload: {
    school_name: string;
    website?: string;
    phone: string;
    whatsapp_number?: string;
    state: string;
    address: string;
    description?: string;

    admin_first_name: string;
    admin_last_name: string;
    admin_email: string;
    admin_password: string;
  }) {
    const res = await api.post("/school-admin/onboard", payload);
    return res.data;
  }
}
