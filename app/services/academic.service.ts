import { api } from "@/lib/api";

export interface ActiveSession {
  id: string;
  name: string;
}

export interface ActiveTerm {
  id: string;
  name: string;
}

export interface ActiveAcademicPeriod {
  session: ActiveSession | null;
  term: ActiveTerm | null;
}

export const AcademicService = {
  async getActive(): Promise<ActiveAcademicPeriod> {
    const { data } = await api.get("/academic/active");
    return data;
  },
};
