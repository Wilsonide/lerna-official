"use client";

import { useEffect, useState } from "react";

import {
  AcademicService,
  ActiveAcademicPeriod,
} from "@/app/services/academic.service";

export function useAcademicPeriod() {
  const [data, setData] = useState<ActiveAcademicPeriod | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await AcademicService.getActive();

        setData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    academicPeriod: data,
    session: data?.session,
    term: data?.term,
    loading,
  };
}
