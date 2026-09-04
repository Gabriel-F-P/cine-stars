"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  approveLaunchPrizeClaim,
  rejectLaunchPrizeClaim,
  type ActionState,
} from "@/app/admin/actions";

const initialState: ActionState = { status: "idle" };

function ActionButton({
  label,
  variant,
}: {
  label: string;
  variant: "approve" | "reject";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === "approve"
          ? "bg-gold text-neutral-950 hover:brightness-110"
          : "border border-crimson/40 text-crimson-soft hover:bg-crimson/10"
      }`}
    >
      {pending ? "Enviando..." : label}
    </button>
  );
}

export function LaunchPrizeReviewCard({
  id,
  launchTitle,
  prizeDescription,
  invoiceCode,
  memberName,
  cpf,
}: {
  id: string;
  launchTitle: string;
  prizeDescription: string;
  invoiceCode: string;
  memberName: string;
  cpf: string;
}) {
  const [approveState, approveAction] = useActionState(
    approveLaunchPrizeClaim,
    initialState
  );
  const [rejectState, rejectAction] = useActionState(
    rejectLaunchPrizeClaim,
    initialState
  );
  const [showReject, setShowReject] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium">{memberName}</p>
          <p className="text-sm text-neutral-400">
            {launchTitle} · CPF {cpf}
          </p>
          <p className="text-xs text-neutral-500">Nota: {invoiceCode}</p>
        </div>
        <p className="text-sm font-semibold text-gold">{prizeDescription}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <form action={approveAction} className="flex items-end gap-3">
          <input type="hidden" name="id" value={id} />
          <div>
            <label className="mb-1 block text-xs text-neutral-400">
              Nota de entrega (opcional)
            </label>
            <input
              name="fulfillmentNote"
              className="w-56 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-gold"
              placeholder="Ex: retirar no balcão"
            />
          </div>
          <ActionButton label="Aprovar" variant="approve" />
        </form>

        <button
          type="button"
          onClick={() => setShowReject((v) => !v)}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-neutral-300 hover:border-crimson/40 hover:text-crimson-soft"
        >
          Rejeitar
        </button>
      </div>

      {showReject && (
        <form action={rejectAction} className="mt-3 flex items-end gap-3">
          <input type="hidden" name="id" value={id} />
          <div className="flex-1">
            <label className="mb-1 block text-xs text-neutral-400">
              Motivo (opcional)
            </label>
            <input
              name="reason"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-gold"
              placeholder="Ex: nota inválida"
            />
          </div>
          <ActionButton label="Confirmar rejeição" variant="reject" />
        </form>
      )}

      {(approveState.message || rejectState.message) && (
        <p className="mt-2 text-sm text-neutral-400">
          {approveState.message || rejectState.message}
        </p>
      )}
    </div>
  );
}
