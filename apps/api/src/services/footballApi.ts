import type { FdCompetition, FdMatchesResponse } from "@zen/types";
import apiService from "./apiService";
import { cached } from "./cache";
import { clubCatalog } from "./clubCatalog";
import { getMatchesTtl, normalizeStatus, TEAM_COMPETITIONS_TTL } from "./teamCachePolicy";

const AVAILABLE_PLAN = "TIER_ONE";

const AVAILABLE_COMPETITIONS_TTL = 24 * 60 * 60_000;

type FdCompetitionWithPlan = FdCompetition & { plan: string };

function getAvailableCompetitionIds(): Promise<Set<number>> {
  return cached("competitions:available", AVAILABLE_COMPETITIONS_TTL, () =>
    apiService
      .get<{ competitions: FdCompetitionWithPlan[] }>("/competitions", { timeout: 10_000 })
      .then(
        (response) =>
          new Set(
            response.data.competitions
              .filter((competition) => competition.plan === AVAILABLE_PLAN)
              .map((competition) => competition.id),
          ),
      ),
  );
}

export async function getTeamMatches(
  teamId: number,
  season?: string,
  status?: string,
) {
  season = season?.trim() || undefined;
  status = normalizeStatus(status);
  const key = JSON.stringify(["matches", teamId, season ?? null, status ?? null]);

  try {
    return await cached(key, (data: FdMatchesResponse) => getMatchesTtl(data, status), async () => {
      const response = await apiService.get<FdMatchesResponse>(
        `/teams/${teamId}/matches`,
        {
          timeout: 10_000,
          params: {
            season: season,
            status: status,
          },
        },
      );
      return response.data;
    });
  } catch (error) {
    console.error("Error fetching team matches:", error);
    throw error;
  }
}

export async function getCompetitionFromTeam(teamId: number) {
  try {
    const runningCompetitions = await cached(
      `competitions:team:${teamId}`,
      TEAM_COMPETITIONS_TTL,
      async () => {
        const response = await apiService.get<{
          runningCompetitions: FdCompetition[];
        }>(`/teams/${teamId}`, { timeout: 10_000 });
        return response.data.runningCompetitions;
      },
    );
    try {
      const availableIds = await getAvailableCompetitionIds();
      return runningCompetitions.filter((competition) => availableIds.has(competition.id));
    } catch (error) {
      console.warn("Could not resolve available competitions, returning unfiltered:", error);
      return runningCompetitions;
    }
  } catch (error) {
    console.error("Error fetching competition from team:", error);
    throw error;
  }
}

export async function getTeamsFromCompetition(competitionId: number) {
  return clubCatalog.getTeams(competitionId);
}
