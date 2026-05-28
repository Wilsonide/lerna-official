type Props = {
  title: string;
  description: string;
  price?: string; // optional now
  accent: "blue" | "orange" | "dark";
  priceLabel?: string; // optional fallback label
};

export default function ServiceCard({
  title,
  description,
  price,
  priceLabel = "Contact for pricing",
  accent,
}: Props) {
  const accentStyles = {
    blue: "bg-brand-blue/10",
    orange: "bg-brand-orange/10",
    dark: "bg-black/10",
  };

  return (
    <div className="group bg-white rounded-[32px] border border-black/5 p-8 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl">
      <div className={`w-16 h-16 rounded-2xl mb-8 ${accentStyles[accent]}`} />

      <h3 className="text-2xl font-semibold text-brand-black">{title}</h3>

      <p className="mt-5 text-black/60 leading-8">{description}</p>

      <button className="mt-8 text-brand-blue font-semibold hover:underline">
        Request pricing →
      </button>
    </div>
  );
}
