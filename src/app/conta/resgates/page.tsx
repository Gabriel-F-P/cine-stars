import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PickupInfoCard } from "@/components/PickupInfoCard";

export default async function MeusResgatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar?callbackUrl=/conta/resgates");

  const redemptions = await prisma.redemption.findMany({
    where: { memberId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { storeItem: { select: { name: true, imageUrl: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide">Meus resgates</h1>
        <p className="mt-1 text-neutral-400">
          Seus prêmios resgatados e os códigos pra usar ou retirar.
        </p>
      </div>

      {redemptions.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
          Você ainda não resgatou nenhum prêmio.
        </p>
      ) : (
        <div className="space-y-3">
          {redemptions.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-white/10 bg-neutral-900/60 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{r.storeItem.name}</p>
                  <p className="text-xs text-neutral-500">
                    {r.createdAt.toLocaleDateString("pt-BR")} ·{" "}
                    {r.pointsSpent} pontos
                  </p>
                </div>
              </div>
              {r.fulfillmentNote ? (
                <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2">
                  <code className="text-sm font-semibold tracking-wide text-gold">
                    {r.fulfillmentNote}
                  </code>
                </div>
              ) : (
                <p className="mt-3 text-sm text-neutral-500">
                  Retire esse prêmio presencialmente — veja o endereço abaixo.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <PickupInfoCard />
    </div>
  );
}
