import { CLUB_LEAGUES, toClub, type ClubCatalog, type CompetitionTeam } from "@zen/types";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import apiService from "./apiService";

const TTL = 24 * 60 * 60_000;
const RETRY_DELAY = 5 * 60_000;
type LeagueSnapshot = { updatedAt: number; teams: CompetitionTeam[] };
type Snapshot = { version: 1; retryAt: number; leagues: Record<number, LeagueSnapshot> };

export class ClubCatalogUnavailableError extends Error {}

function validTeams(value: unknown): value is CompetitionTeam[] {
  return Array.isArray(value) && value.length > 0 && value.every((team) =>
    team && Number.isSafeInteger(team.id) && team.id > 0 &&
    typeof team.name === "string" && team.name.trim() &&
    (team.shortName == null || typeof team.shortName === "string") &&
    (team.crest == null || typeof team.crest === "string"),
  );
}

/** One store per API process; the file must be on persistent storage in production. */
export function createClubCatalogStore({
  filePath,
  fetchTeams,
  now = Date.now,
}: {
  filePath: string;
  fetchTeams: (competitionId: number) => Promise<CompetitionTeam[]>;
  now?: () => number;
}) {
  let snapshot: Snapshot = { version: 1, retryAt: 0, leagues: {} };
  let initialized: Promise<void> | undefined;
  let refreshing: Promise<void> | undefined;

  async function readSnapshot() {
    try {
      const saved = JSON.parse(await readFile(filePath, "utf8"));
      if (saved.version !== 1) return;
      snapshot.retryAt = Number.isFinite(saved.retryAt) ? saved.retryAt : 0;
      for (const league of CLUB_LEAGUES) {
        const entry = saved.leagues?.[league.id];
        if (entry && Number.isFinite(entry.updatedAt) && entry.updatedAt <= now() && validTeams(entry.teams)) {
          snapshot.leagues[league.id] = entry;
        }
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.warn("Club catalog cache could not be read; a new catalog will be fetched.");
      }
    }
  }

  async function persist() {
    try {
      await mkdir(dirname(filePath), { recursive: true });
      const temporary = `${filePath}.${process.pid}.tmp`;
      await writeFile(temporary, JSON.stringify(snapshot), "utf8");
      await rename(temporary, filePath);
    } catch {
      // Keep serving the in-memory snapshot, but make failed persistence observable.
      console.error("Club catalog could not be saved. Check CLUB_CATALOG_FILE and volume permissions.");
    }
  }

  function fresh(entry: LeagueSnapshot | undefined) {
    return entry !== undefined && now() - entry.updatedAt < TTL;
  }

  async function refresh() {
    for (const league of CLUB_LEAGUES) {
      if (fresh(snapshot.leagues[league.id])) continue;
      try {
        const teams = await fetchTeams(league.id);
        if (!validTeams(teams)) throw new Error("Invalid league response");
        snapshot.leagues[league.id] = {
          updatedAt: now(),
          teams: [...new Map(teams.map((team) => [team.id, {
            id: team.id, name: team.name, shortName: team.shortName ?? null,
            crest: team.crest ?? null,
          }])).values()],
        };
        // Save each successful league, so partial refreshes survive restarts too.
        await persist();
      } catch {
        snapshot.retryAt = now() + RETRY_DELAY;
        await persist();
        console.warn(`Club catalog refresh failed for ${league.code}; retry deferred for five minutes.`);
        return;
      }
    }
    snapshot.retryAt = 0;
    await persist();
  }

  async function ensureCatalog() {
    await (initialized ??= readSnapshot());
    if (refreshing) {
      await refreshing;
    } else if (now() >= snapshot.retryAt && !CLUB_LEAGUES.every((league) => fresh(snapshot.leagues[league.id]))) {
      refreshing = refresh().finally(() => { refreshing = undefined; });
      await refreshing;
    }
    if (!CLUB_LEAGUES.every((league) => snapshot.leagues[league.id])) {
      throw new ClubCatalogUnavailableError("Club catalog is temporarily unavailable");
    }
  }

  return {
    async get(): Promise<ClubCatalog> {
      await ensureCatalog();
      return {
        updatedAt: new Date(Math.min(...CLUB_LEAGUES.map((league) => snapshot.leagues[league.id].updatedAt))).toISOString(),
        stale: CLUB_LEAGUES.some((league) => !fresh(snapshot.leagues[league.id])),
        leagues: CLUB_LEAGUES.map((league) => ({
          ...league,
          clubs: snapshot.leagues[league.id].teams.map((team) => toClub(team, league.id))
            .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
        })),
      };
    },
    async getTeams(competitionId: number): Promise<CompetitionTeam[]> {
      await ensureCatalog();
      return snapshot.leagues[competitionId]?.teams ?? [];
    },
  };
}

export const clubCatalog = createClubCatalogStore({
  filePath: process.env.CLUB_CATALOG_FILE ?? resolve(process.cwd(), ".cache/club-catalog.json"),
  fetchTeams: async (competitionId) => {
    const response = await apiService.get<{ teams: CompetitionTeam[] }>(
      `/competitions/${competitionId}/teams`, { timeout: 8_000 },
    );
    return response.data.teams;
  },
});
