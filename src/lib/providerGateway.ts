import {
  ProviderErrorCode,
  ProviderFailure,
  ProviderName,
  ProviderResult,
} from "./domain";

interface SafeProviderCallOptions<T> {
  provider: ProviderName;
  operation: () => Promise<T>;
  fallback?: () => T;
  timeoutMs?: number;
}

function mapErrorCode(error: unknown): ProviderErrorCode {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (message.includes("timeout")) return "timeout";
  if (message.includes("quota")) return "quota_exceeded";
  if (message.includes("429") || message.includes("rate")) return "rate_limited";
  if (message.includes("401") || message.includes("403")) return "unauthorized";
  if (message.includes("404") || message.includes("not found")) return "not_found";
  if (message.includes("400") || message.includes("invalid")) return "invalid_request";
  if (message.includes("503") || message.includes("unavailable")) {
    return "provider_unavailable";
  }

  return "unknown";
}

function createFailure(
  provider: ProviderName,
  error: unknown,
): ProviderFailure {
  const code = mapErrorCode(error);

  return {
    provider,
    code,
    message:
      error instanceof Error
        ? error.message
        : "O provedor externo não respondeu como esperado.",
    retryable: [
      "timeout",
      "quota_exceeded",
      "rate_limited",
      "provider_unavailable",
      "unknown",
    ].includes(code),
    occurredAt: new Date().toISOString(),
  };
}

export async function safeProviderCall<T>({
  provider,
  operation,
  fallback,
  timeoutMs = 8000,
}: SafeProviderCallOptions<T>): Promise<ProviderResult<T>> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error("Provider timeout")),
        timeoutMs,
      );
    });

    const data = await Promise.race([operation(), timeoutPromise]);

    return {
      ok: true,
      data,
      usedFallback: false,
    };
  } catch (error) {
    const failure = createFailure(provider, error);

    if (fallback) {
      return {
        ok: true,
        data: fallback(),
        failure,
        usedFallback: true,
        fallbackReason: fallbackMessage(failure),
      };
    }

    return {
      ok: false,
      failure,
      usedFallback: false,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function fallbackMessage(failure: ProviderFailure) {
  switch (failure.code) {
    case "timeout":
    case "provider_unavailable":
      return "Serviço externo temporariamente indisponível. Mantivemos os últimos dados seguros.";
    case "quota_exceeded":
    case "rate_limited":
      return "Limite temporário do serviço atingido. O Rota preservou o roteiro e tentará novamente.";
    case "unauthorized":
      return "A integração precisa ser revalidada. Nenhum dado foi inventado.";
    case "not_found":
      return "Não foi possível confirmar esse dado na fonte externa.";
    default:
      return "Não conseguimos confirmar o dado agora. O Rota preservou somente informações conhecidas.";
  }
}
