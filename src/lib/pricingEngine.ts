import { PlacePricing, UserTripConfig } from "./types";

interface PricingResult {
  total: number;
  breakdown: string[];
  summary: string;
}

function formatCurrency(value: number) {
  return "R$" + Math.round(value).toLocaleString("pt-BR");
}

function childWeight(age: number) {
  if (age <= 2) return 0.15;
  if (age <= 5) return 0.3;
  return 0.5;
}

function findChildPrice(age: number, pricing: PlacePricing) {
  const band = pricing.childBands?.find(
    (item) => age >= item.minAge && age <= item.maxAge
  );
  return band?.price ?? pricing.adultPrice ?? 0;
}

export function calculatePlacePrice(
  fallbackCost: number,
  pricing: PlacePricing | undefined,
  config: UserTripConfig
): PricingResult {
  if (fallbackCost <= 0 || pricing?.mode === "free") {
    return {
      total: 0,
      breakdown: ["Grátis para o grupo"],
      summary: "Grátis para o grupo",
    };
  }

  if (pricing?.mode === "per_person") {
    const adultPrice = pricing.adultPrice ?? fallbackCost;
    const adultTotal = adultPrice * config.adults;
    const breakdown = [
      config.adults +
        (config.adults === 1 ? " adulto × " : " adultos × ") +
        formatCurrency(adultPrice) +
        " = " +
        formatCurrency(adultTotal),
    ];

    let childTotal = 0;
    config.childAges.forEach((age, index) => {
      const price = findChildPrice(age, pricing);
      childTotal += price;
      breakdown.push(
        "Criança " +
          (index + 1) +
          " (" +
          age +
          (age === 1 ? " ano): " : " anos): ") +
          (price === 0 ? "grátis" : formatCurrency(price))
      );
    });

    const total = adultTotal + childTotal;
    return {
      total,
      breakdown,
      summary: formatCurrency(total) + " para o grupo",
    };
  }

  const baselineWeight = 2.5;
  const groupWeight =
    config.adults +
    config.childAges.reduce((total, age) => total + childWeight(age), 0);
  const total = Math.round((fallbackCost * groupWeight) / baselineWeight);

  return {
    total,
    breakdown: [
      "Estimativa ajustada para " +
        config.adults +
        (config.adults === 1 ? " adulto" : " adultos") +
        (config.childAges.length
          ? " e " +
            config.childAges.length +
            (config.childAges.length === 1 ? " criança" : " crianças")
          : ""),
    ],
    summary: "~" + formatCurrency(total) + " para o grupo",
  };
}

export function getUnitPriceLabel(
  fallbackCost: number,
  pricing: PlacePricing | undefined,
  costType: string
) {
  if (costType === "free" || pricing?.mode === "free" || fallbackCost <= 0) {
    return "Grátis";
  }

  if (pricing?.mode === "per_person") {
    return formatCurrency(pricing.adultPrice ?? fallbackCost) + " por adulto";
  }

  return "~" + formatCurrency(fallbackCost) + " estimado";
}
