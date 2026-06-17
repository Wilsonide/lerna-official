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
              : "From mentorship, admissions, and skills training to entrepreneurship support, we help individuals achieve clarity and growth."}
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
                {/* ACCESS TO SYSTEMS */}
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

                {/* ACCESS TO RESOURCES */}
                <section id="access-to-resources" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Access to Resources</h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We provide high-quality educational materials that improve
                    learning outcomes, strengthen classroom delivery, and
                    support both teachers and students across all levels.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ Curriculum textbooks</div>
                    <div className={listItem}>
                      ✓ Classroom learning materials
                    </div>
                    <div className={listItem}>✓ STEM kits and tools</div>
                    <div className={listItem}>
                      ✓ Literacy development resources
                    </div>
                    <div className={listItem}>
                      ✓ Library development support
                    </div>
                    <div className={listItem}>✓ Digital learning content</div>
                  </div>

                  {/* CTA (KEEPED AS REQUESTED) */}
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

                {/* ACCESS TO FINANCE */}
                <section id="access-to-finance" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Access to Finance</h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We help schools access structured funding and financial
                    advisory systems that support expansion, sustainability, and
                    long-term institutional growth.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ Funding guidance</div>
                    <div className={listItem}>✓ Expansion advisory</div>
                    <div className={listItem}>✓ Budget planning systems</div>
                    <div className={listItem}>
                      ✓ Financial sustainability strategy
                    </div>
                  </div>
                </section>

                {/* EXTRA */}
                <section id="school-website-design" className={sectionCard}>
                  <h3 className="text-3xl font-bold">School Website Design</h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We build modern, fast, and conversion-focused school
                    websites that improve visibility, admissions, and trust.
                  </p>
                </section>

                <section id="social-media-management" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Social Media Management
                  </h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We manage structured digital communication systems that help
                    schools build reputation, engagement, and consistent online
                    presence.
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
                    We provide hands-on academic supervision and quality
                    assurance systems that improve teaching standards and school
                    performance.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ Academic supervision</div>
                    <div className={listItem}>✓ Staff evaluation systems</div>
                    <div className={listItem}>✓ Quality assurance reviews</div>
                    <div className={listItem}>
                      ✓ School improvement planning
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* INDIVIDUALS */}
                <section id="career-guidance" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Career Guidance & Mentorship
                  </h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We help individuals discover their strengths, clarify career
                    direction, and build actionable paths for personal and
                    professional growth.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ Career discovery sessions</div>
                    <div className={listItem}>✓ One-on-one mentorship</div>
                    <div className={listItem}>
                      ✓ Personal development planning
                    </div>
                    <div className={listItem}>✓ Goal-setting frameworks</div>
                  </div>
                </section>

                <section id="scholarship-support" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Scholarship & Admission Support
                  </h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We guide individuals through admission and scholarship
                    processes, helping them prepare strong applications and
                    documentation.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ University applications</div>
                    <div className={listItem}>✓ Scholarship guidance</div>
                    <div className={listItem}>
                      ✓ Admission strategy planning
                    </div>
                    <div className={listItem}>
                      ✓ Document preparation support
                    </div>
                  </div>
                </section>

                <section id="skills-development" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Skills Development & Certifications
                  </h3>
                  <p className="mt-5 text-black/60 leading-8">
                    Practical, job-ready skills training designed to improve
                    employability, productivity, and career readiness.
                  </p>
                </section>

                <section id="study-abroad-advisory" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Study Abroad Advisory</h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We support international study planning, admissions, and
                    application strategy for global opportunities.
                  </p>
                </section>

                <section id="digital-literacy" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Digital Literacy Training
                  </h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We equip individuals with essential digital skills needed
                    for modern careers and online productivity.
                  </p>
                </section>

                <section id="entrepreneurship-support" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Entrepreneurship Support
                  </h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We help individuals turn ideas into structured businesses
                    through strategy, planning, and execution support.
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
