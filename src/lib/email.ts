import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM_EMAIL ?? "CineStars <onboarding@resend.dev>";

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<{ ok: boolean; error?: string }> {
  if (!apiKey) {
    console.error(
      "RESEND_API_KEY não configurado — e-mail de redefinição não enviado."
    );
    return { ok: false, error: "E-mail não configurado" };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject: "Redefinir sua senha — CineStars",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color: #f2c94c;">Cine<span style="color:#111">Stars</span></h1>
        <p>Recebemos um pedido para redefinir a senha da sua conta.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#f2c94c;color:#111;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Redefinir senha
          </a>
        </p>
        <p style="color:#666;font-size:14px;">Esse link expira em 1 hora. Se você não pediu essa redefinição, pode ignorar este e-mail.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Erro ao enviar e-mail via Resend", error);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
