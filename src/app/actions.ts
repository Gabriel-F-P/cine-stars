"use server";

import { signupSchema } from "@/lib/validation";
import { createSignup } from "@/lib/signup";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

export type RegisterMemberState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerMember(
  _prevState: RegisterMemberState,
  formData: FormData
): Promise<RegisterMemberState> {
  const ip = await getClientIp();
  if (!checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000)) {
    return {
      status: "error",
      message: "Muitas tentativas de cadastro. Tente novamente mais tarde.",
    };
  }

  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    age: formData.get("age"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    cpf: formData.get("cpf"),
    neighborhood: formData.get("neighborhood"),
    city: formData.get("city"),
    addressLine: formData.get("addressLine"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Verifique os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  await createSignup(parsed.data, "PUBLIC");

  return {
    status: "success",
    message:
      "Cadastro recebido! Vamos te avisar assim que os pacotes do CineStars estiverem disponíveis.",
  };
}
