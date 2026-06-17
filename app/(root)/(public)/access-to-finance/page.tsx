export default function AccessToFinancePage() {
  return (
    <main className="bg-white text-brand-black">
      {/* HERO */}
      <section className="bg-[#f8fafc] py-28">
        <div className="max-w-7xl mx-auto px-6">
          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-brand-blue">
            School Finance
          </p>

          <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight">
            Access to Finance
          </h1>

          <p className="mt-6 text-lg text-black/60 max-w-3xl leading-8">
            We support schools with structured financial guidance, funding
            opportunities, and strategic planning systems that enable
            sustainable growth. This includes helping schools access funding to
            strengthen basic infrastructure, improve learning environments, and
            create better conditions for learners to thrive.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="rounded-3xl border p-10 md:p-14 shadow-sm">
            <h2 className="text-3xl font-bold">What This Includes</h2>

            <ul className="mt-8 grid md:grid-cols-2 gap-4 text-black/70">
              <li>✓ Funding advisory & access support</li>
              <li>✓ Infrastructure development funding guidance</li>
              <li>✓ Expansion planning strategies</li>
              <li>✓ Budget structuring systems</li>
              <li>✓ Financial sustainability frameworks</li>
              <li>✓ Resource allocation optimization</li>
              <li>✓ Long-term institutional growth planning</li>
            </ul>
          </div>

          <div className="rounded-3xl border p-10 md:p-14 bg-slate-50">
            <h2 className="text-3xl font-bold">Impact</h2>

            <p className="mt-5 text-black/60 leading-8">
              Schools are better positioned to scale operations, manage
              resources effectively, and build financially stable educational
              systems.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
