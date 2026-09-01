import type { FdCompetition, Match } from "@zen/types";
import api from "./api";

export async function getTestMatches(
  options?: { signal?: AbortSignal },
): Promise<Match[]> {
  try {
    const response = await api.get<Match[]>("/test/matches", {
      signal: options?.signal,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching test matches:", error);
    throw error;
  }
}

export async function getTestCompetitions(
  options?: { signal?: AbortSignal },
): Promise<FdCompetition[]> {
  try {
    const response = await api.get<FdCompetition[]>("/test/competitions", {
      signal: options?.signal,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching test competitions:", error);
    throw error;
  }
}
