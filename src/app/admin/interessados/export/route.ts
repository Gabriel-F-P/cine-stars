import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const signups = await prisma.signup.findMany({
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "nome",
    "idade",
    "telefone",
    "email",
    "cpf",
    "bairro",
    "cidade",
    "endereco",
    "origem",
    "cadastrado_em",
  ];

  const rows = signups.map((s) =>
    [
      s.name,
      String(s.age),
      s.phone,
      s.email,
      s.cpf,
      s.neighborhood,
      s.city,
      s.addressLine,
      s.source,
      s.createdAt.toISOString(),
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="interessados-cinestars.csv"`,
    },
  });
}
