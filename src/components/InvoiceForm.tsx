"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { submitInvoice, type ActionState } from "@/app/conta/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-gold px-6 py-3 text-base font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enviando..." : "Enviar nota fiscal"}
    </button>
  );
}

export function InvoiceForm() {
  const [state, formAction] = useActionState(submitInvoice, initialState);
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
      <div>
        <label htmlFor="code" className="mb-1 block text-sm font-medium text-neutral-300">
          Código / número da nota fiscal
        </label>
        <input
          id="code"
          name="code"
          type="text"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Ex: 000123456"
        />
      </div>

      <div>
        <label htmlFor="amount" className="mb-1 block text-sm font-medium text-neutral-300">
          Valor gasto (R$)
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="0,00"
        />
      </div>

      {state.status !== "idle" && state.message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            state.status === "success"
              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border border-crimson/40 bg-crimson/10 text-red-200"
          }`}
          role="alert"
        >
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
