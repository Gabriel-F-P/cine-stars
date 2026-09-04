import { getAppSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminConfiguracoesPage() {
  const settings = await getAppSettings();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl tracking-wide">Configurações</h1>
      <SettingsForm
        pointsPerReal={settings.pointsPerReal}
        maxMonthlyInvoicePoints={settings.maxMonthlyInvoicePoints}
        pickupAddress={settings.pickupAddress ?? ""}
        pickupHours={settings.pickupHours ?? ""}
        pickupMapUrl={settings.pickupMapUrl ?? ""}
      />
    </div>
  );
}
