# CineStars

Landing page do clube de fidelidade CineStars. Fase atual: pesquisa de interesse — o formulário de cadastro coleta nome, idade, telefone, e-mail e endereço, sem pagamento nenhum, pra usar como argumento na apresentação a cinemas locais e reservar o lugar de quem se cadastrar antes dos pacotes serem lançados. O app também já tem uma área de admin (métricas, cadastro de lançamentos, gestão de equipe) e uma área de funcionário (busca de cadastro por CPF, registro presencial). O fluxo de assinatura paga via Mercado Pago e o sistema de pontos existem no código mas estão desativados até o lançamento oficial dos pacotes.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Server Actions)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma 7](https://www.prisma.io) + PostgreSQL (via driver adapter `@prisma/adapter-pg`)
- [Mercado Pago SDK](https://github.com/mercadopago/sdk-nodejs) (assinaturas / PreApproval)
- [Zod](https://zod.dev) para validação de formulário
- [lucide-react](https://lucide.dev) para os ícones

## Rodando localmente

1. Suba o banco de dados local (Docker):

   ```bash
   docker compose up -d
   ```

2. Instale as dependências e aplique as migrations:

   ```bash
   npm install
   npx prisma migrate dev
   ```

3. Configure o `.env` (veja abaixo) com suas credenciais de teste do Mercado Pago.

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000).

## Planos

Definidos em `src/lib/plans.ts` (fonte única usada pela UI e pela criação da assinatura):

| Plano | Preço | Pontos/mês | Bônus |
| --- | --- | --- | --- |
| Básico | R$ 10/mês | 20 pontos | +40 pontos a cada 3 meses |
| Premium | R$ 20/mês | 50 pontos | +80 pontos a cada 3 meses |

## Variáveis de ambiente (`.env`)

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | Connection string do Postgres. Já configurada para o `docker-compose.yml` local; em produção é injetada pelo plugin Postgres do Railway. |
| `MERCADOPAGO_ACCESS_TOKEN` | Access Token da sua aplicação no [painel do Mercado Pago](https://www.mercadopago.com.br/developers/panel/app). Use o token de **teste** (`TEST-...`) em desenvolvimento — pertence ao fluxo de assinatura paga, hoje desativado. |
| `MERCADOPAGO_WEBHOOK_SECRET` | Assinatura secreta do webhook, configurada no mesmo painel, usada para validar as notificações recebidas. |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação. Como começa com `NEXT_PUBLIC_`, é embutida no build do Next.js — precisa estar configurada **antes** do build de produção. Em produção, o domínio real (ex: `https://cinestars.com.br`). |
| `AUTH_SECRET` | Segredo do Auth.js pra assinar/criptografar os cookies de sessão (JWT). Gere um valor novo pra produção, nunca reaproveite o de desenvolvimento: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. |
| `RESEND_API_KEY` | API key da [Resend](https://resend.com), usada pro e-mail de redefinição de senha. |
| `RESEND_FROM_EMAIL` | Remetente dos e-mails. Sem domínio verificado na Resend, precisa ser `onboarding@resend.dev` (só entrega pro e-mail dono da conta). |

Veja `.env.example` pra copiar como ponto de partida.

### Testando o webhook do Mercado Pago localmente

Só relevante quando o fluxo de assinatura paga for reativado. O Mercado Pago precisa alcançar `NEXT_PUBLIC_APP_URL/api/webhooks/mercadopago` publicamente — em desenvolvimento, use um túnel (ex: `ngrok http 3000`) e atualize `NEXT_PUBLIC_APP_URL` com a URL gerada.

## Fluxo atual: pesquisa de interesse

1. O visitante preenche o formulário na landing page (`src/components/RegisterForm.tsx`) com nome, idade, telefone, e-mail, CPF e endereço — sem escolha de plano e sem pagamento.
2. A Server Action `registerMember` (`src/app/actions.ts`) valida os dados e grava um `Signup` no banco via `createSignup` (`src/lib/signup.ts`), fazendo upsert pelo CPF.
3. Na área `/admin/interessados`, o admin acompanha contagem, faixa etária e cidade/bairro dos cadastros (com exportação em CSV) pra usar na apresentação aos cinemas.
4. Na área `/funcionario`, a equipe busca um cadastro pelo CPF ou registra alguém presencialmente (mesmo fluxo, com `source: STAFF`).

O fluxo de assinatura paga via Mercado Pago (`PreApproval`, webhook, pontos) e a loja de resgate por pontos continuam implementados, mas fora do ar — serão reativados quando os pacotes forem lançados.

## Banco de dados

Principais modelos (`prisma/schema.prisma`):

- `Signup` — cadastros da pesquisa de interesse: nome, idade, telefone, e-mail, CPF (único), bairro, cidade, endereço e origem (`PUBLIC` ou `STAFF`).
- `Member` — contas com login (Auth.js): admin, funcionário e, quando o pagamento for reativado, assinantes. Guarda plano, status de assinatura e o ID da assinatura no Mercado Pago.
- `Launch`, `LaunchPrizeClaim`, `StoreItem`, `Voucher`, `Redemption`, `PointsTransaction`, `InvoiceSubmission` — sistema de lançamentos/prêmios/pontos, hoje dormente.

Para inspecionar os dados visualmente:

```bash
npx prisma studio
```

## Deploy no Railway

1. Compre/aponte o domínio (ex: `cinestars.com.br`) — domínios `.com.br` são registrados no Registro.br, não pelo Railway.
2. Crie um projeto no Railway e conecte o repositório GitHub `cine-stars`.
3. Adicione o plugin **Postgres** ao projeto — ele injeta `DATABASE_URL` automaticamente no serviço da aplicação.
4. Configure as demais variáveis de ambiente da tabela acima nas configurações do serviço (**principalmente `NEXT_PUBLIC_APP_URL` antes do primeiro build**, já com o domínio final).
5. Build e start já estão prontos no `package.json`: o build roda `prisma generate` automaticamente (`postinstall`), e o start roda `prisma migrate deploy` antes de subir o servidor (`next start`) — nenhuma configuração extra é necessária no Railway.
6. Nas configurações de rede (Networking) do serviço, adicione o domínio customizado e aponte o CNAME/TXT indicado no Registro.br (ou delegue os nameservers, se preferir).
7. Depois do primeiro deploy com banco vazio, crie a conta de admin manualmente (ainda não há tela pública de "criar primeiro admin") — pode ser feito via `npx prisma studio` conectado ao `DATABASE_URL` de produção, ou repetindo o mesmo script usado localmente para o seed do admin.
