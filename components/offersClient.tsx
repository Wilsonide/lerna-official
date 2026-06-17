"use client";

import { useState } from "react";

const sectionCard =
  "scroll-mt-24 border border-black/5 rounded-3xl p-10 md:p-14 bg-white shadow-sm hover:shadow-md transition";

const listItem = "flex items-start gap-3 text-black/70 leading-7";

type Mode = "schools" | "individuals";

export default function OffersPage() {
  const getInitialMode = (): Mode => {
    if (typeof window === "undefined") return "schools";

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    return mode === "individuals" ? "individuals" : "schools";
  };

  const [mode, setMode] = useState<Mode>(() => getInitialMode());

  function switchMode(newMode: Mode) {
    setMode(newMode);

    const url = new URL(window.location.href);
    url.searchParams.set("mode", newMode);

    window.history.pushState({}, "", url.toString());
  }

  return (
    <main className="bg-white text-brand-black">
      {/* HERO */}
      <section className="bg-[#f8fafc] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-brand-blue">
            What We Offer
          </p>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold max-w-5xl leading-tight">
            {mode === "schools"
              ? "Practical solutions that help schools grow, operate efficiently, and deliver exceptional learning experiences."
              : "Practical solutions that help individuals learn, grow, and unlock opportunities."}
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-black/60">
            {mode === "schools"
              ? "From systems and staff development to digital visibility and finance, we help schools build strong institutions."
              : "We are currently building new opportunities for individuals. More updates will follow soon."}
          </p>

          {/* TOGGLE */}
          <div className="mt-10 inline-flex rounded-full border bg-white p-1 shadow-sm">
            <button
              onClick={() => switchMode("schools")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                mode === "schools"
                  ? "bg-brand-blue text-white"
                  : "text-black/60"
              }`}
            >
              Schools
            </button>

            <button
              onClick={() => switchMode("individuals")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                mode === "individuals"
                  ? "bg-brand-blue text-white"
                  : "text-black/60"
              }`}
            >
              Individuals
            </button>
          </div>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            {mode === "schools" ? "Core Solutions" : "Core Support Areas"}
          </h2>

          <div className="space-y-10">
            {mode === "schools" ? (
              <>
                {/* ================= SCHOOL CONTENT ================= */}

                <section id="access-to-systems" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Access to Systems</h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We design structured academic and operational systems that
                    help schools run efficiently, improve teaching quality, and
                    maintain consistent performance across all departments.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ ALF teaching framework</div>
                    <div className={listItem}>✓ Lesson planning systems</div>
                    <div className={listItem}>✓ Academic tracking tools</div>
                    <div className={listItem}>
                      ✓ Staff performance monitoring
                    </div>
                    <div className={listItem}>
                      ✓ School operations structure
                    </div>
                    <div className={listItem}>
                      ✓ Assessment & reporting systems
                    </div>
                  </div>
                </section>

                <section id="access-to-resources" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Access to Resources</h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We provide high-quality educational materials that improve
                    learning outcomes and strengthen classroom delivery.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ Curriculum textbooks</div>
                    <div className={listItem}>
                      ✓ Classroom learning materials
                    </div>
                    <div className={listItem}>✓ STEM kits and tools</div>
                    <div className={listItem}>
                      ✓ Library development support
                    </div>
                  </div>

                  <div className="mt-10">
                    <a
                      href="https://lernabookshop.bumpa.shop/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-xl bg-brand-blue px-6 py-3 text-white font-semibold hover:opacity-90 transition"
                    >
                      Visit Lerna Bookshop
                    </a>
                  </div>
                </section>

                <section id="access-to-finance" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Access to Finance</h3>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ Funding guidance</div>
                    <div className={listItem}>✓ Expansion advisory</div>
                    <div className={listItem}>✓ Budget planning systems</div>
                    <div className={listItem}>
                      ✓ Financial sustainability strategy
                    </div>
                  </div>
                </section>

                {/* ================= SCHOOL EXTRA SERVICES RESTORED ================= */}

                <section id="school-website-design" className={sectionCard}>
                  <h3 className="text-3xl font-bold">School Website Design</h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We design and develop modern, responsive, and
                    performance-optimized school websites that strengthen
                    institutional credibility, improve digital visibility, and
                    support seamless communication with parents, students, and
                    stakeholders.
                  </p>

                  <p className="mt-5 text-black/60 leading-8">
                    Our solutions are structured to enhance admissions flow,
                    showcase academic excellence, and position schools
                    professionally in the digital space.
                  </p>
                </section>

                <section id="social-media-management" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Social Media Management
                  </h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We manage structured digital communication systems that
                    strengthen school branding, engagement, and online presence
                    across major social platforms.
                  </p>

                  <p className="mt-5 text-black/60 leading-8">
                    This includes content planning, visual storytelling,
                    audience engagement, and consistent brand positioning to
                    help schools build trust and remain visible in a competitive
                    educational environment.
                  </p>
                </section>

                <section
                  id="dedicated-supervisory-support"
                  className={sectionCard}
                >
                  <h3 className="text-3xl font-bold">
                    Dedicated Supervisory Support
                  </h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We provide academic supervision and quality assurance
                    systems that improve teaching standards, ensure consistency
                    across classrooms, and strengthen overall school
                    performance.
                  </p>

                  <p className="mt-5 text-black/60 leading-8">
                    Our support framework helps school leadership maintain
                    accountability, improve instructional delivery, and
                    implement continuous improvement strategies.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ Academic supervision</div>
                    <div className={listItem}>✓ Staff monitoring</div>
                    <div className={listItem}>✓ Quality assurance reviews</div>
                    <div className={listItem}>
                      ✓ School improvement planning
                    </div>
                    <div className={listItem}>
                      ✓ Teaching performance evaluation
                    </div>
                    <div className={listItem}>
                      ✓ Operational compliance checks
                    </div>
                  </div>
                </section>
              </>
            ) : (
              /* ================= INDIVIDUALS - COMING SOON ================= */
              <section className={sectionCard}>
                <div className="text-center py-20">
                  <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-black/5 flex items-center justify-center">
                    <span className="text-2xl">🚧</span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold">
                    Coming Soon
                  </h3>

                  <p className="mt-5 text-black/60 leading-8 max-w-2xl mx-auto">
                    We are actively developing ways to better partner with,
                    support, and empower individuals.
                  </p>

                  <div className="mt-10 inline-flex items-center rounded-full border px-6 py-2 text-sm text-black/60">
                    Stay tuned for updates
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
