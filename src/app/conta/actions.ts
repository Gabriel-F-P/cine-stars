"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { awardPoints, getMemberPointsBalance } from "@/lib/points";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  code?: string;
};

async function requireMember() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autenticado");
  }
  return session.user;
}

export async function redeemItem(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireMember();
  const storeItemId = formData.get("storeItemId");

  if (typeof storeItemId !== "string" || !storeItemId) {
    return { status: "error", message: "Item inválido." };
  }

  let assignedCode: string | undefined;

  try {
    await prisma.$transaction(async (tx) => {
      const item = await tx.storeItem.findUnique({
        where: { id: storeItemId },
      });

      if (!item || !item.active) {
        throw new Error("Este item não está mais disponível.");
      }

      const voucherManaged = (await tx.voucher.count({
        where: { storeItemId: item.id },
      })) > 0;

      let voucher = null;
      if (voucherManaged) {
        voucher = await tx.voucher.findFirst({
          where: { storeItemId: item.id, status: "AVAILABLE" },
          orderBy: { createdAt: "asc" },
        });
        if (!voucher) {
          throw new Error("Este item está sem estoque de vouchers.");
        }
      } else if (item.stock !== null && item.stock <= 0) {
        throw new Error("Este item está sem estoque.");
      }

      const balance = await getMemberPointsBalance(user.id);
      if (balance < item.pointsCost) {
        throw new Error("Você não tem pontos suficientes para esse item.");
      }

      const redemption = await tx.redemption.create({
        data: {
          memberId: user.id,
          storeItemId: item.id,
          pointsSpent: item.pointsCost,
          status: "FULFILLED",
          fulfilledAt: new Date(),
          fulfillmentNote: voucher?.code,
        },
      });

      await awardPoints(tx, user.id, "REDEMPTION", -item.pointsCost, {
        description: `Resgate: ${item.name}`,
        sourceId: redemption.id,
      });

      if (voucher) {
        await tx.voucher.update({
          where: { id: voucher.id },
          data: { status: "ASSIGNED", redemptionId: redemption.id },
        });
        assignedCode = voucher.code;
      } else if (item.stock !== null) {
        await tx.storeItem.update({
          where: { id: item.id },
          data: { stock: item.stock - 1 },
        });
      }
    });
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Não foi possível resgatar.",
    };
  }

  revalidatePath("/conta");
  revalidatePath("/conta/loja/[id]", "page");
  revalidatePath("/conta/pontos");
  revalidatePath("/conta/resgates");
  return {
    status: "success",
    message: assignedCode
      ? "Resgate realizado! Guarde seu código abaixo."
      : "Resgate realizado com sucesso!",
    code: assignedCode,
  };
}

export async function submitInvoice(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireMember();
  const code = formData.get("code");
  const amountRaw = formData.get("amount");

  if (typeof code !== "string" || code.trim().length < 3) {
    return { status: "error", message: "Informe o código da nota fiscal." };
  }

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { status: "error", message: "Informe o valor gasto na nota." };
  }

  const trimmedCode = code.trim();
  const existing = await prisma.invoiceSubmission.findUnique({
    where: { code: trimmedCode },
  });
  if (existing) {
    return {
      status: "error",
      message: "Essa nota fiscal já foi cadastrada anteriormente.",
    };
  }

  try {
    await prisma.invoiceSubmission.create({
      data: {
        memberId: user.id,
        code: trimmedCode,
        amountCents: Math.round(amount * 100),
      },
    });
  } catch {
    return {
      status: "error",
      message: "Essa nota fiscal já foi cadastrada anteriormente.",
    };
  }

  revalidatePath("/conta/nota-fiscal");
  return {
    status: "success",
    message: "Nota fiscal enviada! Aguarde a aprovação.",
  };
}

export async function claimLaunchPrize(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireMember();
  const launchId = formData.get("launchId");
  const code = formData.get("code");

  if (typeof launchId !== "string" || !launchId) {
    return { status: "error", message: "Lançamento inválido." };
  }
  if (typeof code !== "string" || code.trim().length < 3) {
    return { status: "error", message: "Informe o código da nota do ingresso." };
  }

  const [launch, member] = await Promise.all([
    prisma.launch.findUnique({ where: { id: launchId } }),
    prisma.member.findUnique({ where: { id: user.id } }),
  ]);

  if (!launch || !launch.active || !launch.prizeDescription) {
    return { status: "error", message: "Esse prêmio não está disponível." };
  }
  if (!member) {
    return { status: "error", message: "Membro não encontrado." };
  }

  const existingClaim = await prisma.launchPrizeClaim.findUnique({
    where: { launchId_cpf: { launchId, cpf: member.cpf } },
  });
  if (existingClaim) {
    return {
      status: "error",
      message: "Esse CPF já resgatou o prêmio desse lançamento.",
    };
  }

  const trimmedCode = code.trim();

  try {
    await prisma.launchPrizeClaim.create({
      data: {
        launchId,
        memberId: member.id,
        cpf: member.cpf,
        invoiceCode: trimmedCode,
      },
    });
  } catch {
    return {
      status: "error",
      message: "Essa nota já foi usada pra resgatar um prêmio.",
    };
  }

  revalidatePath("/conta");
  revalidatePath(`/conta/lancamentos/${launchId}`);
  return {
    status: "success",
    message: "Nota enviada! Aguarde a aprovação do seu prêmio.",
  };
}
