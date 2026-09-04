import Link from "next/link";
import { Ticket } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CreateStoreItemForm } from "@/components/admin/CreateStoreItemForm";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";
import { toggleStoreItemActive } from "@/app/admin/actions";

export default async function AdminLojaPage() {
  const items = await prisma.storeItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide">Itens da loja</h1>
        <p className="mt-1 text-neutral-400">
          Crie e gerencie os prêmios disponíveis para resgate.
        </p>
      </div>

      <CreateStoreItemForm />

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
            Nenhum item cadastrado ainda.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-neutral-900/60 px-4 py-3"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-neutral-500">
                  {item.pointsCost} pontos ·{" "}
                  {item.stock === null ? "estoque ilimitado" : `${item.stock} em estoque`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/loja/${item.id}/vouchers`}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300 transition hover:border-gold/50 hover:text-gold"
                >
                  <Ticket size={12} />
                  Vouchers
                </Link>
                <ToggleActiveButton
                  id={item.id}
                  active={item.active}
                  action={toggleStoreItemActive}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
