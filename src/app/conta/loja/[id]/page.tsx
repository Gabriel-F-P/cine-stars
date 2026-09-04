import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Gift } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMemberPointsBalance } from "@/lib/points";
import { RedeemButton } from "@/components/RedeemButton";
import { PickupInfoCard } from "@/components/PickupInfoCard";
import { getVoucherAvailability, isOutOfStock } from "@/lib/store";

export default async function StoreItemPage({
  params,
}: PageProps<"/conta/loja/[id]">) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) redirect(`/entrar?callbackUrl=/conta/loja/${id}`);

  const item = await prisma.storeItem.findUnique({ where: { id } });
  if (!item || !item.active) notFound();

  const balance = await getMemberPointsBalance(session.user.id);
  const voucherAvailability = await getVoucherAvailability([item.id]);
  const availability = voucherAvailability.get(item.id)!;
  const outOfStock = isOutOfStock(item, availability);
  const canAfford = balance >= item.pointsCost && !outOfStock;

  return (
    <div className="space-y-6">
      <Link
        href="/conta"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-gold"
      >
        <ArrowLeft size={16} />
        Voltar pra loja
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gold/20 via-neutral-900 to-neutral-950">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-entered arbitrary external URL
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Gift size={72} className="text-gold/60" />
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-3xl tracking-wide">{item.name}</h1>
          <p className="mt-3 text-neutral-400">{item.description}</p>

          <p className="font-display mt-6 text-4xl text-gold">
            {item.pointsCost} pontos
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Seu saldo: <span className="text-neutral-300">{balance} pontos</span>
          </p>

          <div className="mt-6 max-w-xs">
            {outOfStock ? (
              <p className="rounded-lg border border-crimson/30 bg-crimson/10 px-4 py-3 text-sm text-red-200">
                {availability.managed
                  ? "Os códigos desse item acabaram. Volte em breve, novas unidades podem ser adicionadas em breve."
                  : "Esse item está sem estoque no momento."}
              </p>
            ) : (
              <RedeemButton storeItemId={item.id} canAfford={canAfford} />
            )}
          </div>

          {!availability.managed && (
            <div className="mt-6 max-w-xs">
              <PickupInfoCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
