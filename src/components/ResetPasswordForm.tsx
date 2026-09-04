"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resetPassword, type ActionState } from "@/app/redefinir-senha/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-gold px-6 py-3 text-base font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Redefinir senha"}
    </button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(resetPassword, initialState);

  if (state.status === "success") {
    return (
      <div className="space-y-4">
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {state.message}
        </p>
        <Link
          href="/entrar"
          className="block w-full rounded-lg bg-gold px-6 py-3 text-center text-base font-semibold text-neutral-950 transition hover:brightness-110"
        >
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-neutral-300"
        >
          Nova senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-neutral-300"
        >
          Confirmar nova senha
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Repita a senha"
        />
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
