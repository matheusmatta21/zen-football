import assert from "node:assert/strict";
import test from "node:test";
import type { FdMatch, FdMatchesResponse } from "@zen/types";
import { createCache } from "../src/services/cache";
import { getMatchesTtl, TEAM_COMPETITIONS_TTL } from "../src/services/teamCachePolicy";
import apiService from "../src/services/apiService";
import { getCompetitionFromTeam, getTeamMatches } from "../src/services/footballApi";

const MINUTE = 60_000;

test("slow requests stay shared and the TTL starts after completion", async () => {
  let now = 0;
  const cached = createCache({ now: () => now });
  let complete!: (value: string) => void;
  let calls = 0;
  const fetcher = () => {
    calls++;
    return new Promise<string>((resolve) => { complete = resolve; });
  };
  const first = cached("team:65", MINUTE, fetcher);
  await Promise.resolve();
  now = 2 * MINUTE;
  const users = Array.from({ length: 20 }, () => cached("team:65", MINUTE, fetcher));
  complete("matches");
  assert.deepEqual(await Promise.all([first, ...users]), Array(21).fill("matches"));
  now += MINUTE - 1;
  await cached("team:65", MINUTE, fetcher);
  assert.equal(calls, 1);
  now++;
  assert.equal(await cached("team:65", MINUTE, async () => "updated"), "updated");
});

test("failures are shared for one minute, then can be retried", async () => {
  let now = 0;
  let calls = 0;
  const cached = createCache({ now: () => now });
  const fetcher = async () => { calls++; throw new Error("upstream 429"); };
  const attempts = await Promise.allSettled(Array.from({ length: 20 }, () => cached("team:65", MINUTE, fetcher)));
  assert.ok(attempts.every((attempt) => attempt.status === "rejected"));
  now = MINUTE - 1;
  await assert.rejects(cached("team:65", MINUTE, fetcher), /upstream 429/);
  assert.equal(calls, 1);
  now++;
  assert.equal(await cached("team:65", MINUTE, async () => { calls++; return "recovered"; }), "recovered");
  assert.equal(calls, 2);
});

test("capacity evicts least recently used results without evicting pending requests", async () => {
  const cached = createCache({ maxEntries: 2 });
  await cached("a", MINUTE, async () => "a");
  await cached("b", MINUTE, async () => "b");
  await cached("a", MINUTE, async () => "wrong");
  await cached("c", MINUTE, async () => "c");
  assert.equal(await cached("a", MINUTE, async () => "wrong"), "a");
  assert.equal(await cached("b", MINUTE, async () => "refetched"), "refetched");

  const smallCache = createCache({ maxEntries: 1 });
  let complete!: (value: string) => void;
  const first = smallCache("pending", MINUTE, () => new Promise<string>((resolve) => { complete = resolve; }));
  await smallCache("other", MINUTE, async () => "other");
  const second = smallCache("pending", MINUTE, async () => "wrong");
  assert.equal(first, second);
  complete("shared");
  assert.equal(await second, "shared");
});

test("match TTL follows live status and expires before the kickoff polling window", () => {
  const now = Date.parse("2026-09-05T12:00:00Z");
  const data = (status: FdMatch["status"], offset = 60 * MINUTE) => ({
    matches: [{ status, utcDate: new Date(now + offset).toISOString() }],
  }) as FdMatchesResponse;
  for (const status of ["IN_PLAY", "PAUSED", "EXTRA_TIME", "PENALTY_SHOOTOUT"] as const) {
    assert.equal(getMatchesTtl(data(status), undefined, now), MINUTE);
  }
  assert.equal(getMatchesTtl(data("TIMED"), undefined, now), 5 * MINUTE);
  assert.equal(getMatchesTtl(data("TIMED", 7 * MINUTE), undefined, now), 2 * MINUTE);
  assert.equal(getMatchesTtl(data("SCHEDULED", 4 * MINUTE), undefined, now), MINUTE);
  assert.equal(getMatchesTtl(data("TIMED", -MINUTE), undefined, now), MINUTE);
  assert.equal(getMatchesTtl(data("FINISHED"), undefined, now), 5 * MINUTE);
  assert.equal(getMatchesTtl({ matches: [] } as unknown as FdMatchesResponse, "LIVE", now), MINUTE);
  assert.equal(TEAM_COMPETITIONS_TTL, 24 * 60 * MINUTE);
});

test("team service reuses each club and isolates seasons and normalized status filters", async (t) => {
  const originalAdapter = apiService.defaults.adapter;
  let now = Date.parse("2026-09-05T12:00:00Z");
  t.mock.method(Date, "now", () => now);
  const calls: { path: string; season?: string; status?: string }[] = [];
  apiService.defaults.adapter = async (config) => {
    calls.push({ path: config.url!, ...config.params });
    const data = config.url === "/competitions" ? { competitions: [{ id: 2021, plan: "TIER_ONE" }] } :
      config.url?.endsWith("/matches") ? { matches: [], filters: config.params, resultSet: { count: 0 } } :
        { runningCompetitions: [{ id: 2021 }, { id: 9999 }] };
    return { data, config, headers: {}, status: 200, statusText: "OK" };
  };
  t.after(() => { apiService.defaults.adapter = originalAdapter; });

  await Promise.all(Array.from({ length: 20 }, () => getTeamMatches(65)));
  await getTeamMatches(61);
  await getTeamMatches(65);
  assert.equal(calls.filter((call) => call.path === "/teams/65/matches").length, 1);
  assert.equal(calls.filter((call) => call.path === "/teams/61/matches").length, 1);
  await getTeamMatches(65, "2025", " paused,IN_PLAY,PAUSED ");
  await getTeamMatches(65, " 2025 ", "IN_PLAY,PAUSED");
  await getTeamMatches(65, "2026", "PAUSED,IN_PLAY");
  await getTeamMatches(65, "2026", "FINISHED");
  assert.equal(calls.filter((call) => call.path === "/teams/65/matches").length, 4);
  assert.equal(calls[2].status, "IN_PLAY,PAUSED");

  now += 5 * MINUTE - 1;
  await getTeamMatches(65);
  assert.equal(calls.filter((call) => call.path === "/teams/65/matches").length, 4);
  now++;
  await getTeamMatches(65);
  assert.equal(calls.filter((call) => call.path === "/teams/65/matches").length, 5);

  const competitions = await Promise.all(Array.from({ length: 20 }, () => getCompetitionFromTeam(65)));
  assert.deepEqual(competitions[0], [{ id: 2021 }]);
  await getCompetitionFromTeam(61);
  await getCompetitionFromTeam(65);
  assert.equal(calls.filter((call) => call.path === "/teams/65").length, 1);
  assert.equal(calls.filter((call) => call.path === "/teams/61").length, 1);
  assert.equal(calls.filter((call) => call.path === "/competitions").length, 1);
  now += TEAM_COMPETITIONS_TTL - 1;
  await getCompetitionFromTeam(65);
  assert.equal(calls.filter((call) => call.path === "/teams/65").length, 1);
  now++;
  await getCompetitionFromTeam(65);
  assert.equal(calls.filter((call) => call.path === "/teams/65").length, 2);
});
