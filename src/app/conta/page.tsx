import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMemberPointsBalance } from "@/lib/points";
import { PLANS } from "@/lib/plans";
import { LaunchBanners } from "@/components/LaunchBanners";
import { StoreItemCard } from "@/components/StoreItemCard";
import { PickupInfoCard } from "@/components/PickupInfoCard";
import { getVoucherAvailability, isOutOfStock } from "@/lib/store";

export default async function ContaPage() {
  const session = await auth();
  if (!session?.user) redirect("/entrar?callbackUrl=/conta");
  if (session.user.role === "ADMIN") redirect("/admin");

  const member = await prisma.member.findUnique({
    where: { id: session.user.id },
  });
  if (!member) redirect("/entrar?callbackUrl=/conta");

  const [balance, items] = await Promise.all([
    getMemberPointsBalance(member.id),
    prisma.storeItem.findMany({
      where: { active: true },
      orderBy: { pointsCost: "asc" },
    }),
  ]);

  const planDefinition = PLANS[member.plan];
  const voucherAvailability = await getVoucherAvailability(
    items.map((item) => item.id)
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide">
            Olá, {member.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-neutral-400">Plano {planDefinition.name}</p>
        </div>

        <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-neutral-900/60 px-6 py-4 text-right">
          <p className="text-xs text-neutral-400">Saldo de pontos</p>
          <p className="font-display text-3xl text-gold">{balance}</p>
        </div>
      </div>

      {member.subscriptionStatus === "PENDING" && (
        <p className="flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
          <Sparkles size={16} />
          Sua assinatura ainda está aguardando confirmação do Mercado Pago.
        </p>
      )}

      <LaunchBanners />

      <div>
        <h2 className="mb-3 text-lg font-semibold">Loja de resgate</h2>
        {items.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
            Nenhum item disponível na loja no momento.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => {
              const outOfStock = isOutOfStock(
                item,
                voucherAvailability.get(item.id)!
              );
              return (
                <StoreItemCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  pointsCost={item.pointsCost}
                  outOfStock={outOfStock}
                  canAfford={balance >= item.pointsCost}
                />
              );
            })}
          </div>
        )}
      </div>

      {items.some((item) => !voucherAvailability.get(item.id)?.managed) && (
        <PickupInfoCard />
      )}
    </div>
  );
}
