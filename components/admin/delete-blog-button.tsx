/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import Modal from "@/components/ui/modal";
import { BlogService } from "@/app/services/blog.services";

export default function DeleteBlogButton({ id }: { id: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    const toastId = toast.loading("Deleting blog...");

    try {
      setLoading(true);

      await BlogService.deleteBlog(id);

      toast.success("Blog deleted successfully", {
        id: toastId,
      });

      setOpen(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete blog", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Delete
      </button>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Delete Blog">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm rounded-lg border"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}
