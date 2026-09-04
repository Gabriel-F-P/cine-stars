import Link from "next/link";

export const metadata = {
  title: "Termos de Uso — CineStars",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-16 text-neutral-100">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="font-display text-2xl tracking-wide">
          Cine<span className="text-gold">Stars</span>
        </Link>

        <h1 className="font-display mt-8 text-4xl tracking-wide">
          Termos de Uso
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Última atualização: setembro de 2026
        </p>

        <div className="prose prose-invert mt-8 space-y-6 text-neutral-300">
          <section>
            <h2 className="text-xl font-semibold text-white">1. O clube</h2>
            <p className="mt-2 text-sm leading-relaxed">
              O CineStars é um clube de fidelidade por assinatura mensal.
              Assinantes acumulam pontos ao ir ao cinema, comprar na
              bomboniere e enviar notas fiscais, podendo trocar esses pontos
              por ingressos, descontos e outros prêmios disponíveis na loja
              de resgate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              2. Assinatura e cobrança
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              A assinatura é cobrada mensalmente, de forma recorrente, via
              Mercado Pago, no valor do plano escolhido no momento da
              adesão. Você pode cancelar a qualquer momento, sem multa ou
              fidelidade — o cancelamento interrompe as cobranças futuras,
              mas não gera reembolso do período já pago.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              3. Pontos e resgates
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li>
                Pontos não têm valor monetário, não são reembolsáveis e não
                podem ser transferidos entre contas.
              </li>
              <li>
                Notas fiscais enviadas passam por análise e podem ser
                rejeitadas em caso de dados incorretos, duplicidade ou
                suspeita de fraude.
              </li>
              <li>
                Prêmios resgatados (incluindo vales-presente de terceiros,
                como o Ingresso.com) seguem as regras de validade e uso do
                próprio emissor do prêmio, que podem incluir prazo de
                expiração e restrição de uso.
              </li>
              <li>
                A retirada de prêmios físicos ou a entrega de códigos ocorre
                no local e horário informados na sua conta.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              4. Uso da conta
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Cada conta é pessoal e intransferível. Tentativas de fraude —
              como reenvio de notas fiscais já usadas, notas forjadas ou uso
              de pontos obtidos de má-fé — podem resultar em cancelamento da
              conta e perda dos pontos acumulados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Contato</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Dúvidas sobre esses termos podem ser enviadas pelos canais de
              atendimento informados no site.
            </p>
          </section>

          <p className="mt-8 rounded-lg border border-white/10 bg-neutral-900/60 p-4 text-xs text-neutral-500">
            Este texto é um modelo geral e não substitui a revisão de um
            advogado antes do lançamento oficial do serviço.
          </p>
        </div>
      </div>
    </div>
  );
}
