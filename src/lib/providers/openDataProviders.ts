import {
  DestinationRef,
  ProviderResult,
  RotaPlace,
  RotaRoute,
  RotaWeatherForecast,
} from "../domain";
import { safeProviderCall } from "../providerGateway";
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

const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const PHOTON_URL = "https://photon.komoot.io/api/";
const OSRM_URL = "https://router.project-osrm.org/table/v1";
const USER_AGENT = "Rota/0.1 (open-data integration)";
const MAX_RESULTS = 10;

interface NominatimSearchResult {
  place_id?: number;
  osm_type?: string;
  osm_id?: number;
  lat?: string;
  lon?: string;
  name?: string;
  display_name?: string;
  address?: {
    country?: string;
    country_code?: string;
    state?: string;
  };
}

interface PhotonFeature {
  type?: "Feature";
  geometry?: {
    type?: "Point";
    coordinates?: [number, number];
  };
  properties?: {
    osm_id?: number;
    osm_type?: string;
    osm_key?: string;
    osm_value?: string;
    name?: string;
    type?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    district?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface PhotonResponse {
  features?: PhotonFeature[];
}

interface OsrmTableResponse {
  code?: string;
  durations?: Array<Array<number | null>>;
  distances?: Array<Array<number | null>>;
}

interface OpenMeteoForecastResponse {
  hourly?: {
    time?: string[];
    temperature_2m?: Array<number | null>;
    precipitation_probability?: Array<number | null>;
    weather_code?: Array<number | null>;
  };
}

function source(
  provider: "open_meteo" | "nominatim" | "photon" | "osrm",
  sourceUrl: string,
  externalId?: string,
) {
  return {
    provider,
    sourceUrl,
    ...(externalId ? { externalId } : {}),
    retrievedAt: new Date().toISOString(),
  } as const;
}

async function getJson<T>(url: string, provider: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(provider + " HTTP " + response.status);
  }

  return (await response.json()) as T;
}

function boundedLimit(value: number | undefined) {
  return Math.max(1, Math.min(MAX_RESULTS, value ?? MAX_RESULTS));
}

function isCoordinatePair(
  coordinates: [number, number] | undefined,
): coordinates is [number, number] {
  return Boolean(coordinates && Number.isFinite(coordinates[0]) && Number.isFinite(coordinates[1]));
}

function destinationId(result: NominatimSearchResult) {
  return "nominatim-destination-" + String(result.place_id ?? result.osm_id ?? result.name);
}

function destinationName(result: NominatimSearchResult) {
  return result.name ?? result.display_name?.split(",")[0]?.trim() ?? "Destino";
}

function destinationCountryCode(result: NominatimSearchResult) {
  return (result.address?.country_code ?? "").toUpperCase();
}

function categoryForPhoton(properties: NonNullable<PhotonFeature["properties"]>) {
  return properties.type ?? properties.osm_value ?? properties.osm_key ?? "Lugar";
}

function weatherSensitivityForPhoton(
  properties: NonNullable<PhotonFeature["properties"]>,
): RotaPlace["weatherSensitivity"] {
  const key = properties.osm_key?.toLowerCase();
  const value = properties.osm_value?.toLowerCase();

  if (
    key === "natural" ||
    (key === "leisure" && ["park", "garden", "nature_reserve", "playground"].includes(value ?? ""))
  ) {
    return "outdoor";
  }

  if (
    key === "amenity" &&
    ["museum", "cinema", "theatre", "library", "restaurant", "cafe"].includes(value ?? "")
  ) {
    return "indoor";
  }

  return "mixed";
}

function photonPlaceToRotaPlace(feature: PhotonFeature, sourceUrl: string): RotaPlace | undefined {
  const properties = feature.properties;
  const coordinates = feature.geometry?.coordinates;

  if (!properties?.name || !properties.osm_id || !isCoordinatePair(coordinates)) {
    return undefined;
  }

  const id = "photon-" + (properties.osm_type ?? "osm") + "-" + properties.osm_id;
  const retrievedAt = new Date().toISOString();
  const placeSource = {
    provider: "photon" as const,
    externalId: String(properties.osm_id),
    sourceUrl,
    retrievedAt,
  };
  const address = [
    properties.street &&
      (properties.housenumber
        ? properties.street + ", " + properties.housenumber
        : properties.street),
    properties.postcode,
    properties.city,
    properties.state,
    properties.country,
  ]
    .filter(Boolean)
    .join(" · ");
  const neighborhood = properties.district ?? properties.suburb ?? properties.city;

  return {
    id,
    providerPlaceId: String(properties.osm_id),
    name: properties.name,
    category: categoryForPhoton(properties),
    coordinates: {
      latitude: coordinates[1],
      longitude: coordinates[0],
    },
    ...(address
      ? {
          address: {
            value: address,
            confidence: "confirmed" as const,
            source: placeSource,
          },
        }
      : {}),
    ...(neighborhood
      ? {
          neighborhood: {
            value: neighborhood,
            confidence: "confirmed" as const,
            source: placeSource,
          },
        }
      : {}),
    businessStatus: {
      confidence: "unknown",
      source: placeSource,
      note: "OpenStreetMap não confirma o status operacional deste lugar.",
    },
    openingStatus: {
      confidence: "unknown",
      source: placeSource,
      note: "Horário de funcionamento não confirmado por esta fonte.",
    },
    weatherSensitivity: weatherSensitivityForPhoton(properties),
    photoUrls: [],
    source: placeSource,
  };
}

function dateAfterHours(startDateIso: string, hours: number) {
  const date = new Date(startDateIso + "T00:00:00Z");
  date.setUTCHours(date.getUTCHours() + Math.max(0, hours - 1));
  return date.toISOString().slice(0, 10);
}

function weatherDescription(code: number | null | undefined) {
  if (code === 0) return { condition: "clear" as const, description: "Céu aberto" };
  if (code !== undefined && code !== null && code >= 95) {
    return { condition: "storm" as const, description: "Trovoada" };
  }
  if (code !== undefined && code !== null && (code >= 51 || (code >= 80 && code <= 82))) {
    return { condition: "rain" as const, description: "Chuva" };
  }
  return { condition: "cloudy" as const, description: "Nublado ou parcialmente nublado" };
}

export const openDataPlacesProvider: PlacesProvider = {
  async searchDestinations(input: DestinationSearchInput) {
    const query = input.query.trim();

    if (query.length < 2) {
      return {
        ok: false,
        usedFallback: false,
        failure: {
          provider: "nominatim" as const,
          code: "invalid_request" as const,
          message: "Informe ao menos 2 caracteres para buscar um destino.",
          retryable: false,
          occurredAt: new Date().toISOString(),
        },
      } satisfies ProviderResult<DestinationRef[]>;
    }

    return safeProviderCall({
      provider: "nominatim",
      operation: async () => {
        const url = new URL(NOMINATIM_SEARCH_URL);
        url.searchParams.set("q", query);
        url.searchParams.set("format", "jsonv2");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("limit", String(boundedLimit(8)));
        url.searchParams.set("accept-language", input.languageCode ?? "pt-BR");
        const payload = await getJson<NominatimSearchResult[]>(url.toString(), "Nominatim");

        return payload
          .filter(
            (result) => Number.isFinite(Number(result.lat)) && Number.isFinite(Number(result.lon)),
          )
          .map((result) => ({
            id: destinationId(result),
            name: destinationName(result),
            ...(result.address?.state ? { adminArea: result.address.state } : {}),
            country: result.address?.country ?? "",
            countryCode: destinationCountryCode(result),
            latitude: Number(result.lat),
            longitude: Number(result.lon),
            timeZone: "auto",
            source: source(
              "nominatim",
              url.toString(),
              result.osm_id ? String(result.osm_id) : undefined,
            ),
          }));
      },
    });
  },

  async searchPlaces(input: PlaceSearchInput) {
    return safeProviderCall({
      provider: "photon",
      operation: async () => {
        const url = new URL(PHOTON_URL);
        const query = input.query.trim();
        url.searchParams.set("q", (query || "atrações") + " " + input.destination.name);
        url.searchParams.set("limit", String(boundedLimit(input.maxResults)));
        url.searchParams.set("lat", String(input.destination.latitude));
        url.searchParams.set("lon", String(input.destination.longitude));
        // Photon does not support every locale; its documented fallback keeps
        // the OSM name when Portuguese is unavailable.
        url.searchParams.set("lang", "default");
        const payload = await getJson<PhotonResponse>(url.toString(), "Photon");

        return (payload.features ?? [])
          .map((feature) => photonPlaceToRotaPlace(feature, url.toString()))
          .filter((place): place is RotaPlace => Boolean(place));
      },
    });
  },

  async getPlaceDetails(input: PlaceDetailsInput) {
    return {
      ok: false,
      usedFallback: false,
      failure: {
        provider: "photon" as const,
        code: "not_found" as const,
        message: "A fonte open-data ainda não oferece detalhes estáveis para este identificador.",
        retryable: false,
        occurredAt: new Date().toISOString(),
      },
    } satisfies ProviderResult<RotaPlace>;
  },
};

export const openDataRoutesProvider: RoutesProvider = {
  async computeMatrix(input: RouteMatrixInput) {
    if (input.travelMode === "TRANSIT") {
      return {
        ok: false,
        usedFallback: false,
        failure: {
          provider: "osrm" as const,
          code: "provider_unavailable" as const,
          message: "OSRM não fornece rotas de transporte público.",
          retryable: false,
          occurredAt: new Date().toISOString(),
        },
      } as ProviderResult<RotaRoute[]>;
    }

    if (input.origins.length === 0 || input.destinations.length === 0) {
      return {
        ok: false,
        usedFallback: false,
        failure: {
          provider: "osrm" as const,
          code: "invalid_request" as const,
          message: "Informe ao menos uma origem e um destino.",
          retryable: false,
          occurredAt: new Date().toISOString(),
        },
      } satisfies ProviderResult<RotaRoute[]>;
    }

    return safeProviderCall({
      provider: "osrm",
      operation: async () => {
        const profile = input.travelMode === "WALK" ? "foot" : "driving";
        const points = [...input.origins, ...input.destinations];
        const sources = input.origins.map((_, index) => index).join(";");
        const destinations = input.destinations
          .map((_, index) => input.origins.length + index)
          .join(";");
        const coordinates = points.map((point) => point.longitude + "," + point.latitude).join(";");
        const url =
          OSRM_URL +
          "/" +
          profile +
          "/" +
          coordinates +
          "?annotations=duration,distance&sources=" +
          sources +
          "&destinations=" +
          destinations;
        const payload = await getJson<OsrmTableResponse>(url, "OSRM");

        if (payload.code !== "Ok") throw new Error("OSRM returned " + payload.code);

        const retrievedAt = new Date().toISOString();
        const routes: RotaRoute[] = [];
        input.origins.forEach((origin, originIndex) => {
          input.destinations.forEach((destination, destinationIndex) => {
            const duration = payload.durations?.[originIndex]?.[destinationIndex];
            const distance = payload.distances?.[originIndex]?.[destinationIndex];
            if (
              duration === null ||
              duration === undefined ||
              distance === null ||
              distance === undefined
            ) {
              return;
            }

            const routeSource = {
              provider: "osrm" as const,
              sourceUrl: url,
              retrievedAt,
            };
            routes.push({
              originId: origin.id,
              destinationId: destination.id,
              durationMinutes: {
                value: Math.max(1, Math.round(duration / 60)),
                confidence: "estimated",
                source: routeSource,
                note: "Estimativa de rota sem trânsito em tempo real.",
              },
              distanceMeters: {
                value: Math.round(distance),
                confidence: "confirmed",
                source: routeSource,
              },
              trafficAware: false,
              source: routeSource,
            });
          });
        });

        return routes;
      },
    });
  },
};

export const openDataWeatherProvider: WeatherProvider = {
  async getHourlyForecast(input: WeatherForecastInput) {
    const hours = Math.max(1, Math.min(48, input.hours));

    return safeProviderCall({
      provider: "open_meteo",
      operation: async () => {
        const url = new URL(OPEN_METEO_FORECAST_URL);
        url.searchParams.set("latitude", String(input.latitude));
        url.searchParams.set("longitude", String(input.longitude));
        url.searchParams.set("hourly", "temperature_2m,precipitation_probability,weather_code");
        url.searchParams.set("timezone", input.timeZone);
        url.searchParams.set("start_date", input.startDateIso);
        url.searchParams.set("end_date", dateAfterHours(input.startDateIso, hours));
        const payload = await getJson<OpenMeteoForecastResponse>(
          url.toString(),
          "Open-Meteo forecast",
        );
        const hourly = payload.hourly;

        if (!hourly?.time?.length) throw new Error("Open-Meteo did not return hourly data");

        const retrievedAt = new Date().toISOString();
        const forecastHours = hourly.time.slice(0, hours).map((time, index) => {
          const temperature = hourly.temperature_2m?.[index];
          const precipitation = hourly.precipitation_probability?.[index];
          const weather = weatherDescription(hourly.weather_code?.[index]);
          const sourceReference = {
            provider: "open_meteo" as const,
            sourceUrl: url.toString(),
            retrievedAt,
          };

          return {
            timeIso: time + ":00",
            temperatureC: {
              ...(temperature !== null && temperature !== undefined ? { value: temperature } : {}),
              confidence:
                temperature !== null && temperature !== undefined
                  ? ("confirmed" as const)
                  : ("unavailable" as const),
              source: sourceReference,
            },
            precipitationProbability: {
              ...(precipitation !== null && precipitation !== undefined
                ? { value: precipitation }
                : {}),
              confidence:
                precipitation !== null && precipitation !== undefined
                  ? ("confirmed" as const)
                  : ("unavailable" as const),
              source: sourceReference,
            },
            condition: {
              value: weather.description,
              confidence: "confirmed" as const,
              source: sourceReference,
            },
            source: sourceReference,
          };
        });

        const forecast: RotaWeatherForecast = {
          location: {
            latitude: input.latitude,
            longitude: input.longitude,
            timeZone: input.timeZone,
          },
          hours: forecastHours,
          source: {
            provider: "open_meteo",
            sourceUrl: url.toString(),
            retrievedAt,
          },
        };

        return forecast;
      },
    });
  },
};

export const openDataProviderRegistry = {
  places: openDataPlacesProvider,
  routes: openDataRoutesProvider,
  weather: openDataWeatherProvider,
};
