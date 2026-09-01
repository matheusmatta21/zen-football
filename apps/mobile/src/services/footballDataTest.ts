import type { Match } from "@zen/types";
import api from "./api";

export async function getBournemouthMatches(): Promise<Match[]> {
  try {
    const response = await api.get<Match[]>("/bournemouth/matches");
    return response.data;
  } catch (error) {
    console.error("Error fetching Bournemouth matches:", error);
    throw error;
  }
}