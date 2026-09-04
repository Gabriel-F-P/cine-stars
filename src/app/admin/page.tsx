import { prisma } from "@/lib/prisma";
import { PLANS, PLAN_LIST, formatPriceCents } from "@/lib/plans";

const STATUS_ORDER = ["PENDING", "AUTHORIZED", "PAUSED", "CANCELLED"] as const;
const STATUS_LABEL: Record<(typeof STATUS_ORDER)[number], string> = {
  PENDING: "Pendente",
  AUTHORIZED: "Ativa",
  PAUSED: "Pausada",
  CANCELLED: "Cancelada",
};

export default async function AdminMetricsPage() {
  const [
    totalMembers,
    byPlanAndStatus,
    pendingInvoices,
    totalRedemptions,
    pointsIssued,
    pointsRedeemed,
  ] = await Promise.all([
    prisma.member.count({ where: { role: "MEMBER" } }),
    prisma.member.groupBy({
      by: ["plan", "subscriptionStatus"],
      where: { role: "MEMBER" },
      _count: { _all: true },
    }),
    prisma.invoiceSubmission.count({ where: { status: "PENDING" } }),
    prisma.redemption.count(),
    prisma.pointsTransaction.aggregate({
      where: { points: { gt: 0 } },
      _sum: { points: true },
    }),
    prisma.pointsTransaction.aggregate({
      where: { points: { lt: 0 } },
      _sum: { points: true },
    }),
  ]);

  const counts: Record<
    "BASIC" | "PREMIUM",
    Record<(typeof STATUS_ORDER)[number], number>
  > = {
    BASIC: { PENDING: 0, AUTHORIZED: 0, PAUSED: 0, CANCELLED: 0 },
    PREMIUM: { PENDING: 0, AUTHORIZED: 0, PAUSED: 0, CANCELLED: 0 },
  };
  byPlanAndStatus.forEach((row) => {
    counts[row.plan][row.subscriptionStatus] = row._count._all;
  });

  const totalByPlan = (plan: "BASIC" | "PREMIUM") =>
    STATUS_ORDER.reduce((sum, status) => sum + counts[plan][status], 0);

  const activeCount = counts.BASIC.AUTHORIZED + counts.PREMIUM.AUTHORIZED;
  const mrrCents =
    counts.BASIC.AUTHORIZED * PLANS.BASIC.priceCents +
    counts.PREMIUM.AUTHORIZED * PLANS.PREMIUM.priceCents;

  const cards = [
    { label: "Membros cadastrados", value: totalMembers },
    { label: "Assinaturas ativas", value: activeCount },
    { label: "MRR", value: formatPriceCents(mrrCents) },
    { label: "Notas fiscais pendentes", value: pendingInvoices },
    { label: "Resgates realizados", value: totalRedemptions },
    {
      label: "Pontos emitidos vs. resgatados",
      value: `${pointsIssued._sum.points ?? 0} / ${Math.abs(
        pointsRedeemed._sum.points ?? 0
      )}`,
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl tracking-wide">Métricas</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-white/10 bg-neutral-900/60 p-6"
          >
            <p className="text-sm text-neutral-400">{card.label}</p>
            <p className="font-display mt-1 text-3xl text-gold">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Membros por plano</h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-900 text-left text-neutral-400">
                <th className="px-4 py-3 font-medium">Plano</th>
                {STATUS_ORDER.map((status) => (
                  <th key={status} className="px-4 py-3 font-medium">
                    {STATUS_LABEL[status]}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {PLAN_LIST.map((plan) => (
                <tr key={plan.id} className="bg-neutral-900/60">
                  <td className="px-4 py-3 font-medium">{plan.name}</td>
                  {STATUS_ORDER.map((status) => (
                    <td key={status} className="px-4 py-3 text-neutral-300">
                      {counts[plan.id][status]}
                    </td>
                  ))}
                  <td className="px-4 py-3 font-semibold text-gold">
                    {totalByPlan(plan.id)}
                  </td>
                </tr>
              ))}
              <tr className="bg-neutral-900/80 font-semibold">
                <td className="px-4 py-3">Total</td>
                {STATUS_ORDER.map((status) => (
                  <td key={status} className="px-4 py-3 text-neutral-300">
                    {counts.BASIC[status] + counts.PREMIUM[status]}
                  </td>
                ))}
                <td className="px-4 py-3 text-gold">{totalMembers}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
