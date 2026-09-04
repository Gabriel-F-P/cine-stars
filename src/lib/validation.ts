import { z } from "zod";
import { isValidCpf, onlyDigits } from "@/lib/cpf";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Informe seu nome completo")
      .max(120, "Nome muito longo"),
    email: z.string().trim().toLowerCase().email("E-mail inválido"),
    phone: z
      .string()
      .transform(onlyDigits)
      .refine((value) => value.length === 10 || value.length === 11, {
        message: "Telefone inválido",
      }),
    cpf: z
      .string()
      .transform(onlyDigits)
      .refine(isValidCpf, { message: "CPF inválido" }),
    plan: z.enum(["BASIC", "PREMIUM"], {
      message: "Selecione um plano",
    }),
    password: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo")
    .max(120, "Nome muito longo"),
  age: z.coerce
    .number()
    .int("Idade inválida")
    .min(1, "Idade inválida")
    .max(120, "Idade inválida"),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  phone: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length === 10 || value.length === 11, {
      message: "Telefone inválido",
    }),
  cpf: z
    .string()
    .transform(onlyDigits)
    .refine(isValidCpf, { message: "CPF inválido" }),
  neighborhood: z
    .string()
    .trim()
    .min(2, "Informe o bairro")
    .max(80, "Bairro muito longo"),
  city: z
    .string()
    .trim()
    .min(2, "Informe a cidade")
    .max(80, "Cidade muito longa"),
  addressLine: z
    .string()
    .trim()
    .min(5, "Informe rua e número")
    .max(160, "Endereço muito longo"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;
