"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/points";
import { getAppSettings, updateAppSettings } from "@/lib/settings";
import { hashPassword } from "@/lib/password";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Acesso negado");
  }
  return session.user;
}

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createStoreItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const name = str(formData, "name");
  const description = str(formData, "description");
  const imageUrl = str(formData, "imageUrl");
  const pointsCost = Number(formData.get("pointsCost"));
  const stockRaw = str(formData, "stock");
  const stock = stockRaw ? Number(stockRaw) : null;

  if (!name || !description || !Number.isFinite(pointsCost) || pointsCost <= 0) {
    return { status: "error", message: "Preencha os campos obrigatórios." };
  }

  await prisma.storeItem.create({
    data: {
      name,
      description,
      imageUrl: imageUrl || null,
      pointsCost: Math.round(pointsCost),
      stock: stock !== null && Number.isFinite(stock) ? Math.round(stock) : null,
    },
  });

  revalidatePath("/admin/loja");
  revalidatePath("/conta");
  revalidatePath("/conta/loja/[id]", "page");
  return { status: "success", message: "Item criado!" };
}

export async function toggleStoreItemActive(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  const item = await prisma.storeItem.findUnique({ where: { id } });
  if (!item) return { status: "error", message: "Item não encontrado." };

  await prisma.storeItem.update({
    where: { id },
    data: { active: !item.active },
  });

  revalidatePath("/admin/loja");
  revalidatePath("/conta");
  revalidatePath("/conta/loja/[id]", "page");
  return { status: "success" };
}

export async function addVouchers(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const storeItemId = str(formData, "storeItemId");
  const codesRaw = str(formData, "codes");
  const expiresAtRaw = str(formData, "expiresAt");

  const item = await prisma.storeItem.findUnique({ where: { id: storeItemId } });
  if (!item) {
    return { status: "error", message: "Item não encontrado." };
  }

  const codes = Array.from(
    new Set(
      codesRaw
        .split("\n")
        .map((c) => c.trim())
        .filter(Boolean)
    )
  );

  if (codes.length === 0) {
    return { status: "error", message: "Cole ao menos um código." };
  }

  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  const result = await prisma.voucher.createMany({
    data: codes.map((code) => ({
      storeItemId,
      code,
      expiresAt,
    })),
    skipDuplicates: true,
  });

  revalidatePath(`/admin/loja/${storeItemId}/vouchers`);

  const skipped = codes.length - result.count;
  return {
    status: "success",
    message:
      skipped > 0
        ? `${result.count} código(s) adicionado(s), ${skipped} já existia(m) e foram ignorados.`
        : `${result.count} código(s) adicionado(s)!`,
  };
}

export async function createLaunch(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const title = str(formData, "title");
  const synopsis = str(formData, "synopsis");
  const director = str(formData, "director");
  const releaseLabel = str(formData, "releaseLabel");
  const bannerUrl = str(formData, "bannerUrl");
  const prizeDescription = str(formData, "prizeDescription");

  if (!title || !synopsis || !releaseLabel) {
    return { status: "error", message: "Preencha os campos obrigatórios." };
  }

  await prisma.launch.create({
    data: {
      title,
      synopsis,
      director: director || null,
      releaseLabel,
      bannerUrl: bannerUrl || null,
      prizeDescription: prizeDescription || null,
    },
  });

  revalidatePath("/admin/lancamentos");
  revalidatePath("/conta");
  return { status: "success", message: "Lançamento criado!" };
}

export async function toggleLaunchActive(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  const launch = await prisma.launch.findUnique({ where: { id } });
  if (!launch) return { status: "error", message: "Lançamento não encontrado." };

  await prisma.launch.update({
    where: { id },
    data: { active: !launch.active },
  });

  revalidatePath("/admin/lancamentos");
  revalidatePath("/conta");
  return { status: "success" };
}

