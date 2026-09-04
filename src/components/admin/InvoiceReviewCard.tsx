"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { History } from "lucide-react";
import { approveInvoice, rejectInvoice, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { status: "idle" };

type RecentRedemption = {
  itemName: string;
  createdAt: string;
  status: string;
};

function ActionButton({ label, variant }: { label: string; variant: "approve" | "reject" }) {
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

export function InvoiceReviewCard({
  id,
  code,
  amountCents,
  memberName,
  recentRedemptions,
}: {
  id: string;
  code: string;
  amountCents: number;
  memberName: string;
  recentRedemptions: RecentRedemption[];
}) {
  const [approveState, approveAction] = useActionState(approveInvoice, initialState);
  const [rejectState, rejectAction] = useActionState(rejectInvoice, initialState);
  const [showReject, setShowReject] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium">{memberName}</p>
          <p className="text-sm text-neutral-400">Código: {code}</p>
        </div>
        <p className="text-lg font-semibold text-gold">
          R$ {(amountCents / 100).toFixed(2)}
        </p>
      </div>

      {recentRedemptions.length > 0 && (
        <div className="mt-3 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-gold">
            <History size={12} />
            Resgates recentes desse membro
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-neutral-400">
            {recentRedemptions.map((r, i) => (
              <li key={i}>
                {r.itemName} — {r.createdAt} ({r.status})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <form action={approveAction} className="flex items-end gap-3">
          <input type="hidden" name="id" value={id} />
          <div>
            <label className="mb-1 block text-xs text-neutral-400">
              Valor (opcional, corrige o declarado)
            </label>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={(amountCents / 100).toFixed(2)}
              className="w-32 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-gold"
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
              placeholder="Ex: código inválido"
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
