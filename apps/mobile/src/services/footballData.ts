import type { FdCompetition, Match } from "@zen/types";
import api from "./api";

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
