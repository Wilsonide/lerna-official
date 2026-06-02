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
            Core Solutions
          </h2>

          <div className="space-y-10">
            {/* ACCESS TO SYSTEMS */}
            <section id="acess-to-systems" className={sectionCard}>
              <h3 className="text-3xl font-bold">Access to Systems</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                Great schools are built on great systems. Through our Access to
                Systems solution, we help schools establish the structures,
                processes, and frameworks needed to deliver consistent learning
                outcomes, improve staff effectiveness, and strengthen overall
                school operations.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                At the heart of this offering is our
                <span className="font-semibold text-brand-black">
                  {" "}
                  Accelerated Learners Framework (ALF)
                </span>
                , a comprehensive lesson planning and instructional system
                designed to guide teachers in delivering engaging, structured,
                and learner-centered lessons. ALF provides educators with
                ready-to-use lesson plans, teaching strategies, assessment
                guidance, and classroom delivery frameworks that improve
                consistency across classrooms and reduce lesson preparation
                time.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                Beyond ALF, schools gain access to management systems,
                operational frameworks, training programs, and governance
                structures that help leaders build sustainable institutions
                capable of scaling with confidence.
              </p>

              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className={listItem}>
                  ✓ Accelerated Learners Framework (ALF)
                </div>

                <div className={listItem}>
                  ✓ Ready-to-use lesson plans & schemes
                </div>

                <div className={listItem}>✓ Teacher instructional guides</div>

                <div className={listItem}>✓ School Management Platform</div>

                <div className={listItem}>
                  ✓ Staff Training & Professional Development
                </div>

                <div className={listItem}>✓ Club Management Frameworks</div>

                <div className={listItem}>
                  ✓ School Policy & Handbook Development
                </div>

                <div className={listItem}>✓ Academic Monitoring Systems</div>

                <div className={listItem}>✓ Quality Assurance Processes</div>

                <div className={listItem}>
                  ✓ Operational Documentation & Systems
                </div>
              </div>
            </section>

            {/* ACCESS TO RESOURCES */}
            <section id="access-to-resources" className={sectionCard}>
              <h3 className="text-3xl font-bold">Access to Resources</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                Quality learning requires quality resources. Through our
                educational resource network, schools gain access to books,
                learning materials, classroom resources, and educational tools
                that support literacy, teaching effectiveness, and learner
                engagement.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                We help schools build stronger reading cultures, improve
                instructional delivery, and create richer learning environments
                through carefully selected educational resources.
              </p>

              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className={listItem}>✓ Access to Educational Books</div>

                <div className={listItem}>✓ Classroom Learning Materials</div>

                <div className={listItem}>✓ Literacy & Reading Resources</div>

                <div className={listItem}>✓ STEM Activity Resources</div>

                <div className={listItem}>
                  ✓ Children&apos;s Literature Collections
                </div>

                <div className={listItem}>✓ School Library Setup Support</div>
              </div>

              <div className="mt-8">
                <Link
                  href="https://lernabookshop.bumpa.shop/"
                  target="_blank"
                  className="inline-flex items-center text-brand-blue font-semibold hover:underline"
                >
                  Visit Our Bookstore →
                </Link>
              </div>
            </section>

            {/* ACCESS TO FINANCE */}
            <section id="access-to-finance" className={sectionCard}>
              <h3 className="text-3xl font-bold">Access to Finance</h3>

              <p className="mt-5 text-black/60 leading-8 max-w-4xl">
                Sustainable growth often requires financial support. Through our
                Access to Finance solution, schools can explore funding
                opportunities that enable expansion, facility upgrades,
                infrastructure development, and operational improvements.
              </p>

              <p className="mt-4 text-black/60 leading-8 max-w-4xl">
                Beyond financing, we provide advisory support to help schools
                make responsible financial decisions that align with their
                long-term vision and growth objectives.
              </p>

              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className={listItem}>✓ Loan-to-Schools Support</div>

                <div className={listItem}>✓ School Expansion Financing</div>

                <div className={listItem}>
                  ✓ Infrastructure Development Funding
                </div>

                <div className={listItem}>✓ Financial Planning Support</div>

                <div className={listItem}>✓ Growth Strategy Advisory</div>

                <div className={listItem}>✓ Funding Readiness Assessment</div>
              </div>

              <p className="mt-8 text-brand-blue font-semibold text-lg">
                Subject to assessment & eligibility
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
          </div>
        </div>
      </section>
    </main>
  );
}
