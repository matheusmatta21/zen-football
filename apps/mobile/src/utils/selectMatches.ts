import type { Match } from "@zen/types";

export type MatchListMode = "upcoming" | "finished";

export function selectMatches(matches: Match[], mode: MatchListMode): Match[] {
  return matches
    .filter(
      (match) =>
        match.status === "live" ||
        (match.status === mode && match.note === null),
    )
    .sort((a, b) => {
      if (a.status === "live" && b.status !== "live") return -1;
      if (a.status !== "live" && b.status === "live") return 1;
      if (a.status === "finished" && b.status === "finished") return Date.parse(b.kickoffUtc) - Date.parse(a.kickoffUtc);
      return Date.parse(a.kickoffUtc) - Date.parse(b.kickoffUtc);
    });
}
