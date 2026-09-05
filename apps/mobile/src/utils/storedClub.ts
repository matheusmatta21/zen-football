import { CLUB_LEAGUES, type Club } from "@zen/types";

// Migration only: older builds saved a slug instead of the selected club data.
const legacyClubs: Record<string, [number, string, number]> = {
  bournemouth: [1044, "Bournemouth", 2021],
  chelsea: [61, "Chelsea", 2021],
  arsenal: [57, "Arsenal", 2021],
  barcelona: [81, "Barcelona", 2014],
  "borussia-dortmund": [4, "Borussia Dortmund", 2002],
  juventus: [109, "Juventus", 2019],
  fluminense: [1765, "Fluminense", 2013],
  vasco: [1780, "Vasco da Gama", 2013],
  corinthians: [1779, "Corinthians", 2013],
};

export function parseStoredClub(value: string | null): Club | null {
  if (!value) return null;
  if (Object.hasOwn(legacyClubs, value)) {
    const [id, name, competitionId] = legacyClubs[value];
    return { id, name, competitionId, logoUrl: null };
  }

  try {
    const club = JSON.parse(value);
    if (
      club && Number.isSafeInteger(club.id) && club.id > 0 &&
      typeof club.name === "string" && club.name.trim() &&
      (club.logoUrl === null || typeof club.logoUrl === "string") &&
      CLUB_LEAGUES.some((league) => league.id === club.competitionId)
    ) {
      return {
        id: club.id, name: club.name, logoUrl: club.logoUrl,
        competitionId: club.competitionId,
      };
    }
  } catch {
    // Invalid local storage returns the user to club selection.
  }
  return null;
}
