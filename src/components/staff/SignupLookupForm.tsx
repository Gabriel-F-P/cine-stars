"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { findSignupByCpf, type SignupLookupState } from "@/app/funcionario/actions";
import { formatCpf } from "@/lib/cpf";

const initialState: SignupLookupState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Buscando..." : "Buscar"}
    </button>
  );
}

export function SignupLookupForm() {
  const [state, formAction] = useActionState(findSignupByCpf, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <label
            htmlFor="cpf"
            className="mb-1 block text-sm font-medium text-neutral-300"
          >
            CPF do cliente
          </label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            required
            inputMode="numeric"
            onInput={(e) => {
              e.currentTarget.value = formatCpf(e.currentTarget.value);
            }}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
            placeholder="000.000.000-00"
          />
        </div>
        <SubmitButton />
      </form>

      {state.status === "not_found" && (
        <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}

      {state.status === "error" && (
        <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}

      {state.status === "found" && state.signup && (
        <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-6">
          <p className="font-display text-xl text-gold">
            {state.signup.name}
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-neutral-500">Idade</dt>
              <dd className="text-neutral-200">{state.signup.age} anos</dd>
            </div>
            <div>
              <dt className="text-neutral-500">CPF</dt>
              <dd className="text-neutral-200">
                {formatCpf(state.signup.cpf)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Telefone</dt>
              <dd className="text-neutral-200">{state.signup.phone}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">E-mail</dt>
              <dd className="text-neutral-200">{state.signup.email}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Bairro / Cidade</dt>
              <dd className="text-neutral-200">
                {state.signup.neighborhood} — {state.signup.city}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Endereço</dt>
              <dd className="text-neutral-200">{state.signup.addressLine}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-neutral-500">
            Ainda não há pacote/assinatura vinculada — esse cadastro é só da
            fase de pesquisa de interesse.
          </p>
        </div>
      )}
    </div>
  );
}
