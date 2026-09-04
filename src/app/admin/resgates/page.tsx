import { prisma } from "@/lib/prisma";
import { FulfillRedemptionForm } from "@/components/admin/FulfillRedemptionForm";

export default async function AdminResgatesPage() {
  const redemptions = await prisma.redemption.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      member: { select: { name: true, email: true } },
      storeItem: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">Resgates</h1>
        <p className="mt-1 text-neutral-400">
          Resgates são concluídos automaticamente pelo membro — não precisam
          de aprovação. Use a nota abaixo só pra registrar o código do
          voucher entregue na retirada.
        </p>
      </div>

      {redemptions.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
          Nenhum resgate ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {redemptions.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-white/10 bg-neutral-900/60 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{r.storeItem.name}</p>
                  <p className="text-sm text-neutral-400">
                    {r.member.name} · {r.member.email}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {r.createdAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <p className="text-lg font-semibold text-gold">
                  {r.pointsSpent} pontos
                </p>
              </div>
              <FulfillRedemptionForm
                id={r.id}
                defaultNote={r.fulfillmentNote ?? ""}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
