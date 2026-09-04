import { NextRequest, NextResponse } from "next/server";
import { WebhookSignatureValidator } from "mercadopago";
import { invoiceClient, preApprovalClient } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { awardPoints } from "@/lib/points";
import { PLANS } from "@/lib/plans";

const MP_STATUS_MAP: Record<
  string,
  "AUTHORIZED" | "PAUSED" | "CANCELLED" | "PENDING"
> = {
  authorized: "AUTHORIZED",
  paused: "PAUSED",
  cancelled: "CANCELLED",
  pending: "PENDING",
};

export async function POST(request: NextRequest) {
  const url = request.nextUrl;
  const dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (secret) {
    try {
      WebhookSignatureValidator.validate({
        xSignature: request.headers.get("x-signature"),
        xRequestId: request.headers.get("x-request-id"),
        dataId,
        secret,
        toleranceSeconds: 300,
      });
    } catch (error) {
      console.error("Assinatura de webhook inválida", error);
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  }

  const body = await request.json().catch(() => null);
  const type = body?.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");

  if (!dataId) {
    return NextResponse.json({ received: true });
  }

  try {
    if (type === "subscription_preapproval" || type === "preapproval") {
      await handlePreapprovalEvent(dataId);
    } else if (type === "subscription_authorized_payment") {
      await handleAuthorizedPaymentEvent(dataId);
    }
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago", error);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handlePreapprovalEvent(dataId: string) {
  const preapproval = await preApprovalClient.get({ id: dataId });
  const externalReference = preapproval.external_reference;
  const mpStatus = preapproval.status ?? "pending";

  if (!externalReference) return;

  const status = MP_STATUS_MAP[mpStatus] ?? "PENDING";

  await prisma.member.update({
    where: { id: externalReference },
    data: {
      subscriptionStatus: status,
      mpPreapprovalId: preapproval.id,
    },
  });
}

async function handleAuthorizedPaymentEvent(dataId: string) {
  const invoice = await invoiceClient.get({ id: dataId });

  if (
    invoice.payment?.status !== "approved" ||
    !invoice.external_reference ||
    !invoice.id
  ) {
    return;
  }

  const memberId = invoice.external_reference;
  const alreadyProcessed = await prisma.pointsTransaction.findUnique({
    where: { sourceId: invoice.id },
  });
  if (alreadyProcessed) return;

  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) return;

  const planDefinition = PLANS[member.plan];

  await prisma.$transaction(async (tx) => {
    await awardPoints(tx, memberId, "SUBSCRIPTION_MONTHLY", planDefinition.pointsPerMonth, {
      description: `Pontos mensais — plano ${planDefinition.name}`,
      sourceId: invoice.id,
    });

    const monthlyCount = await tx.pointsTransaction.count({
      where: { memberId, type: "SUBSCRIPTION_MONTHLY" },
    });

    if (monthlyCount % planDefinition.bonusPeriodMonths === 0) {
      await awardPoints(tx, memberId, "SUBSCRIPTION_BONUS", planDefinition.bonusPoints, {
        description: `Bônus trimestral — plano ${planDefinition.name}`,
        sourceId: `${invoice.id}-bonus`,
      });
    }
  });
}
