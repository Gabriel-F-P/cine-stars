"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/app/admin/actions";

const initialState: ActionState = { status: "idle" };

function SubmitButton({ active }: { active: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
        active
          ? "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
          : "border-neutral-600 text-neutral-400 hover:bg-white/5"
      }`}
    >
      {active ? "Ativo" : "Inativo"}
    </button>
  );
}

export function ToggleActiveButton({
  id,
  active,
  action,
}: {
  id: string;
  active: boolean;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton active={active} />
    </form>
  );
}
