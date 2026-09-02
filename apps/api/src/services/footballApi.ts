import { FdCompetition, FdMatchesResponse } from "@zen/types";
import apiService from "./apiService";

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
    return response.data.runningCompetitions;
  } catch (error) {
    console.error("Error fetching competition from team:", error);
    throw error;
  }
}
