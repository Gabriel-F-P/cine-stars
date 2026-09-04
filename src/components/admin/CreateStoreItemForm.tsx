"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createStoreItem, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Criando..." : "Criar item"}
    </button>
  );
}

export function CreateStoreItemForm() {
  const [state, formAction] = useActionState(createStoreItem, initialState);
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
      className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-neutral-900/60 p-6 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Nome
        </label>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Ex: Pôster autografado, action figure exclusiva"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Descrição
        </label>
        <textarea
          name="description"
          required
          rows={2}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Descrição do prêmio"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Custo em pontos
        </label>
        <input
          name="pointsCost"
          type="number"
          min="1"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Estoque (vazio = ilimitado)
        </label>
        <input
          name="stock"
          type="number"
          min="0"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Ex: 10"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          URL da imagem (opcional)
        </label>
        <input
          name="imageUrl"
          type="url"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-4 sm:col-span-2">
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
