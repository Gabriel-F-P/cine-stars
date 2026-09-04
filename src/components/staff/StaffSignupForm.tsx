"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  createSignupAsStaff,
  type SignupFormState,
} from "@/app/funcionario/actions";
import { formatCpf, formatPhone } from "@/lib/cpf";

const initialState: SignupFormState = { status: "idle" };

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p className="mt-1 text-sm text-crimson" role="alert">
      {errors[0]}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar cadastro"}
    </button>
  );
}

export function StaffSignupForm() {
  const [state, formAction] = useActionState(createSignupAsStaff, initialState);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Nome completo
        </label>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
        />
        <FieldError errors={state.fieldErrors?.name} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            Idade
          </label>
          <input
            name="age"
            type="number"
            min={1}
            max={120}
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          />
          <FieldError errors={state.fieldErrors?.age} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            CPF
          </label>
          <input
            name="cpf"
            required
            inputMode="numeric"
            onInput={(e) => {
              e.currentTarget.value = formatCpf(e.currentTarget.value);
            }}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          />
          <FieldError errors={state.fieldErrors?.cpf} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            E-mail
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            Telefone
          </label>
          <input
            name="phone"
            required
            onInput={(e) => {
              e.currentTarget.value = formatPhone(e.currentTarget.value);
            }}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          />
          <FieldError errors={state.fieldErrors?.phone} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            Bairro
          </label>
          <input
            name="neighborhood"
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          />
          <FieldError errors={state.fieldErrors?.neighborhood} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-300">
            Cidade
          </label>
          <input
            name="city"
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          />
          <FieldError errors={state.fieldErrors?.city} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">
          Endereço (rua e número)
        </label>
        <input
          name="addressLine"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
        />
        <FieldError errors={state.fieldErrors?.addressLine} />
      </div>

      {state.status === "error" && state.message && (
        <p className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
