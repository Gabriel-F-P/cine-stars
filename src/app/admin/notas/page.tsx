import { prisma } from "@/lib/prisma";
import { InvoiceReviewCard } from "@/components/admin/InvoiceReviewCard";

export default async function AdminNotasPage() {
  const submissions = await prisma.invoiceSubmission.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      member: {
        select: {
          name: true,
          redemptions: {
            orderBy: { createdAt: "desc" },
            take: 3,
            include: { storeItem: { select: { name: true } } },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          Notas fiscais pendentes
        </h1>
        <p className="mt-1 text-neutral-400">
          {submissions.length} nota(s) aguardando revisão.
        </p>
      </div>

      {submissions.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
          Nenhuma nota pendente no momento.
        </p>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <InvoiceReviewCard
              key={s.id}
              id={s.id}
              code={s.code}
              amountCents={s.amountCents}
              memberName={s.member.name}
              recentRedemptions={s.member.redemptions.map((r) => ({
                itemName: r.storeItem.name,
                createdAt: r.createdAt.toLocaleDateString("pt-BR"),
                status: r.status,
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
