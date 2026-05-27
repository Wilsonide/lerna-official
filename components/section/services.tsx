import ServiceCard from "../ui/service-card";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <section id="services" className="py-28 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <p className="uppercase tracking-[0.3em] text-sm text-brand-blue font-semibold mb-4">
            Core Services
          </p>

          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Everything Your School Needs To Grow
          </h2>

          <p className="mt-6 text-black/60 text-lg leading-8">
            Structured educational systems, staff development, digital
            visibility, and operational support — designed specifically for
            modern schools.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-20">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              price={service.price}
              accent={service.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
