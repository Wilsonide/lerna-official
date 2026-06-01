import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-white text-brand-black">
      {/* HERO */}
      <section className="bg-[#f8fafc] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-brand-blue">
            About Lerna
          </p>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold max-w-5xl leading-tight">
            Building smarter schools through systems, structure, and innovation.
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-black/60">
            Lerna is an educational solutions company focused on helping schools
            improve academic delivery, operational efficiency, and institutional
            growth through structured systems and modern learning tools.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="mt-6 text-black/60 leading-8">
              To transform schools into well-structured, high-performing
              institutions by providing practical systems, digital tools, and
              professional support that improve teaching and learning outcomes.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">Our Vision</h2>
            <p className="mt-6 text-black/60 leading-8">
              To become Africa’s leading partner in educational transformation,
              empowering schools with technology-driven solutions that redefine
              how learning is delivered and managed.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12">What We Do</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "School Management Systems",
              "Staff Training & Development",
              "Digital School Transformation",
              "Academic Supervision",
              "School Branding & Visibility",
              "Educational Resources",
            ].map((item) => (
              <div
                key={item}
                className="p-8 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 mb-5" />
                <h3 className="font-semibold text-lg">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold">
            Let’s build better schools together
          </h2>

          <p className="mt-6 text-black/60 leading-8">
            Partner with us to transform your school into a structured,
            efficient, and high-performing institution.
          </p>
        </div>
      </section>
    </main>
  );
}
