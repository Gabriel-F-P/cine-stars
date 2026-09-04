"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Receipt,
  Ticket,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Compre seu ingresso",
    description:
      "Vá ao cinema, assista ao filme e guarde a nota fiscal da compra.",
    icon: Ticket,
    color: "from-crimson to-orange-600",
  },
  {
    number: "02",
    title: "Apresente a nota",
    description:
      "Envie o código da nota fiscal pelo nosso site ou direto na conversa do WhatsApp.",
    icon: Receipt,
    color: "from-gold to-orange-500",
  },
  {
    number: "03",
    title: "Ganhe seu prêmio",
    description:
      "Retire seu prêmio exclusivo na hora — sem sistema de pontos.",
    icon: Gift,
    color: "from-emerald-500 to-teal-600",
  },
];

export function HowItWorksCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDistance = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - trackCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-6 [scrollbar-width:none] [-ms-overflow-style:none] sm:px-[calc((100%-64rem)/2+1.5rem)] [&::-webkit-scrollbar]:hidden"
      >
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="relative w-[80%] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-8 sm:w-[340px]"
          >
            <span
              className={`font-display absolute -right-2 -top-6 text-8xl text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.12)]`}
              aria-hidden="true"
            >
              {step.number}
            </span>
            <div
              className={`relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white shadow-lg`}
            >
              <step.icon size={26} />
            </div>
            <p className="relative mt-6 text-xs font-semibold uppercase tracking-widest text-gold">
              Passo {step.number}
            </p>
            <h3 className="relative mt-1 text-xl font-semibold">
              {step.title}
            </h3>
            <p className="relative mt-2 text-sm text-neutral-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Passo anterior"
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition hover:border-gold/50 hover:text-gold disabled:opacity-30"
          disabled={activeIndex === 0}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {STEPS.map((step, i) => (
            <button
              key={step.number}
              type="button"
              aria-label={`Ir para o passo ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-gold" : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Próximo passo"
          onClick={() =>
            scrollToIndex(Math.min(STEPS.length - 1, activeIndex + 1))
          }
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition hover:border-gold/50 hover:text-gold disabled:opacity-30"
          disabled={activeIndex === STEPS.length - 1}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
