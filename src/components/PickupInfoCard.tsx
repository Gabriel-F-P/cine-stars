import { Clock, MapPin } from "lucide-react";
import { getAppSettings } from "@/lib/settings";

export async function PickupInfoCard() {
  const settings = await getAppSettings();

  if (!settings.pickupAddress && !settings.pickupHours && !settings.pickupMapUrl) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
        Onde retirar seu prêmio
      </h3>
      <div className="mt-3 space-y-2 text-sm">
        {settings.pickupAddress && (
          <p className="flex items-start gap-2 text-neutral-300">
            <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
            {settings.pickupAddress}
          </p>
        )}
        {settings.pickupHours && (
          <p className="flex items-start gap-2 text-neutral-300">
            <Clock size={16} className="mt-0.5 shrink-0 text-gold" />
            {settings.pickupHours}
          </p>
        )}
        {settings.pickupMapUrl && (
          <a
            href={settings.pickupMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:underline"
          >
            <MapPin size={14} />
            Ver no mapa
          </a>
        )}
      </div>
    </div>
  );
}
