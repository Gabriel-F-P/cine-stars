import { prisma } from "@/lib/prisma";
import { CreateStaffMemberForm } from "@/components/admin/CreateStaffMemberForm";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  FUNCIONARIO: "Funcionário",
};

export default async function AdminEquipePage() {
  const staff = await prisma.member.findMany({
    where: { role: { in: ["ADMIN", "FUNCIONARIO"] } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-wide">Equipe</h1>
        <p className="mt-1 text-neutral-400">
          Contas de admin e funcionário pra acessar o painel e a busca por
          CPF.
        </p>
      </div>

      <CreateStaffMemberForm />

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-900 text-left text-neutral-400">
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Papel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {staff.map((member) => (
              <tr key={member.id} className="bg-neutral-900/60">
                <td className="px-4 py-3">{member.name}</td>
                <td className="px-4 py-3 text-neutral-300">
                  {member.email}
                </td>
                <td className="px-4 py-3 text-neutral-300">
                  {ROLE_LABEL[member.role]}
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-neutral-500" colSpan={3}>
                  Nenhuma conta de equipe ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
