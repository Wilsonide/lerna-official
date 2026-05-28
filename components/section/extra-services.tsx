import { extraServices } from "@/lib/data";

export default function ExtraServices() {
  return (
    <section className="py-28 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <p className="uppercase tracking-[0.3em] text-brand-blue text-sm font-semibold mb-4">
            Specialist Services
          </p>

          <h2 className="text-5xl font-bold">More Ways We Support Schools</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-20">
          {extraServices.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-[32px] border border-black/5 p-10"
            >
              <p className="uppercase tracking-[0.2em] text-sm text-brand-blue font-semibold">
                Digital Service
              </p>

              <h3 className="mt-5 text-3xl font-bold">{service.title}</h3>

              <p className="mt-5 text-black/60 leading-8">
                {service.description}
              </p>

              <div className="mt-8 text-brand-blue font-semibold hover:underline">
                {/* {service.price} */}
                learn more →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
