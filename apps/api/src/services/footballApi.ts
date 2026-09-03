import { FdCompetition, FdMatchesResponse } from "@zen/types";
import apiService from "./apiService";
import { cached } from "./cache";

const AVAILABLE_PLAN = "TIER_ONE";

const MATCHES_TTL = 60_000;
const TEAM_COMPETITIONS_TTL = 60 * 60_000;
const AVAILABLE_COMPETITIONS_TTL = 24 * 60 * 60_000;

type FdCompetitionWithPlan = FdCompetition & { plan: string };

function getAvailableCompetitionIds(): Promise<Set<number>> {
  return cached("competitions:available", AVAILABLE_COMPETITIONS_TTL, () =>
    apiService
      .get<{ competitions: FdCompetitionWithPlan[] }>("/competitions")
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
  const key = `matches:${teamId}:${season ?? ""}:${status ?? ""}`;

  try {
    return await cached(key, MATCHES_TTL, async () => {
      const response = await apiService.get<FdMatchesResponse>(
        `/teams/${teamId}/matches`,
        {
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
    return await cached(
      `competitions:team:${teamId}`,
      TEAM_COMPETITIONS_TTL,
      async () => {
        const response = await apiService.get<{
          runningCompetitions: FdCompetition[];
        }>(`/teams/${teamId}`);
        const runningCompetitions = response.data.runningCompetitions;

        try {
          const availableIds = await getAvailableCompetitionIds();
          return runningCompetitions.filter((competition) =>
            availableIds.has(competition.id),
          );
        } catch (error) {
          console.warn(
            "Could not resolve available competitions, returning unfiltered:",
            error,
          );
          return runningCompetitions;
        }
      },
    );
  } catch (error) {
    console.error("Error fetching competition from team:", error);
    throw error;
  }
}
