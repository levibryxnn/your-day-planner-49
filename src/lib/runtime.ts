export const IS_STATIC_DEMO = import.meta.env["VITE_GITHUB_PAGES_DEMO"] === "true";

export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
