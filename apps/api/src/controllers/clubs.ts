import type { Request, Response } from "express";
import { clubCatalog, ClubCatalogUnavailableError } from "../services/clubCatalog";

export async function getClubsController(_req: Request, res: Response) {
  try {
    res.json(await clubCatalog.get());
  } catch (error) {
    if (error instanceof ClubCatalogUnavailableError) {
      res.setHeader("Retry-After", "300");
      res.status(503).json({ error: "Club catalog is temporarily unavailable" });
      return;
    }
    res.status(500).json({ error: "Failed to load club catalog" });
  }
}
