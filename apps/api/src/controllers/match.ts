import { toMatch } from "@zen/types";
import { isAllowedTeamId } from "../config/clubs";
import {
  getCompetitionFromTeam,
  getTeamMatches,
} from "../services/footballApi";

function parseTeamId(rawTeamId: unknown): number | null {
  if (typeof rawTeamId !== "string" || rawTeamId.trim() === "") {
    return null;
  }

  const teamId = Number(rawTeamId);

  if (!Number.isInteger(teamId) || !isAllowedTeamId(teamId)) {
    return null;
  }

  return teamId;
}

export async function getTeamMatchesController(req: any, res: any) {
  const { teamId: rawTeamId, season, status } = req.query;

  const teamId = parseTeamId(rawTeamId);

  if (teamId === null) {
    return res
      .status(400)
      .json({ error: "teamId query parameter is missing or not supported" });
  }

  try {
    const data = await getTeamMatches(teamId, season, status);
    res.json(data.matches.map(toMatch));
  } catch (error) {
    console.error("Error fetching team matches:", error);
    res.status(500).json({ error: "Failed to fetch team matches" });
  }
}

export async function getCompetitionFromTeamController(req: any, res: any) {
  const teamId = parseTeamId(req.query.teamId);

  if (teamId === null) {
    return res
      .status(400)
      .json({ error: "teamId query parameter is missing or not supported" });
  }

  try {
    const competitions = await getCompetitionFromTeam(teamId);
    res.json(competitions);
  } catch (error) {
    console.error("Error fetching competition from team:", error);
    res.status(500).json({ error: "Failed to fetch competition from team" });
  }
}
