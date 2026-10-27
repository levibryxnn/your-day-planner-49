import { createFileRoute } from "@tanstack/react-router";
import { openDataRoutesProvider } from "../../lib/providers/openDataProviders";
import type { RouteMatrixInput } from "../../lib/providers/contracts";

function isRouteMatrixInput(value: unknown): value is RouteMatrixInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<RouteMatrixInput>;
  return (
    Array.isArray(input.origins) &&
    Array.isArray(input.destinations) &&
    input.origins.length > 0 &&
    input.destinations.length > 0 &&
    input.origins.length <= 20 &&
    input.destinations.length <= 20 &&
    (input.travelMode === "DRIVE" || input.travelMode === "TRANSIT" || input.travelMode === "WALK")
  );
}

export const Route = createFileRoute("/api/routes")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "JSON inválido." }, { status: 400 });
        }

        if (!isRouteMatrixInput(body)) {
          return Response.json(
            { error: "origins, destinations e travelMode válidos são obrigatórios." },
            { status: 400 },
          );
        }

        const result = await openDataRoutesProvider.computeMatrix(body);

        return Response.json(result, {
          status: result.ok ? 200 : 502,
          headers: { "Cache-Control": "no-store" },
        });
      },
    },
  },
});
