import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "MEMBER" | "ADMIN" | "FUNCIONARIO";
  }

  interface Session {
    user: {
      id: string;
      role: "MEMBER" | "ADMIN" | "FUNCIONARIO";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "MEMBER" | "ADMIN" | "FUNCIONARIO";
  }
}
