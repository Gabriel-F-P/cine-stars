import Link from "next/link";
import { isPlanId, PLANS } from "@/lib/plans";

export default async function SucessoPage({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string }>;
}) {
  const { plano } = await searchParams;
  const planId = plano?.toUpperCase();
  const plan = isPlanId(planId) ? PLANS[planId] : undefined;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <span className="text-5xl">🎉</span>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
        Cadastro enviado!
      </h1>
      <p className="mt-4 max-w-md text-neutral-400">
        {plan
          ? `Recebemos sua adesão ao plano ${plan.name}. Assim que o Mercado Pago confirmar a autorização, você começa a acumular ${plan.pointsPerMonth} pontos por mês.`
          : "Recebemos sua adesão ao CineStars. Assim que o Mercado Pago confirmar a autorização, sua assinatura entra em vigor."}{" "}
        Em breve você recebe um e-mail com os próximos passos.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-gold px-6 py-3 font-semibold text-neutral-950 transition hover:brightness-110"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}
