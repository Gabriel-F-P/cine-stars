import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "singleton";

export async function getAppSettings() {
  return prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID },
    update: {},
  });
}

export async function updateAppSettings(data: {
  pointsPerReal?: number;
  maxMonthlyInvoicePoints?: number;
  pickupAddress?: string | null;
  pickupHours?: string | null;
  pickupMapUrl?: string | null;
}) {
  return prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...data },
    update: data,
  });
}
