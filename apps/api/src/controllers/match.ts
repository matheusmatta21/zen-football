import { toMatch } from "@zen/types";
import {
  getCompetitionFromTeam,
  getTeamMatches,
} from "../services/footballApi";

export async function getTeamMatchesController(req: any, res: any) {
  const { teamId, season, status } = req.query;

  if (!teamId) {
    return res
      .status(400)
      .json({ error: "teamId query parameter is required" });
  }

  try {
    const data = await getTeamMatches(Number(teamId), season, status);
    res.json(data.matches.map(toMatch));
  } catch (error) {
    console.error("Error fetching team matches:", error);
    res.status(500).json({ error: "Failed to fetch team matches" });
  }
}

export async function getCompetitionFromTeamController(req: any, res: any) {
  const { teamId } = req.query;

  if (!teamId) {
    return res
      .status(400)
      .json({ error: "teamId query parameter is required" });
  }

  try {
    const competitions = await getCompetitionFromTeam(Number(teamId));
    res.json(competitions);
  } catch (error) {
    console.error("Error fetching competition from team:", error);
    res.status(500).json({ error: "Failed to fetch competition from team" });
  }
}
