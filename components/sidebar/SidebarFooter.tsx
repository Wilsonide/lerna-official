"use client";

interface SidebarFooterProps {
  collapsed: boolean;

  firstName?: string;
  lastName?: string;
  email?: string;
}

export default function SidebarFooter({
  collapsed,
  firstName,
  lastName,
  email,
}: SidebarFooterProps) {
  return (
    <div className="border-t bg-gray-50 p-4">
      {collapsed ? (
        <div className="flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
            {firstName?.[0]}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-3">
          <p className="font-medium text-gray-900">
            {firstName} {lastName}
          </p>

          <p className="truncate text-xs text-gray-500">{email}</p>
        </div>
      )}
    </div>
  );
}
