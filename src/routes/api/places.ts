import { createFileRoute } from "@tanstack/react-router";
import { openDataPlacesProvider } from "../../lib/providers/openDataProviders";

export const Route = createFileRoute("/api/places")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const query = (url.searchParams.get("q") ?? "").slice(0, 100);
        const latitude = Number(url.searchParams.get("lat"));
        const longitude = Number(url.searchParams.get("lon"));
        const name = (url.searchParams.get("destination") ?? "Destino").slice(0, 100);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return Response.json(
            { error: "lat e lon são obrigatórios e devem ser numéricos." },
            { status: 400 },
          );
        }

        const result = await openDataPlacesProvider.searchPlaces({
          query,
          destination: {
            id: "request-destination",
            name,
            country: "",
            countryCode: "",
            latitude,
            longitude,
            timeZone: "UTC",
            source: { provider: "open_meteo" },
          },
          maxResults: 10,
          languageCode: "pt",
        });

        return Response.json(result, {
          status: result.ok ? 200 : 502,
          headers: { "Cache-Control": "public, max-age=120" },
        });
      },
    },
  },
});
