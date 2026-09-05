export const CLUB_LEAGUES = [
  { id: 2021, code: "PL", name: "Premier League" },
  { id: 2013, code: "BSA", name: "Brasileirão Série A" },
  { id: 2002, code: "BL1", name: "Bundesliga" },
  { id: 2014, code: "PD", name: "La Liga" },
  { id: 2019, code: "SA", name: "Serie A" },
] as const;

export type Club = {
  id: number;
  name: string;
  logoUrl: string | null;
  competitionId: number;
};

export type ClubCatalog = {
  updatedAt: string;
  stale: boolean;
  leagues: {
    id: number;
    code: string;
    name: string;
    clubs: Club[];
  }[];
};

/** Fields consumed from the existing /teams response. */
export type CompetitionTeam = {
  id: number;
  name: string;
  shortName?: string | null;
  crest?: string | null;
};

export function toClub(team: CompetitionTeam, competitionId: number): Club {
  return {
    id: team.id,
    name: team.shortName || team.name,
    logoUrl: team.crest ?? null,
    competitionId,
  };
}
