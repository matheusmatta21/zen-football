import type { ImageSourcePropType } from "react-native";

type CatalogEntry = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export const TOURNAMENTS = [
  { id: "premier-league", name: "Premier League", logoUrl: null },
  { id: "la-liga", name: "La Liga", logoUrl: null },
  { id: "brasileirao-serie-a", name: "Brasileirão Serie A", logoUrl: null },
  { id: "bundesliga", name: "Bundesliga", logoUrl: null },
  { id: "uefa-champions-league", name: "UEFA Champions League", logoUrl: null },
] as const satisfies readonly CatalogEntry[];

type ClubCatalogEntry = CatalogEntry & { teamId: number };

export const CLUBS = [
  { id: "bournemouth", name: "Bournemouth", logoUrl: null, teamId: 1044 },
  { id: "chelsea", name: "Chelsea", logoUrl: null, teamId: 61 },
  {
    id: "arsenal",
    name: "Arsenal",
    logoUrl: "https://crests.football-data.org/57.png",
    teamId: 57,
  },
  {
    id: "barcelona",
    name: "Barcelona",
    logoUrl: "https://crests.football-data.org/81.png",
    teamId: 81,
  },
  {
    id: "borussia-dortmund",
    name: "Borussia Dortmund",
    logoUrl: "https://crests.football-data.org/4.png",
    teamId: 4,
  },
  {
    id: "juventus",
    name: "Juventus",
    logoUrl: "https://crests.football-data.org/109.png",
    teamId: 109,
  },
] as const satisfies readonly ClubCatalogEntry[];

export type TournamentId = (typeof TOURNAMENTS)[number]["id"];
export type ClubId = (typeof CLUBS)[number]["id"];

export type Club = {
  id: ClubId;
  name: string;
  logoUrl: string | null;
  teamId: number;
};

export const TOURNAMENT_LOGOS: Record<TournamentId, ImageSourcePropType> = {
  "premier-league": require("../../assets/images/premier-league.png"),
  "la-liga": require("../../assets/images/la-liga.png"),
  "brasileirao-serie-a": require("../../assets/images/brasileirao-serie-a.png"),
  bundesliga: require("../../assets/images/bundesliga.png"),
  "uefa-champions-league": require("../../assets/images/uefa-champions-league.png"),
};

/** Escudos empacotados no app. Clubes fora daqui usam o `logoUrl` remoto. */
export const CLUB_LOGOS: Partial<Record<ClubId, ImageSourcePropType>> = {
  bournemouth: require("../../assets/images/bournemouth.png"),
  chelsea: require("../../assets/images/chelsea.webp"),
};

function normalizeTournamentId(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCompetitionEmblem(competition: {
  name: string;
  emblem?: string | null;
}): ImageSourcePropType | null {
  const normalizedName = normalizeTournamentId(competition.name);

  for (const [tournamentId, logo] of Object.entries(TOURNAMENT_LOGOS)) {
    if (normalizeTournamentId(tournamentId) === normalizedName) {
      return logo;
    }
  }

  return competition.emblem ? { uri: competition.emblem } : null;
}


export function getClubLogo(club: Club): ImageSourcePropType | null {
  return club.logoUrl ? { uri: club.logoUrl } : (CLUB_LOGOS[club.id] ?? null);
}
