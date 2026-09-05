import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CLUB_LEAGUES, toClub } from "@zen/types";
import apiService from "../src/services/apiService";
import { getClubCatalog } from "../../mobile/src/services/footballData";
import { parseStoredClub } from "../../mobile/src/utils/storedClub";

const directory = await mkdtemp(join(tmpdir(), "zen-clubs-integration-"));
process.env.CLUB_CATALOG_FILE = join(directory, "catalog.json");
const { getTeamsFromCompetitionController } = await import("../src/controllers/teams");
const { getCompetitionFromTeamController, getTeamMatchesController } = await import("../src/controllers/match");
const { getClubsController } = await import("../src/controllers/clubs");

// The mobile workspace is CommonJS while the API workspace uses ESM.
const require = createRequire(import.meta.url);
const mobileApi: typeof import("../../mobile/src/services/api").default =
  require("../../mobile/src/services/api").default;

function response() {
  return {
    statusCode: 200,
    body: undefined as any,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
  };
}

test("club catalog integration", async (t) => {
  const originalAdapter = apiService.defaults.adapter;
  const originalMobileAdapter = mobileApi.defaults.adapter;
  const calls: string[] = [];
  apiService.defaults.adapter = async (config) => {
    const path = config.url!;
    calls.push(path);
    let data: unknown;
    if (path === "/competitions") {
      data = { competitions: CLUB_LEAGUES.map((league) => ({ ...league, plan: "TIER_ONE" })) };
    } else if (/^\/competitions\/\d+\/teams$/.test(path)) {
      data = { teams: [{ id: 65, name: "Manchester City FC", shortName: "Man. City", crest: "https://example.com/65.svg" }] };
    } else if (path === "/teams/65") {
      data = { runningCompetitions: [{ id: 2021 }] };
    } else if (path === "/teams/999999") {
      data = { runningCompetitions: [{ id: 9999 }] };
    } else if (path === "/teams/65/matches") {
      data = { matches: [] };
    } else {
      throw new Error(`Unexpected request: ${path}`);
    }
    return { data, config, headers: {}, status: 200, statusText: "OK" };
  };

  try {
    await t.test("all five league IDs use the existing teams endpoint and cache responses", async () => {
      for (const league of CLUB_LEAGUES) {
        const query = { competitionId: String(league.id) };
        const first = response();
        const second = response();
        await Promise.all([
          getTeamsFromCompetitionController({ query }, first),
          getTeamsFromCompetitionController({ query }, second),
        ]);
        assert.equal(first.statusCode, 200);
        assert.equal(first.body[0].crest, "https://example.com/65.svg");
        assert.deepEqual(first.body, second.body);
        assert.equal(calls.filter((path) => path === `/competitions/${league.id}/teams`).length, 1);
      }
    });

    await t.test("rejects invalid and unsupported competition queries without upstream calls", async () => {
      const count = calls.length;
      for (const competitionId of [undefined, "", "0", "9999", "PL", ["2021"], {}]) {
        const res = response();
        await getTeamsFromCompetitionController({ query: { competitionId } }, res);
        assert.equal(res.statusCode, 400);
      }
      assert.equal(calls.length, count);
    });

    await t.test("a club outside the old nine can load matches and competitions", async () => {
      const matches = response();
      const competitions = response();
      await Promise.all([
        getTeamMatchesController({ query: { teamId: "65" } }, matches),
        getCompetitionFromTeamController({ query: { teamId: "65" } }, competitions),
      ]);
      assert.equal(matches.statusCode, 200);
      assert.equal(competitions.statusCode, 200);
      assert.equal(competitions.body[0].id, 2021);
      assert.equal(calls.filter((path) => path === "/teams/65").length, 1);
      const unsupported = response();
      await getTeamMatchesController({ query: { teamId: "999999" } }, unsupported);
      assert.equal(unsupported.statusCode, 400);
      assert.ok(!calls.includes("/teams/999999/matches"));
    });

    await t.test("one catalog endpoint returns all leagues without new upstream calls", async () => {
      const count = calls.length;
      const res = response();
      await getClubsController({} as any, res as any);
      assert.equal(res.statusCode, 200);
      assert.equal(res.body.leagues.length, 5);
      assert.equal(res.body.leagues[0].clubs[0].id, 65);
      assert.equal(calls.length, count);
      assert.ok(!calls.includes("/teams/999999"));
    });

    await t.test("mobile retries a failed catalog and shares one request for all leagues", async () => {
      let requests = 0;
      const catalog = { updatedAt: new Date().toISOString(), stale: false,
        leagues: CLUB_LEAGUES.map((league) => ({ ...league, clubs: [
          toClub({ id: 65, name: "Manchester City FC", shortName: "Man. City", crest: "https://example.com/65.svg" }, league.id),
        ] })) };
      mobileApi.defaults.adapter = async (config) => {
        requests++;
        assert.equal(config.url, "/clubs");
        assert.equal(config.params, undefined);
        if (requests === 1) throw new Error("temporary failure");
        return { config, headers: {}, status: 200, statusText: "OK", data: catalog };
      };
      await assert.rejects(getClubCatalog());
      const [first, second] = await Promise.all([getClubCatalog(), getClubCatalog()]);
      assert.equal(requests, 2);
      assert.deepEqual(first, second);
      assert.deepEqual(first, catalog);
      await getClubCatalog();
      assert.equal(requests, 2);
    });

    await t.test("new selections survive restart and legacy slugs still resolve", () => {
      const club = toClub({ id: 65, name: "Manchester City FC", crest: null }, 2021);
      assert.deepEqual(parseStoredClub(JSON.stringify(club)), club);
      assert.equal(parseStoredClub("bournemouth")?.id, 1044);
      assert.equal(parseStoredClub("juventus")?.competitionId, 2019);
      for (const value of [null, "", "invalid", "null", "{}", "__proto__", "65"])
        assert.equal(parseStoredClub(value), null);
    });
  } finally {
    apiService.defaults.adapter = originalAdapter;
    mobileApi.defaults.adapter = originalMobileAdapter;
    await rm(directory, { recursive: true, force: true });
  }
});
