type CacheEntry = {
  value: Promise<unknown>;
  expiresAt: number;
};

const MAX_ENTRIES = 100;

const entries = new Map<string, CacheEntry>();

function sweepExpired(now: number) {
  for (const [key, entry] of entries) {
    if (entry.expiresAt <= now) {
      entries.delete(key);
    }
  }
}

export function cached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const existing = entries.get(key);

  if (existing && existing.expiresAt > now) {
    return existing.value as Promise<T>;
  }

  if (entries.size >= MAX_ENTRIES) {
    sweepExpired(now);
  }

  const value = fetcher();
  const entry: CacheEntry = { value, expiresAt: now + ttlMs };

  entries.set(key, entry);

  value.catch(() => {
    if (entries.get(key) === entry) {
      entries.delete(key);
    }
  });

  return value;
}
