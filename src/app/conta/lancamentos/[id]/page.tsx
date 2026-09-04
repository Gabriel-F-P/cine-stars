import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CalendarClock, Clapperboard, Gift } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ClaimPrizeForm } from "@/components/ClaimPrizeForm";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Em análise",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-gold",
  APPROVED: "text-emerald-400",
  REJECTED: "text-crimson-soft",
};

export default async function LaunchDetailPage({
  params,
}: PageProps<"/conta/lancamentos/[id]">) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) redirect(`/entrar?callbackUrl=/conta/lancamentos/${id}`);

  const launch = await prisma.launch.findUnique({ where: { id } });
  if (!launch || !launch.active) notFound();

  const member = await prisma.member.findUnique({
    where: { id: session.user.id },
  });
  if (!member) redirect(`/entrar?callbackUrl=/conta/lancamentos/${id}`);

  const existingClaim = launch.prizeDescription
    ? await prisma.launchPrizeClaim.findUnique({
        where: { launchId_cpf: { launchId: id, cpf: member.cpf } },
      })
    : null;

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
        <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-crimson via-violet to-neutral-950 lg:aspect-square">
          {launch.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-entered arbitrary external URL
            <img
              src={launch.bannerUrl}
              alt={launch.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Clapperboard size={72} className="text-white/60" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            <CalendarClock size={12} />
            {launch.releaseLabel}
          </span>
          <h1 className="font-display mt-3 text-3xl tracking-wide">
            {launch.title}
          </h1>
          {launch.director && (
            <p className="mt-1 text-sm text-neutral-500">
              Direção: {launch.director}
            </p>
          )}
          <p className="mt-3 text-neutral-400">{launch.synopsis}</p>

          {launch.prizeDescription && (
            <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold">
                <Gift size={16} />
                Prêmio de estreia
              </p>
              <p className="mt-2 text-neutral-200">
                {launch.prizeDescription}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Assista o filme, mostre a nota fiscal do ingresso e resgate —
                sem gastar pontos. Limitado a 1 por CPF.
              </p>

              <div className="mt-4">
                {existingClaim ? (
                  <div>
                    <p
                      className={`text-sm font-semibold ${STATUS_COLOR[existingClaim.status]}`}
                    >
                      Seu resgate: {STATUS_LABEL[existingClaim.status]}
                    </p>
                    {existingClaim.status === "APPROVED" &&
                      existingClaim.fulfillmentNote && (
                        <p className="mt-1 text-sm text-neutral-300">
                          {existingClaim.fulfillmentNote}
                        </p>
                      )}
                    {existingClaim.status === "REJECTED" &&
                      existingClaim.rejectionReason && (
                        <p className="mt-1 text-sm text-neutral-400">
                          Motivo: {existingClaim.rejectionReason}
                        </p>
                      )}
                  </div>
                ) : (
                  <ClaimPrizeForm launchId={launch.id} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
