"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { onlyDigits } from "@/lib/cpf";
import { signupSchema } from "@/lib/validation";
import { createSignup } from "@/lib/signup";
import type { Signup } from "@/generated/prisma/client";

async function requireStaff() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "FUNCIONARIO")
  ) {
    throw new Error("Acesso negado");
  }
  return session.user;
}

export type SignupLookupState = {
  status: "idle" | "found" | "not_found" | "error";
  message?: string;
  signup?: Signup;
};

export async function findSignupByCpf(
  _prevState: SignupLookupState,
  formData: FormData
): Promise<SignupLookupState> {
  await requireStaff();

  const cpf = onlyDigits(String(formData.get("cpf") ?? ""));
  if (cpf.length !== 11) {
    return { status: "error", message: "CPF inválido." };
  }

  const signup = await prisma.signup.findUnique({ where: { cpf } });
  if (!signup) {
    return { status: "not_found", message: "Nenhum cadastro com esse CPF." };
  }

  return { status: "found", signup };
}

export type SignupFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createSignupAsStaff(
  _prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  await requireStaff();

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

  await createSignup(parsed.data, "STAFF");

  return { status: "success", message: "Cadastro salvo!" };
}
