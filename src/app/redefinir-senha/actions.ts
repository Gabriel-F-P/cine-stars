"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { hashResetToken } from "@/lib/reset-token";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function resetPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = formData.get("token");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof token !== "string" || !token) {
    return { status: "error", message: "Link inválido." };
  }
  if (typeof password !== "string" || password.length < 8) {
    return {
      status: "error",
      message: "A senha precisa ter no mínimo 8 caracteres.",
    };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "As senhas não coincidem." };
  }

  const tokenHash = hashResetToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt < new Date()
  ) {
    return {
      status: "error",
      message: "Esse link expirou ou já foi usado. Peça um novo.",
    };
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.member.update({
      where: { id: resetToken.memberId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    status: "success",
    message: "Senha redefinida! Você já pode entrar com a nova senha.",
  };
}
