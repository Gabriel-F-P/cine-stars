"use server";

import { prisma } from "@/lib/prisma";
import { generateResetToken, RESET_TOKEN_TTL_MS } from "@/lib/reset-token";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const GENERIC_MESSAGE =
  "Se esse e-mail estiver cadastrado, enviamos um link de redefinição.";

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const emailRaw = formData.get("email");
  const email =
    typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";

  if (!email) {
    return { status: "error", message: "Informe seu e-mail." };
  }

  const ip = await getClientIp();
  if (
    !checkRateLimit(`reset-ip:${ip}`, 5, 60 * 60 * 1000) ||
    !checkRateLimit(`reset-email:${email}`, 3, 60 * 60 * 1000)
  ) {
    // Ainda retorna a mensagem genérica pra não revelar rate-limit a um atacante.
    return { status: "success", message: GENERIC_MESSAGE };
  }

  const member = await prisma.member.findUnique({ where: { email } });

  if (member) {
    const { token, tokenHash } = generateResetToken();

    await prisma.passwordResetToken.create({
      data: {
        memberId: member.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${appUrl}/redefinir-senha?token=${token}`;

    await sendPasswordResetEmail(member.email, resetUrl);
  }

  return { status: "success", message: GENERIC_MESSAGE };
}
