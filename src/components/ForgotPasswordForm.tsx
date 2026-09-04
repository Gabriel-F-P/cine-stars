"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset, type ActionState } from "@/app/esqueci-senha/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-gold px-6 py-3 text-base font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enviando..." : "Enviar link de redefinição"}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  if (state.status === "success") {
    return (
      <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
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

      {state.status === "error" && state.message && (
        <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
