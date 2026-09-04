"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { redeemItem, type ActionState } from "@/app/conta/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Resgatando..." : disabled ? "Pontos insuficientes" : "Resgatar"}
    </button>
  );
}

function CodeBox({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard indisponível — o código já está visível na tela.
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2">
      <code className="text-sm font-semibold tracking-wide text-gold">
        {code}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gold hover:bg-gold/10"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

export function RedeemButton({
  storeItemId,
  canAfford,
}: {
  storeItemId: string;
  canAfford: boolean;
}) {
  const [state, formAction] = useActionState(redeemItem, initialState);

  return (
    <form action={formAction} className="mt-4 space-y-2">
      <input type="hidden" name="storeItemId" value={storeItemId} />
      <SubmitButton disabled={!canAfford} />
      {state.status !== "idle" && state.message && (
        <p
          className={`text-xs ${
            state.status === "success" ? "text-emerald-400" : "text-crimson-soft"
          }`}
          role="alert"
        >
          {state.message}
        </p>
      )}
      {state.code && <CodeBox code={state.code} />}
    </form>
  );
}
