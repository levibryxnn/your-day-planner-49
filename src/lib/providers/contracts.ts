import {
  DestinationRef,
  ProviderResult,
  RotaPlace,
  RotaRoute,
  RotaWeatherForecast,
} from "../domain";

export interface DestinationSearchInput {
  query: string;
  sessionToken?: string;
  languageCode?: string;
}

export interface PlaceSearchInput {
  destination: DestinationRef;
  query: string;
  includedTypes?: string[];
  maxResults?: number;
  languageCode?: string;
}

export interface PlaceDetailsInput {
  placeId: string;
  languageCode?: string;
  fields: string[];
}

export interface RouteMatrixInput {
  origins: Array<{ id: string; latitude: number; longitude: number }>;
  destinations: Array<{ id: string; latitude: number; longitude: number }>;
  departureTimeIso?: string;
  travelMode: "DRIVE" | "TRANSIT" | "WALK";
  trafficAware?: boolean;
}

export interface WeatherForecastInput {
  latitude: number;
  longitude: number;
  timeZone: string;
  startDateIso: string;
  hours: number;
}

export interface PlacesProvider {
  searchDestinations(input: DestinationSearchInput): Promise<ProviderResult<DestinationRef[]>>;

  searchPlaces(input: PlaceSearchInput): Promise<ProviderResult<RotaPlace[]>>;

  getPlaceDetails(input: PlaceDetailsInput): Promise<ProviderResult<RotaPlace>>;
}

export interface RoutesProvider {
  computeMatrix(input: RouteMatrixInput): Promise<ProviderResult<RotaRoute[]>>;
}

export interface WeatherProvider {
  getHourlyForecast(input: WeatherForecastInput): Promise<ProviderResult<RotaWeatherForecast>>;
}
