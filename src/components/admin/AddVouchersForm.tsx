"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { addVouchers, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Adicionando..." : "Adicionar códigos"}
    </button>
  );
}

export function AddVouchersForm({ storeItemId }: { storeItemId: string }) {
  const [state, formAction] = useActionState(addVouchers, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-xl border border-white/10 bg-neutral-900/60 p-6"
    >
      <input type="hidden" name="storeItemId" value={storeItemId} />

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Códigos (um por linha)
        </label>
        <textarea
          name="codes"
          required
          rows={6}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 font-mono text-sm text-neutral-100 outline-none focus:border-gold"
          placeholder={"ABC123\nDEF456\nGHI789"}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Validade (opcional, vale pra todos os códigos colados acima)
        </label>
        <input
          name="expiresAt"
          type="date"
          className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
        />
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton />
        {state.status !== "idle" && state.message && (
          <p
            className={`text-sm ${
              state.status === "success" ? "text-emerald-400" : "text-crimson-soft"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
