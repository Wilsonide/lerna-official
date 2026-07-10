"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/app/store/auth-store";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  GraduationCap,
  Shield,
  Menu,
  X,
  School,
  LucideIcon,
  FileText,
  PlusCircle,
  FileBarChart,
  CalendarRange,
  ClipboardCheck,
  CalendarDays,
  Calendar,
  BarChart3,
  UserPlus,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: {
    label: string;
    href: string;
  }[];
};

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardRoutes = [
    "/student",
    "/teacher",
    "/parent",
    "/school-admin",
    "/admin",
  ];

  const isActive = (href: string) => {
    // Dashboard links must match exactly
    if (dashboardRoutes.includes(href)) {
      return pathname === href;
    }

    // Other links support nested routes
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const baseLink =
    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all";
  const active =
    "bg-blue-50 text-blue-700 font-semibold border border-blue-100";
  const inactive = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  const navItems: Record<string, NavItem[]> = {
    STUDENT: [
      {
        label: "Dashboard",
        href: "/student",
        icon: LayoutDashboard,
      },

      {
        label: "Attendance",
        href: "/student/attendance",
        icon: Users,
      },

      {
        label: "Results",
        href: "/student/results",
        icon: GraduationCap,
      },
      { label: "Profile", href: "/student/profile", icon: Settings },
    ],

    TEACHER: [
      {
        label: "Dashboard",
        href: "/teacher",
        icon: LayoutDashboard,
      },

      {
        label: "Classes",
        href: "/teacher/classes",
        icon: School,
      },

      {
        label: "Lessons",
        href: "/teacher/lessons",
        icon: BookOpen,
      },

      {
        label: "Attendance",
        href: "/teacher/attendance",
        icon: Users,
      },

      {
        label: "Results",
        href: "/teacher/results",
        icon: GraduationCap,
        children: [
          {
            label: "View Results",
            href: "/teacher/results",
          },
        ],
      },

      {
        label: "Profile",
        href: "/teacher/profile",
        icon: Settings,
      },
    ],

    PARENT: [
      { label: "Dashboard", href: "/parent", icon: LayoutDashboard },
      { label: "Children", href: "/parent/children", icon: Users },
      { label: "Profile", href: "/school-admin/profile", icon: Settings },
    ],

    SCHOOL_ADMIN: [
      {
        label: "Dashboard",
        href: "/school-admin",
        icon: LayoutDashboard,
      },

      {
        label: "Academic Setup",
        href: "/school-admin/academic-structure",
        icon: School,
      },

      {
        label: "Classes",
        href: "/school-admin/classes",
        icon: School,
      },

      {
        label: "Students",
        href: "/school-admin/students",
        icon: GraduationCap,
      },

      {
        label: "Teachers",
        href: "/school-admin/teachers",
        icon: Users,
      },

      {
        label: "Subjects",
        href: "/school-admin/subjects",
        icon: BookOpen,
      },

      {
        label: "Attendance",
        href: "/school-admin/attendance",
        icon: ClipboardCheck,
      },

      {
        label: "Results",
        href: "/school-admin/results",
        icon: BarChart3,
      },

      {
        label: "Sessions",
        href: "/school-admin/sessions",
        icon: Calendar,
      },

      {
        label: "Terms",
        href: "/school-admin/terms",
        icon: CalendarDays,
      },
      {
        label: "Settings",
        href: "/school-admin/settings",
        icon: Settings,
      },
      {
        label: "Registrations",
        href: "/school-admin/registrations",
        icon: UserPlus,
      },
    ],

    SUPER_ADMIN: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Schools", href: "/admin/schools", icon: BookOpen },
      { label: "Admins", href: "/admin/admins", icon: Shield },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Create Blogs", href: "/admin/blogs/create", icon: PlusCircle },
      { label: "View Blogs", href: "/admin/blogs", icon: FileText },
      { label: "Lesson Notes", href: "/admin/lessons", icon: Settings },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  };

  const items = role ? navItems[role] || [] : [];

  return (
    <>
      {/* MOBILE TOGGLE */}
      <div className="md:hidden fixed top-[90px] left-4 z-30">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white border rounded-lg shadow"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
fixed md:sticky
top-20
left-0
h-[calc(100vh-5rem)]
bg-white
border-r
flex
flex-col
transition-all
duration-300
${collapsed ? "w-20" : "w-72"}
${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
z-30
`}
      >
        {/* HEADER */}
        <div className="border-b px-4 py-5">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-3">
                {user?.school_logo ? (
                  <Image
                    src={user.school_logo}
                    alt={user.school_name ?? ""}
                    width={42}
                    height={42}
                    className="rounded-lg border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                    <School size={20} />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {user?.school_name ?? "School"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {role?.replace("_", " ")}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-100"
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        {/* NAV */}
        <nav
          className="
flex-1
overflow-y-auto
px-3
py-4
space-y-1
scrollbar-thin
scrollbar-thumb-gray-300
"
        >
          {items.map((item) => {
            const Icon = item.icon;

            const parentActive =
              isActive(item.href) ||
              item.children?.some((child) => isActive(child.href));

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`
${baseLink}
${parentActive ? active : inactive}
`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>

                {!collapsed && item.children && parentActive && (
                  <div className="ml-8 mt-1 space-y-1 border-l border-gray-200 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block rounded-md px-3 py-2 text-sm transition ${
                          isActive(child.href)
                            ? "bg-gray-100 font-medium text-black"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="border-t p-4">
          {!collapsed ? (
            <div className="space-y-1">
              <p className="font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>

              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {user?.first_name?.[0]}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
