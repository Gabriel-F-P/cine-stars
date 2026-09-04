"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { claimLaunchPrize, type ActionState } from "@/app/conta/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-gold px-6 py-3 text-base font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enviando..." : "Resgatar prêmio"}
    </button>
  );
}

export function ClaimPrizeForm({ launchId }: { launchId: string }) {
  const [state, formAction] = useActionState(claimLaunchPrize, initialState);

  if (state.status === "success") {
    return (
      <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="launchId" value={launchId} />
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Código da nota fiscal do ingresso
        </label>
        <input
          name="code"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Ex: 44 dígitos da chave de acesso"
        />
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}

      <SubmitButton />
      <p className="text-center text-xs text-neutral-500">
        Limitado a 1 prêmio por CPF nesse lançamento.
      </p>
    </form>
  );
}
