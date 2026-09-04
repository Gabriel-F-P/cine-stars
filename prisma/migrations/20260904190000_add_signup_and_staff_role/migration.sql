-- AlterEnum
ALTER TYPE "MemberRole" ADD VALUE 'FUNCIONARIO';

-- CreateEnum
CREATE TYPE "SignupSource" AS ENUM ('PUBLIC', 'STAFF');

-- CreateTable
CREATE TABLE "Signup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "source" "SignupSource" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Signup_cpf_key" ON "Signup"("cpf");

-- CreateIndex
CREATE INDEX "Signup_city_idx" ON "Signup"("city");

-- CreateIndex
CREATE INDEX "Signup_createdAt_idx" ON "Signup"("createdAt");
