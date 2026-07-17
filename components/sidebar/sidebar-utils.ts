export const dashboardRoutes = [
  "/student",
  "/teacher",
  "/parent",
  "/school-admin",
  "/admin",
];

export function isSidebarRouteActive(pathname: string, href: string) {
  // Dashboard pages only match exactly
  if (dashboardRoutes.includes(href)) {
    return pathname === href;
  }

  // Every other page supports nested routes
  return pathname === href || pathname.startsWith(`${href}/`);
}
