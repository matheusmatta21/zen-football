import { toMatch } from "@zen/types";
import { getBournemouthMatches } from "../services/testFootballApi";

export async function getBournemouthMatchesController(req: any, res: any) {
  try {
    const data = await getBournemouthMatches();
    res.json(data.matches.map(toMatch));
  } catch (error) {
    console.error("Error fetching Bournemouth matches:", error);
    res.status(500).json({ error: "Failed to fetch Bournemouth matches" });
  }
}