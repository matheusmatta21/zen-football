import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CLUB_LEAGUES } from "@zen/types";
import { createClubCatalogStore, ClubCatalogUnavailableError } from "../src/services/clubCatalog";

const DAY = 24 * 60 * 60_000;

test("persistent club catalog", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "zen-catalog-store-"));
  try {
    await t.test("five requests populate all leagues, concurrent callers and restarts reuse the file", async () => {
      let now = Date.parse("2026-09-05T12:00:00Z");
      let calls = 0;
      const filePath = join(directory, "complete.json");
      const options = { filePath, now: () => now, fetchTeams: async (id: number) => {
        calls++;
        return [
          { id: id + 1, name: "Zulu FC", shortName: "Zulu" },
          { id, name: "Alpha FC", shortName: "Alpha", crest: "https://example.com/crest.svg" },
          { id, name: "Alpha FC", shortName: "Alpha", crest: "https://example.com/crest.svg" },
        ];
      } };
      const store = createClubCatalogStore(options);
      const results = await Promise.all(Array.from({ length: 20 }, () => store.get()));
      assert.equal(calls, 5);
      assert.equal(results[0].leagues.length, 5);
      assert.deepEqual(results[0].leagues[0].clubs.map((club) => club.name), ["Alpha", "Zulu"]);
      assert.equal(results[0].stale, false);
      assert.equal(Object.keys(JSON.parse(await readFile(filePath, "utf8")).leagues).length, 5);

      const restarted = createClubCatalogStore(options);
      assert.deepEqual(await restarted.get(), results[0]);
      await restarted.getTeams(CLUB_LEAGUES[0].id);
      assert.equal(calls, 5);
      now += DAY - 1;
      await restarted.get();
      assert.equal(calls, 5);
      now++;
      await Promise.all([restarted.get(), restarted.get()]);
      assert.equal(calls, 10);
    });

    await t.test("stale data survives failures and persisted cooldown prevents request storms", async () => {
      let now = Date.parse("2026-09-05T12:00:00Z");
      let failing = false;
      let calls = 0;
      const options = { filePath: join(directory, "stale.json"), now: () => now,
        fetchTeams: async (id: number) => {
          calls++;
          if (failing) throw new Error("429");
          return [{ id, name: `Team ${id}` }];
        } };
      const store = createClubCatalogStore(options);
      const original = await store.get();
      now += DAY;
      failing = true;
      const stale = await store.get();
      assert.equal(stale.stale, true);
      assert.deepEqual(stale.leagues, original.leagues);
      assert.equal(calls, 6);
      await Promise.all(Array.from({ length: 10 }, () => store.get()));
      const restarted = createClubCatalogStore(options);
      await restarted.get();
      assert.equal(calls, 6);
      now += 5 * 60_000;
      failing = false;
      assert.equal((await restarted.get()).stale, false);
      assert.equal(calls, 11);
    });

    await t.test("partial initial refresh is persisted and only missing leagues are retried", async () => {
      let now = Date.parse("2026-09-05T12:00:00Z");
      const calls: number[] = [];
      let failing = true;
      const options = { filePath: join(directory, "partial.json"), now: () => now,
        fetchTeams: async (id: number) => {
          calls.push(id);
          if (id === 2002 && failing) throw new Error("offline");
          return [{ id, name: `Team ${id}` }];
        } };
      await assert.rejects(createClubCatalogStore(options).get(), ClubCatalogUnavailableError);
      assert.equal(calls.length, 3);
      const restarted = createClubCatalogStore(options);
      await assert.rejects(restarted.get(), ClubCatalogUnavailableError);
      assert.equal(calls.length, 3);
      failing = false;
      now += 5 * 60_000;
      assert.equal((await restarted.get()).leagues.length, 5);
      assert.deepEqual(calls, [2021, 2013, 2002, 2002, 2014, 2019]);
    });

    await t.test("a corrupted disk cache is rebuilt; empty upstream data cannot wipe a league", async () => {
      const filePath = join(directory, "corrupt.json");
      await writeFile(filePath, "invalid JSON");
      let now = Date.parse("2026-09-05T12:00:00Z");
      let empty = false;
      const store = createClubCatalogStore({ filePath, now: () => now,
        fetchTeams: async (id) => empty ? [] : [{ id, name: `Team ${id}` }] });
      const original = await store.get();
      now += DAY;
      empty = true;
      const result = await store.get();
      assert.equal(result.stale, true);
      assert.deepEqual(result.leagues, original.leagues);
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
