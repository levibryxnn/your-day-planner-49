import { createFileRoute } from "@tanstack/react-router";
import { openDataWeatherProvider } from "../../lib/providers/openDataProviders";

export const Route = createFileRoute("/api/weather")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const latitude = Number(url.searchParams.get("lat"));
        const longitude = Number(url.searchParams.get("lon"));
        const startDateIso = url.searchParams.get("date") ?? "";
        const timeZone = url.searchParams.get("timezone") ?? "America/Sao_Paulo";
        const hours = Number(url.searchParams.get("hours") ?? "24");

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(startDateIso) ||
          !Number.isFinite(hours)
        ) {
          return Response.json(
            { error: "lat, lon, date e hours válidos são obrigatórios." },
            { status: 400 },
          );
        }

        const result = await openDataWeatherProvider.getHourlyForecast({
          latitude,
          longitude,
          timeZone: timeZone.slice(0, 80),
          startDateIso,
          hours: Math.round(hours),
        });

        return Response.json(result, {
          status: result.ok ? 200 : 502,
          headers: { "Cache-Control": "public, max-age=300" },
        });
      },
    },
  },
});
