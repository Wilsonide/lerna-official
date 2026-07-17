import { SidebarChild } from "./types";

export function getClassChildren(classId?: string): SidebarChild[] {
  if (!classId) {
    return [
      {
        label: "All Classes",
        href: "/school-admin/classes",
      },
    ];
  }

  return [
    {
      label: "Overview",
      href: `/school-admin/classes/${classId}`,
    },

    {
      label: "Students",
      href: `/school-admin/classes/${classId}/students`,
    },

    {
      label: "Teachers",
      href: `/school-admin/classes/${classId}/teachers`,
    },

    {
      label: "Subjects",
      href: `/school-admin/classes/${classId}/subjects`,
    },

    {
      label: "Attendance",
      href: `/school-admin/classes/${classId}/attendance`,
    },

    {
      label: "Results",
      href: `/school-admin/classes/${classId}/results`,
    },
  ];
}

export function getResultChildren(classId?: string): SidebarChild[] {
  if (!classId) {
    return [
      {
        label: "Results",
        href: "/teacher/results",
      },
    ];
  }

  return [
    {
      label: "Enter Results",
      href: `/teacher/results/enter/${classId}`,
    },
    {
      label: "Edit Results",
      href: `/teacher/results/edit/${classId}`,
    },
  ];
}
