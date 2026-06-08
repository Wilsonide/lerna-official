"use client";

import { useState } from "react";

const sectionCard =
  "scroll-mt-24 border border-black/5 rounded-3xl p-10 md:p-14 bg-white shadow-sm hover:shadow-md transition";

const listItem = "flex items-start gap-3 text-black/70 leading-7";

type Mode = "schools" | "individuals";

export default function OffersPage() {
  /**
   * OPTIONAL: read URL safely on client only
   * (no SSR crash, no suspense issue)
   */
  const getInitialMode = (): Mode => {
    if (typeof window === "undefined") return "schools";

    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");

    return mode === "individuals" ? "individuals" : "schools";
  };

  const [mode, setMode] = useState<Mode>(getInitialMode);

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
              : "From mentorship and admissions to skills and career growth, we help individuals achieve their goals."}
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
                {/* ================= SCHOOLS ================= */}

                <section id="access-to-systems" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Access to Systems</h3>

                  <p className="mt-5 text-black/60 leading-8">
                    Great schools don’t succeed by chance — they succeed through
                    structured systems. This service helps schools build
                    operational, academic, and administrative frameworks that
                    improve consistency, performance, and efficiency across the
                    entire institution.
                  </p>

                  <p className="mt-4 text-black/60 leading-8">
                    At the center is the{" "}
                    <b>Accelerated Learners Framework (ALF)</b>, a structured
                    teaching system that gives teachers lesson plans,
                    instructional guides, and assessment tools that improve
                    classroom delivery.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ ALF teaching framework</div>
                    <div className={listItem}>
                      ✓ Structured lesson planning system
                    </div>
                    <div className={listItem}>
                      ✓ Teacher instructional guides
                    </div>
                    <div className={listItem}>✓ Academic tracking systems</div>
                    <div className={listItem}>
                      ✓ School operations framework
                    </div>
                    <div className={listItem}>
                      ✓ Staff performance monitoring
                    </div>
                  </div>
                </section>

                <section id="access-to-resources" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Access to Resources</h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We provide high-quality educational resources that improve
                    literacy, comprehension, and student engagement across all
                    learning levels.
                  </p>

                  <p className="mt-4 text-black/60 leading-8">
                    These resources support teachers in delivering more
                    effective lessons and help learners build stronger academic
                    foundations.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ Curriculum-based textbooks</div>
                    <div className={listItem}>
                      ✓ Classroom learning materials
                    </div>
                    <div className={listItem}>✓ Literacy development tools</div>
                    <div className={listItem}>✓ STEM resources</div>
                    <div className={listItem}>✓ Reading culture programs</div>
                    <div className={listItem}>
                      ✓ Library development support
                    </div>
                  </div>
                </section>

                <section id="access-to-finance" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Access to Finance</h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We help schools access structured funding opportunities that
                    support expansion, infrastructure development, and long-term
                    sustainability.
                  </p>

                  <p className="mt-4 text-black/60 leading-8">
                    Beyond funding, we provide advisory support to ensure
                    financial decisions are strategic, responsible, and aligned
                    with institutional goals.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ School funding support</div>
                    <div className={listItem}>✓ Expansion advisory</div>
                    <div className={listItem}>✓ Financial planning systems</div>
                    <div className={listItem}>✓ Sustainability strategy</div>
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* ================= INDIVIDUALS ================= */}

                <section id="career-guidance" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Career Guidance & Mentorship
                  </h3>

                  <p className="mt-5 text-black/60 leading-8">
                    We help individuals discover their strengths, define clear
                    career paths, and build actionable plans for personal and
                    professional growth.
                  </p>

                  <p className="mt-4 text-black/60 leading-8">
                    Through structured mentorship, we provide clarity,
                    direction, and continuous support for long-term success.
                  </p>

                  <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className={listItem}>✓ Career path discovery</div>
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
                    We guide individuals through the entire admission and
                    scholarship process, making it easier to access local and
                    international opportunities.
                  </p>

                  <p className="mt-4 text-black/60 leading-8">
                    From applications to documentation, we ensure you are
                    well-positioned for successful admission outcomes.
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* EXTRA SERVICES */}
      <section className="py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            {mode === "schools"
              ? "Specialist Services"
              : "Growth & Opportunity Services"}
          </h2>

          <div className="space-y-10">
            {mode === "schools" ? (
              <>
                <section id="school-website-design" className={sectionCard}>
                  <h3 className="text-3xl font-bold">School Website Design</h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We design modern school websites that improve visibility,
                    admissions, and institutional credibility through strong
                    digital presence.
                  </p>
                </section>

                <section id="social-media-management" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Social Media Management
                  </h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We help schools build structured digital communication
                    systems that strengthen reputation and parent engagement.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section id="study-abroad-advisory" className={sectionCard}>
                  <h3 className="text-3xl font-bold">Study Abroad Advisory</h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We guide individuals through international study
                    opportunities, admissions, and application processes.
                  </p>
                </section>

                <section id="digital-literacy" className={sectionCard}>
                  <h3 className="text-3xl font-bold">
                    Digital Literacy Training
                  </h3>
                  <p className="mt-5 text-black/60 leading-8">
                    We equip individuals with essential digital skills needed
                    for modern careers and entrepreneurship.
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
