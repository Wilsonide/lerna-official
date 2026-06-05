import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import NavItem from "@/components/admin/nav-item";
import { LayoutDashboard, FileText, PlusCircle } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 hidden md:flex flex-col border-r bg-white">
        <div className="px-6 py-6 border-b">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-gray-500 mt-1">Manage your content</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem
            href="/admin"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />

          <NavItem
            href="/admin/blogs"
            icon={<FileText size={18} />}
            label="Blogs"
          />

          <NavItem
            href="/admin/blogs/create"
            icon={<PlusCircle size={18} />}
            label="Create Blog"
          />
        </nav>

        <div className="p-4 border-t text-xs text-gray-500">
          Logged in as <span className="font-medium">{user.name}</span>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
