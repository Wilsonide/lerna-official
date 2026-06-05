import Hero from "@/components/section/hero";
import Services from "@/components/section/services";

import ExtraServices from "@/components/section/extra-services";
import FeaturedPosts from "@/components/section/blog-preview";

export default function Home() {
  return (
    <main>
      <Hero />

      <Services />

      <ExtraServices />
      <FeaturedPosts />
    </main>
  );
}
