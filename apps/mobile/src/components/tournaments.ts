import type { ImageSourcePropType } from "react-native";

type CatalogEntry = {
  id: string;
  name: string;
  logoUrl: string | null;
};

type TournamentCatalogEntry = CatalogEntry & { code: string };

/** `code` é o identificador da competição na football-data. */
export const TOURNAMENTS = [
  { id: "premier-league", name: "Premier League", logoUrl: null, code: "PL" },
  { id: "la-liga", name: "La Liga", logoUrl: null, code: "PD" },
  {
    id: "brasileirao-serie-a",
    name: "Brasileirão Série A",
    logoUrl: null,
    code: "BSA",
  },
  { id: "bundesliga", name: "Bundesliga", logoUrl: null, code: "BL1" },
  {
    id: "uefa-champions-league",
    name: "UEFA Champions League",
    logoUrl: null,
    code: "CL",
  },
] as const satisfies readonly TournamentCatalogEntry[];

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
  {
    id: "fluminense",
    name: "Fluminense",
    logoUrl: "https://crests.football-data.org/1765.png",
    teamId: 1765,
  },
  {
    id: "vasco",
    name: "Vasco da Gama",
    logoUrl: "https://crests.football-data.org/1780.png",
    teamId: 1780,
  },
  {
    id: "corinthians",
    name: "Corinthians",
    logoUrl: "https://crests.football-data.org/1779.png",
    teamId: 1779,
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

function getTournamentByCode(code: string) {
  return TOURNAMENTS.find((tournament) => tournament.code === code);
}

/**
 * Emblema local da competição, caindo no emblema remoto quando não há asset.
 * Aceita as duas formas do payload: `emblem` (football-data) e `emblemUrl` (Match).
 */
export function getCompetitionEmblem(competition: {
  code: string;
  emblem?: string | null;
  emblemUrl?: string | null;
}): ImageSourcePropType | null {
  const tournament = getTournamentByCode(competition.code);
  if (tournament) {
    return TOURNAMENT_LOGOS[tournament.id];
  }

  const remoteEmblem = competition.emblem ?? competition.emblemUrl ?? null;
  return remoteEmblem ? { uri: remoteEmblem } : null;
}

/** Nome do catálogo local, caindo no nome da API para competições desconhecidas. */
export function getTournamentName(competition: {
  code: string;
  name: string;
}): string {
  return getTournamentByCode(competition.code)?.name ?? competition.name;
}

export function getClubLogo(club: Club): ImageSourcePropType | null {
  return club.logoUrl ? { uri: club.logoUrl } : (CLUB_LOGOS[club.id] ?? null);
}
