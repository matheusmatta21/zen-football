import type { Match, MatchStatus } from "@zen/types";

export function getMatchCardStatus(match: Match, now: number): MatchStatus {
  if (match.status !== "finished" && match.status !== "finishedToday") {
    return match.status;
  }

  const kickoff = new Date(match.kickoffUtc);
  const today = new Date(now);
  const isToday =
    kickoff.getFullYear() === today.getFullYear() &&
    kickoff.getMonth() === today.getMonth() &&
    kickoff.getDate() === today.getDate();

  return match.note === null && isToday ? "finishedToday" : "finished";
}
