import type { FdCompetition, Match } from "@zen/types";
import type { ClubCatalog } from "@zen/types";
import api from "./api";

let clubsCache: { expiresAt: number; value: Promise<ClubCatalog> } | undefined;
const CLUBS_TTL = 24 * 60 * 60_000;

export function getClubCatalog(): Promise<ClubCatalog> {
  if (clubsCache && clubsCache.expiresAt > Date.now()) return clubsCache.value;

  // Shared request: closing an accordion must not cancel another consumer.
  const value = api.get<ClubCatalog>("/clubs", { timeout: 50_000 }).then(({ data }) => {
    // Do not keep a stale server snapshot in the app for another full day.
    entry.expiresAt = data.stale ? Date.now() + 60_000 :
      Math.min(Date.now() + CLUBS_TTL, Date.parse(data.updatedAt) + CLUBS_TTL);
    return data;
  });
  const entry = { expiresAt: Infinity, value };
  clubsCache = entry;
  value.catch(() => {
    if (clubsCache === entry) clubsCache = undefined;
  });
  return value;
}

type TeamRequestOptions = {
  teamId: number;
  season?: string;
  status?: string;
  signal?: AbortSignal;
};

export async function getTeamMatches({
  teamId,
  season,
  status,
  signal,
}: TeamRequestOptions): Promise<Match[]> {
  try {
    const response = await api.get<Match[]>("/matches", {
      params: { teamId, season, status },
      signal,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching team matches:", error);
    throw error;
  }
}

export async function getTeamCompetitions({
  teamId,
  signal,
}: Pick<TeamRequestOptions, "teamId" | "signal">): Promise<FdCompetition[]> {
  try {
    const response = await api.get<FdCompetition[]>("/competitions", {
      params: { teamId },
      signal,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching team competitions:", error);
    throw error;
  }
}
