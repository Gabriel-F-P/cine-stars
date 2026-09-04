export type PlanId = "BASIC" | "PREMIUM";

export type PlanDefinition = {
  id: PlanId;
  name: string;
  priceCents: number;
  pointsPerMonth: number;
  bonusPoints: number;
  bonusPeriodMonths: number;
  highlight?: boolean;
  perks: string[];
};

export const PLANS: Record<PlanId, PlanDefinition> = {
  BASIC: {
    id: "BASIC",
    name: "Básico",
    priceCents: 1000,
    pointsPerMonth: 20,
    bonusPoints: 40,
    bonusPeriodMonths: 3,
    perks: [
      "20 pontos todo mês",
      "+40 pontos de bônus a cada 3 meses",
      "Troca por colecionáveis exclusivos",
      "Participa dos sorteios mensais de ingressos",
    ],
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "Premium",
    priceCents: 2000,
    pointsPerMonth: 50,
    bonusPoints: 80,
    bonusPeriodMonths: 3,
    highlight: true,
    perks: [
      "50 pontos todo mês",
      "+80 pontos de bônus a cada 3 meses",
      "Troca por colecionáveis exclusivos",
      "Participa dos sorteios mensais de ingressos",
      "Prioridade nos prêmios exclusivos",
    ],
  },
};

export const PLAN_LIST = Object.values(PLANS);

export function isPlanId(value: unknown): value is PlanId {
  return value === "BASIC" || value === "PREMIUM";
}

export function formatPriceCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
