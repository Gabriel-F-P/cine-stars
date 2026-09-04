import Link from "next/link";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";

const AGE_BUCKETS = [
  { label: "Até 17", min: 0, max: 17 },
  { label: "18–24", min: 18, max: 24 },
  { label: "25–34", min: 25, max: 34 },
  { label: "35–44", min: 35, max: 44 },
  { label: "45–59", min: 45, max: 59 },
  { label: "60+", min: 60, max: 999 },
];

export default async function AdminInteressadosPage() {
  const [total, ages, byCity, byNeighborhood, recent] = await Promise.all([
    prisma.signup.count(),
    prisma.signup.findMany({ select: { age: true } }),
    prisma.signup.groupBy({
      by: ["city"],
      _count: { _all: true },
      orderBy: { _count: { city: "desc" } },
      take: 10,
    }),
    prisma.signup.groupBy({
      by: ["neighborhood"],
      _count: { _all: true },
      orderBy: { _count: { neighborhood: "desc" } },
      take: 10,
    }),
    prisma.signup.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const ageBucketCounts = AGE_BUCKETS.map((bucket) => ({
    ...bucket,
    count: ages.filter((s) => s.age >= bucket.min && s.age <= bucket.max)
      .length,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl tracking-wide">Interessados</h1>
        <Link
          href="/admin/interessados/export"
          className="flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm text-neutral-300 transition hover:border-gold/50 hover:text-gold"
        >
          <Download size={16} />
          Exportar CSV
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6">
        <p className="text-sm text-neutral-400">Total de cadastros</p>
        <p className="font-display mt-1 text-4xl text-gold">{total}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Por faixa etária</h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/10">
                {ageBucketCounts.map((bucket) => (
                  <tr key={bucket.label} className="bg-neutral-900/60">
                    <td className="px-4 py-2.5 text-neutral-300">
                      {bucket.label}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gold">
                      {bucket.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Top cidades</h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/10">
                {byCity.map((row) => (
                  <tr key={row.city} className="bg-neutral-900/60">
                    <td className="px-4 py-2.5 text-neutral-300">
                      {row.city}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gold">
                      {row._count._all}
                    </td>
                  </tr>
                ))}
                {byCity.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-neutral-500" colSpan={2}>
                      Sem dados ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Top bairros</h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/10">
                {byNeighborhood.map((row) => (
                  <tr key={row.neighborhood} className="bg-neutral-900/60">
                    <td className="px-4 py-2.5 text-neutral-300">
                      {row.neighborhood}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gold">
                      {row._count._all}
                    </td>
                  </tr>
                ))}
                {byNeighborhood.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-neutral-500" colSpan={2}>
                      Sem dados ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Cadastros recentes ({recent.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-900 text-left text-neutral-400">
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Idade</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Bairro / Cidade</th>
                <th className="px-4 py-3 font-medium">Origem</th>
                <th className="px-4 py-3 font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recent.map((s) => (
                <tr key={s.id} className="bg-neutral-900/60">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3 text-neutral-300">{s.age}</td>
                  <td className="px-4 py-3 text-neutral-300">{s.phone}</td>
                  <td className="px-4 py-3 text-neutral-300">{s.email}</td>
                  <td className="px-4 py-3 text-neutral-300">
                    {s.neighborhood} — {s.city}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {s.source === "STAFF" ? "Presencial" : "Site"}
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {s.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td className="px-4 py-3 text-neutral-500" colSpan={7}>
                    Nenhum cadastro ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
