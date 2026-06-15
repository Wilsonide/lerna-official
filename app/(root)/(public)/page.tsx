import Hero from "@/components/section/hero";
import FeaturedPosts from "@/components/section/blog-preview";
import ServicesSwitcher from "@/components/services-switcher";

export default function Home() {
  return (
    <main>
      <Hero />

      <ServicesSwitcher />
      <FeaturedPosts />
    </main>
  );
}
