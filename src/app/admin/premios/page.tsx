import { prisma } from "@/lib/prisma";
import { LaunchPrizeReviewCard } from "@/components/admin/LaunchPrizeReviewCard";

export default async function AdminPremiosPage() {
  const claims = await prisma.launchPrizeClaim.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      launch: { select: { title: true, prizeDescription: true } },
      member: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          Prêmios de estreia pendentes
        </h1>
        <p className="mt-1 text-neutral-400">
          {claims.length} resgate(s) aguardando revisão. Um prêmio por CPF
          por lançamento.
        </p>
      </div>

      {claims.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
          Nenhum resgate pendente no momento.
        </p>
      ) : (
        <div className="space-y-4">
          {claims.map((c) => (
            <LaunchPrizeReviewCard
              key={c.id}
              id={c.id}
              launchTitle={c.launch.title}
              prizeDescription={c.launch.prizeDescription ?? ""}
              invoiceCode={c.invoiceCode}
              memberName={c.member.name}
              cpf={c.cpf}
            />
          ))}
        </div>
      )}
    </div>
  );
}
