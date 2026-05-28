import BundleCard from "@/components/ui/bundle-card";
import { bundles } from "@/lib/data";

export default function Bundles() {
  return (
    <section id="packages" className="py-32 bg-gray-50 text-brand-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="uppercase tracking-[0.3em] text-brand-orange text-sm font-semibold mb-4">
            Pricing Packages
          </p>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Choose the Right Growth Plan
          </h2>

          <p className="mt-6 text-black/60 text-lg leading-8">
            Flexible educational packages designed for schools at different
            stages of development — from setup to full-scale optimization.
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-10 mt-24 items-stretch">
          {bundles.map((bundle) => (
            <BundleCard
              key={bundle.title}
              title={bundle.title}
              subtitle={bundle.subtitle}
              price={bundle.price}
              save={bundle.save}
              featured={bundle.featured}
              features={bundle.features}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-semibold">
            Need a custom solution for your school?
          </h3>

          <p className="mt-3 text-black/60">
            We can design a tailored package based on your institution’s needs.
          </p>

          <a
            href="https://wa.me/2348068698329"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex bg-brand-orange text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition"
          >
            Talk to Us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
