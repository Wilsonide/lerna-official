"use client";

import Image from "next/image";

import { ChevronLeft, ChevronRight, School, GraduationCap } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;

  toggleSidebar: () => void;

  schoolName?: string | null;

  schoolLogo?: string | null;

  role?: string | null;

  className?: string | null;

  classLevel?: string | null;
}

export default function SidebarHeader({
  collapsed,
  toggleSidebar,

  schoolName,
  schoolLogo,
  role,

  className,
  classLevel,
}: SidebarHeaderProps) {
  return (
    <div className="border-b bg-white px-4 py-5">
      <div className="flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            {className ? (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <GraduationCap size={20} />
              </div>
            ) : schoolLogo ? (
              <Image
                src={schoolLogo}
                alt={schoolName ?? ""}
                width={44}
                height={44}
                className="rounded-xl border object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <School size={20} />
              </div>
            )}

            <div className="min-w-0">
              {className ? (
                <>
                  <p className="truncate font-semibold text-gray-900">
                    {className}
                  </p>

                  <p className="text-xs text-gray-500">{classLevel}</p>
                </>
              ) : (
                <>
                  <p className="truncate font-semibold text-gray-900">
                    {schoolName}
                  </p>

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {role?.replaceAll("_", " ")}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="
            hidden
            md:flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            transition
            hover:bg-gray-100
          "
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );
}
