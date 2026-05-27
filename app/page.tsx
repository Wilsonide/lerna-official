import Navbar from "@/components/layout/navbar";
import Hero from "@/components/section/hero";
import Services from "@/components/section/services";
import Footer from "@/components/layout/footer";
import ExtraServices from "@/components/section/extra-services";
import Resources from "@/components/section/resources";
import Bundles from "@/components/section/bundles";

export default function Home() {
  return (
    <main>
      <Navbar />

      <Hero />

      <Services />

      <Bundles />

      <Resources />

      <ExtraServices />

      <Footer />
    </main>
  );
}
