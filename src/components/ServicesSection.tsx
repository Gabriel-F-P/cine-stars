import { MoviePosterCard, PRIZE_ITEMS } from "@/components/MoviePosterCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export function ServicesSection() {
  return (
    <section
      id="premios"
      className="border-t border-white/10 bg-neutral-900/40 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="text-center">
          <h2 className="font-display text-4xl tracking-wide sm:text-5xl">
            O que você encontra no CineStars
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-400">
            A cada lançamento do ano, novos itens exclusivos entram na
            coleção CineStars — apresente a nota do seu ingresso e leve o seu
            prêmio pra casa.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="relative mt-14">
            <div className="flex gap-6 overflow-x-auto px-2 pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {PRIZE_ITEMS.map((item) => (
                <MoviePosterCard key={item.name} item={item} />
              ))}
            </div>

            <div className="pointer-events-none absolute -left-[10%] -right-[10%] top-1/2 z-10 -translate-y-1/2 -rotate-6">
              <div className="bg-gradient-to-r from-gold via-gold-soft to-gold py-2 shadow-lg shadow-black/50">
                <p className="overflow-hidden text-center font-display text-sm tracking-[0.3em] text-neutral-950 sm:text-lg">
                  ✦ E MUITO MAIS ✦ E MUITO MAIS ✦ E MUITO MAIS ✦
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
