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
  { id: "libertadores", name: "Libertadores", logoUrl: null },
  { id: "sulamericana", name: "Sulamericana", logoUrl: null },
] as const satisfies readonly CatalogEntry[];

export const CLUBS = [
  { id: "bournemouth", name: "Bournemouth", logoUrl: null },
  { id: "chelsea", name: "Chelsea", logoUrl: null },
] as const satisfies readonly CatalogEntry[];

export type TournamentId = (typeof TOURNAMENTS)[number]["id"];
export type ClubId = (typeof CLUBS)[number]["id"];

export type Tournament = {
  id: TournamentId;
  name: string;
  logoUrl: string | null;
};

export type Club = {
  id: ClubId;
  name: string;
  logoUrl: string | null;
};

/** Temporada no formato usado pelas ligas europeias. */
export type Season = string;

export const CURRENT_SEASON: Season = "2025/26";

export type ClubTournament = {
  clubId: ClubId;
  tournamentId: TournamentId;
  season: Season;
};

export const CLUB_TOURNAMENTS: ClubTournament[] = [
  {
    clubId: "bournemouth",
    tournamentId: "premier-league",
    season: CURRENT_SEASON,
  },
  {
    clubId: "chelsea",
    tournamentId: "premier-league",
    season: CURRENT_SEASON,
  },
];

export type TournamentWithClubs = Tournament & { clubs: Club[] };
export type ClubWithTournaments = Club & { tournaments: Tournament[] };

export const TOURNAMENT_LOGOS: Record<TournamentId, ImageSourcePropType> = {
  "premier-league": require("../../../assets/images/premier-league.png"),
  "la-liga": require("../../../assets/images/la-liga.png"),
  "brasileirao-serie-a": require("../../../assets/images/brasileirao-serie-a.png"),
  bundesliga: require("../../../assets/images/bundesliga.png"),
  libertadores: require("../../../assets/images/libertadores.webp"),
  sulamericana: require("../../../assets/images/sudamericana.png"),
};

export const CLUB_LOGOS: Record<ClubId, ImageSourcePropType> = {
  bournemouth: require("../../../assets/images/bournemouth.png"),
  chelsea: require("../../../assets/images/chelsea.webp"),
};

export function getTournamentLogo(tournament: Tournament): ImageSourcePropType {
  return tournament.logoUrl
    ? { uri: tournament.logoUrl }
    : TOURNAMENT_LOGOS[tournament.id];
}

export function getClubLogo(club: Club): ImageSourcePropType {
  return club.logoUrl ? { uri: club.logoUrl } : CLUB_LOGOS[club.id];
}

export function getClubsByTournament(
  tournamentId: TournamentId,
  season: Season | undefined = CURRENT_SEASON,
): Club[] {
  const clubIds = new Set(
    CLUB_TOURNAMENTS.filter(
      (relation) =>
        relation.tournamentId === tournamentId &&
        (season === undefined || relation.season === season),
    ).map((relation) => relation.clubId),
  );

  return CLUBS.filter((club) => clubIds.has(club.id));
}

export function getTournamentsByClub(
  clubId: ClubId,
  season: Season | undefined = CURRENT_SEASON,
): Tournament[] {
  const tournamentIds = new Set(
    CLUB_TOURNAMENTS.filter(
      (relation) =>
        relation.clubId === clubId &&
        (season === undefined || relation.season === season),
    ).map((relation) => relation.tournamentId),
  );

  return TOURNAMENTS.filter((tournament) => tournamentIds.has(tournament.id));
}
