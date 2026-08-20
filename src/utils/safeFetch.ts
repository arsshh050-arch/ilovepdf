export async function safeFetchJson<T = any>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const mergedOptions: RequestInit = {
      credentials: 'include',
      ...options,
      headers: {
        ...(options?.headers || {})
      }
    };

    const res = await fetch(url, mergedOptions);
    const text = await res.text();

    if (text.trim().toLowerCase().startsWith('<!doctype') || text.trim().startsWith('<html') || text.trim().startsWith('<')) {
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw new Error(
        `Received HTML instead of JSON for ${url}. Ensure Node.js server is active and proxying /api requests.`
      );
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw new Error(`Invalid JSON response received from server (${res.status} ${res.statusText}).`);
    }
  } catch (err: any) {
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

