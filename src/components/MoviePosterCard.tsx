import { Star } from "lucide-react";

type PrizeItem = {
  category: string;
  name: string;
  gradient: string;
  rotate: string;
};

export const PRIZE_ITEMS: PrizeItem[] = [
  {
    category: "Prêmio na hora",
    name: "Mousepad exclusivo",
    gradient: "from-crimson via-orange-600 to-neutral-950",
    rotate: "-rotate-3",
  },
  {
    category: "Prêmio na hora",
    name: "Caneca temática",
    gradient: "from-gold via-orange-500 to-neutral-950",
    rotate: "rotate-2",
  },
  {
    category: "Prêmio na hora",
    name: "Pôster exclusivo",
    gradient: "from-violet via-blue-600 to-neutral-950",
    rotate: "-rotate-2",
  },
  {
    category: "Prêmio na hora",
    name: "Boneco colecionável",
    gradient: "from-emerald-600 via-neutral-800 to-neutral-950",
    rotate: "rotate-3",
  },
  {
    category: "Prêmio na hora",
    name: "Chaveiro exclusivo",
    gradient: "from-pink-500 via-rose-600 to-neutral-950",
    rotate: "-rotate-1",
  },
  {
    category: "Prêmio de sorteio",
    name: "Livros exclusivos",
    gradient: "from-cyan-500 via-sky-600 to-neutral-950",
    rotate: "rotate-1",
  },
  {
    category: "Prêmio de sorteio",
    name: "Quadros decorativos",
    gradient: "from-violet via-purple-600 to-neutral-950",
    rotate: "-rotate-2",
  },
  {
    category: "Prêmio de sorteio",
    name: "Prêmios especiais",
    gradient: "from-gold via-crimson to-neutral-950",
    rotate: "rotate-1",
  },
];

export function MoviePosterCard({ item }: { item: PrizeItem }) {
  return (
    <div
      className={`group relative aspect-[2/3] w-44 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${item.gradient} shadow-xl shadow-black/50 transition-transform duration-500 ease-out hover:!rotate-0 hover:scale-105 sm:w-52 ${item.rotate}`}
    >
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, white, transparent 40%)",
        }}
      />

      <span className="absolute right-2 top-2 rotate-6 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-950 shadow">
        Exclusivo
      </span>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-10">
        <p className="text-xs font-medium uppercase tracking-widest text-white/70">
          {item.category}
        </p>
        <p className="font-display text-2xl leading-none tracking-wide text-white">
          {item.name}
        </p>
        <div className="mt-2 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className="fill-gold text-gold"
              strokeWidth={1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
