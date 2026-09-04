import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AddVouchersForm } from "@/components/admin/AddVouchersForm";

export default async function AdminVouchersPage({
  params,
}: PageProps<"/admin/loja/[id]/vouchers">) {
  const { id } = await params;

  const item = await prisma.storeItem.findUnique({ where: { id } });
  if (!item) notFound();

  const vouchers = await prisma.voucher.findMany({
    where: { storeItemId: id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const availableCount = vouchers.filter((v) => v.status === "AVAILABLE").length;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/loja"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-gold"
        >
          <ArrowLeft size={16} />
          Voltar pra itens da loja
        </Link>
        <h1 className="font-display mt-3 text-3xl tracking-wide">
          Vouchers — {item.name}
        </h1>
        <p className="mt-1 text-neutral-400">
          {availableCount} disponível(is) de {vouchers.length} cadastrado(s).
          Quando há vouchers aqui, o resgate desse item entrega o código
          automaticamente e ignora o campo de estoque genérico.
        </p>
      </div>

      <AddVouchersForm storeItemId={id} />

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-900 text-left text-neutral-400">
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Validade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {vouchers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-neutral-400">
                  Nenhum voucher cadastrado ainda.
                </td>
              </tr>
            ) : (
              vouchers.map((v) => (
                <tr key={v.id} className="bg-neutral-900/60">
                  <td className="px-4 py-3 font-mono text-xs">{v.code}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        v.status === "AVAILABLE"
                          ? "text-emerald-400"
                          : "text-neutral-500"
                      }
                    >
                      {v.status === "AVAILABLE" ? "Disponível" : "Atribuído"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {v.expiresAt
                      ? v.expiresAt.toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
