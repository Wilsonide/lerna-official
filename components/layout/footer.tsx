export default function Footer() {
  return (
    <footer id="contact" className="bg-brand-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold">LERNA EDUCATIONAL HUB</h2>

          <p className="mt-6 text-white/60 leading-8 max-w-lg">
            Helping schools grow through structured systems, educational
            excellence, and modern learning solutions.
          </p>
        </div>

        <div className="lg:text-right">
          <p className="uppercase tracking-[0.3em] text-brand-orange text-sm">
            Contact
          </p>

          <h3 className="text-4xl font-bold mt-6">0806 869 8329</h3>

          <a
            href="https://wa.me/2348068698329"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex bg-brand-orange px-8 py-4 rounded-full font-medium hover:opacity-90 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
