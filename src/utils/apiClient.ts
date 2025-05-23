export interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelayMs?: number;
}

async function fetchWithRetry<T = any>(
  input: RequestInfo,
  init: FetchOptions = {}
): Promise<T> {
  const { retries = 2, retryDelayMs = 500, ...rest } = init;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(input, rest);
      const text = await res.text();

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error(`Invalid JSON: ${jsonErr}`);
      }

      return data as T;
    } catch (err) {
      const isLast = attempt === retries;
      console.warn(`Fetch attempt ${attempt + 1} failed:`, err);
      if (isLast) throw err;
      await new Promise(r => setTimeout(r, retryDelayMs));
    }
  }
  throw new Error('fetchWithRetry: exhausted retries');
}

export default fetchWithRetry;