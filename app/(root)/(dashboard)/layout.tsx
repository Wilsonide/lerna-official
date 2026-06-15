import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/dashboard/sidebar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* MAIN AREA */}
      <div className="flex flex-1 pt-20">
        <Sidebar />
        <main className="flex-1 min-w-0 transition-all duration-300">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
