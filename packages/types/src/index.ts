export type {
  Match,
  MatchCompetition,
  MatchNote,
  MatchStatus,
  MatchTeam,
} from "./match";

export { hasScore, toMatch, toMatchNote, toMatchStatus } from "./match";

export type {
  FdCompetition,
  FdMatch,
  FdMatchStatus,
  FdMatchesResponse,
  FdResultSet,
  FdScore,
  FdScoreLine,
  FdSeason,
  FdTeam,
} from "./football-data";
export { CLUB_LEAGUES, toClub } from "./club";
export type { Club, ClubCatalog, CompetitionTeam } from "./club";
