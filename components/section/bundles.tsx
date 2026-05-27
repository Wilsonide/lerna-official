import { bundles } from "@/lib/data";
import BundleCard from "../ui/bundle-card";

export default function Bundles() {
  return (
    <section id="packages" className="py-32 bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <p className="uppercase tracking-[0.3em] text-brand-orange text-sm font-semibold mb-4">
            Pricing Packages
          </p>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Choose Your Growth Level
          </h2>

          <p className="mt-6 text-white/60 text-lg leading-8">
            Flexible educational packages designed for schools at different
            stages of growth.
          </p>
        </div>

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
      </div>
    </section>
  );
}
