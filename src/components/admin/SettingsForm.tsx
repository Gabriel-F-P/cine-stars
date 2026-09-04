"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateSettings, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar"}
    </button>
  );
}

export function SettingsForm({
  pointsPerReal,
  maxMonthlyInvoicePoints,
  pickupAddress,
  pickupHours,
  pickupMapUrl,
}: {
  pointsPerReal: number;
  maxMonthlyInvoicePoints: number;
  pickupAddress: string;
  pickupHours: string;
  pickupMapUrl: string;
}) {
  const [state, formAction] = useActionState(updateSettings, initialState);

  return (
    <form
      action={formAction}
      className="max-w-xl space-y-6 rounded-xl border border-white/10 bg-neutral-900/60 p-6"
    >
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Pontos
        </h3>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            Pontos por real gasto (nota fiscal)
          </label>
          <input
            name="pointsPerReal"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={pointsPerReal}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Ex: 1 = R$1 gasto vira 1 ponto. Usado ao aprovar notas fiscais.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            Teto mensal de pontos por nota fiscal (por membro)
          </label>
          <input
            name="maxMonthlyInvoicePoints"
            type="number"
            min="1"
            step="1"
            defaultValue={maxMonthlyInvoicePoints}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Limite de pontos que um membro pode ganhar por notas fiscais no
            mesmo mês.
          </p>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/10 pt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
          Retirada de prêmios
        </h3>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            Endereço
          </label>
          <input
            name="pickupAddress"
            defaultValue={pickupAddress}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
            placeholder="Ex: Shopping Manauara, piso L2, loja 45"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            Horário de funcionamento
          </label>
          <input
            name="pickupHours"
            defaultValue={pickupHours}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
            placeholder="Ex: Seg a sáb, 10h às 22h"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            Link do mapa (Google Maps)
          </label>
          <input
            name="pickupMapUrl"
            type="url"
            defaultValue={pickupMapUrl}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
            placeholder="https://maps.app.goo.gl/..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton />
        {state.message && (
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
