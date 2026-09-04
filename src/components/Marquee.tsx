const ITEMS = [
  "🍿 RESERVE SEU LUGAR",
  "🎬 NÃO PODE PERDER",
  "🎟️ PACOTES A PARTIR DE R$ 10/MÊS",
  "⭐ GANHE PRÊMIOS COM A NOTA",
  "🎁 SORTEIOS TODO MÊS",
];

export function Marquee() {
  const content = [...ITEMS, ...ITEMS];

  return (
    <div className="film-strip overflow-hidden border-y border-gold/30 bg-gradient-to-r from-crimson via-neutral-950 to-violet py-3">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-5">
        {[...content, ...content].map((item, i) => (
          <span
            key={i}
            className="font-display text-lg tracking-widest text-gold sm:text-xl"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
