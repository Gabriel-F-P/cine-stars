"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createLaunch, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Criando..." : "Criar lançamento"}
    </button>
  );
}

export function CreateLaunchForm() {
  const [state, formAction] = useActionState(createLaunch, initialState);
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
          Título
        </label>
        <input
          name="title"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Ex: Carros"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Sinopse
        </label>
        <textarea
          name="synopsis"
          required
          rows={3}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Resumo do filme"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Diretor (opcional)
        </label>
        <input
          name="director"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Ex: John Lasseter"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Texto de estreia
        </label>
        <input
          name="releaseLabel"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Ex: Chegando em outubro"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          URL do banner (opcional)
        </label>
        <input
          name="bannerUrl"
          type="url"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="https://..."
        />
      </div>

      <div className="sm:col-span-2 rounded-lg border border-gold/20 bg-gold/5 p-4">
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Prêmio de estreia (opcional)
        </label>
        <input
          name="prizeDescription"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Ex: Pôster autografado exclusivo de Carros"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Se preenchido, qualquer assinante ativo pode resgatar mostrando a
          nota fiscal do ingresso desse filme — 1 prêmio por CPF, sem gastar
          pontos.
        </p>
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
