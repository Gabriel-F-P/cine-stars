import { prisma } from "@/lib/prisma";
import type { SignupInput } from "@/lib/validation";

export async function createSignup(
  data: SignupInput,
  source: "PUBLIC" | "STAFF"
) {
  return prisma.signup.upsert({
    where: { cpf: data.cpf },
    create: { ...data, source },
    update: {
      name: data.name,
      age: data.age,
      email: data.email,
      phone: data.phone,
      neighborhood: data.neighborhood,
      city: data.city,
      addressLine: data.addressLine,
    },
  });
}