export async function approveLaunchPrizeClaim(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  const fulfillmentNote = str(formData, "fulfillmentNote");

  const claim = await prisma.launchPrizeClaim.findUnique({ where: { id } });
  if (!claim || claim.status !== "PENDING") {
    return { status: "error", message: "Resgate inválido ou já revisado." };
  }

  await prisma.launchPrizeClaim.update({
    where: { id },
    data: {
      status: "APPROVED",
      fulfillmentNote: fulfillmentNote || null,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/premios");
  revalidatePath("/conta");
  return { status: "success", message: "Prêmio aprovado!" };
}

export async function rejectLaunchPrizeClaim(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  const reason = str(formData, "reason");

  const claim = await prisma.launchPrizeClaim.findUnique({ where: { id } });
  if (!claim || claim.status !== "PENDING") {
    return { status: "error", message: "Resgate inválido ou já revisado." };
  }

  await prisma.launchPrizeClaim.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason: reason || null,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/premios");
  revalidatePath("/conta");
  return { status: "success", message: "Resgate rejeitado." };
}

export async function approveInvoice(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  const amountOverrideRaw = str(formData, "amount");

  const submission = await prisma.invoiceSubmission.findUnique({
    where: { id },
  });
  if (!submission || submission.status !== "PENDING") {
    return { status: "error", message: "Nota inválida ou já revisada." };
  }

  const settings = await getAppSettings();
  const amountCents = amountOverrideRaw
    ? Math.round(Number(amountOverrideRaw) * 100)
    : submission.amountCents;

  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return { status: "error", message: "Valor inválido." };
  }

  const pointsAwarded = Math.round((amountCents / 100) * settings.pointsPerReal);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlyInvoicePoints = await prisma.pointsTransaction.aggregate({
    where: {
      memberId: submission.memberId,
      type: "INVOICE",
      createdAt: { gte: monthStart },
    },
    _sum: { points: true },
  });
  const pointsSoFarThisMonth = monthlyInvoicePoints._sum.points ?? 0;

  if (pointsSoFarThisMonth + pointsAwarded > settings.maxMonthlyInvoicePoints) {
    return {
      status: "error",
      message: `Isso passaria do teto mensal de ${settings.maxMonthlyInvoicePoints} pontos por nota fiscal desse membro (já tem ${pointsSoFarThisMonth} pontos aprovados este mês). Rejeite ou ajuste o teto em Configurações.`,
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.invoiceSubmission.update({
      where: { id },
      data: {
        status: "APPROVED",
        amountCents,
        pointsAwarded,
        reviewedAt: new Date(),
      },
    });

    await awardPoints(tx, submission.memberId, "INVOICE", pointsAwarded, {
      description: `Nota fiscal ${submission.code}`,
      sourceId: submission.id,
    });
  });

  revalidatePath("/admin/notas");
  revalidatePath("/conta/nota-fiscal");
  revalidatePath("/conta/pontos");
  return { status: "success", message: "Nota aprovada!" };
}

export async function rejectInvoice(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  const reason = str(formData, "reason");

  const submission = await prisma.invoiceSubmission.findUnique({
    where: { id },
  });
  if (!submission || submission.status !== "PENDING") {
    return { status: "error", message: "Nota inválida ou já revisada." };
  }

  await prisma.invoiceSubmission.update({
    where: { id },
    data: {
      status: "REJECTED",
      rejectionReason: reason || null,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin/notas");
  revalidatePath("/conta/nota-fiscal");
  return { status: "success", message: "Nota rejeitada." };
}

export async function updateRedemptionNote(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const id = str(formData, "id");
  const fulfillmentNote = str(formData, "fulfillmentNote");

  const redemption = await prisma.redemption.findUnique({ where: { id } });
  if (!redemption) {
    return { status: "error", message: "Resgate não encontrado." };
  }

  await prisma.redemption.update({
    where: { id },
    data: { fulfillmentNote: fulfillmentNote || null },
  });

  revalidatePath("/admin/resgates");
  return { status: "success", message: "Nota salva!" };
}

export async function createStaffMember(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const name = str(formData, "name");
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");
  const role = str(formData, "role");

  if (!name || !email || password.length < 8) {
    return {
      status: "error",
      message: "Preencha nome, e-mail e uma senha com ao menos 8 caracteres.",
    };
  }
  if (role !== "ADMIN" && role !== "FUNCIONARIO") {
    return { status: "error", message: "Papel inválido." };
  }

  const existing = await prisma.member.findUnique({ where: { email } });
  if (existing) {
    return { status: "error", message: "Já existe uma conta com esse e-mail." };
  }

  const passwordHash = await hashPassword(password);

  await prisma.member.create({
    data: {
      name,
      email,
      phone: "",
      cpf: `STAFF-${crypto.randomUUID()}`,
      passwordHash,
      role,
      plan: "BASIC",
      amountCents: 0,
      subscriptionStatus: "CANCELLED",
    },
  });

  revalidatePath("/admin/equipe");
  return { status: "success", message: "Conta de equipe criada!" };
}

export async function updateSettings(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const pointsPerReal = Number(formData.get("pointsPerReal"));
  const maxMonthlyInvoicePoints = Number(formData.get("maxMonthlyInvoicePoints"));
  const pickupAddress = str(formData, "pickupAddress");
  const pickupHours = str(formData, "pickupHours");
  const pickupMapUrl = str(formData, "pickupMapUrl");

  if (!Number.isFinite(pointsPerReal) || pointsPerReal <= 0) {
    return { status: "error", message: "Valor de pontos por real inválido." };
  }
  if (!Number.isFinite(maxMonthlyInvoicePoints) || maxMonthlyInvoicePoints <= 0) {
    return { status: "error", message: "Teto mensal inválido." };
  }

  await updateAppSettings({
    pointsPerReal,
    maxMonthlyInvoicePoints: Math.round(maxMonthlyInvoicePoints),
    pickupAddress: pickupAddress || null,
    pickupHours: pickupHours || null,
    pickupMapUrl: pickupMapUrl || null,
  });
  revalidatePath("/admin/configuracoes");
  revalidatePath("/conta");
  revalidatePath("/conta/loja/[id]", "page");
  return { status: "success", message: "Configuração salva!" };
}
