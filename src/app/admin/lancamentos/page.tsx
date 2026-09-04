import { prisma } from "@/lib/prisma";
import { CreateLaunchForm } from "@/components/admin/CreateLaunchForm";
import { ToggleActiveButton } from "@/components/admin/ToggleActiveButton";
import { toggleLaunchActive } from "@/app/admin/actions";

export default async function AdminLancamentosPage() {
  const launches = await prisma.launch.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide">
          Próximos lançamentos
        </h1>
        <p className="mt-1 text-neutral-400">
          Gerencie os banners de filmes exibidos na loja do usuário.
        </p>
      </div>

      <CreateLaunchForm />

      <div className="space-y-2">
        {launches.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-8 text-center text-neutral-400">
            Nenhum lançamento cadastrado ainda.
          </p>
        ) : (
          launches.map((launch) => (
            <div
              key={launch.id}
              className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-neutral-900/60 px-4 py-3"
            >
              <div>
                <p className="font-medium">{launch.title}</p>
                <p className="text-xs text-neutral-500">
                  {launch.releaseLabel}
                  {launch.director ? ` · Dir. ${launch.director}` : ""}
                </p>
              </div>
              <ToggleActiveButton
                id={launch.id}
                active={launch.active}
                action={toggleLaunchActive}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
