import { prisma } from "@/lib/prisma";
import type { Prisma, PointsTransactionType } from "@/generated/prisma/client";

export async function getMemberPointsBalance(memberId: string): Promise<number> {
  const result = await prisma.pointsTransaction.aggregate({
    where: { memberId },
    _sum: { points: true },
  });
  return result._sum.points ?? 0;
}

export function awardPoints(
  tx: Prisma.TransactionClient,
  memberId: string,
  type: PointsTransactionType,
  points: number,
  options?: { description?: string; sourceId?: string }
) {
  return tx.pointsTransaction.create({
    data: {
      memberId,
      type,
      points,
      description: options?.description,
      sourceId: options?.sourceId,
    },
  });
}
