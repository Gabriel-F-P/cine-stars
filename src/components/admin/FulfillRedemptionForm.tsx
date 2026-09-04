"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateRedemptionNote, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Salvando..." : "Salvar nota"}
    </button>
  );
}

export function FulfillRedemptionForm({
  id,
  defaultNote,
}: {
  id: string;
  defaultNote: string;
}) {
  const [state, formAction] = useActionState(updateRedemptionNote, initialState);

  return (
    <form action={formAction} className="mt-3 flex items-end gap-3">
      <input type="hidden" name="id" value={id} />
      <div className="flex-1">
        <label className="mb-1 block text-xs text-neutral-400">
          Observação de entrega (opcional)
        </label>
        <input
          name="fulfillmentNote"
          defaultValue={defaultNote}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-gold"
          placeholder="Ex: retirado em 10/09, código de rastreio, etc"
        />
      </div>
      <SubmitButton />
      {state.message && (
        <p className="text-sm text-neutral-400">{state.message}</p>
      )}
    </form>
  );
}
