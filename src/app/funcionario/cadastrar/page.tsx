import { StaffSignupForm } from "@/components/staff/StaffSignupForm";

export default function FuncionarioCadastrarPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl tracking-wide">
        Cadastrar novo interessado
      </h1>
      <p className="text-sm text-neutral-400">
        Pra quando alguém preferir se cadastrar presencialmente.
      </p>
      <StaffSignupForm />
    </div>
  );
}
