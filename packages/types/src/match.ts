import type { FdMatch, FdMatchStatus } from "./football-data";

type MatchStatus = "live" | "finished" | "upcoming";

type MatchNote = "postponed" | "cancelled" | "suspended" | "awarded";

type MatchTeam = {
  id: number | null;
  name: string | null;
  crestUrl: string | null;
};

type MatchCompetition = {
  id: number;
  name: string;
  code: string;
  emblemUrl: string | null;
};

type Match = {
  id: number;
  status: MatchStatus;
  note: MatchNote | null;
  kickoffUtc: string;
  competition: MatchCompetition;
  matchday: number | null;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  homeGoals: number | null;
  awayGoals: number | null;
  minute: number | null;
};

function toMatchStatus(status: FdMatchStatus): MatchStatus {
  switch (status) {
    case "IN_PLAY":
    case "PAUSED":
    case "EXTRA_TIME":
    case "PENALTY_SHOOTOUT":
      return "live";

    case "FINISHED":
    case "AWARDED":
    case "SUSPENDED":
      return "finished";

    case "SCHEDULED":
    case "TIMED":
    case "POSTPONED":
    case "CANCELLED":
      return "upcoming";

    default: {
      const exhaustivo: never = status;
      void exhaustivo;
      return "upcoming";
    }
  }
}

function toMatchNote(status: FdMatchStatus): MatchNote | null {
  switch (status) {
    case "POSTPONED":
      return "postponed";
    case "CANCELLED":
      return "cancelled";
    case "SUSPENDED":
      return "suspended";
    case "AWARDED":
      return "awarded";
    default:
      return null;
  }
}

function toMatchTeam(team: FdMatch["homeTeam"]): MatchTeam {
  return {
    id: team.id,
    name: team.shortName ?? team.name,
    crestUrl: team.crest,
  };
}

function toMatch(fd: FdMatch): Match {
  const status = toMatchStatus(fd.status);

  return {
    id: fd.id,
    status,
    note: toMatchNote(fd.status),
    kickoffUtc: fd.utcDate,
    competition: {
      id: fd.competition.id,
      name: fd.competition.name,
      code: fd.competition.code,
      emblemUrl: fd.competition.emblem,
    },
    matchday: fd.matchday,
    homeTeam: toMatchTeam(fd.homeTeam),
    awayTeam: toMatchTeam(fd.awayTeam),
    homeGoals: fd.score.fullTime.home,
    awayGoals: fd.score.fullTime.away,
    minute: status === "live" ? (fd.minute ?? null) : null,
  };
}

function hasScore(match: Match): boolean {
  return match.homeGoals !== null && match.awayGoals !== null;
}

export type { MatchStatus, MatchNote, MatchTeam, MatchCompetition, Match };
export { toMatchStatus, toMatchNote, toMatch, hasScore };
