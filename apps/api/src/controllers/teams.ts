import { CLUB_LEAGUES } from "@zen/types";
import { getTeamsFromCompetition } from "../services/footballApi";

export async function getTeamsFromCompetitionController(req: any, res: any) {
    const rawCompetitionId = req.query.competitionId;
    const competitionId = Number(rawCompetitionId);

    if (typeof rawCompetitionId !== "string" ||
        !CLUB_LEAGUES.some((league) => league.id === competitionId)) {
        return res
            .status(400)
            .json({ error: "competitionId query parameter is missing or invalid" });
    }

    try {
        const teams = await getTeamsFromCompetition(competitionId);
        res.json(teams);
    } catch (error) {
        console.error("Error fetching teams from competition:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
