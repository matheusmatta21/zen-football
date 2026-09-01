import type { Match } from "@zen/types";
import api from "./api";

export async function getBournemouthMatches(
  options?: { signal?: AbortSignal },
): Promise<Match[]> {
  try {
    const response = await api.get<Match[]>("/bournemouth/matches", {
      signal: options?.signal,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Bournemouth matches:", error);
    throw error;
  }
}