import {
  AVAILABLE_MOCK_PLACES,
  BASE_SUGGESTED_STOPS,
  MOCK_DESTINATION,
  MOCK_HOURLY_WEATHER,
} from "../mockData";
import type {
  ProviderResult,
  RotaPlace,
  RotaRoute,
  RotaWeatherForecast,
} from "../domain";
import type {
  DestinationSearchInput,
  PlaceDetailsInput,
  PlaceSearchInput,
  PlacesProvider,
  RouteMatrixInput,
  RoutesProvider,
  WeatherForecastInput,
  WeatherProvider,
} from "./contracts";

function success<T>(data: T): ProviderResult<T> {
  return {
    ok: true,
    data,
    usedFallback: false,
  };
}

function sourceNow() {
  return {
    provider: "mock" as const,
    retrievedAt: new Date().toISOString(),
  };
}

function placeToRotaPlace(
  place: {
    id: string;
    name: string;
    category: string;
    neighborhood?: string;
    cost: number;
    weatherSensitivity?: "outdoor" | "mixed" | "indoor";
    rating?: number;
    reviewCount?: number;
  },
  index: number,
): RotaPlace {
  return {
    id: place.id,
    providerPlaceId: place.id,
    name: place.name,
    category: place.category,
    coordinates: {
      latitude: MOCK_DESTINATION.latitude + index * 0.004,
      longitude: MOCK_DESTINATION.longitude - index * 0.003,
    },
    neighborhood: {
      value: place.neighborhood,
      confidence: "estimated",
      source: sourceNow(),
    },
    businessStatus: {
      value: "operational",
      confidence: "estimated",
      source: sourceNow(),
    },
    openingStatus: {
      value: "unknown",
      confidence: "unknown",
      source: sourceNow(),
      note: "Horário ainda não conectado a um provedor real.",
    },
    rating:
      place.rating !== undefined
        ? {
            value: place.rating,
            confidence: "estimated",
            source: sourceNow(),
          }
        : undefined,
    ratingCount:
      place.reviewCount !== undefined
        ? {
            value: place.reviewCount,
            confidence: "estimated",
            source: sourceNow(),
          }
        : undefined,
    priceRange:
      place.cost > 0
        ? {
            value: {
              min: Math.round(place.cost * 0.8),
              max: Math.round(place.cost * 1.2),
              currency: "BRL",
            },
            confidence: "estimated",
            source: sourceNow(),
          }
        : undefined,
    weatherSensitivity: place.weatherSensitivity ?? "mixed",
    photoUrls: [],
    source: sourceNow(),
  };
}

export const mockPlacesProvider: PlacesProvider = {
  async searchDestinations(input: DestinationSearchInput) {
    const matches = MOCK_DESTINATION.name
      .toLowerCase()
      .includes(input.query.trim().toLowerCase());

    return success(matches ? [MOCK_DESTINATION] : []);
  },

  async searchPlaces(input: PlaceSearchInput) {
    const all = [...AVAILABLE_MOCK_PLACES, ...BASE_SUGGESTED_STOPS];
    const query = input.query.trim().toLowerCase();

    const filtered = all
      .filter((place) => {
        if (!query) return true;
        return (
          place.name.toLowerCase().includes(query) ||
          place.category.toLowerCase().includes(query)
        );
      })
      .slice(0, input.maxResults ?? 10)
      .map((place, index) => placeToRotaPlace(place, index));

    return success(filtered);
  },

  async getPlaceDetails(input: PlaceDetailsInput) {
    const all = [...AVAILABLE_MOCK_PLACES, ...BASE_SUGGESTED_STOPS];
    const index = all.findIndex((place) => place.id === input.placeId);
    const place = all[index];

    if (!place) {
      return {
        ok: false,
        usedFallback: false,
        failure: {
          provider: "mock",
          code: "not_found",
          message: "Lugar não encontrado no catálogo simulado.",
          retryable: false,
          occurredAt: new Date().toISOString(),
        },
      };
    }

    return success(placeToRotaPlace(place, Math.max(index, 0)));
  },
};

function haversineMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const earthRadius = 6371000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadius * Math.asin(Math.sqrt(value));
}

export const mockRoutesProvider: RoutesProvider = {
  async computeMatrix(input: RouteMatrixInput) {
    const speedMetersPerMinute =
      input.travelMode === "WALK"
        ? 80
        : input.travelMode === "TRANSIT"
          ? 300
          : 450;

    const routes: RotaRoute[] = [];

    input.origins.forEach((origin) => {
      input.destinations.forEach((destination) => {
        const distance = Math.round(haversineMeters(origin, destination));
        const duration = Math.max(
          1,
          Math.round(distance / speedMetersPerMinute),
        );

        routes.push({
          originId: origin.id,
          destinationId: destination.id,
          durationMinutes: {
            value: duration,
            confidence: "estimated",
            source: sourceNow(),
            note: "Estimativa geométrica apenas para validar a arquitetura.",
          },
          distanceMeters: {
            value: distance,
            confidence: "estimated",
            source: sourceNow(),
          },
          trafficAware: false,
          source: sourceNow(),
        });
      });
    });

    return success(routes);
  },
};

export const mockWeatherProvider: WeatherProvider = {
  async getHourlyForecast(input: WeatherForecastInput) {
    const hours = MOCK_HOURLY_WEATHER.slice(0, input.hours).map((slot) => ({
      timeIso: input.startDateIso + "T" + slot.time + ":00",
      temperatureC: {
        value: slot.temperatureC,
        confidence: "estimated" as const,
        source: sourceNow(),
      },
      precipitationProbability: {
        value: slot.precipitationProbability,
        confidence: "estimated" as const,
        source: sourceNow(),
      },
      condition: {
        value: slot.description,
        confidence: "estimated" as const,
        source: sourceNow(),
      },
      source: sourceNow(),
    }));

    const forecast: RotaWeatherForecast = {
      location: {
        latitude: input.latitude,
        longitude: input.longitude,
        timeZone: input.timeZone,
      },
      hours,
      source: sourceNow(),
    };

    return success(forecast);
  },
};

export const mockProviderRegistry = {
  places: mockPlacesProvider,
  routes: mockRoutesProvider,
  weather: mockWeatherProvider,
};
