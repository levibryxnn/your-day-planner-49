export type ConfidenceLevel = "confirmed" | "estimated" | "stale" | "unknown" | "unavailable";

export type ProviderName =
  | "mock"
  | "open_meteo"
  | "nominatim"
  | "photon"
  | "osrm"
  | "google_places"
  | "google_routes"
  | "google_weather"
  | "weatherapi"
  | "tomorrow_io"
  | "rota_verified";

export interface SourceReference {
  provider: ProviderName;
  externalId?: string;
  sourceUrl?: string;
  retrievedAt?: string;
  verifiedAt?: string;
}

export interface DataField<T> {
  value?: T;
  confidence: ConfidenceLevel;
  source: SourceReference;
  note?: string;
}

export interface DestinationRef {
  id: string;
  name: string;
  adminArea?: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  source: SourceReference;
}

export interface RotaPlace {
  id: string;
  providerPlaceId?: string;
  name: string;
  category: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address?: DataField<string>;
  neighborhood?: DataField<string>;
  businessStatus: DataField<
    "operational" | "temporarily_closed" | "permanently_closed" | "unknown"
  >;
  openingStatus: DataField<"open" | "closed" | "unknown">;
  rating?: DataField<number>;
  ratingCount?: DataField<number>;
  priceLevel?: DataField<number>;
  priceRange?: DataField<{
    min?: number;
    max?: number;
    currency: string;
  }>;
  weatherSensitivity: "outdoor" | "mixed" | "indoor";
  photoUrls: string[];
  source: SourceReference;
}

export interface RotaRoute {
  originId: string;
  destinationId: string;
  durationMinutes: DataField<number>;
  distanceMeters: DataField<number>;
  trafficAware: boolean;
  source: SourceReference;
}

export interface RotaWeatherHour {
  timeIso: string;
  temperatureC: DataField<number>;
  precipitationProbability: DataField<number>;
  condition: DataField<string>;
  source: SourceReference;
}

export interface RotaWeatherForecast {
  location: {
    latitude: number;
    longitude: number;
    timeZone: string;
  };
  hours: RotaWeatherHour[];
  source: SourceReference;
}

export type ProviderErrorCode =
  | "timeout"
  | "quota_exceeded"
  | "rate_limited"
  | "invalid_request"
  | "not_found"
  | "provider_unavailable"
  | "unauthorized"
  | "unknown";

export interface ProviderFailure {
  provider: ProviderName;
  code: ProviderErrorCode;
  message: string;
  retryable: boolean;
  occurredAt: string;
}

export interface ProviderResult<T> {
  ok: boolean;
  data?: T;
  failure?: ProviderFailure;
  usedFallback: boolean;
  fallbackReason?: string;
}
