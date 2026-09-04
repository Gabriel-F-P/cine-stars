import Link from "next/link";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default function EsqueciSenhaPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-16 text-neutral-100">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl tracking-wide">
            Cine<span className="text-gold">Stars</span>
          </Link>
          <p className="mt-2 text-sm text-neutral-400">
            Esqueceu sua senha? Vamos te ajudar a redefinir.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900/60 p-8">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/entrar" className="text-gold hover:underline">
            Voltar pro login
          </Link>
        </p>
      </div>
    </div>
  );
}
