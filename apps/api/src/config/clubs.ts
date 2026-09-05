import { clubCatalog } from "../services/clubCatalog";

export async function isAllowedTeamId(teamId: number): Promise<boolean> {
  const catalog = await clubCatalog.get();
  return catalog.leagues.some((league) => league.clubs.some((club) => club.id === teamId));
}
