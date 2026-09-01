type FdTeam = {
    id: number | null;
    name: string | null;
    shortName: string | null;
    tla: string | null;
    crest: string | null;
}

type FdScore = {
    winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
    duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT";
    fullTime: FdScoreLine;
    halfTime: FdScoreLine;
}

type FdScoreLine = {
    home: number | null;
    away: number | null;
}

type FdCompetition = {
    id: number;
    name: string;
    code: string;
    type: "LEAGUE" | "LEAGUE_CUP" | "CUP" | "PLAYOFFS";
    emblem: string | null;
}

type FdSeason = {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number | null;
    winner: FdTeam | null;
}

type FdMatchStatus =
    | "SCHEDULED"
    | "TIMED"
    | "IN_PLAY"
    | "PAUSED"
    | "EXTRA_TIME"
    | "PENALTY_SHOOTOUT"
    | "FINISHED"
    | "SUSPENDED"
    | "POSTPONED"
    | "CANCELLED"
    | "AWARDED";

type FdMatch = {
    id: number;
    competition: FdCompetition;
    season: FdSeason;
    utcDate: string;
    status: FdMatchStatus;
    matchday: number | null;
    stage: string;
    group: string | null;
    lastUpdated: string;
    homeTeam: FdTeam;
    awayTeam: FdTeam;
    score: FdScore;
    minute?: number | null;
    injuryTime?: number | null;
}

type FdResultSet = {
    count: number;
    competitions?: string;
    first?: string;
    last?: string;
    played?: number;
    wins?: number;
    draws?: number;
    losses?: number;
}

type FdMatchesResponse = {
    filters: Record<string, unknown>;
    resultSet: FdResultSet;
    matches: FdMatch[];
}

export type {
    FdTeam,
    FdScore,
    FdScoreLine,
    FdCompetition,
    FdSeason,
    FdMatchStatus,
    FdMatch,
    FdResultSet,
    FdMatchesResponse,
};
