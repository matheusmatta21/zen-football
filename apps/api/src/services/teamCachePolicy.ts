import type { FdMatchesResponse } from "@zen/types";

const MINUTE = 60_000;
const NORMAL_TTL = 5 * MINUTE;
const KICKOFF_LOOKAHEAD = 5 * MINUTE;
const LIVE_STATUSES = new Set(["LIVE", "IN_PLAY", "PAUSED", "EXTRA_TIME", "PENALTY_SHOOTOUT"]);

export const TEAM_COMPETITIONS_TTL = 24 * 60 * MINUTE;

export function getMatchesTtl(data: FdMatchesResponse, status?: string, now = Date.now()): number {
  // Empty LIVE responses also need a short TTL, so new live matches appear.
  if (status?.split(",").some((value) => LIVE_STATUSES.has(value))) return MINUTE;

  let ttl = NORMAL_TTL;
  for (const match of data.matches) {
    if (LIVE_STATUSES.has(match.status)) return MINUTE;
    if (match.status !== "SCHEDULED" && match.status !== "TIMED") continue;
    const untilPollingWindow = Date.parse(match.utcDate) - now - KICKOFF_LOOKAHEAD;
    if (!Number.isFinite(untilPollingWindow) || untilPollingWindow <= 0) return MINUTE;
    // Expire when polling should begin, even if the normal five minutes remain.
    ttl = Math.min(ttl, untilPollingWindow);
  }
  return ttl;
}

export function normalizeStatus(status?: string): string | undefined {
  return status ? [...new Set(status.split(",").map((value) => value.trim().toUpperCase()))]
    .filter(Boolean).sort().join(",") || undefined : undefined;
}
