import Link from "next/link";

const sectionCard =
  "scroll-mt-24 border border-black/5 rounded-3xl p-10 md:p-14 bg-white shadow-sm hover:shadow-md transition";

const listItem = "flex items-start gap-3 text-black/70 leading-7";

export default function OffersPage() {
  return (
    <main className="bg-white text-brand-black">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#f8fafc] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-brand-blue">
            What We Offer
          </p>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold max-w-5xl leading-tight">
            Practical solutions that help schools grow, operate efficiently, and
            deliver exceptional learning experiences.
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-black/60">
            From staff development and school systems to digital visibility and
            educational resources, Lerna provides structured solutions that
            strengthen academic delivery, improve operations, and enhance
            institutional excellence.
          </p>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Core Services
          </h2>

          <div className="space-y-10">
            <section id="school-management-platform" className={sectionCard}>
              <h3 className="text-3xl font-bold">School Management Platform</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                A centralized academic and administrative system that connects
                teachers, students, and school leadership into one unified
                digital ecosystem. It replaces fragmented processes with a
                structured workflow for planning, monitoring, and evaluation.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                Schools gain real-time visibility into academic performance,
                curriculum delivery, and staff coordination—enabling faster,
                data-driven decision-making and improved accountability.
              </p>

              <ul className="mt-8 grid md:grid-cols-2 gap-4">
                <li className={listItem}>
                  ✓ Structured lesson planning system
                </li>
                <li className={listItem}>✓ Academic performance tracking</li>
                <li className={listItem}>✓ Curriculum alignment framework</li>
                <li className={listItem}>✓ Staff coordination tools</li>
                <li className={listItem}>✓ Performance analytics dashboards</li>
              </ul>

              <p className="mt-8 text-brand-blue font-semibold text-lg">
                Starting from ₦250,000
              </p>
            </section>

            <section id="social-media-management" className={sectionCard}>
              <h3 className="text-3xl font-bold">Social Media Management</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                We help schools transform their digital presence into a
                structured communication system that builds trust, strengthens
                reputation, and attracts prospective parents.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                Through consistent storytelling, visual identity management, and
                engagement strategy, we position schools as credible and
                forward-thinking institutions online.
              </p>

              <ul className="mt-8 grid md:grid-cols-2 gap-4">
                <li className={listItem}>✓ Content strategy & planning</li>
                <li className={listItem}>✓ Professional visual design</li>
                <li className={listItem}>✓ Social media scheduling systems</li>
                <li className={listItem}>✓ Community engagement management</li>
                <li className={listItem}>✓ Brand positioning strategy</li>
              </ul>

              <p className="mt-8 text-brand-blue font-semibold text-lg">
                Starting from ₦100,000
              </p>
            </section>

            <section id="staff-training-sessions" className={sectionCard}>
              <h3 className="text-3xl font-bold">Staff Training Sessions</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                We deliver structured professional development programs designed
                to improve teaching quality, classroom effectiveness, and
                student engagement through modern pedagogical approaches.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                Each session focuses on practical implementation strategies that
                educators can immediately apply in real classroom environments.
              </p>

              <ul className="mt-8 grid md:grid-cols-2 gap-4">
                <li className={listItem}>✓ Modern pedagogy training</li>
                <li className={listItem}>✓ Classroom management systems</li>
                <li className={listItem}>✓ Assessment design techniques</li>
                <li className={listItem}>
                  ✓ Technology integration in teaching
                </li>
              </ul>

              <p className="mt-8 text-brand-blue font-semibold text-lg">
                Starting from ₦40,000
              </p>
            </section>

            <section id="dedicated-supervisory-support" className={sectionCard}>
              <h3 className="text-3xl font-bold">
                Dedicated Supervisory Support
              </h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                Ongoing academic supervision designed to maintain high teaching
                standards, improve instructional quality, and support school
                leadership with structured feedback systems.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                This service ensures continuous improvement through monitoring,
                evaluation, and strategic guidance across all academic levels.
              </p>

              <ul className="mt-8 grid md:grid-cols-2 gap-4">
                <li className={listItem}>✓ Quality assurance systems</li>
                <li className={listItem}>✓ Classroom observation reports</li>
                <li className={listItem}>✓ Staff mentoring programs</li>
                <li className={listItem}>✓ Academic performance audits</li>
              </ul>

              <p className="mt-8 text-brand-blue font-semibold text-lg">
                Starting from ₦150,000
              </p>
            </section>

            <section id="club-management" className={sectionCard}>
              <h3 className="text-3xl font-bold">Club Management</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                We design and manage structured co-curricular programs that
                support holistic student development beyond academics.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                These programs build leadership, creativity, teamwork, and
                communication skills through guided activities and structured
                learning experiences.
              </p>

              <ul className="mt-8 grid md:grid-cols-2 gap-4">
                <li className={listItem}>✓ STEM innovation clubs</li>
                <li className={listItem}>✓ Debate & public speaking</li>
                <li className={listItem}>✓ Reading development clubs</li>
                <li className={listItem}>✓ Creative arts programs</li>
              </ul>

              <p className="mt-8 text-brand-blue font-semibold text-lg">
                Starting from ₦5,000 per pupil
              </p>
            </section>
          </div>
        </div>
      </section>

      {/* SPECIALIST SERVICES */}
      <section className="py-28 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            Specialist Services
          </h2>

          <div className="space-y-10">
            <section id="school-website-design" className={sectionCard}>
              <h3 className="text-3xl font-bold">School Website Design</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                We build modern, high-performance school websites that enhance
                credibility, improve communication, and support student
                admissions through a strong digital presence.
              </p>

              <ul className="mt-8 grid md:grid-cols-2 gap-4">
                <li className={listItem}>✓ Responsive mobile-first design</li>
                <li className={listItem}>✓ Admission & inquiry systems</li>
                <li className={listItem}>✓ SEO-optimized structure</li>
              </ul>

              <p className="mt-8 text-brand-blue font-semibold text-lg">
                Starting from ₦200,000
              </p>
            </section>

            <section id="school-policy-writing" className={sectionCard}>
              <h3 className="text-3xl font-bold">School Policy Writing</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                We develop clear, structured governance documents that define
                operational standards, improve accountability, and ensure
                consistency across school systems.
              </p>

              <ul className="mt-8 grid md:grid-cols-2 gap-4">
                <li className={listItem}>✓ Staff & student handbooks</li>
                <li className={listItem}>✓ Operational policies</li>
                <li className={listItem}>✓ Safeguarding frameworks</li>
              </ul>

              <p className="mt-8 text-brand-blue font-semibold text-lg">
                Starting from ₦80,000
              </p>
            </section>
            <section id="loan-to-schools" className={sectionCard}>
              <h3 className="text-3xl font-bold">Loan-to-Schools Support</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                We provide structured financial support solutions designed to
                help schools expand infrastructure, improve facilities, and
                invest in long-term educational growth without immediate
                financial pressure.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                This service connects schools to flexible funding opportunities
                and guided financial planning support, ensuring responsible
                borrowing aligned with institutional sustainability and growth
                strategy.
              </p>

              <ul className="mt-8 grid md:grid-cols-2 gap-4">
                <li className={listItem}>✓ School expansion financing</li>
                <li className={listItem}>
                  ✓ Infrastructure development support
                </li>
                <li className={listItem}>✓ Flexible repayment structuring</li>
                <li className={listItem}>✓ Financial advisory guidance</li>
              </ul>

              <p className="mt-8 text-brand-blue font-semibold text-lg">
                Subject to assessment & eligibility
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
