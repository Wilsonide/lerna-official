type Props = {
  title: string;
  subtitle: string;
  price: string;
  save: string;
  featured?: boolean;
  features: string[];
};

export default function BundleCard({
  title,
  subtitle,
  price,
  save,
  featured,
  features,
}: Props) {
  const badge = featured
    ? "Growth Pack"
    : title === "StartSmart"
      ? "Entry Pack"
      : "Signature Pack";

  return (
    <div
      className={`relative overflow-hidden rounded-[36px] p-[1px] transition-all duration-500 hover:-translate-y-3 ${
        featured
          ? "bg-gradient-to-b from-brand-orange via-brand-blue to-brand-blue shadow-[0_20px_80px_rgba(59,113,232,0.35)] scale-105"
          : "bg-gradient-to-b from-black/10 to-black/5 hover:shadow-2xl"
      }`}
    >
      {/* INNER CARD */}
      <div
        className={`relative h-full rounded-[35px] p-10 backdrop-blur-xl ${
          featured ? "bg-brand-blue text-white" : "bg-white text-brand-black"
        }`}
      >
        {/* GLOW */}
        <div
          className={`absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl ${
            featured ? "bg-brand-orange/20" : "bg-brand-blue/10"
          }`}
        />

        {/* BADGE */}
        <div
          className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold tracking-[0.2em] uppercase mb-8 ${
            featured
              ? "bg-white/15 text-white border border-white/10"
              : "bg-brand-blue/10 text-brand-blue"
          }`}
        >
          {badge}
        </div>

        {/* MOST POPULAR */}
        {featured && (
          <div className="absolute top-0 right-8 bg-brand-orange text-white text-xs px-5 py-2 rounded-b-2xl font-semibold tracking-wide shadow-lg">
            MOST POPULAR
          </div>
        )}

        {/* TITLE */}
        <h3 className="text-4xl font-bold tracking-tight">{title}</h3>

        {/* SUBTITLE */}
        <p
          className={`mt-5 leading-8 text-[15px] ${
            featured ? "text-white/75" : "text-black/60"
          }`}
        >
          {subtitle}
        </p>

        {/* PRICE */}
        <div className="mt-12">
          <div className="flex items-end gap-2">
            <h2 className="text-6xl font-bold tracking-tight">{price}</h2>
          </div>

          <p
            className={`mt-3 text-sm ${
              featured ? "text-brand-orange" : "text-brand-blue"
            }`}
          >
            {save}
          </p>
        </div>

        {/* DIVIDER */}
        <div
          className={`my-10 h-px w-full ${
            featured ? "bg-white/10" : "bg-black/5"
          }`}
        />

        {/* FEATURES */}
        <div className="space-y-5">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-4">
              {/* ICON */}
              <div
                className={`mt-1.5 flex h-5 w-5 items-center justify-center rounded-full ${
                  featured ? "bg-brand-orange/20" : "bg-brand-blue/10"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    featured ? "bg-brand-orange" : "bg-brand-blue"
                  }`}
                />
              </div>

              {/* TEXT */}
              <p
                className={`leading-7 text-[15px] ${
                  featured ? "text-white/85" : "text-black/70"
                }`}
              >
                {feature}
              </p>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <button
          className={`mt-12 w-full rounded-2xl py-4 font-semibold transition-all duration-300 ${
            featured
              ? "bg-white text-brand-blue hover:bg-white/90"
              : "bg-brand-blue text-white hover:shadow-xl hover:scale-[1.02]"
          }`}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
