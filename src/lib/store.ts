import { prisma } from "@/lib/prisma";

export type VoucherAvailability = { managed: boolean; available: number };

export async function getVoucherAvailability(
  storeItemIds: string[]
): Promise<Map<string, VoucherAvailability>> {
  const availability = new Map<string, VoucherAvailability>();
  for (const id of storeItemIds) {
    availability.set(id, { managed: false, available: 0 });
  }

  if (storeItemIds.length === 0) return availability;

  const grouped = await prisma.voucher.groupBy({
    by: ["storeItemId", "status"],
    where: { storeItemId: { in: storeItemIds } },
    _count: { _all: true },
  });

  for (const row of grouped) {
    const entry = availability.get(row.storeItemId);
    if (!entry) continue;
    entry.managed = true;
    if (row.status === "AVAILABLE") entry.available = row._count._all;
  }

  return availability;
}

export function isOutOfStock(
  item: { stock: number | null },
  voucherInfo: VoucherAvailability
): boolean {
  if (voucherInfo.managed) return voucherInfo.available <= 0;
  return item.stock !== null && item.stock <= 0;
}
