import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMemberPointsBalance } from "@/lib/points";

const TYPE_LABEL: Record<string, string> = {
  SUBSCRIPTION_MONTHLY: "Pontos mensais da assinatura",
  SUBSCRIPTION_BONUS: "Bônus trimestral",
  INVOICE: "Nota fiscal aprovada",
  REDEMPTION: "Resgate na loja",
  ADJUSTMENT: "Ajuste manual",
};

export default async function PontosPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar?callbackUrl=/conta/pontos");

  const [transactions, balance] = await Promise.all([
    prisma.pointsTransaction.findMany({
      where: { memberId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    getMemberPointsBalance(session.user.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-wide">Meus pontos</h1>
        <p className="mt-1 text-neutral-400">
          Saldo atual:{" "}
          <span className="text-gold font-semibold">{balance} pontos</span>
        </p>
      </div>

      {transactions.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
          Você ainda não tem movimentações de pontos.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/10">
              {transactions.map((t) => (
                <tr key={t.id} className="bg-neutral-900/60">
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {t.description || TYPE_LABEL[t.type]}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {t.createdAt.toLocaleDateString("pt-BR")}
                    </p>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      t.points >= 0 ? "text-emerald-400" : "text-crimson-soft"
                    }`}
                  >
                    {t.points >= 0 ? "+" : ""}
                    {t.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
