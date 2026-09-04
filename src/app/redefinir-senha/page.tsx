import Link from "next/link";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-16 text-neutral-100">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl tracking-wide">
            Cine<span className="text-gold">Stars</span>
          </Link>
          <p className="mt-2 text-sm text-neutral-400">
            Escolha sua nova senha
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900/60 p-8">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-red-200">
              Link inválido. Peça uma nova redefinição em{" "}
              <Link href="/esqueci-senha" className="underline">
                esqueci minha senha
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
