import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — CineStars",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-16 text-neutral-100">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="font-display text-2xl tracking-wide">
          Cine<span className="text-gold">Stars</span>
        </Link>

        <h1 className="font-display mt-8 text-4xl tracking-wide">
          Política de Privacidade
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Última atualização: setembro de 2026
        </p>

        <div className="prose prose-invert mt-8 space-y-6 text-neutral-300">
          <section>
            <h2 className="text-xl font-semibold text-white">
              1. Dados que coletamos
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              <li>Nome completo, e-mail, telefone e CPF, no cadastro.</li>
              <li>
                Dados de pagamento são processados diretamente pelo Mercado
                Pago — o CineStars não armazena número de cartão nem dados
                bancários.
              </li>
              <li>
                Código e valor das notas fiscais enviadas para acúmulo de
                pontos.
              </li>
              <li>
                Histórico de pontos, resgates e assinatura dentro da
                plataforma.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              2. Para que usamos seus dados
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Usamos seus dados para processar a assinatura e os pagamentos
              recorrentes, calcular e creditar pontos, entregar prêmios
              resgatados, autenticar seu acesso à conta e cumprir obrigações
              legais e fiscais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              3. Compartilhamento
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Compartilhamos dados estritamente necessários com o Mercado
              Pago (para processar sua assinatura) e, quando aplicável, com
              parceiros de prêmios (como a plataforma usada para emitir
              vales-presente). Não vendemos seus dados a terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              4. Seus direitos (LGPD)
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Você pode solicitar a qualquer momento a confirmação,
              correção, portabilidade ou exclusão dos seus dados pessoais,
              nos termos da Lei Geral de Proteção de Dados (Lei nº
              13.709/2018), pelos canais de contato do site. A exclusão da
              conta encerra a assinatura e zera o saldo de pontos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">
              5. Segurança
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Sua senha é armazenada com hash criptográfico (nunca em texto
              plano) e o acesso à conta é protegido por autenticação. Ainda
              assim, nenhum sistema é 100% livre de risco — recomendamos usar
              uma senha única para o CineStars.
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
