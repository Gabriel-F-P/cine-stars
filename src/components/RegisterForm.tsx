"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerMember, type RegisterMemberState } from "@/app/actions";
import { formatCpf, formatPhone } from "@/lib/cpf";

const initialState: RegisterMemberState = { status: "idle" };

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
      className="w-full rounded-lg bg-gold px-6 py-3 text-base font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Enviando..." : "Quero participar"}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerMember, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <p className="font-display text-xl text-emerald-300">
          Cadastro recebido!
        </p>
        <p className="mt-2 text-sm text-emerald-200/80">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-neutral-300"
        >
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Seu nome completo"
        />
        <FieldError errors={state.fieldErrors?.name} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="age"
            className="mb-1 block text-sm font-medium text-neutral-300"
          >
            Idade
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={1}
            max={120}
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
            placeholder="Ex: 28"
          />
          <FieldError errors={state.fieldErrors?.age} />
        </div>

        <div>
          <label
            htmlFor="cpf"
            className="mb-1 block text-sm font-medium text-neutral-300"
          >
            CPF
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
          <FieldError errors={state.fieldErrors?.cpf} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-neutral-300"
          >
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
            placeholder="voce@email.com"
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-neutral-300"
          >
            Telefone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            onInput={(e) => {
              e.currentTarget.value = formatPhone(e.currentTarget.value);
            }}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
            placeholder="(11) 91234-5678"
          />
          <FieldError errors={state.fieldErrors?.phone} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="neighborhood"
            className="mb-1 block text-sm font-medium text-neutral-300"
          >
            Bairro
          </label>
          <input
            id="neighborhood"
            name="neighborhood"
            type="text"
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
            placeholder="Seu bairro"
          />
          <FieldError errors={state.fieldErrors?.neighborhood} />
        </div>

        <div>
          <label
            htmlFor="city"
            className="mb-1 block text-sm font-medium text-neutral-300"
          >
            Cidade
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
            placeholder="Sua cidade"
          />
          <FieldError errors={state.fieldErrors?.city} />
        </div>
      </div>

      <div>
        <label
          htmlFor="addressLine"
          className="mb-1 block text-sm font-medium text-neutral-300"
        >
          Endereço (rua e número)
        </label>
        <input
          id="addressLine"
          name="addressLine"
          type="text"
          required
          autoComplete="street-address"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-neutral-100 outline-none focus:border-gold"
          placeholder="Rua, número, complemento"
        />
        <FieldError errors={state.fieldErrors?.addressLine} />
      </div>

      {state.status === "error" && state.message && (
        <p
          className="rounded-lg border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {state.message}
        </p>
      )}

      <SubmitButton />

      <p className="text-center text-xs text-neutral-600">
        Ao se cadastrar, você concorda com os{" "}
        <Link href="/termos" className="underline hover:text-gold">
          Termos de Uso
        </Link>{" "}
        e a{" "}
        <Link href="/privacidade" className="underline hover:text-gold">
          Política de Privacidade
        </Link>
        .
      </p>
    </form>
  );
}
