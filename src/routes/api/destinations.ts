import { createFileRoute } from "@tanstack/react-router";
import { openDataPlacesProvider } from "../../lib/providers/openDataProviders";

export const Route = createFileRoute("/api/destinations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const query = (url.searchParams.get("q") ?? "").slice(0, 100);
        const result = await openDataPlacesProvider.searchDestinations({
          query,
          languageCode: "pt",
        });

        return Response.json(result, {
          status: result.ok ? 200 : result.failure?.code === "invalid_request" ? 400 : 502,
          headers: { "Cache-Control": "public, max-age=300" },
        });
      },
    },
  },
});
