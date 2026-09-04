import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Clapperboard,
  Film,
  Gift,
  Percent,
  PartyPopper,
  Popcorn,
  RefreshCw,
  Sparkles,
  Star,
  Ticket,
} from "lucide-react";
import { RegisterForm } from "@/components/RegisterForm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Marquee } from "@/components/Marquee";
import { HowItWorksCarousel } from "@/components/HowItWorksCarousel";
import { LaunchSection } from "@/components/LaunchSection";
import { ServicesSection } from "@/components/ServicesSection";

const benefits = [
  {
    title: "Prêmio a cada ingresso",
    description:
      "Apresente a nota fiscal do seu ingresso e ganhe prêmios exclusivos — sem sistema de pontos, é na hora.",
    icon: Film,
    color: "from-crimson to-orange-600",
  },
  {
    title: "Sorteio de ingressos",
    description:
      "Todo mês sorteamos ingressos entre todos os membros ativos do clube.",
    icon: Ticket,
    color: "from-gold to-orange-500",
  },
  {
    title: "Colecionáveis exclusivos",
    description:
      "Ganhe itens colecionáveis exclusivos dos maiores lançamentos do ano ao apresentar a nota do seu ingresso.",
    icon: Gift,
    color: "from-violet to-purple-600",
  },
  {
    title: "Descontos na bomboniere",
    description:
      "Preços especiais em pipoca, refrigerantes e combos sempre que você for ao cinema.",
    icon: Percent,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Mais sorteios todo mês",
    description:
      "Além dos ingressos, também tem sorteio de experiências e prêmios exclusivos pros membros.",
    icon: PartyPopper,
    color: "from-pink-500 to-rose-600",
  },
  {
    title: "Cancele quando quiser",
    description:
      "Assinatura mensal sem fidelidade — pause ou cancele direto pelo WhatsApp quando quiser.",
    icon: RefreshCw,
    color: "from-cyan-500 to-sky-600",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-x-clip">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <span className="font-display text-2xl tracking-wide">
              Cine<span className="text-gold">Stars</span>
            </span>
            <div className="flex items-center gap-3">
              <a
                href="#cadastro"
                className="rounded-full border border-gold px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold hover:text-neutral-950"
              >
                Quero participar
              </a>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {/* HERO */}
          <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-28">
            <div
              className="animate-spotlight absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-crimson/40 blur-[100px]"
              aria-hidden="true"
            />
            <div
              className="animate-spotlight absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full bg-violet/40 blur-[100px]"
              style={{ animationDelay: "-4s" }}
              aria-hidden="true"
            />
            <div
              className="absolute left-1/2 top-1/3 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-gold/20 blur-[110px]"
              aria-hidden="true"
            />

            {/* Floating cinema icons */}
            <Popcorn
              className="animate-float absolute left-[8%] top-24 h-10 w-10 text-gold/70 sm:h-14 sm:w-14"
              style={{ "--rot": "-12deg" } as CSSProperties}
              aria-hidden="true"
            />
            <Ticket
              className="animate-float absolute right-[10%] top-16 h-9 w-9 text-crimson-soft/80 sm:h-12 sm:w-12"
              style={{ animationDelay: "-2s", "--rot": "10deg" } as CSSProperties}
              aria-hidden="true"
            />
            <Clapperboard
              className="animate-float absolute bottom-10 left-[14%] h-9 w-9 text-violet-soft/80 sm:h-11 sm:w-11"
              style={{ animationDelay: "-3.5s", "--rot": "-6deg" } as CSSProperties}
              aria-hidden="true"
            />
            <Star
              className="animate-float absolute bottom-24 right-[16%] h-6 w-6 fill-gold text-gold sm:h-8 sm:w-8"
              style={{ animationDelay: "-1s" } as CSSProperties}
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-sm font-medium text-gold">
                <Sparkles size={14} />
                Reserve seu lugar — pacotes a partir de R$ 10/mês
              </span>
              <h1 className="font-display mt-6 text-6xl leading-[0.95] tracking-wide sm:text-8xl">
                Todo ingresso e{" "}
                <span className="bg-gradient-to-r from-gold via-gold-soft to-gold bg-clip-text text-transparent animate-shimmer">
                  toda pipoca
                </span>{" "}
                vira prêmio
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
                O CineStars é o clube que recompensa quem já ama ir ao
                cinema: compre seu ingresso, apresente a nota fiscal e ganhe
                prêmios exclusivos dos lançamentos do ano — além de concorrer
                a sorteios mensais de ingressos e experiências.
              </p>
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href="#cadastro"
                  className="animate-glow inline-block rounded-lg bg-gold px-8 py-3.5 text-base font-semibold text-neutral-950 transition hover:scale-105 hover:brightness-110"
                >
                  Quero reservar meu lugar
                </a>
                <a
                  href="#premios"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3.5 text-base font-medium text-neutral-200 transition hover:border-gold/50 hover:text-gold"
                >
                  <Film size={18} />
                  Ver prêmios do clube
                </a>
              </div>
            </div>
          </section>

          <Marquee />

          <LaunchSection />

          {/* HOW IT WORKS */}
          <section className="border-t border-white/10 py-24">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-sm font-medium text-gold">
                  <Sparkles size={14} />
                  Chegou a maneira de recompensar quem gosta de ir ao cinema
                </span>
                <h2 className="font-display mt-4 text-4xl tracking-wide sm:text-5xl">
                  Como funciona
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-neutral-400">
                  Do ingresso ao prêmio, em 3 passos simples. Arraste os cards
                  pro lado pra ver o caminho completo.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={120}>
              <HowItWorksCarousel />
            </ScrollReveal>
          </section>

          {/* BENEFITS */}
          <section className="border-t border-white/10 bg-neutral-900/40 px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <ScrollReveal className="text-center">
                <h2 className="font-display text-4xl tracking-wide sm:text-5xl">
                  Benefícios do clube
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-neutral-400">
                  Feito para quem vive o cinema. Quanto mais você participa, mais
                  vantagens você desbloqueia.
                </p>
              </ScrollReveal>

              <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit, i) => (
                  <ScrollReveal key={benefit.title} delay={i * 80}>
                    <div className="group relative h-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900/60 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10">
                      <div
                        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${benefit.color} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40`}
                        aria-hidden="true"
                      />
                      <div
                        className={`relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${benefit.color} text-white shadow-lg`}
                      >
                        <benefit.icon size={22} />
                      </div>
                      <h3 className="relative mt-4 text-lg font-semibold">
                        {benefit.title}
                      </h3>
                      <p className="relative mt-2 text-sm text-neutral-400">
                        {benefit.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          <ServicesSection />

          {/* CADASTRO */}
          <section
            id="cadastro"
            className="relative overflow-hidden border-t border-white/10 px-6 py-24"
          >
            <div
              className="absolute -bottom-24 left-1/2 h-[24rem] w-[36rem] -translate-x-1/2 rounded-full bg-crimson/20 blur-[120px]"
              aria-hidden="true"
            />
            <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-sm font-medium text-gold">
                  <Ticket size={14} />
                  Reserve seu lugar
                </span>
                <h2 className="font-display mt-4 text-4xl tracking-wide sm:text-5xl">
                  Garanta sua vaga e venha ser um Star
                </h2>
                <p className="mt-4 text-neutral-400">
                  Estamos com as inscrições abertas antes do lançamento
                  oficial. Preencha seus dados pra reservar seu lugar —
                  pacotes a partir de R$ 10/mês, sem pagamento nenhum agora.
                  Assim que estiverem disponíveis, avisamos você.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-gold" />
                    Cadastro rápido, leva menos de 1 minuto
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-gold" />
                    Pacotes a partir de R$ 10/mês, sem pagamento agora
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-gold" />
                    Você é avisado assim que os pacotes forem lançados
                  </li>
                </ul>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <div className="ticket-notch relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70 p-8 shadow-2xl shadow-black/40">
                  <div
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-gold to-violet"
                    aria-hidden="true"
                  />
                  <div className="absolute left-6 right-6 top-6 border-t border-dashed border-white/10" />
                  <RegisterForm />
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>

        <footer className="film-strip border-t border-white/10 bg-neutral-950 px-6 py-10 text-center text-sm text-neutral-500">
          <span className="font-display block text-lg tracking-wide text-neutral-300">
            Cine<span className="text-gold">Stars</span>
          </span>
          <p className="mt-2">
            © {new Date().getFullYear()} CineStars. Todos os direitos
            reservados.
          </p>
          <p className="mt-2 flex justify-center gap-4 text-xs">
            <Link href="/termos" className="hover:text-gold">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-gold">
              Política de Privacidade
            </Link>
          </p>
        </footer>
      </div>
  );
}
