import Link from "next/link";
import { CalendarClock, Clapperboard, Gift } from "lucide-react";
import { prisma } from "@/lib/prisma";

const FALLBACK_GRADIENTS = [
  "from-crimson via-orange-600 to-neutral-950",
  "from-violet via-blue-600 to-neutral-950",
  "from-gold via-orange-500 to-neutral-950",
  "from-emerald-600 via-neutral-800 to-neutral-950",
];

export async function LaunchBanners() {
  const launches = await prisma.launch.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  if (launches.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Próximos lançamentos</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {launches.map((launch, i) => (
          <Link
            key={launch.id}
            href={`/conta/lancamentos/${launch.id}`}
            className={`group relative flex h-64 w-72 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/30 transition hover:border-gold/40 sm:w-96 ${
              launch.bannerUrl
                ? ""
                : `bg-gradient-to-br ${FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]}`
            }`}
          >
            {launch.bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-entered arbitrary external URL
              <img
                src={launch.bannerUrl}
                alt={launch.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 0%, white, transparent 45%)",
                }}
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

            {launch.prizeDescription && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-neutral-950">
                <Gift size={12} />
                Prêmio
              </span>
            )}

            <div className="relative flex flex-1 flex-col justify-end p-6">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-gold">
                <CalendarClock size={12} />
                {launch.releaseLabel}
              </span>
              <h3 className="font-display mt-3 text-3xl tracking-wide text-white">
                {launch.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-white/80">
                {launch.synopsis}
              </p>
              {launch.director && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-white/60">
                  <Clapperboard size={12} />
                  Direção: {launch.director}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
