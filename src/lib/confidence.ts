import type { ConfidenceLevel, ProviderName } from "./domain";

export function confidenceLabel(level: ConfidenceLevel) {
  switch (level) {
    case "confirmed":
      return "Confirmado";
    case "estimated":
      return "Estimado";
    case "stale":
      return "Pode estar desatualizado";
    case "unknown":
      return "Não confirmado";
    case "unavailable":
      return "Indisponível";
  }
}

export function providerLabel(provider: ProviderName) {
  switch (provider) {
    case "google_places":
      return "Google Places";
    case "google_routes":
      return "Google Routes";
    case "weatherapi":
      return "WeatherAPI";
    case "tomorrow_io":
      return "Tomorrow.io";
    case "rota_verified":
      return "Base verificada do Rota";
    case "mock":
    default:
      return "Dados simulados";
  }
}

export function shouldPresentAsExact(level: ConfidenceLevel) {
  return level === "confirmed";
}
