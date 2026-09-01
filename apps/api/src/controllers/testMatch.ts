import { toMatch } from "@zen/types";
import { getTestCompetitionFromTeam, getTestMatches } from "../services/testFootballApi";

export async function getTestMatchesController(req: any, res: any) {
  try {
    const data = await getTestMatches();
    res.json(data.matches.map(toMatch));
  } catch (error) {
    console.error("Error fetching test matches:", error);
    res.status(500).json({ error: "Failed to fetch test matches" });
  }
}

export async function getTestCompetitionFromTeamController(req: any, res: any) {
  try {
    const competitions = await getTestCompetitionFromTeam();
    res.json(competitions);
  } catch (error) {
    console.error("Error fetching competition from team:", error);
    res.status(500).json({ error: "Failed to fetch competition from team" });
  }
}