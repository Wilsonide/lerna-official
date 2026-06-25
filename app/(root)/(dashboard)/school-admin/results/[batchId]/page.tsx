"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { toast } from "sonner";

import { CheckCircle, Clock, Send, XCircle } from "lucide-react";

import { SchoolAdminService } from "@/app/services/school-admin.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApprovalHistory {
  id: string;
  action: string;
  note?: string;
  created_at: string;
  user_name?: string;
}

export default function ResultApprovalHistoryPage() {
  const params = useParams();

  const batchId = params.batchId as string;

  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState<ApprovalHistory[]>([]);

  const loadHistory = async () => {
    try {
      const response =
        await SchoolAdminService.getResultApprovalHistory(batchId);

      setHistory(
        Array.isArray(response?.history)
          ? response.history
          : Array.isArray(response)
            ? response
            : [],
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to load approval history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) {
      void Promise.resolve().then(() => loadHistory());
    }
  }, [batchId]);

  const getIcon = (action: string) => {
    const value = action?.toLowerCase?.() || "";

    if (value.includes("approve")) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }

    if (value.includes("reject")) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }

    if (value.includes("publish")) {
      return <Send className="h-5 w-5 text-blue-600" />;
    }

    return <Clock className="h-5 w-5 text-yellow-600" />;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">Result Approval History</h1>

        <p className="text-muted-foreground">
          Timeline of approval actions for this result batch
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Timeline</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No approval history found
            </div>
          ) : (
            <div className="relative ml-3 border-l">
              {history.map((item, index) => (
                <div key={item.id || index} className="relative mb-8 ml-6">
                  <div className="absolute -left-[35px] rounded-full bg-white p-1">
                    {getIcon(item.action)}
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold capitalize">
                          {item.action}
                        </h3>

                        <p className="text-muted-foreground text-sm">
                          By {item.user_name || "System"}
                        </p>
                      </div>

                      <span className="text-muted-foreground text-sm">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>

                    {item.note && (
                      <div className="bg-muted mt-4 rounded-md p-3 text-sm">
                        {item.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
