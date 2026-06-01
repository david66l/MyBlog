const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const REVALIDATE_SECONDS = 60;

type FetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const revalidate = options.revalidate ?? REVALIDATE_SECONDS;
  const response = await fetch(`${API_BASE}${path}`, {
    ...(revalidate === false || revalidate === 0
      ? { cache: "no-store" as const }
      : { next: { revalidate } }),
  });

  if (!response.ok) {
    throw new Error(`API ${path} failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export { API_BASE, REVALIDATE_SECONDS, apiFetch };
