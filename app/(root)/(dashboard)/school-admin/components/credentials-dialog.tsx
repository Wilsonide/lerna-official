"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

type Props = {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  username: string;

  password: string;
};

export default function CredentialsDialog({
  open,
  onOpenChange,
  username,
  password,
}: Props) {
  async function copyCredentials() {
    await navigator.clipboard.writeText(
      `Username: ${username}\nPassword: ${password}`,
    );

    toast.success("Credentials copied.");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Created Successfully</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Username</p>

            <p className="mt-1 font-semibold break-all">{username}</p>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Temporary Password</p>

            <p className="mt-1 font-semibold break-all">{password}</p>
          </div>

          <Button className="w-full" onClick={copyCredentials}>
            Copy Credentials
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
