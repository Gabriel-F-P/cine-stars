import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceForm } from "@/components/InvoiceForm";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Em análise",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-gold",
  APPROVED: "text-emerald-400",
  REJECTED: "text-crimson-soft",
};

export default async function NotaFiscalPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar?callbackUrl=/conta/nota-fiscal");

  const submissions = await prisma.invoiceSubmission.findMany({
    where: { memberId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide">Nota fiscal</h1>
        <p className="mt-1 text-neutral-400">
          Envie o código da sua nota fiscal e ganhe pontos assim que for
          aprovada.
        </p>
      </div>

      <InvoiceForm />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Notas enviadas</h2>
        {submissions.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
            Você ainda não enviou nenhuma nota fiscal.
          </p>
        ) : (
          <div className="space-y-2">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-neutral-900/60 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{s.code}</p>
                  <p className="text-xs text-neutral-500">
                    R$ {(s.amountCents / 100).toFixed(2)} ·{" "}
                    {s.createdAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${STATUS_COLOR[s.status]}`}>
                  {STATUS_LABEL[s.status]}
                  {s.status === "APPROVED" && s.pointsAwarded
                    ? ` (+${s.pointsAwarded})`
                    : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
