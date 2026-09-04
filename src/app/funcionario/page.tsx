import { SignupLookupForm } from "@/components/staff/SignupLookupForm";

export default function FuncionarioPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl tracking-wide">Buscar cliente</h1>
      <p className="text-sm text-neutral-400">
        Digite o CPF pra ver os dados de cadastro da pessoa.
      </p>
      <SignupLookupForm />
    </div>
  );
}
