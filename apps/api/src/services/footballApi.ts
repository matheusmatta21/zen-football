import { FdCompetition, FdMatchesResponse } from "@zen/types";
import apiService from "./apiService";

const AVAILABLE_PLAN = "TIER_ONE";

type FdCompetitionWithPlan = FdCompetition & { plan: string };

let availableCompetitionIds: Promise<Set<number>> | null = null;

function getAvailableCompetitionIds(): Promise<Set<number>> {
  if (!availableCompetitionIds) {
    availableCompetitionIds = apiService
      .get<{ competitions: FdCompetitionWithPlan[] }>("/competitions")
      .then(
        (response) =>
          new Set(
            response.data.competitions
              .filter((competition) => competition.plan === AVAILABLE_PLAN)
              .map((competition) => competition.id),
          ),
      )
      .catch((error) => {
        availableCompetitionIds = null;
        throw error;
      });
  }

  return availableCompetitionIds;
}

export async function getTeamMatches(
  teamId: number,
  season?: string,
  status?: string,
) {
  try {
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
  } catch (error) {
    console.error("Error fetching team matches:", error);
    throw error;
  }
}

export async function getCompetitionFromTeam(teamId: number) {
  try {
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
  } catch (error) {
    console.error("Error fetching competition from team:", error);
    throw error;
  }
}
