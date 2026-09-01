import { toMatch } from "@zen/types";
import { getTestMatches } from "../services/testFootballApi";

export async function getTestMatchesController(req: any, res: any) {
  try {
    const data = await getTestMatches();
    res.json(data.matches.map(toMatch));
  } catch (error) {
    console.error("Error fetching test matches:", error);
    res.status(500).json({ error: "Failed to fetch test matches" });
  }
}