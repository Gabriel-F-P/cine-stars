import { Rocket, Star } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

export function LaunchSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 px-6 py-20">
      <div
        className="absolute left-1/2 top-1/2 h-[30rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson/15 blur-[120px]"
        aria-hidden="true"
      />
      <ScrollReveal className="relative mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-sm font-medium text-gold">
          <Rocket size={14} />
          Reserva antecipada
        </span>
        <h2 className="font-display mt-4 text-5xl tracking-wide sm:text-7xl">
          Garanta seu{" "}
          <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent">
            lugar
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-neutral-400">
          Cadastre-se agora e seja avisado assim que os pacotes do CineStars,
          a partir de R$ 10/mês, estiverem disponíveis.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-5 py-2.5 text-sm font-medium text-gold">
          <Star size={16} />
          Sem pagamento agora — é só reservar seu lugar
        </div>
      </ScrollReveal>
    </section>
  );
}
