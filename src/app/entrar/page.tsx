import Link from "next/link";
import { loginAction } from "@/app/entrar/actions";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-16 text-neutral-100">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl tracking-wide">
            Cine<span className="text-gold">Stars</span>
          </Link>
          <p className="mt-2 text-sm text-neutral-400">
            Entre com sua conta para acessar seus pontos
          </p>
        </div>

        <form
          action={loginAction}
          className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-neutral-900/60 p-8"
        >
          <input
            type="hidden"
            name="redirectTo"
            value={callbackUrl || "/conta"}
          />

          {error && (
            <p
              className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              E-mail ou senha incorretos.
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-neutral-300"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300"
              >
                Senha
              </label>
              <Link
                href="/esqueci-senha"
                className="text-xs text-neutral-500 hover:text-gold"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gold px-6 py-3 text-base font-semibold text-neutral-950 transition hover:brightness-110"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Ainda não é assinante?{" "}
          <Link href="/#cadastro" className="text-gold hover:underline">
            Assine o clube
          </Link>
        </p>
      </div>
    </div>
  );
}
