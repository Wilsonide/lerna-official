import { bookstoreServices } from "@/lib/data";

export default function Resources() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <p className="uppercase tracking-[0.3em] text-brand-blue text-sm font-semibold mb-4">
            Books & Resources
          </p>

          <h2 className="text-5xl font-bold leading-tight">
            Building Reading Culture & Learning Resources
          </h2>

          <p className="mt-6 text-black/60 leading-8 text-lg">
            From early readers to full library setup, we provide educational
            materials that enrich classrooms and support literacy development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {bookstoreServices.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-black/5 p-8 hover:shadow-xl transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 mb-6" />

              <h3 className="text-xl font-semibold">{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
