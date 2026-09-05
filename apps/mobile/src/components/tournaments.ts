import type { ImageSourcePropType } from "react-native";
import type { Club } from "@zen/types";
export type { Club } from "@zen/types";

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
  { id: "serie-a", name: "Serie A", logoUrl: null, code: "SA" },
  {
    id: "uefa-champions-league",
    name: "UEFA Champions League",
    logoUrl: null,
    code: "CL",
  },
] as const satisfies readonly TournamentCatalogEntry[];

export type TournamentId = (typeof TOURNAMENTS)[number]["id"];
export type ClubId = Club["id"];

export const TOURNAMENT_LOGOS: Partial<Record<TournamentId, ImageSourcePropType>> = {
  "premier-league": require("../../assets/images/premier-league.png"),
  "la-liga": require("../../assets/images/la-liga.png"),
  "brasileirao-serie-a": require("../../assets/images/brasileirao-serie-a.png"),
  bundesliga: require("../../assets/images/bundesliga.png"),
  "uefa-champions-league": require("../../assets/images/uefa-champions-league.png"),
};

/** Escudos empacotados no app. Clubes fora daqui usam o `logoUrl` remoto. */
export const CLUB_LOGOS: Partial<Record<ClubId, ImageSourcePropType>> = {
  1044: require("../../assets/images/bournemouth.png"),
  61: require("../../assets/images/chelsea.webp"),
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
  if (tournament && TOURNAMENT_LOGOS[tournament.id]) {
    return TOURNAMENT_LOGOS[tournament.id] ?? null;
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
