import { getTeamMatches } from "../services/footballApi";

export async function getTeamMatchesController(req: any, res: any) {
  const { teamId, season, status } = req.query;

  if (!teamId) {
    return res
      .status(400)
      .json({ error: "teamId query parameter is required" });
  }

  try {
    const matches = await getTeamMatches(Number(teamId), season, status);
    res.json(matches);
  } catch (error) {
    console.error("Error fetching team matches:", error);
    res.status(500).json({ error: "Failed to fetch team matches" });
  }
}
