import Link from "next/link";
import { Gift } from "lucide-react";

type StoreItemCardProps = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  pointsCost: number;
  outOfStock: boolean;
  canAfford: boolean;
};

export function StoreItemCard({
  id,
  name,
  description,
  imageUrl,
  pointsCost,
  outOfStock,
  canAfford,
}: StoreItemCardProps) {
  return (
    <Link
      href={`/conta/loja/${id}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900/60 transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10 ${
        outOfStock ? "opacity-70" : ""
      }`}
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-gold/20 via-neutral-900 to-neutral-950">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-entered arbitrary external URLs, can't be pre-allowlisted for next/image
          <img
            src={imageUrl}
            alt={name}
            className={`h-full w-full object-cover ${outOfStock ? "grayscale" : ""}`}
          />
        ) : (
          <Gift size={40} className="text-gold/60" />
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="-rotate-12 rounded-md border-2 border-crimson-soft bg-neutral-950/90 px-4 py-1.5 text-sm font-bold uppercase tracking-wide text-crimson-soft">
              Indisponível
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold group-hover:text-gold">{name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-neutral-400">
          {description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-xl text-gold">
            {pointsCost} pts
          </span>
          <span
            className={`text-xs font-medium ${
              canAfford && !outOfStock ? "text-emerald-400" : "text-neutral-500"
            }`}
          >
            {outOfStock
              ? "Indisponível"
              : canAfford
                ? "Você pode resgatar"
                : "Faltam pontos"}
          </span>
        </div>
      </div>
    </Link>
  );
}
