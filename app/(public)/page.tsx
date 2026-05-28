import Hero from "@/components/section/hero";
import Services from "@/components/section/services";

import ExtraServices from "@/components/section/extra-services";
import Resources from "@/components/section/resources";

export default function Home() {
  return (
    <main>
      <Hero />

      <Services />

      <Resources />

      <ExtraServices />
    </main>
  );
}
