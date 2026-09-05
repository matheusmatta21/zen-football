type CacheEntry = {
  value: Promise<unknown>;
  expiresAt: number;
  pending: boolean;
};

/** Shared within one API process. TTL starts when the upstream request settles. */
export function createCache({
  now = () => Date.now(),
  maxEntries = 500,
  failureTtlMs = 60_000,
} = {}) {
  const entries = new Map<string, CacheEntry>();

  function trim() {
    // Never evict in-flight requests: later callers must join the same promise.
    for (const [key, entry] of entries) {
      if (!entry.pending && entry.expiresAt <= now()) entries.delete(key);
    }
    for (const [key, entry] of entries) {
      if (entries.size <= maxEntries) break;
      if (!entry.pending) entries.delete(key);
    }
  }

  return function cached<T>(
    key: string,
    ttlMs: number | ((value: T) => number),
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const existing = entries.get(key);
    if (existing && (existing.pending || existing.expiresAt > now())) {
      entries.delete(key);
      entries.set(key, existing);
      return existing.value as Promise<T>;
    }

    const value = Promise.resolve().then(fetcher).then((result) => {
      entry.expiresAt = now() + (typeof ttlMs === "function" ? ttlMs(result) : ttlMs);
      return result;
    });
    const entry: CacheEntry = { value, expiresAt: Infinity, pending: true };
    entries.delete(key);
    entries.set(key, entry);
    trim();

    // Keep failures briefly to avoid repeated upstream attempts by other users.
    // The error is still returned to every caller, never cached as valid data.
    value.then(() => {
      entry.pending = false;
      trim();
    }, () => {
      entry.pending = false;
      entry.expiresAt = now() + failureTtlMs;
      trim();
    });
    return value;
  };
}

export const cached = createCache();
